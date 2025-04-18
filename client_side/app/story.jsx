import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import {
  start,
  stop,
  isRecognitionAvailable,
  requestPermissionsAsync,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export default function Story() {
  const { childID, topic } = useLocalSearchParams();

  const [paragraph, setParagraph] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');

  useSpeechRecognitionEvent('onSpeechResults', (event) => {
    if (event.value?.[0]) {
      setSpokenText(event.value[0]);
      handleLiveComparison(event.value[0]);
    }
  });

  const fetchStory = async (childID, topic) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;
    try {
      const response = await fetch(apiUrl);
      const text = await response.text(); 
  
      if (!response.ok) {
        throw new Error(`Server returned error: ${text}`);
      }
  
      const data = JSON.parse(text);
  
      const firstParagraph = data?.paragraphs?.p1 || "אין פסקה זמינה.";
      const imageUrl = data?.imagesUrls?.img1 || null;
  
      setParagraph(firstParagraph);
      setImage(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (childID && topic) {
      fetchStory(childID, topic);
    }
  }, [childID, topic]);

  const speakStory = () => {
    console.log('speakStory pressed');
    if (paragraph) {
      Speech.speak(paragraph, { language: 'he-IL' });
    }
  };

  const stopStory = () => {
    console.log('stopStory pressed');
    Speech.stop();
  };

  const startListening = async () => {
    console.log('startListening pressed');
    const available = await isRecognitionAvailable();
    if (!available) {
      alert("זיהוי דיבור לא זמין במכשיר זה.");
      return;
    }

    await requestPermissionsAsync();
    setComparisonResult(null);
    setCurrentWordIndex(0);
    setSpokenText('');
    setIsRecording(true);
    await start({ language: 'he-IL' });
  };

  const stopListening = async () => {
    console.log('stopListening pressed');
    setIsRecording(false);
    await stop();
  };

  const handleLiveComparison = (spokenText) => {
    if (!paragraph) return;

    const originalWords = paragraph.trim().split(/\s+/);
    const spokenWords = spokenText.trim().split(/\s+/);

    const index = spokenWords.length - 1;
    const originalWord = originalWords[index];
    const spokenWord = spokenWords[index];

    if (!originalWord || !spokenWord) return;

    const isMatch = originalWord.toLowerCase() === spokenWord.toLowerCase();

    const result = originalWords.map((word, i) => ({
      word,
      match: spokenWords[i] && spokenWords[i].toLowerCase() === word.toLowerCase(),
    }));

    setComparisonResult(result);
    setCurrentWordIndex(index);

    if (isMatch) {
      if (index % 5 === 0) {
        Speech.speak("כל הכבוד!", { language: 'he-IL' });
      }
    } else {
      Speech.speak("נסה שוב את המילה הזו", { language: 'he-IL' });
    }
  };

  const renderComparison = () => {
    if (!comparisonResult) return null;

    return (
      <Text style={styles.paragraph}>
        {comparisonResult.map((item, index) => {
          let style = { color: item.match ? 'black' : 'red' };
          if (index === currentWordIndex) {
            style = { ...style, backgroundColor: '#FFFF99' };
          }

          return (
            <Text key={index} style={style}>
              {item.word + ' '}
            </Text>
          );
        })}
      </Text>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#65558F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.paragraph}>{paragraph}</Text>

              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity onPress={speakStory}>
                  <Icon name="volume-up" size={30} color="#2980B9" />
                </TouchableOpacity>

                <TouchableOpacity onPress={stopStory}>
                  <Icon name="stop" size={30} color="#C0392B" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={isRecording ? stopListening : startListening}
                >
                  <Icon
                    name={isRecording ? "stop" : "mic"}
                    size={30}
                    color={isRecording ? '#C0392B' : '#2980B9'}
                  />
                </TouchableOpacity>
              </View>

              {comparisonResult && (
                <>
                  <Text style={styles.title}>השוואת קריאה:</Text>
                  {renderComparison()}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
});
