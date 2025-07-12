import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image, Modal, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import stringSimilarity from 'string-similarity';
import { styles } from './Style/story';
import { AudioModule, useAudioPlayer, useAudioRecorder } from 'expo-audio';

export default function Story() {
  const router = useRouter();
  const { childID, topic } = useLocalSearchParams();
  const [paragraphs, setParagraphs] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [storyId, setStoryId] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [textIPA, setTextIPA] = useState('');
  const [audioIPA, setAudioIPA] = useState('');
  const [phonemeDiff, setPhonemeDiff] = useState(null);

  const audioRecorder = useAudioRecorder({
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
  });

  const audioPlayer = useAudioPlayer(recordingUri || '');
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);

  useEffect(() => {
    if (childID && topic) fetchStory(childID, topic);
  }, [childID, topic]);

  const fetchStory = async (childID, topic) => {
    try {
      const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;
      const response = await fetch(apiUrl);
      const text = await response.text();
      if (!response.ok) throw new Error('לא נמצא סיפור מתאים');
      const data = JSON.parse(text);
      setStoryId(data?.id);
      setParagraphs(Object.values(data?.paragraphs || {}));
      setImages(Object.values(data?.imagesUrls || {}));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const speakStory = () => {
    const para = paragraphs[currentIndex];
    if (!para) return;
    setIsSpeaking(true);
    Speech.speak(para, {
      language: 'he-IL',
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopStory = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const record = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
      setRecordingUri(null);
      setTextIPA('');
      setAudioIPA('');
      setPhonemeDiff(null);
    } catch (error) {
      Alert.alert('Recording error', error.message);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);
      const uri = audioRecorder.uri;
      setRecordingUri(uri);

      const formData = new FormData();
      formData.append('text', paragraphs[currentIndex]);
      formData.append('audio', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav',
      });

      const response = await fetch('http://192.168.1.75:3000/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.error) {
        Alert.alert('Analysis error', result.error);
      } else {
        // Parse result like:
        // Text IPA: /.../
        // Audio IPA: /.../
        // Phoneme differences: 2
        const lines = result.result.split('\n');
        const ipaText = lines.find(line => line.startsWith('Text IPA:')) || '';
        const ipaAudio = lines.find(line => line.startsWith('Audio IPA:')) || '';
        const ipaDiff = lines.find(line => line.startsWith('Phoneme differences:')) || '';

        setTextIPA(ipaText.replace('Text IPA:', '').trim());
        setAudioIPA(ipaAudio.replace('Audio IPA:', '').trim());
        setPhonemeDiff(ipaDiff.replace('Phoneme differences:', '').trim());
      }
    } catch (error) {
      Alert.alert('Stop recording error', error.message);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#2980B9" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View>
            {images[currentIndex] && (
              <Image source={{ uri: images[currentIndex] }} style={styles.image} />
            )}
            <Text style={styles.paragraph}>{paragraphs[currentIndex]}</Text>

            {textIPA && audioIPA && (
              <View style={{ padding: 12 }}>
                <Text style={{ fontWeight: 'bold' }}>Text IPA:</Text>
                <Text style={{ fontSize: 16, marginBottom: 8 }}>{textIPA}</Text>
                <Text style={{ fontWeight: 'bold' }}>Audio IPA:</Text>
                <Text style={{ fontSize: 16, marginBottom: 8 }}>{audioIPA}</Text>
                <Text style={{ fontWeight: 'bold' }}>Phoneme Differences:</Text>
                <Text style={{ fontSize: 16, color: phonemeDiff > 1 ? 'red' : 'green' }}>
                  {phonemeDiff}
                </Text>
              </View>
            )}

            <View style={styles.navigation}>
              <TouchableOpacity onPress={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}>
                <Icon name="arrow-right" size={30} color="#65558F" />
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
                    animated={true}
                    style={{ transform: [{ scaleX: -1 }] }}
                  />
                  <Text style={styles.emoji}>{getEncouragementEmoji()}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setCurrentIndex(prev => Math.min(prev + 1, paragraphs.length - 1))}>
                <Icon name="arrow-left" size={30} color="#65558F" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <TouchableOpacity style={[styles.button, isSpeaking && styles.buttonListening]} onPress={isSpeaking ? stopStory : speakStory}>
                <Icon name={isSpeaking ? "stop" : "volume-up"} size={30} color={isSpeaking ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, isRecording && styles.buttonListening]} onPress={isRecording ? stopRecording : record}>
                <Icon name={isRecording ? "stop" : "microphone"} size={30} color={isRecording ? "#C0392B" : "#65558F"} />
              </TouchableOpacity>
            </View>

            {currentIndex === paragraphs.length - 1 && (
              <TouchableOpacity onPress={() => setShowEndModal(true)} style={styles.endButton}>
                <Text style={styles.endButtonText}>סיים את הסיפור</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <Modal visible={showEndModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 כל הכבוד שסיימת את הסיפור!</Text>
            <Text style={styles.modalSubtitle}>איך נהנית מהסיפור?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => {
                  setRating(star);
                  fetch(`http://www.storytimetestsitetwo.somee.com/api/Story/RateStory?storyId=${storyId}&rating=${star}`, { method: 'POST' });
                }}>
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
