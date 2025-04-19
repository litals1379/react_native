import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image, Modal, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';  // מודול להפעלת דיבור
import * as SpeechRecognition from 'expo-speech-recognition';  // מודול לזיהוי דיבור
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress';  // מודול לתצוגת בר התקדמות
// import LottieView from 'lottie-react-native';  // מודול לאנימציות Lottie

export default function Story() {
  const { childID, topic } = useLocalSearchParams();  // קבלת מזהה הילד והנושא מתוך הכתובת של הדף

  // הגדרת מצב (state) לאחסון נתונים שונים
  const [paragraphs, setParagraphs] = useState([]);  // אחסון הפסקאות של הסיפור
  const [images, setImages] = useState([]);  // אחסון תמונות הקשורות לפסקאות
  const [currentIndex, setCurrentIndex] = useState(0);  // אינדקס הפסקה נוכחית
  const [loading, setLoading] = useState(true);  // מצב טעינה
  const [error, setError] = useState(null);  // מצב שגיאה
  const [comparisonResult, setComparisonResult] = useState(null);  // תוצאה של השוואת קריאה
  const [currentWordIndex, setCurrentWordIndex] = useState(0);  // אינדקס המילה הנוכחית בהשוואת קריאה
  const [isRecording, setIsRecording] = useState(false);  // מצב אם נרשם דיבור
  const [spokenText, setSpokenText] = useState('');  // טקסט מדובר
  const [showEndModal, setShowEndModal] = useState(false);  // מצב להראות את מודל הסיום
  const [rating, setRating] = useState(0);  // דירוג הסיפור

  // הדפסת המודול של SpeechRecognition למעקב אם הוא נטען
  console.log('📦 SpeechRecognition module:', SpeechRecognition);

  // שמיעה לאירועים של זיהוי דיבור ושמירת התוצאה
  SpeechRecognition.useSpeechRecognitionEvent('onSpeechResults', (event) => {
    console.log('🎙️ SpeechRecognition result event:', event);
    if (event.value?.[0]) {
      console.log('🗣️ Detected speech:', event.value[0]);
      setSpokenText(event.value[0]);  // עדכון הטקסט המדובר
      handleLiveComparison(event.value[0]);  // השוואת טקסט
    }
  });

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

  // דיבור פסקה נוכחית
  const speakStory = () => {
    if (paragraphs[currentIndex]) {
      Speech.speak(paragraphs[currentIndex], { language: 'he-IL' });  // דיבור בעברית
    }
  };

  // עצירת הדיבור
  const stopStory = () => Speech.stop();

  // התחלת הקשבה לדיבור
  const startListening = async () => {
    const available = await SpeechRecognition.isRecognitionAvailable();
    console.log('🔍 isRecognitionAvailable:', available);
    if (!available) return alert("זיהוי דיבור לא זמין במכשיר זה.");
  
    await SpeechRecognition.requestPermissionsAsync();
    console.log('✅ Permissions granted');
  
    setComparisonResult(null);
    setCurrentWordIndex(0);
    setSpokenText('');
    setIsRecording(true);
  
    await SpeechRecognition.start({ language: 'he-IL' });  // התחלת זיהוי דיבור בעברית
    console.log('🎙️ Started listening...');
  };

  // עצירת ההקלטה
  const stopListening = async () => {
    setIsRecording(false);
    await SpeechRecognition.stop();
  };

  // השוואת הטקסט המדובר עם הפסקה הנוכחית
  const handleLiveComparison = (spokenText) => {
    const paragraph = paragraphs[currentIndex];
    if (!paragraph) return;

    const originalWords = paragraph.trim().split(/\s+/);  // פיצול הפסקה למילים
    const spokenWords = spokenText.trim().split(/\s+/);  // פיצול הטקסט המדובר למילים
    const index = spokenWords.length - 1;  // אינדקס המילה הנוכחית בהשוואה

    if (!originalWords[index] || !spokenWords[index]) return;

    // השוואת המילים והצגת התוצאה
    const result = originalWords.map((word, i) => ({
      word,
      match: spokenWords[i]?.toLowerCase() === word.toLowerCase(),
    }));

    setComparisonResult(result);  // עדכון התוצאה
    setCurrentWordIndex(index);  // עדכון אינדקס המילה הנוכחית

    if (result[index].match) {
      if (index % 5 === 0) {
        Speech.speak("כל הכבוד!", { language: 'he-IL' });  // חיזוק חיובי
      }
    } else {
      Speech.speak("נסה שוב את המילה הזו", { language: 'he-IL' });  // חיזוק למילה לא נכונה
    }
  };

  // מעבר לפסקה הבאה
  const goToNextParagraph = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setComparisonResult(null);
      setSpokenText('');
    } else {
      setShowEndModal(true);  // הצגת מודל סיום אם זה הסיפור האחרון
    }
  };

  // חזרה לפסקה קודמת
  const goToPreviousParagraph = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setComparisonResult(null);
      setSpokenText('');
    }
  };

  // פונקציה להדפסת התוצאה של השוואת הקריאה
  const renderComparison = () => comparisonResult && (
    <Text style={styles.paragraph}>
      {comparisonResult.map((item, index) => {
        let style = { color: item.match ? 'black' : 'red' };  // צבע המילים
        if (index === currentWordIndex) {
          style.backgroundColor = '#FFFF99';  // סימון המילה הנוכחית
        }
        return <Text key={index} style={style}>{item.word + ' '}</Text>;
      })}
    </Text>
  );

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

            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity onPress={speakStory}><Icon name="volume-up" size={30} color="#2980B9" /></TouchableOpacity>
              <TouchableOpacity onPress={stopStory}><Icon name="stop" size={30} color="#C0392B" /></TouchableOpacity>
              <TouchableOpacity onPress={isRecording ? stopListening : startListening}>
                <Icon name={isRecording ? "stop" : "mic"} size={30} color={isRecording ? '#C0392B' : '#2980B9'} />
              </TouchableOpacity>
            </View>

            {/* ניווט לפסקאות */}
            <View style={styles.navigation}>
              <TouchableOpacity onPress={goToPreviousParagraph} disabled={currentIndex === 0}>
                <Icon name="arrow-back" size={30} color={currentIndex === 0 ? '#ccc' : '#2980B9'} />
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
                    />
                    <Text style={styles.emoji}>{getEncouragementEmoji()}</Text>
                  </View>
                </View>
              )}

              <TouchableOpacity onPress={goToNextParagraph} disabled={currentIndex === paragraphs.length - 1}>
                <Icon name="arrow-forward" size={30} color={currentIndex === paragraphs.length - 1 ? '#ccc' : '#2980B9'} />
              </TouchableOpacity>
            </View>

            {comparisonResult && (
              <>
                <Text style={styles.title}>השוואת קריאה:</Text>
                {renderComparison()}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* מודל סיום סיפור */}
      <Modal visible={showEndModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require('../assets/animations/confetti.json')}
              autoPlay
              loop={false}
              style={styles.confetti}
            />
            <Text style={styles.modalTitle}>🎉 כל הכבוד שסיימת את הסיפור!</Text>
            <Text style={styles.modalSubtitle}>איך נהנית מהסיפור?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Icon name="star" size={32} color={star <= rating ? "#FFD700" : "#ccc"} />
                </TouchableOpacity>
              ))}
            </View>
            <Button title="סיים" onPress={() => setShowEndModal(false)} />
          </View>
        </View>
      </Modal>
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
  navigation: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    marginBottom: 4,
    fontSize: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 20,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confetti: {
    width: '100%',
    height: '100%',
  },
});
