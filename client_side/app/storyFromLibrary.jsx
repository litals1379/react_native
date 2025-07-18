import { Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { styles } from './Style/storyFromLibrary';
import AlertModal from './Components/AlertModal'; // ✅ IMPORT MODAL

const StoryFromLibrary = () => {
  const router = useRouter();
  const { storyId } = useLocalSearchParams();
  const [story, setStory] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  const [modalData, setModalData] = useState({ // ✅ MODAL STATE
    visible: false,
    message: '',
    emoji: '',
    type: 'success',
  });

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryById/${storyId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unknown error');

        setStory(data);
        setParagraphs(Object.values(data.paragraphs || {}));
        setImages(Object.values(data.imagesUrls || {}));
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
      onDone: () => { },
      onStopped: () => { },
      onError: (err) => console.error('Speech error:', err),
    });
  };

  const record = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Microphone permission not granted');
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
      console.log('🎤 Recording started as .wav');
    } catch (err) {
      console.error('Recording error:', err);
      Alert.alert('Recording error', err.message || 'Unknown error');
    }
  };


  const stopRecording = async () => {
    try {
      if (!recording) {
        console.warn('Stop called but no active recording');
        return;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setRecordingUri(uri);
      console.log('🛑 Recording stopped. URI:', uri);

      const formData = new FormData();
      formData.append('text', paragraphs[currentIndex]);
      formData.append('audio', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav',
      });

      setIsAnalyzing(true); // 👈 Start loading

      const response = await fetch('https://storytime-fp9z.onrender.com/analyze', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      const wrongArr = json.result;

      const words = paragraphs[currentIndex].split(/\s+/);
      const coloredWords = words.map((word, i) => ({
        text: word,
        isWrong: wrongArr[i] === 1
      }));

      setHighlightedWords(coloredWords);
      setHasFeedback(true);

      if (wrongArr.includes(1)) {
        setModalData({
          visible: true,
          message: 'היו כמה פספוסים בהגייה 🤏 תנסה שוב, אתה כמעט שם!',
          emoji: '🧐',
          type: 'error',
        });
      } else {
        setModalData({
          visible: true,
          message: 'בול פגיעה! הגית את הכל מושלם 💪✨',
          emoji: '🌟',
          type: 'success',
        });
        goToNextParagraph();
      }

    } catch (err) {
      console.error('Stop recording error:', err);
      Alert.alert('Stop recording error', err.message || 'Unknown error');
    } finally {
      setIsAnalyzing(false); // 👈 Always stop loading (even on error)
    }
  };


  const toggleRecording = () => {
    recording ? stopRecording() : record();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {images[currentIndex] && (
            <Image source={{ uri: images[currentIndex] }} style={styles.image} resizeMode="cover" />
          )}

          {paragraphs[currentIndex] && (
            <View style={styles.wordWrapContainer}>
              {(highlightedWords.length > 0
                ? highlightedWords
                : paragraphs[currentIndex].split(/\s+/).map((word) => ({ text: word, isWrong: false }))
              ).map((wordObj, i) => (
                <TouchableOpacity key={i} onPress={() => speakWord(wordObj.text)}>
                  <Text
                    style={[
                      styles.wordText,
                      hasFeedback && {
                        color: wordObj.isWrong ? '#E74C3C' : '#2ECC71',
                      },
                    ]}
                  >
                    {wordObj.text + ' '}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.navigation}>
            <TouchableOpacity onPress={goToNextParagraph} disabled={currentIndex === paragraphs.length - 1}>
              <Icon name="arrow-left" size={30} color={currentIndex === paragraphs.length - 1 ? '#ccc' : '#65558F'} />
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

            <TouchableOpacity onPress={goToPreviousParagraph} disabled={currentIndex === 0}>
              <Icon name="arrow-right" size={30} color={currentIndex === 0 ? '#ccc' : '#65558F'} />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.button, isSpeaking && styles.buttonListening]}
                onPress={isSpeaking ? stopStory : speakStory}
              >
                <Icon name={isSpeaking ? "stop" : "volume-up"} size={30} color={isSpeaking ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, recording && styles.buttonListening]}
                onPress={toggleRecording}
              >
                <Icon name={recording ? "stop" : "microphone"} size={30} color={recording ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>
            </View>

            {currentIndex === paragraphs.length - 1 && (
              <TouchableOpacity
                onPress={() => router.push('/userProfile')}
                style={[styles.endButton, { marginTop: 20 }]}
              >
                <Text style={styles.endButtonText}>סיים את הסיפור</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}

      {/* ✅ CUSTOM ALERT MODAL BELOW SCROLLVIEW */}
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

    </View>
  );
};

export default StoryFromLibrary;
