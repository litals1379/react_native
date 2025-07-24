import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { storyGeneratorService } from './services/storyGeneratorService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles as generatorStyles } from './Style/storyGenerator';
import { styles as libraryStyles } from './Style/storyFromLibrary';
import AlertModal from './Components/AlertModal';
import * as Progress from 'react-native-progress';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

const StoryGenerator = () => {
  const { topic, childReadingLevel, childID } = useLocalSearchParams();
  const router = useRouter();
  const [story, setStory] = useState([]);
  const [storyTitle, setStoryTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modalData, setModalData] = useState({
    visible: false,
    message: '',
    emoji: '',
    type: 'success',
  });
  const [imageLoading, setImageLoading] = useState({});
  const [sessionStartTime] = useState(new Date().toISOString());
  const [userId, setUserId] = useState('');
  const [storyId, setStoryId] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(setUserId);
    const handleGenerateStory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await storyGeneratorService.generateStory(topic, childReadingLevel);
        if (result.error) {
          setError(result.error);
        } else {
          let normalizedParagraphs = [];
          if (result.storyParagraph) {
            normalizedParagraphs = result.storyParagraph.map(p => ({
              ...p,
              text: p.text.normalize('NFC'),
              image: p.image || null
            }));
          } else if (result.paragraphs && result.imagesUrls) {
            const paraKeys = Object.keys(result.paragraphs).sort();
            normalizedParagraphs = paraKeys.map((key, idx) => ({
              text: (result.paragraphs[key] || '')
                .replace(/^([\\]+n|[\\\n\r\s])+/g, '')
                .replace(/\\+n/g, '\n')
                .replace(/^\s+|\s+$/g, '')
                .normalize('NFC'),
              image: result.imagesUrls[`img${idx}`] || null
            }));
          } else {
            setError('פורמט סיפור לא נתמך מהשרת.');
            setStory([]);
            setStoryTitle('');
            setStoryId(null);
            return;
          }
          setStory(normalizedParagraphs);
          setStoryTitle(result.title || '');
          setStoryId(result.id || null);
        }
      } catch (err) {
        setError(err.message || 'שגיאה בעת יצירת הסיפור.');
      } finally {
        setIsLoading(false);
      }
    };
    if (topic) {
      handleGenerateStory();
    }
  }, [topic]);

  const goToNextParagraph = () => {
    if (currentIndex < story.length - 1) {
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
    const progress = (currentIndex + 1) / story.length;
    if (progress < 0.34) return '#E74C3C';
    if (progress < 0.67) return '#F39C12';
    return '#27AE60';
  };

  const getEncouragementEmoji = () => {
    const progress = (currentIndex + 1) / story.length;
    if (progress < 0.34) return '🚀';
    if (progress < 0.67) return '🌟';
    return '🏆';
  };

  const speakStory = () => {
    if (story[currentIndex]?.text) {
      setIsSpeaking(true);
      Speech.speak(story[currentIndex].text, {
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
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      Alert.alert('Recording error', err.message || 'Unknown error');
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
      formData.append('text', story[currentIndex].text);
      formData.append('audio', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav',
      });
      setIsAnalyzing(true);
      const response = await fetch('https://storytime-fp9z.onrender.com/analyze', {
        method: 'POST',
        body: formData,
      });
      const json = await response.json();
      const wrongArr = json.result;
      const words = story[currentIndex].text.split(/\s+/);
      const problematicWords = words.filter((_, i) => wrongArr[i] === 1);
      setHighlightedWords(words.map((word, i) => ({ text: word, isWrong: wrongArr[i] === 1 })));
      setHasFeedback(true);
      setModalData({
        visible: true,
        message: wrongArr.includes(1)
          ? 'היו כמה פספוסים בהגייה 🤏 תנסה שוב, אתה כמעט שם!'
          : 'בול פגיעה! הגית את הכל מושלם 💪✨',
        emoji: wrongArr.includes(1) ? '🧐' : '🌟',
        type: wrongArr.includes(1) ? 'error' : 'success',
      });
      if (!wrongArr.includes(1)) goToNextParagraph();
    } catch (err) {
      console.error('Stop recording error:', err);
      Alert.alert('שגיאה', 'הייתה שגיאה בעיבוד ההקלטה');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    recording ? stopRecording() : record();
  };

  // Add handleEndStory logic
  const handleEndStory = async () => {
    try {
      const totalErrors = story.reduce((acc, _, idx) => {
        if (!story[idx]?.text) return acc;
        const words = story[idx].text.split(/\s+/);
        const wrongs = highlightedWords.length && idx === currentIndex
          ? highlightedWords.filter(w => w.isWrong).length
          : 0;
        return acc + wrongs;
      }, 0);
      const report = {
        storyId: storyId,
        userId,
        childId: childID,
        startTime: sessionStartTime,
        endTime: new Date().toISOString(),
        totalParagraphs: story.length,
        completedParagraphs: currentIndex + 1,
        totalErrors,
        paragraphs: story.map((p, idx) => ({
          paragraphIndex: idx,
          text: p.text,
          problematicWords: idx === currentIndex && highlightedWords.length ? highlightedWords.filter(w => w.isWrong).map(w => w.text) : [],
          attempts: 1,
          wasSuccessful: idx !== currentIndex || !highlightedWords.some(w => w.isWrong)
        })),
        summary: {
          feedbackType: totalErrors === 0 ? 'Excellent' : 'Needs Improvement',
          comment: totalErrors === 0 ? 'בול פגיעה! הגית את הכל מושלם 💪✨' : 'היו כמה מילים קשות. המשך לתרגל ונשפר יחד!',
          emoji: totalErrors === 0 ? '🌟' : '🧐'
        }
      };
      console.log('Sending report:', report);
      const response = await fetch('http://www.storytimetestsitetwo.somee.com/api/ReadingSessionReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        Alert.alert('שגיאה', 'שליחת הדוח נכשלה: ' + errorText);
        return;
      }
      router.push('/userProfile');
    } catch (err) {
      Alert.alert('שגיאה', 'שליחת הדוח נכשלה: ' + (err.message || err));
    }
  };

  if (isLoading) {
    return (
      <View style={[libraryStyles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        <Text style={[libraryStyles.bookTitle, { textAlign: 'center', marginBottom: 24 }]}>{`יוצר סיפור בנושא ${topic}`}</Text>
        <ActivityIndicator size={80} color="#65558F" />
      </View>
    );
  }

  return (
    <View style={libraryStyles.container}>
      {error ? (
        <Text style={libraryStyles.errorText}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={libraryStyles.scrollContent}>
          {storyTitle !== '' && (
            <Text style={libraryStyles.bookTitle}>{storyTitle}</Text>
          )}
          {story[currentIndex]?.image && (
            <Image source={{ uri: story[currentIndex].image }} style={libraryStyles.image} resizeMode="cover" />
          )}
          {story[currentIndex]?.text && (
            <View style={libraryStyles.wordWrapContainer}>
              {(highlightedWords.length > 0
                ? highlightedWords
                : story[currentIndex].text.split(/\s+/).map((word) => ({ text: word, isWrong: false }))
              ).map((wordObj, i) => (
                <TouchableOpacity key={i} onPress={() => speakWord(wordObj.text)}>
                  <Text
                    style={[
                      libraryStyles.wordText,
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
          <View style={libraryStyles.navigation}>
            <TouchableOpacity onPress={goToPreviousParagraph} disabled={isRecording || currentIndex === 0}>
              <Icon name="arrow-right" size={30} color={isRecording || currentIndex === 0 ? '#ccc' : '#65558F'} />
            </TouchableOpacity>
            <View style={libraryStyles.progressContainer}>
              <Text style={libraryStyles.progressText}>פסקה {currentIndex + 1} מתוך {story.length}</Text>
              <View style={libraryStyles.progressRow}>
                <Progress.Bar
                  progress={(currentIndex + 1) / story.length}
                  width={160}
                  height={10}
                  borderRadius={8}
                  color={getProgressColor()}
                  unfilledColor="#E0E0E0"
                  borderWidth={0}
                  animated
                  style={{ transform: [{ scaleX: -1 }] }}
                />
                <Text style={libraryStyles.emoji}>{getEncouragementEmoji()}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={goToNextParagraph} disabled={isRecording || currentIndex === story.length - 1}>
              <Icon name="arrow-left" size={30} color={isRecording || currentIndex === story.length - 1 ? '#ccc' : '#65558F'} />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <TouchableOpacity
                style={[libraryStyles.button, isSpeaking && libraryStyles.buttonListening]}
                onPress={isSpeaking ? stopStory : speakStory} disabled={isRecording}
              >
                <Icon name={isSpeaking ? "stop" : "volume-up"} size={30} color={isSpeaking ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[libraryStyles.button, recording && libraryStyles.buttonListening]}
                onPress={toggleRecording} disabled={isSpeaking}
              >
                <Icon name={recording ? "stop" : "microphone"} size={30} color={recording ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>
            </View>
            {currentIndex === story.length - 1 && (
              <TouchableOpacity
                onPress={handleEndStory}
                disabled={isRecording}
                style={[libraryStyles.endButton, { marginTop: 20 }]}
              >
                <Text style={libraryStyles.endButtonText}>סיים את הסיפור</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}
      <AlertModal
        visible={modalData.visible}
        onClose={() => setModalData(prev => ({ ...prev, visible: false }))}
        message={modalData.message}
        emoji={modalData.emoji}
        type={modalData.type}
      />
      {isAnalyzing && (
        <View style={libraryStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#65558F" />
          <Text style={libraryStyles.loadingText}>בודק את ההגייה שלך...</Text>
        </View>
      )}
    </View>
  );
};

export default StoryGenerator;
