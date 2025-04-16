import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

const StoryFromLibrary = () => {
  const { storyId } = useLocalSearchParams();  // שליפת ה-`storyId` מהפרמטרים

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryById/${storyId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Server returned error: ${data.message || 'Unknown error'}`);
        }

        setStory(data);
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
          {story?.imagesUrls?.img1 && (
            <Image
              source={{ uri: story.imagesUrls.img1 }} // מציגים את התמונה הראשונה
              style={styles.image}
              resizeMode="cover"
            />
          )}
          {story?.paragraphs?.p1 && (
            <Text style={styles.content}>{story.paragraphs.p1}</Text> // מציגים את הפסקה הראשונה
          )}
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
});

export default StoryFromLibrary;
