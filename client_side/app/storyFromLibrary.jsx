import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // שימוש באייקונים מ־FontAwesome
import * as Progress from 'react-native-progress';
import * as Speech from 'expo-speech';

const StoryFromLibrary = () => {
  const { storyId } = useLocalSearchParams();

  const [story, setStory] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const goToNextParagraph = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousParagraph = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
      Speech.speak(paragraphs[currentIndex], { language: 'he-IL' });
      setIsSpeaking(true);
    }
  };

  const stopStory = () => {
    Speech.stop();
    setIsSpeaking(false);
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
        <>
          {images[currentIndex] && (
            <Image
              source={{ uri: images[currentIndex] }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          {paragraphs[currentIndex] && (
            <Text style={styles.content}>{paragraphs[currentIndex]}</Text>
          )}

          {/* ניווט עם חצים + בר התקדמות */}
          <View style={styles.navigation}>
            <TouchableOpacity onPress={goToPreviousParagraph} disabled={currentIndex === 0}>
              <Icon name="arrow-left" size={30} color={currentIndex === 0 ? '#ccc' : '#2980B9'} />
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

            <TouchableOpacity onPress={goToNextParagraph} disabled={currentIndex === paragraphs.length - 1}>
              <Icon name="arrow-right" size={30} color={currentIndex === paragraphs.length - 1 ? '#ccc' : '#2980B9'} />
            </TouchableOpacity>
          </View>

          {/* כפתורי שליטה על הקריאה */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <TouchableOpacity onPress={speakStory}>
              <Icon name="volume-up" size={30} color="#2980B9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={stopStory}>
              <Icon name="stop" size={30} color="#C0392B" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  content: {
    textAlign: 'right',
    fontSize: 16,
    marginTop: 20,
    color: '#333',
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
});

export default StoryFromLibrary;
