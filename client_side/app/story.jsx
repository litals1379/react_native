import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image, Modal, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import stringSimilarity from 'string-similarity';
import { styles } from './Style/story';

export default function Story() {
  const router = useRouter();
  const { childID, topic } = useLocalSearchParams();
  const [paragraphs, setParagraphs] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (childID && topic) {
      fetchStory(childID, topic);
    }
  }, [childID, topic]);

  const fetchStory = async (childID, topic) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;
    try {
      const response = await fetch(apiUrl);
      const text = await response.text();

      if (!response.ok) {
        throw new Error('לא נמצא סיפור מתאים');
      }

      const data = JSON.parse(text);
      setParagraphs(Object.values(data?.paragraphs || {}));
      setImages(Object.values(data?.imagesUrls || {}));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const speakStory = () => {
    if (paragraphs[currentIndex]) {
      setIsSpeaking(true);
      Speech.speak(paragraphs[currentIndex], {
        language: 'he-IL',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const stopStory = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  function cleanText(text) {
    return text
      .normalize('NFKD')
      .replace(/[\u0591-\u05C7]/g, '')
      .replace(/[^\w\s\u0590-\u05FF]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  const isReadingCorrect = () => {
    const cleanedOriginal = cleanText(paragraphs[currentIndex] || '');
    const cleanedTranscript = cleanText(transcript || '');
    const similarity = stringSimilarity.compareTwoStrings(cleanedOriginal, cleanedTranscript);
    console.log("Similarity:", similarity);
    return similarity > 0.75; // סף נמוך יותר, מקבל טעויות קטנות
  };
  

  useEffect(() => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync();
    const resultListener = ExpoSpeechRecognitionModule.addListener("result", (event) => {
      const latestResult = event.results[0]?.transcript || "";
      setTranscript(latestResult);
    });

    return () => resultListener.remove();
  }, []);

  const startListening = () => {
    setTranscript("");
    ExpoSpeechRecognitionModule.start({
      lang: "he-IL",
      interimResults: true,
      continuous: true,
    });
    setIsListening(true);
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
  };

  const toggleListening = () => {
    isListening ? stopListening() : startListening();
  };

  const goToNextParagraph = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTranscript("");
    } else {
      setShowEndModal(true);
    }
  };

  const goToPreviousParagraph = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTranscript("");
    }
  };

  const getProgressColor = () => {
    const progress = (currentIndex + 1) / paragraphs.length;
    if (progress < 0.34) return '#E74C3C';
    if (progress < 0.67) return '#F39C12';
    return '#27AE60';
  };

  const getEncouragementEmoji = () => {
    const progress = (currentIndex + 1) / paragraphs.length;
    if (progress < 0.34) return '🚀';
    if (progress < 0.67) return '🌟';
    return '🏆';
  };

  // פידבק מותאם לרמת הקריאה
  let feedbackComponent = null;
if (transcript !== "") {
  const isCorrect = isReadingCorrect();
  if (isCorrect) {
    feedbackComponent = <Text style={{ color: 'green', fontWeight: 'bold' }}>✔️ כל הכבוד! קראת נכון!</Text>;
  } else {
    feedbackComponent = <Text style={{ color: 'orange', fontWeight: 'bold' }}>✨ כמעט! אתה קרוב! נסה שוב.</Text>;
  }
}


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#2980B9" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View>
            {images[currentIndex] && (
              <Image source={{ uri: images[currentIndex] }} style={styles.image} resizeMode="cover" />
            )}
            <Text style={styles.paragraph}>{paragraphs[currentIndex]}</Text>

            {transcript !== "" && (
              <View style={styles.transcriptContainer}>
                <Text style={styles.transcriptLabel}>מה שאמרת:</Text>
                <Text style={styles.transcriptText}>{transcript}</Text>
              </View>
            )}

            <View style={{ marginTop: 10, alignItems: 'center' }}>
              {feedbackComponent}
            </View>

            <View style={styles.navigation}>
              <TouchableOpacity onPress={goToNextParagraph} disabled={currentIndex === paragraphs.length - 1}>
                <Icon name="arrow-left" size={30} color={currentIndex === paragraphs.length - 1 ? '#ccc' : '#65558F'} />
              </TouchableOpacity>

              {!loading && paragraphs.length > 0 && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>פסקה {currentIndex + 1} מתוך {paragraphs.length}</Text>
                  <View style={styles.progressRow}>
                    <Progress.Bar
                      progress={(currentIndex + 1) / paragraphs.length}
                      width={160}
                      height={10}
                      borderRadius={8}
                      color={getProgressColor()}
                      unfilledColor="#E0E0E0"
                      borderWidth={0}
                      animated={true}
                      style={{ transform: [{ scaleX: -1 }] }}
                    />
                    <Text style={styles.emoji}>{getEncouragementEmoji()}</Text>
                  </View>
                </View>
              )}

              <TouchableOpacity onPress={goToPreviousParagraph} disabled={currentIndex === 0}>
                <Icon name="arrow-right" size={30} color={currentIndex === 0 ? '#ccc' : '#65558F'} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <TouchableOpacity style={[styles.button, isSpeaking && styles.buttonListening]} onPress={isSpeaking ? stopStory : speakStory}>
                <Icon name={isSpeaking ? "stop" : "volume-up"} size={30} color={isSpeaking ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, isListening && styles.buttonListening]} onPress={toggleListening}>
                <Icon name={isListening ? "stop" : "microphone"} size={30} color={isListening ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>
            </View>

            {currentIndex === paragraphs.length - 1 && (
              <TouchableOpacity onPress={() => setShowEndModal(true)} style={styles.endButton}>
                <Text style={styles.endButtonText}>סיים את הסיפור</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <Modal visible={showEndModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 כל הכבוד שסיימת את הסיפור!</Text>
            <Text style={styles.modalSubtitle}>איך נהנית מהסיפור?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Icon name="star" size={32} color={star <= rating ? "#FFD700" : "#ccc"} />
                </TouchableOpacity>
              ))}
            </View>
            <Button title="סיים" onPress={() => {
              setShowEndModal(false);
              router.push('/userProfile');
            }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
