import { Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import * as Speech from 'expo-speech';
// import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import { styles } from './Style/storyFromLibrary';
import * as FileSystem from 'expo-file-system';
import { AudioModule, useAudioPlayer, useAudioRecorder } from 'expo-audio';


const StoryFromLibrary = () => {
  const router = useRouter();
  const { storyId } = useLocalSearchParams();
  // State Hooks
  const [story, setStory] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recordingOptions = {
    android: {
      extension: '.wav',
      outputFormat: AudioModule.RECORDING_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: AudioModule.RECORDING_AUDIO_ENCODING_PCM_16BIT,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      outputFormat: AudioModule.RECORDING_OUTPUT_FORMAT_LINEARPCM,
      audioQuality: AudioModule.RECORDING_AUDIO_QUALITY_HIGH,
      audioEncoding: AudioModule.RECORDING_AUDIO_ENCODING_PCM_16BIT,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const audioRecorder = useAudioRecorder(recordingOptions);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);

  const audioPlayer = useAudioPlayer(recordingUri || '');

  // Data Fetch
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryById/${storyId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Server returned error: ${data.message || 'Unknown error'}`);
        }

        setStory(data);
        setParagraphs(Object.values(data.paragraphs || {}));
        setImages(Object.values(data.imagesUrls || {}));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  // Speech Recognition setup
  // useEffect(() => {
  //   ExpoSpeechRecognitionModule.requestPermissionsAsync();

  //   const resultListener = ExpoSpeechRecognitionModule.addListener("result", (event) => {
  //     console.log("Results:", event.results);
  //     const latestResult = event.results[0]?.transcript || "";
  //     setTranscript(latestResult);
  //   });

  //   return () => {
  //     resultListener.remove();
  //   };
  // }, []);
  // Poll playback status every 500ms


  useEffect(() => {
    const requestPermissions = async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    };
    requestPermissions();
  }, []);

  // Navigation Functions
  const goToNextParagraph = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTranscript("");  // איפוס התוצאה הקולית
    }
  };

  const goToPreviousParagraph = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTranscript("");  // איפוס התוצאה הקולית
    }
  };

  // UI Utility Functions
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

  // Text-to-Speech Functions
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

  // Speech Recognition Functions
  // const startListening = () => {
  //   setTranscript("");
  //   ExpoSpeechRecognitionModule.start({
  //     lang: "he-IL",
  //     interimResults: true,
  //     continuous: true,
  //   });
  //   setIsListening(true);
  // };

  // const stopListening = () => {
  //   ExpoSpeechRecognitionModule.stop();
  //   setIsListening(false);
  // };

  const record = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
      setRecordingUri(null);
    } catch (error) {
      Alert.alert('Recording error', error.message);
      console.error('Recording error:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);
      const uri = audioRecorder.uri;
      setRecordingUri(uri);
      console.log('Recording stopped, URI:', uri);

      const formData = new FormData();
      formData.append('text', 'הַדַּיָּיג נִצְמָד לְדֹופֶן הַסִּירָה בִּזְמַן הַסְּעָרָה.');
      // formData.append('text', 'הַדַּיָּיג נִצְמָד לְדֹופֶן.');
      // formData.append('text', 'הַדַּיָּיג נִצְמָד');
      formData.append('audio', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav',
      });

      const response = await fetch('http://192.168.1.75:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Result:', result);
      if (result.error) {
        console.error('Error from server:', result.error);
        Alert.alert('Analysis error', result.error);
      } else {
        console.log('Gemini IPA result:', result.result);
        Alert.alert('Gemini Result', result.result);
      }
    } catch (error) {
      Alert.alert('Stop recording error', error.message);
      console.error('Stop recording error:', error);
    }
  };

  const toggleListening = () => {
    isRecording ? stopRecording() : record();
  };

  // Render Section
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
            <Text style={styles.content}>{paragraphs[currentIndex]}</Text>
          )}

          {/* Navigation */}
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

          {/* Controls */}
          <View style={{ alignItems: 'center', marginTop: 20 }}>
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
                style={[styles.button, isRecording && styles.buttonListening]}
                onPress={toggleListening}
              >
                <Icon name={isRecording ? "stop" : "microphone"} size={30} color={isRecording ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>
            </View>


            {transcript !== "" && (
              <View style={styles.transcriptContainer}>
                <Text style={styles.transcriptLabel}>מה שאמרת:</Text>
                <Text style={styles.transcriptText}>{transcript}</Text>
              </View>
            )}

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
    </View>
  );
};


export default StoryFromLibrary;