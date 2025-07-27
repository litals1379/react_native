import { Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Alert, Modal, Button } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import * as Speech from 'expo-speech';
import { Audio, Video } from 'expo-av';
import { styles } from './Style/storyFromLibrary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SOMEE_STORY_GET_BY_ID, API_SOMEE_READING_SESSION_REPORT, API_SOMEE_STORY_RATE, API_Render_Analyzing } from './Config/config'; // <--- Original Config Import
import { Animated, Easing } from 'react-native';

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
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;
  const pulseAnimationRef = useRef(null); // Ref to hold the animation instance

  // Animation for pulsing buttons
  const startPulsing = () => {
    // Stop any existing animation before starting a new one
    if (pulseAnimationRef.current) {
      pulseAnimationRef.current.stop();
    }

    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 2,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    animation.start();
    pulseAnimationRef.current = animation; // Store the animation instance
  };

  const stopPulsing = () => {
    if (pulseAnimationRef.current) {
      pulseAnimationRef.current.stop(); // Stop the animation
      pulseAnimationRef.current = null; // Clear the ref
    }
    pulseScale.setValue(1); // Reset scale
    pulseOpacity.setValue(0.6); // Reset opacity
  };

  useEffect(() => {
    if (isSpeaking || recording) {
      startPulsing();
    } else {
      stopPulsing();
    }

    // Cleanup function for useEffect
    return () => {
      stopPulsing(); // Stop animation if component unmounts
    };
  }, [isSpeaking, recording]);

  // Report Data State
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

  // Fetch Story Data on Component Mount
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
            wasSuccessful: false,
            hasBeenPassed: false, // User navigated past this paragraph at least once
            wasRecorded: false, // User attempted to record this paragraph
          }))
        }));
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) fetchStory();
  }, [storyId]);

  // Navigation Logic for Next Paragraph
  const goToNextParagraph = () => {
    setReportData(prev => {
      const updatedParagraphs = [...prev.paragraphs];
      const currentParagraphData = updatedParagraphs[currentIndex];

      if (currentParagraphData) {
        // Mark the current paragraph as passed if it hasn't been already
        if (!currentParagraphData.hasBeenPassed) {
          currentParagraphData.hasBeenPassed = true;
        }

        // If the paragraph was NOT recorded (and no attempts were made),
        // mark all its words as problematic (skipped as mistake)
        if (!currentParagraphData.wasRecorded && currentParagraphData.attempts === 0) {
          const words = currentParagraphData.text.split(/\s+/).filter(word => word.length > 0);
          currentParagraphData.problematicWords = words;
          currentParagraphData.wasSuccessful = false;
        }
      }
      return { ...prev, paragraphs: updatedParagraphs };
    });

    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHighlightedWords([]);
      setHasFeedback(false);
      setFeedbackVideo(null); // Clear any existing feedback video
    }
    // No else block here, as "Next" is disabled on the last paragraph
  };

  // Navigation Logic for Previous Paragraph
  const goToPreviousParagraph = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setHighlightedWords([]);
      setHasFeedback(false);
      setFeedbackVideo(null); // Clear any existing feedback video
    }
  };

  // Progress Bar Color based on progress
  const getProgressColor = () => {
    const progress = (currentIndex + 1) / paragraphs.length;
    if (progress < 0.34) return '#E74C3C'; // Red
    if (progress < 0.67) return '#F39C12'; // Orange
    return '#27AE60'; // Green
  };

  // Encouragement Emoji based on progress
  const getEncouragementEmoji = () => {
    const progress = (currentIndex + 1) / paragraphs.length;
    if (progress < 0.34) return '🚀';
    if (progress < 0.67) return '🌟';
    return '🏆';
  };

  // Text-to-Speech Functions
  const speakStory = () => {
    if (paragraphs[currentIndex]) {
      setIsSpeaking(true);
      Speech.speak(paragraphs[currentIndex], {
        language: 'he-IL',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => {
          console.error("Speech error");
          setIsSpeaking(false);
        },
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

  // Audio Recording Functions
  const record = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('הרשאת מיקרופון נדרשת', 'אנא אפשר גישה למיקרופון כדי להקליט את קריאתך.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync({
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

      await recordingInstance.startAsync();
      setRecording(recordingInstance);
      setRecordingUri(null); // Clear previous recording URI
      setIsRecording(true);
      console.log('Recording started.');
    } catch (err) {
      console.error('Recording start error:', err);
      Alert.alert('שגיאת הקלטה', err.message || 'אירעה שגיאה בעת התחלת ההקלטה.');
      setRecording(null); // Ensure recording state is reset
      setIsRecording(false);
      setRecordingUri(null);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.warn('Attempted to stop recording, but no recording object exists.');
        return;
      }

      // Indicate that recording has stopped but analysis is starting
      setIsRecording(false); // Set this immediately so the UI reflects "not recording"
      setIsAnalyzing(true); // Show analysis spinner

      console.log('Attempting to stop and unload recording...');
      await recording.stopAndUnloadAsync();
      console.log('Recording stopped and unloaded.');

      const uri = recording.getURI();
      setRecording(null); // Clear recording object only after successful stop/unload
      setRecordingUri(uri); // Store URI for analysis

      if (!uri) {
        throw new Error("Recording URI is null after stopAndUnloadAsync.");
      }
      console.log('Recording URI:', uri);

      // 2. Prepare data for analysis
      const formData = new FormData();
      formData.append('text', paragraphs[currentIndex]);
      formData.append('audio', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav',
      });

      console.log('Sending audio for analysis...');
      // 4. Await the analysis API response
      const response = await fetch(API_Render_Analyzing, {
        method: 'POST',
        body: formData,
      });
      console.log('Analysis API response received.');

      // Handle non-OK responses from the analysis API
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Analysis API error:', response.status, errorData);
        Alert.alert('שגיאה בניתוח', errorData.message || 'הייתה שגיאה בבדיקת ההגייה.');
        setFeedbackVideo(null); // Clear video if API fails
        return; // Exit function early on API error
      }

      const json = await response.json();
      const wrongArr = json.result; // wrongArr is typically an array like [0, 1, 0] for correct/incorrect words
      const words = paragraphs[currentIndex].split(/\s+/).filter(word => word.length > 0);
      const problematicWords = words.filter((_, i) => wrongArr[i] === 1);

      // 5. Update report data (after successful analysis)
      setReportData(prev => ({
        ...prev,
        paragraphs: prev.paragraphs.map(p =>
          p.paragraphIndex === currentIndex
            ? {
              ...p,
              problematicWords, // Update with actual errors from analysis
              attempts: p.attempts + 1,
              wasSuccessful: !wrongArr.includes(1), // True if no errors detected
              hasBeenPassed: true, // A recorded paragraph is always considered passed
              wasRecorded: true, // Mark that this paragraph was explicitly recorded
            }
            : p
        )
      }));

      // Update UI for highlighted words and feedback
      setHighlightedWords(words.map((word, i) => ({ text: word, isWrong: wrongArr[i] === 1 })));
      setHasFeedback(true);

      // 6. Determine character ID and feedback video AFTER analysis results are ready
      const characterId = parseInt(characterID);
      const feedbackSet = feedbackVideos[characterId];

      if (feedbackSet) {
        setFeedbackVideo(wrongArr.includes(1) ? feedbackSet.wrong : feedbackSet.correct);
        // If correct, auto-advance after video feedback
        if (!wrongArr.includes(1)) {
          setTimeout(() => {
            setFeedbackVideo(null); // Ensure video clears before moving
            goToNextParagraph();
          }, 4000); // Wait for video to play (adjust duration as needed)
        } else {
            // If incorrect, clear video after 4 seconds but don't auto-advance
            setTimeout(() => {
                setFeedbackVideo(null);
            }, 4000); // Wait for video to play (adjust duration as needed)
        }
      } else {
        console.warn('No feedback videos found for characterID:', characterId);
        setFeedbackVideo(null);
        // If no feedback video, and correct, still auto-advance
        if (!wrongArr.includes(1)) {
          goToNextParagraph();
        }
      }

    } catch (err) {
      console.error('Error during stop recording or analysis:', err);
      Alert.alert('שגיאה', 'הייתה שגיאה בעיבוד או בניתוח ההקלטה: ' + (err.message || 'שגיאה לא ידועה'));
      setFeedbackVideo(null); // Always clear feedback video on error
    } finally {
      console.log('Analysis process finished or encountered error. Setting isAnalyzing to false.');
      setIsAnalyzing(false); // Crucially, ensure this is always set to false
    }
  };

  const toggleRecording = () => {
    recording ? stopRecording() : record();
  };

  // Handles End of Story, sends report
  const handleEndStory = async () => {
    // Before finalizing the report, make sure the LAST paragraph's status is updated
    // in case the user clicked "Finish" directly without recording or skipping to next
    setReportData(prev => {
      const updatedParagraphs = [...prev.paragraphs];
      const lastParagraphData = updatedParagraphs[currentIndex];

      if (lastParagraphData && !lastParagraphData.hasBeenPassed) {
        lastParagraphData.hasBeenPassed = true;
        // If the last paragraph was not recorded, mark all words as problematic
        if (!lastParagraphData.wasRecorded && lastParagraphData.attempts === 0) {
          const words = lastParagraphData.text.split(/\s+/).filter(word => word.length > 0);
          lastParagraphData.problematicWords = words;
          lastParagraphData.wasSuccessful = false;
        }
      }
      return { ...prev, paragraphs: updatedParagraphs };
    });

    let calculatedTotalErrors = 0;
    let calculatedCompletedParagraphs = 0;

    // Iterate through the final state of paragraphs to calculate totals
    reportData.paragraphs.forEach(p => {
      // A paragraph is considered "completed" if the user has navigated past it OR recorded it
      if (p.hasBeenPassed) { // hasBeenPassed implies it's been seen/moved past
        calculatedCompletedParagraphs++;
      }
      // Count errors for all paragraphs that were "passed" (either recorded or skipped without recording)
      // This correctly reflects reduced errors if a skipped paragraph was later recorded
      calculatedTotalErrors += p.problematicWords.length;
    });

    try {
      const finalReport = {
        ...reportData,
        endTime: new Date().toISOString(),
        totalParagraphs: paragraphs.length,
        completedParagraphs: calculatedCompletedParagraphs,
        totalErrors: calculatedTotalErrors,
        summary: {
          feedbackType: calculatedTotalErrors === 0 ? 'מצויין' : 'יש עוד מה לשפר',
          comment: calculatedTotalErrors === 0
            ? 'בול פגיעה! הגית את הכל מושלם 💪✨'
            : 'היו כמה מילים קשות. המשך לתרגל ונשפר יחד!',
          emoji: calculatedTotalErrors === 0 ? '🌟' : '🧐'
        }
      };

      await fetch(API_SOMEE_READING_SESSION_REPORT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalReport)
      });
      console.log("Reading session report sent successfully.");
    } catch (err) {
      console.error("❌ Failed to send report:", err);
      Alert.alert("שגיאה", "שליחת הדוח נכשלה");
    }
  };

  // Story Rating Function
  const submitRating = async (ratingValue) => {
    if (!reportData.storyId) return;
    try {
      await fetch(`${API_SOMEE_STORY_RATE}?storyId=${reportData.storyId}&rating=${ratingValue}`, { method: 'POST' });
      console.log(`Story ${reportData.storyId} rated ${ratingValue} successfully.`);
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert("שגיאה", "שליחת הדירוג נכשלה");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#65558F" />
        <Text style={styles.loadingText}>טוען סיפור...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>שגיאה: {error}</Text>
        <Button title="נסה שוב" onPress={() => router.replace('/library')} />
      </View>
    );
  }

  // Main Component Render
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
          {(highlightedWords.length > 0 // If feedback is available, use highlighted words
            ? highlightedWords
            : paragraphs[currentIndex].split(/\s+/).map((word) => ({ text: word, isWrong: false })) // Otherwise, default to no highlights
          ).map((wordObj, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => speakWord(wordObj.text)}
              disabled={isRecording} // Disable word touch during recording
            >
              <Text style={[
                styles.wordText,
                hasFeedback && { color: wordObj.isWrong ? '#E74C3C' : '#2ECC71' } // Apply color if feedback exists
              ]}>
                {wordObj.text + ' '}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          <TouchableOpacity
            onPress={goToPreviousParagraph}
            disabled={isRecording || isSpeaking || currentIndex === 0}
          >
            <Icon
              name="arrow-right" // Right arrow for "previous" in RTL
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
            // Disable "Next" if currently recording/speaking OR if on the last paragraph
            disabled={isRecording || isSpeaking || currentIndex === paragraphs.length - 1}
          >
            <Icon
              name="arrow-left" // Left arrow for "next" in RTL
              size={30}
              color={
                isRecording || isSpeaking || currentIndex === paragraphs.length - 1
                  ? '#ccc' // Disabled color
                  : '#65558F' // Enabled color
              }
            />
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
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
              style={{ transform: [{ scaleX: -1 }] }} // Flip for RTL
            />
            <Text style={styles.emoji}>{getEncouragementEmoji()}</Text>
          </View>

          {/* Feedback Video Modal */}
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
                    console.error('Video playback error:', error);
                    setFeedbackVideo(null);
                  }}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish && !status.isLooping) {
                      setFeedbackVideo(null);
                    }
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>

        {/* Control Buttons (Speak & Record) */}
        <View style={styles.controlButtonsContainer}>
          {/* Speaking Button with pulsing background */}
          <View style={styles.buttonWrapper}>
            {isSpeaking && (
              <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseScale }], opacity: pulseOpacity, backgroundColor: '#D6C9F0' }]} />
            )}
            <TouchableOpacity
              style={[styles.button, isSpeaking && styles.buttonListening, { opacity: recording ? 0.5 : 1 }]}
              onPress={isSpeaking ? stopStory : speakStory}
              disabled={isRecording}
            >
              <Icon name={isSpeaking ? "stop" : "volume-up"} size={30} color={isSpeaking ? "#C0392B" : "#65558F"} />
            </TouchableOpacity>
          </View>

          {/* Recording Button with pulsing background */}
          <View style={styles.buttonWrapper}>
            {recording && (
              <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseScale }], opacity: pulseOpacity, backgroundColor: '#F6B8B8' }]} />
            )}
            <TouchableOpacity
              style={[styles.button, recording && styles.buttonListening, { opacity: isSpeaking ? 0.5 : 1 }]}
              onPress={toggleRecording}
              disabled={isSpeaking}
            >
              <Icon name={recording ? "stop" : "microphone"} size={30} color={recording ? "#C0392B" : "#65558F"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* The "Finish Story" button now appears ONLY on the last paragraph */}
        {currentIndex === paragraphs.length - 1 && (
            <TouchableOpacity
                onPress={() => { handleEndStory(); setShowEndModal(true); }}
                disabled={isRecording || isSpeaking}
                style={styles.endButton}
            >
                <Text style={styles.endButtonText}>סיים את הסיפור</Text>
            </TouchableOpacity>
        )}
      </ScrollView>

      {/* End Story Modal (Rating) */}
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

      {/* Analysis Loading Overlay */}
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