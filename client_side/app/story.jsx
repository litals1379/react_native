import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image, Modal, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';  // מודול להפעלת דיבור
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';  // מודול לתצוגת בר התקדמות
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent} from "expo-speech-recognition";
import {styles} from './Style/story';  // קובץ סגנונות מותאם אישית

export default function Story() {
  const router = useRouter();
  const { childID, topic } = useLocalSearchParams();  // קבלת מזהה הילד והנושא מתוך הכתובת של הדף
  // הגדרת מצב (state) לאחסון נתונים שונים
  const [paragraphs, setParagraphs] = useState([]);  // אחסון הפסקאות של הסיפור
  const [images, setImages] = useState([]);  // אחסון תמונות הקשורות לפסקאות
  const [currentIndex, setCurrentIndex] = useState(0);  // אינדקס הפסקה נוכחית
  const [loading, setLoading] = useState(true);  // מצב טעינה
  const [error, setError] = useState(null);  // מצב שגיאה
  const [rating, setRating] = useState(0);  // דירוג הסיפור
  const [showEndModal, setShowEndModal] = useState(false);  // מצב להצגת מודל סיום הסיפור

  const [isSpeaking, setIsSpeaking] = useState(false);


  // adding speech recognition
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");


  // פונקציה להבאת הסיפור מהשרת
  const fetchStory = async (childID, topic) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;
    try {
      const response = await fetch(apiUrl);
      const text = await response.text();


      if (!response.ok) {
        throw new Error(`Server returned error: ${text}`);
      }


      const data = JSON.parse(text);
      const loadedParagraphs = Object.values(data?.paragraphs || {});
      const loadedImages = Object.values(data?.imagesUrls || {});


      setParagraphs(loadedParagraphs);  // שמירת הפסקאות
      setImages(loadedImages);  // שמירת התמונות
    } catch (err) {
      setError(err.message);  // במקרה של שגיאה
    } finally {
      setLoading(false);  // סיום טעינה
    }
  };


  // טעינת הסיפור בעת שינוי childID או topic
  useEffect(() => {
    if (childID && topic) {
      fetchStory(childID, topic);  // קריאת הסיפור מהשרת
    }
  }, [childID, topic]);


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
  


  // מעבר לפסקה הבאה
  const goToNextParagraph = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTranscript("");  // איפוס התוצאה הקולית
    } else {
      setShowEndModal(true);  // הצגת מודל סיום אם זה הסיפור האחרון
    }
  };


  // חזרה לפסקה קודמת
  const goToPreviousParagraph = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTranscript("");  // איפוס התוצאה הקולית
    }
  };


  // קביעת צבע בר ההתקדמות לפי אחוז התקדמות
  const getProgressColor = () => {
    const progress = (currentIndex + 1) / paragraphs.length;
    if (progress < 0.34) return '#E74C3C';  // אדום
    if (progress < 0.67) return '#F39C12';  // צהוב
    return '#27AE60';  // ירוק
  };


  // קביעת האימוג'י להמרצה לפי אחוז ההתקדמות
  const getEncouragementEmoji = () => {
    const progress = (currentIndex + 1) / paragraphs.length;
    if (progress < 0.34) return '🚀';  // התחלה
    if (progress < 0.67) return '🌟';  // חצי הדרך
    return '🏆';  // סיום
  };

  // speech recognition functions
  useEffect(() => {
    // Request permissions when component mounts
    ExpoSpeechRecognitionModule.requestPermissionsAsync();

    // Register result event listener
    const resultListener = ExpoSpeechRecognitionModule.addListener(
      "result",
      (event) => {
        console.log("Results:", event.results);
        const latestResult = event.results[0]?.transcript || "";
        setTranscript(latestResult);
      }
    );

    // Clean up listener when component unmounts
    return () => {
      resultListener.remove();
    };
  }, []);

  const startListening = () => {
    setTranscript(""); // Clear previous result
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
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#2980B9" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>  // הצגת שגיאה אם יש
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


            {/* ניווט לפסקאות */}
            <View style={styles.navigation}>
              <TouchableOpacity onPress={goToNextParagraph} disabled={currentIndex === paragraphs.length - 1}>
                <Icon name="arrow-left" size={30} color={currentIndex === paragraphs.length - 1 ? '#ccc' : '#65558F'} />
              </TouchableOpacity>


              {/* בר התקדמות */}
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
              {/* כפתור דיבור/עצירה */}
              <TouchableOpacity
                style={[styles.button, isSpeaking && styles.buttonListening]}
                onPress={isSpeaking ? stopStory : speakStory}
              >
                <Icon name={isSpeaking ? "stop" : "volume-up"} size={30} color={isSpeaking ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>

              {/* כפתור מיקרופון/עצירה */}
              <TouchableOpacity
                style={[styles.button, isListening && styles.buttonListening]}
                onPress={toggleListening}
              >
                <Icon name={isListening ? "stop" : "microphone"} size={30} color={isListening ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>
            </View>


            {/* כפתור סיום הסיפור */}
            {currentIndex === paragraphs.length - 1 && (
              <TouchableOpacity onPress={() => setShowEndModal(true)} style={styles.endButton}>
                <Text style={styles.endButtonText}>סיים את הסיפור</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>


      {/* מודל סיום סיפור */}
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

