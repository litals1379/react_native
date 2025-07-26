import { Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Alert, Modal, Button } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import * as Speech from 'expo-speech';
import { Audio, Video } from 'expo-av';
import { styles } from './Style/storyFromLibrary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SOMEE_STORY_GET_BY_ID, API_SOMEE_READING_SESSION_REPORT, API_SOMEE_STORY_RATE, API_Render_Analyzing } from './Config/config';

// ✅ ייבוא סרטונים
const feedbackVideos = {
  1: {
    correct: require('../assets/sounds/mikoEncouraging.mp4'),
    wrong: require('../assets/sounds/mikoWrong.mp4'),
  },
  2: {
    correct: require('../assets/sounds/naviEncouraging.mp4'),
    wrong: require('../assets/sounds/naviWrong.mp4'),
  },
  3: {
    correct: require('../assets/sounds/karniEncouraging.mp4'),
    wrong: require('../assets/sounds/karniWrong.mp4'),
  },
  4: {
    correct: require('../assets/sounds/teddyEncouraging.mp4'),
    wrong: require('../assets/sounds/teddyWrong.mp4'),
  },
};


const StoryFromLibrary = () => {
  const router = useRouter();
  const { storyId, childId, characterID } = useLocalSearchParams();

  const [story, setStory] = useState(null);
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

  // ✅ נגן וידאו משוב
  const [feedbackVideo, setFeedbackVideo] = useState(null);
  const videoFeedbackRef = useRef(null);

  const [reportData, setReportData] = useState({
    storyId,
    userId: '',
    childId,
    startTime: new Date().toISOString(),
    totalParagraphs: 0,
    completedParagraphs: 0,
    totalErrors: 0,
    paragraphs: [],
    summary: {}
  });

  const [showEndModal, setShowEndModal] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`${API_SOMEE_STORY_GET_BY_ID}${storyId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unknown error');

        const fetchedParagraphs = Object.values(data.paragraphs || {});
        const fetchedImages = Object.values(data.imagesUrls || {});
        const userId = await AsyncStorage.getItem('userId');

        setStory(data);
        setParagraphs(fetchedParagraphs);
        setImages(fetchedImages);
        setReportData(prev => ({
          ...prev,
          userId,
          totalParagraphs: fetchedParagraphs.length,
          paragraphs: fetchedParagraphs.map((text, index) => ({
            paragraphIndex: index,
            text,
            problematicWords: [],
            attempts: 0,
            wasSuccessful: false
          }))
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) fetchStory();
  }, [storyId]);

  const goToNextParagraph = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHighlightedWords([]);
      setHasFeedback(false);
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

  const speakWord = (word) => {
    Speech.speak(word, {
      language: 'he-IL',
    });
  };

  const record = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('אנא אפשר הרשאות גישה למיקרופון');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        isMeteringEnabled: false,
      });

      await recording.startAsync();
      setRecording(recording);
      setRecordingUri(null);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      Alert.alert('Recording error', err.message || 'Unknown error');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      // 1. Stop and unload the recording
      await recording.stopAndUnloadAsync(); // Ensure this completes
      const uri = recording.getURI();
      setRecording(null);
      setRecordingUri(uri);
      setIsRecording(false);

      // 2. Prepare data for analysis
      const formData = new FormData();
      formData.append('text', paragraphs[currentIndex]);
      formData.append('audio', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav',
      });

      // 3. Indicate analysis is in progress
      setIsAnalyzing(true);

      // 4. Await the analysis API response
      const response = await fetch(API_Render_Analyzing, {
        method: 'POST',
        body: formData,
      });

      // Handle non-OK responses from the analysis API
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Analysis API error:', response.status, errorData);
        Alert.alert('שגיאה בניתוח', errorData.message || 'הייתה שגיאה בבדיקת ההגייה.');
        // Crucial: Set feedback to null and stop analyzing if API call fails
        setFeedbackVideo(null);
        setIsAnalyzing(false);
        return; // Exit the function gracefully
      }

      const json = await response.json();
      const wrongArr = json.result;
      const words = paragraphs[currentIndex].split(/\s+/);
      const problematicWords = words.filter((_, i) => wrongArr[i] === 1);

      // 5. Update report data (after successful analysis)
      setReportData(prev => ({
        ...prev,
        completedParagraphs: prev.completedParagraphs + 1,
        totalErrors: prev.totalErrors + problematicWords.length,
        paragraphs: prev.paragraphs.map(p =>
          p.paragraphIndex === currentIndex
            ? {
              ...p,
              problematicWords,
              attempts: 1,
              wasSuccessful: !wrongArr.includes(1)
            }
            : p
        )
      }));

      setHighlightedWords(words.map((word, i) => ({ text: word, isWrong: wrongArr[i] === 1 })));
      setHasFeedback(true);

      // 6. Determine character ID and feedback video AFTER analysis results are ready
      const characterId = parseInt(characterID);
      const feedbackSet = feedbackVideos[characterId];

      if (feedbackSet) {
        // Only set the feedback video if a valid source is found
        setFeedbackVideo(wrongArr.includes(1) ? feedbackSet.wrong : feedbackSet.correct);
      } else {
        console.warn('No feedback videos found for characterID:', characterId);
        setFeedbackVideo(null); // Ensure modal doesn't open
      }

    } catch (err) {
      console.error('Stop recording or analysis error:', err);
      Alert.alert('שגיאה', 'הייתה שגיאה בעיבוד או בניתוח ההקלטה: ' + (err.message || 'שגיאה לא ידועה'));
      // Ensure cleanup in case of any error
      setFeedbackVideo(null);
    } finally {
      // This will always run, ensuring the loading indicator is dismissed
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    recording ? stopRecording() : record();
  };

  const handleEndStory = async () => {
    try {
      const finalReport = {
        ...reportData,
        endTime: new Date().toISOString(),
        summary: {
          feedbackType: reportData.totalErrors === 0 ? 'מצויין' : 'יש עוד מה לשפר',
          comment: reportData.totalErrors === 0
            ? 'בול פגיעה! הגית את הכל מושלם 💪✨'
            : 'היו כמה מילים קשות. המשך לתרגל ונשפר יחד!',
          emoji: reportData.totalErrors === 0 ? '🌟' : '🧐'
        }
      };

      await fetch(API_SOMEE_READING_SESSION_REPORT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalReport)
      });
    } catch (err) {
      console.error("❌ Failed to send report:", err);
      Alert.alert("שגיאה", "שליחת הדוח נכשלה");
    }
  };

  const submitRating = async (ratingValue) => {
    if (!reportData.storyId) return;
    try {
      await fetch(`${API_SOMEE_STORY_RATE}?storyId=${reportData.storyId}&rating=${ratingValue}`, { method: 'POST' });
    } catch (error) {
      Alert.alert("שגיאה", "שליחת הדירוג נכשלה");
    }
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#65558F" /></View>;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.bookTitle}>{story.title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {images[currentIndex] && (
          <Image source={{ uri: images[currentIndex] }} style={styles.image} resizeMode="cover" />
        )}

        <View style={styles.wordWrapContainer}>
          {(highlightedWords.length > 0
            ? highlightedWords
            : paragraphs[currentIndex].split(/\s+/).map((word) => ({ text: word, isWrong: false }))
          ).map((wordObj, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => speakWord(wordObj.text)}
              disabled={isRecording} // Add this line
            >
              <Text style={[styles.wordText, hasFeedback && { color: wordObj.isWrong ? '#E74C3C' : '#2ECC71' }]}>
                {wordObj.text + ' '}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.navigation}>
          <TouchableOpacity
            onPress={goToPreviousParagraph}
            disabled={isRecording || isSpeaking || currentIndex === 0}
          >
            <Icon
              name="arrow-right"
              size={30}
              color={
                isRecording || isSpeaking || currentIndex === 0
                  ? '#ccc'
                  : '#65558F'
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextParagraph}
            disabled={
              isRecording || isSpeaking || currentIndex === paragraphs.length - 1
            }
          >
            <Icon
              name="arrow-left"
              size={30}
              color={
                isRecording || isSpeaking || currentIndex === paragraphs.length - 1
                  ? '#ccc'
                  : '#65558F'
              }
            />
          </TouchableOpacity>
        </View>


        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>פסקה {currentIndex + 1} מתוך {paragraphs.length}</Text>
          <View style={styles.progressRow}>
            <Progress.Bar progress={(currentIndex + 1) / paragraphs.length} width={160} height={10} borderRadius={8} color={getProgressColor()} unfilledColor="#E0E0E0" borderWidth={0} animated style={{ transform: [{ scaleX: -1 }] }} />
            <Text style={styles.emoji}>{getEncouragementEmoji()}</Text>
          </View>

          <Modal visible={!!feedbackVideo} transparent animationType="fade">
            <View style={styles.feedbackModalOverlay}>
              <View style={styles.feedbackBubble}>
                <Video
                  ref={videoFeedbackRef}
                  source={feedbackVideo}
                  shouldPlay
                  isLooping={false}
                  useNativeControls={false}
                  resizeMode="cover"
                  style={styles.feedbackVideo}
                  onError={(error) => {
                    console.error('Video error:', error);
                    setFeedbackVideo(null); // fail-safe
                  }}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish && !status.isLooping) {
                      setFeedbackVideo(null);
                      if (!highlightedWords.some(w => w.isWrong)) {
                        goToNextParagraph();
                      }
                    }
                  }}
                />
              </View>
            </View>
          </Modal>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 20 }}>
          <TouchableOpacity style={[styles.button, isSpeaking && styles.buttonListening]} onPress={isSpeaking ? stopStory : speakStory} disabled={isRecording}>
            <Icon name={isSpeaking ? "stop" : "volume-up"} size={30} color={isSpeaking ? "#C0392B" : "#65558F"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, recording && styles.buttonListening]} onPress={toggleRecording} disabled={isSpeaking}>
            <Icon name={recording ? "stop" : "microphone"} size={30} color={recording ? "#C0392B" : "#65558F"} />
          </TouchableOpacity>
        </View>

        {currentIndex === paragraphs.length - 1 && (
          <TouchableOpacity onPress={() => { handleEndStory(); setShowEndModal(true); }} disabled={isRecording || isSpeaking} style={[styles.endButton, { marginTop: 20 }]}>
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
            <Button title="סיים" onPress={() => { setShowEndModal(false); router.push('/userProfile') }} />
          </View>
        </View>
      </Modal>

      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#65558F" />
          <Text style={styles.loadingText}>בודק את ההגייה שלך...</Text>
        </View>
      )}
    </View>
  );
};

export default StoryFromLibrary;
