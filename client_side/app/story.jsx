import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image, Modal, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';  // מודול להפעלת דיבור
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress';  // מודול לתצוגת בר התקדמות


export default function Story() {
  const { childID, topic } = useLocalSearchParams();  // קבלת מזהה הילד והנושא מתוך הכתובת של הדף


  // הגדרת מצב (state) לאחסון נתונים שונים
  const [paragraphs, setParagraphs] = useState([]);  // אחסון הפסקאות של הסיפור
  const [images, setImages] = useState([]);  // אחסון תמונות הקשורות לפסקאות
  const [currentIndex, setCurrentIndex] = useState(0);  // אינדקס הפסקה נוכחית
  const [loading, setLoading] = useState(true);  // מצב טעינה
  const [error, setError] = useState(null);  // מצב שגיאה
  const [rating, setRating] = useState(0);  // דירוג הסיפור
  const [showEndModal, setShowEndModal] = useState(false);  // מצב להצגת מודל סיום הסיפור


  // פונקציה להבאת הסיפור מהשרת
  const fetchStory = async (childID, topic) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const text = await response.text();
  
      if (!response.ok) {
        throw new Error(`Server returned error: ${text}`);
      }
  
      const data = JSON.parse(text);
      const loadedParagraphs = Object.values(data?.paragraphs || {});
      const loadedImages = Object.values(data?.imagesUrls || {});
  
      setParagraphs(loadedParagraphs);  // שמירת הפסקאות
      setImages(loadedImages);          // שמירת התמונות
    } catch (err) {
      setError(err.message);            // במקרה של שגיאה
    } finally {
      setLoading(false);               // סיום טעינה
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


  // מעבר לפסקה הבאה
  const goToNextParagraph = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowEndModal(true);  // הצגת מודל סיום אם זה הסיפור האחרון
    }
  };


  // חזרה לפסקה קודמת
  const goToPreviousParagraph = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
  endButton: {
    backgroundColor: '#B3E7F2',
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  endButtonText: {
    fontSize: 18,
    color: '#65558F',
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  }
});



