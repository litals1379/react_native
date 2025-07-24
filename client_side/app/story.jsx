import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ActivityIndicator, ScrollView, Image, Alert, TouchableOpacity, Modal, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import * as Speech from 'expo-speech';
import { Audio, Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from './Components/AlertModal';
import { styles } from './Style/story';

export default function Story() {
  const router = useRouter();
  const { childID, topic } = useLocalSearchParams();
  const [paragraphs, setParagraphs] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userId, setUserId] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const [rating, setRating] = useState(0);
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [modalData, setModalData] = useState({ visible: false, message: '', emoji: '', type: 'success' });

  const [reportData, setReportData] = useState({
    storyId: null, userId: '', childId: childID, startTime: new Date().toISOString(), totalParagraphs: 0,
    completedParagraphs: 0, totalErrors: 0, paragraphs: [], summary: {}
  });

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`);
        const text = await response.text();
        if (!response.ok) throw new Error('לא נמצא סיפור מתאים');
        const data = JSON.parse(text);
        const fetchedParagraphs = Object.values(data?.paragraphs || {});
        const fetchedImages = Object.values(data?.imagesUrls || {});
        const uid = await AsyncStorage.getItem('userId');

        setParagraphs(fetchedParagraphs);
        setImages(fetchedImages);
        setReportData(prev => ({
          ...prev, userId: uid, storyId: data?.id, totalParagraphs: fetchedParagraphs.length,
          paragraphs: fetchedParagraphs.map((text, index) => ({
            paragraphIndex: index, text, problematicWords: [], attempts: 0, wasSuccessful: false
          }))
        }));
        setUserId(uid);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (childID && topic) fetchStory();
  }, [childID, topic]);

  const speakStory = () => {
    if (paragraphs[currentIndex]) {
      setIsSpeaking(true);
      Speech.speak(paragraphs[currentIndex], {
        language: 'he-IL', onDone: () => setIsSpeaking(false), onStopped: () => setIsSpeaking(false), onError: () => setIsSpeaking(false),
      });
    }
  };

  const stopStory = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const speakWord = (word) => {
    Speech.speak(word, { language: 'he-IL' });
  };

  const record = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return Alert.alert('לא אושרה גישה למיקרופון');
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setRecordingUri(null);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setRecordingUri(uri);
      setIsRecording(false);

      const formData = new FormData();
      formData.append('text', paragraphs[currentIndex]);
      formData.append('audio', { uri, name: 'recording.wav', type: 'audio/wav' });

      setIsAnalyzing(true);
      const response = await fetch('https://storytime-fp9z.onrender.com/analyze', { method: 'POST', body: formData });
      const json = await response.json();
      const wrongArr = json.result;
      const words = paragraphs[currentIndex].split(/\s+/);
      const problematicWords = words.filter((_, i) => wrongArr[i] === 1);

      setReportData(prev => ({
        ...prev,
        completedParagraphs: prev.completedParagraphs + 1,
        totalErrors: prev.totalErrors + problematicWords.length,
        paragraphs: prev.paragraphs.map(p =>
          p.paragraphIndex === currentIndex ? {
            ...p, problematicWords, attempts: 1, wasSuccessful: !wrongArr.includes(1)
          } : p
        )
      }));

      setHighlightedWords(words.map((word, i) => ({ text: word, isWrong: wrongArr[i] === 1 })));
      setHasFeedback(true);
      setModalData({
        visible: true,
        message: wrongArr.includes(1) ? 'היו כמה פספוסים בהגייה 🤏 תנסה שוב, אתה כמעט שם!' : 'בול פגיעה! הגית את הכל מושלם 💪✨',
        emoji: wrongArr.includes(1) ? '🧐' : '🌟',
        type: wrongArr.includes(1) ? 'error' : 'success'
      });
    } catch (err) {
      console.error('Stop recording error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => recording ? stopRecording() : record();

  const goToNextParagraph = () => {
    if (currentIndex < paragraphs.length - 1) {
      if (currentIndex === 0) {
        setShowVideo(true);
      } else {
        setCurrentIndex(currentIndex + 1);
        setHighlightedWords([]);
        setHasFeedback(false);
      }
    } else {
      setShowEndModal(true);
    }
  };

  const goToPreviousParagraph = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setHighlightedWords([]);
      setHasFeedback(false);
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

  const handleEndStory = async () => {
    try {
      const finalReport = {
        ...reportData,
        endTime: new Date().toISOString(),
        summary: {
          feedbackType: reportData.totalErrors === 0 ? 'Excellent' : 'Needs Improvement',
          comment: reportData.totalErrors === 0 ? 'בול פגיעה! הגית את הכל מושלם 💪✨' : 'היו כמה מילים קשות. המשך לתרגל ונשפר יחד!',
          emoji: reportData.totalErrors === 0 ? '🌟' : '🧐',
        }
      };

      const response = await fetch("http://www.storytimetestsitetwo.somee.com/api/ReadingSessionReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalReport)
      });

      if (!response.ok) throw new Error(await response.text());
      console.log("✅ Report sent successfully");
    } catch (err) {
      console.error("❌ Failed to send report:", err);
      Alert.alert("שגיאה", "שליחת הדוח נכשלה");
    }
  };

  const submitRating = async (ratingValue) => {
    if (!reportData.storyId) return;
    try {
      const response = await fetch(`http://www.storytimetestsitetwo.somee.com/api/Story/RateStory?storyId=${reportData.storyId}&rating=${ratingValue}`, { method: 'POST' });
      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      Alert.alert("שגיאה", "שליחת הדירוג נכשלה");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2980B9" style={{ marginTop: 20 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {images[currentIndex] && <Image source={{ uri: images[currentIndex] }} style={styles.image} />}

        {paragraphs[currentIndex] && (
          <View style={styles.paragraphContainer}>
            {(highlightedWords.length > 0 ? highlightedWords : paragraphs[currentIndex].split(/\s+/).map(word => ({ text: word, isWrong: false }))
            ).map((wordObj, i) => (
              <TouchableOpacity key={i} onPress={() => speakWord(wordObj.text)}>
                <Text style={[styles.word, hasFeedback && (wordObj.isWrong ? styles.wordIncorrect : styles.wordCorrect)]}>{wordObj.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.navButtons}>
          <TouchableOpacity onPress={goToPreviousParagraph} disabled={isRecording || isSpeaking || currentIndex === 0}>
            <Icon name="arrow-right" size={30} color={isRecording || isSpeaking || currentIndex === 0 ? '#ccc' : styles.arrow.color} />
          </TouchableOpacity>

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
                  animated
                  style={{ transform: [{ scaleX: -1 }] }}
                />
                <Text style={styles.emoji}>{getEncouragementEmoji()}</Text>
              </View>
            </View>

          <TouchableOpacity onPress={goToNextParagraph} disabled={isRecording || isSpeaking || currentIndex === paragraphs.length - 1}>
            <Icon name="arrow-left" size={30} color={isRecording || isSpeaking || currentIndex === paragraphs.length - 1 ? '#ccc' : styles.arrow.color} />
          </TouchableOpacity>
        </View>

        {currentIndex === 0 && showVideo && (
          <Video
            ref={videoRef}
            source={require('../assets/sounds/naniEncouraging.mp4')}
            style={styles.image}
            resizeMode="contain"
            shouldPlay
            isLooping={false}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setShowVideo(false);
                setCurrentIndex(1);
                setHighlightedWords([]);
                setHasFeedback(false);
              }
            }}
          />
        )}

        <View style={styles.micButtons}>
          <TouchableOpacity onPress={isSpeaking ? stopStory : speakStory}>
            <Icon name={isSpeaking ? 'stop' : 'volume-up'} style={isSpeaking ? styles.stopIcon : styles.micIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleRecording}>
            <Icon name={recording ? 'stop' : 'microphone'} style={recording ? styles.stopIcon : styles.micIcon} />
          </TouchableOpacity>
        </View>

        {currentIndex === paragraphs.length - 1 && (
          <TouchableOpacity onPress={() => setShowEndModal(true)} style={styles.endButton} disabled={isRecording || isSpeaking}>
            <Text style={styles.endButtonText}>סיים את הסיפור</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={showEndModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🎉 כל הכבוד שסיימת את הסיפור!</Text>
            <Text style={styles.modalSubtitle}>איך נהנית מהסיפור?</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => { setRating(star); submitRating(star); }}>
                  <Icon name="star" size={32} color={star <= rating ? "#FFD700" : "#ccc"} />
                </TouchableOpacity>
              ))}
            </View>
            <Button title="סיים" onPress={() => { setShowEndModal(false); handleEndStory();router.push('/userProfile') }} />
          </View>
        </View>
      </Modal>

      <AlertModal
        visible={modalData.visible}
        onClose={() => setModalData(prev => ({ ...prev, visible: false }))}
        message={modalData.message}
        emoji={modalData.emoji}
        type={modalData.type}
      />

      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#65558F" />
          <Text style={styles.loadingText}>בודק את ההגייה שלך...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
