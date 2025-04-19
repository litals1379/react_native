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
  const [isRecording, setIsRecording] = useState(false);  // מצב אם נרשם דיבור
  const [spokenText, setSpokenText] = useState('');  // טקסט מדובר
  const [showEndModal, setShowEndModal] = useState(false);  // מצב להראות את מודל הסיום
  const [rating, setRating] = useState(0);  // דירוג הסיפור

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

  // התחלת הקשבה לדיבור (לא מדובר בזמן אמת)
  const startListening = async () => {
    const available = await SpeechRecognition.isRecognitionAvailable();
    console.log('🔍 isRecognitionAvailable:', available);
    if (!available) return alert("זיהוי דיבור לא זמין במכשיר זה.");

    await SpeechRecognition.requestPermissionsAsync();
    console.log('✅ Permissions granted');

    setSpokenText('');
    setIsRecording(true);

    // התחלת הקלטת הדיבור (אין זיהוי בזמן אמת, רק בסוף ההקלטה)
    await SpeechRecognition.start({ language: 'he-IL' });
    console.log('🎙️ Started listening...');
  };

  // עצירת ההקלטה
  const stopListening = async () => {
    setIsRecording(false);
    const result = await SpeechRecognition.stop();  // מקבלים את התוצאה לאחר ההקלטה
    console.log('🎙️ Speech results:', result);
    setSpokenText(result?.value?.[0] || '');  // שמירה על הטקסט המלא
    handleComparison(result?.value?.[0] || '');  // השוואת טקסט אחרי סיום ההקלטה
  };

  // השוואת הטקסט המדובר עם הפסקה הנוכחית
  const handleComparison = (spokenText) => {
    const paragraph = paragraphs[currentIndex];
    if (!paragraph) return;

    const originalWords = paragraph.trim().split(/\s+/);  // פיצול הפסקה למילים
    const spokenWords = spokenText.trim().split(/\s+/);  // פיצול הטקסט המדובר למילים

    const result = originalWords.map((word, i) => ({
      word,
      match: spokenWords[i]?.toLowerCase() === word.toLowerCase(),
    }));

    setComparisonResult(result);  // עדכון התוצאה
  };

  // פונקציה להדפסת התוצאה של השוואת הקריאה
  const renderComparison = () => comparisonResult && (
    <Text style={styles.paragraph}>
      {comparisonResult.map((item, index) => {
        let style = { color: item.match ? 'black' : 'red' };  // צבע המילים
        return <Text key={index} style={style}>{item.word + ' '}</Text>;
      })}
    </Text>
  );

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
            {/* <LottieView
              source={require('../assets/animations/confetti.json')}
              autoPlay
              loop={false}
              style={styles.confetti}
            /> */}
            <Text style={styles.modalTitle}>🎉 כל הכבוד שסיימת את הסיפור!</Text>
            <Progress.Bar progress={rating / 10} width={200} />
            <Button title="הערך את הסיפור" onPress={() => setRating(8)} />
            <Button title="סיים" onPress={() => setShowEndModal(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, justifyContent: 'center' },
  paragraph: { fontSize: 18, marginVertical: 10, lineHeight: 25 },
  image: { width: '100%', height: 200, marginBottom: 10 },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, marginBottom: 20 },
  confetti: { width: 200, height: 200 },
  errorText: { color: 'red', textAlign: 'center' }
});
