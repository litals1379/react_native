/*import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { useSpeechRecognition, useSpeechRecognitionEvents } from 'expo-speech-recognition'; 

export default function Story() {
  const { childID, topic } = useLocalSearchParams();

  const [paragraph, setParagraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);

  const {
    startSpeechRecognition,
    stopSpeechRecognition,
    isRecording,
    transcript,
    resetTranscript,
  } = useSpeechRecognition();

  useSpeechRecognitionEvents({
    onResult: (result) => {
      compareSpeech(result.transcript);
    },
  });

  const fetchStory = async (childID, topic) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;

    try {
      const response = await fetch(apiUrl);
      const text = await response.text();
      setParagraph(text || "לא נמצאו פסקאות.");
    } catch (err) {
      console.error("Fetch error:", err.message);
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
    if (paragraph) {
      Speech.speak(paragraph, { language: 'he-IL' });
    }
  };

  const stopStory = () => {
    Speech.stop();
  };

  const startListening = async () => {
    setComparisonResult(null);
    resetTranscript();
    await startSpeechRecognition({ language: 'he-IL' });
  };

  const stopListening = async () => {
    await stopSpeechRecognition();
  };

  const compareSpeech = (spokenText) => {
    if (!paragraph) return;

    const originalWords = paragraph.split(' ');
    const spokenWords = spokenText.split(' ');

    const result = originalWords.map((word, i) => {
      const match = spokenWords[i] && spokenWords[i].trim() === word.trim();
      return { word, match };
    });

    setComparisonResult(result);
  };

  const renderComparison = () => {
    if (!comparisonResult) return null;

    return (
      <Text style={styles.paragraph}>
        {comparisonResult.map((item, index) => (
          <Text
            key={index}
            style={{ color: item.match ? 'black' : 'red', fontWeight: item.match ? 'normal' : 'bold' }}
          >
            {item.word + ' '}
          </Text>
        ))}
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
              <Text style={styles.title}>סיפור:</Text>
              <Text style={styles.paragraph}>{paragraph}</Text>

              <Button title="🔊 השמע סיפור" onPress={speakStory} />
              <Button title="⏸️ עצור קריאה" onPress={stopStory} />

              <View style={{ marginVertical: 20 }}>
                <Button
                  title={isRecording ? "⏹️ עצור קריאת ילד" : "🎤 התחלת קריאת ילד"}
                  onPress={isRecording ? stopListening : startListening}
                  color={isRecording ? '#C0392B' : '#2980B9'}
                />
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
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});*/
