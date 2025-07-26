import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from './Style/storyFromLibrary'; // סגנון קיים, כולל bookImage, bookTitle וכו'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_SOMEE_USER, API_SOMEE_STORY_GET_AVAILABLE } from './Config/config';

export default function StorySelection() {
  const { childID, childReadingLevel, topic, characterID } = useLocalSearchParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const AddStoryToReadingHistoryUrl = API_SOMEE_USER;

  useEffect(() => {
    fetch(`${API_SOMEE_STORY_GET_AVAILABLE}${childID}/${encodeURIComponent(topic)}`)
      .then(async res => {
        const text = await res.text();
        try {
          const parsed = text ? JSON.parse(text) : [];
          if (Array.isArray(parsed)) {
            const simplified = parsed.map(story => ({
              id: story.id,
              title: story.title,
              coverImg: story.coverImg,
              averageRating: story.averageRating ?? 0,
            }));
            console.log("📚 Stories to display:", simplified);
            setStories(simplified);
          } else {
            console.warn("Response is not an array:", parsed);
            setStories([]);
          }
        } catch (err) {
          console.error("❌ Failed to parse JSON:", err, text);
          setStories([]);
        }
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        setStories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReadStory = async (storyId) => {
    // router.push({ pathname: './story', params: { childID, topic, storyId } });
    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await fetch(
        `${AddStoryToReadingHistoryUrl}${userId}/child/${childID}/reading-history?storyId=${storyId}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.text(); // if your backend returns a simple message
      console.log('✅ Story added to reading history:', data);
    } catch (error) {
      console.error('❌ Error adding story to reading history:', error);
    }
    router.push({ pathname: './storyFromLibrary', params: { childId: childID, storyId } });
  };

  const handleGenerateNewStory = () => {
    console.log("childID from story selection: ", childID)
    router.push({ pathname: './StoryGenerator', params: { childID, childReadingLevel, topic, characterID } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>בחר סיפור בנושא: {topic}</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {stories && stories.length > 0 ? (
            <ScrollView style={styles.booksList}>
              {stories.map((story, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.bookItem}
                  onPress={() => handleReadStory(story.id)}
                >
                  {story.coverImg && (
                    <Image
                      source={{ uri: story.coverImg }}
                      style={styles.bookImage}
                    />
                  )}
                  <Text style={styles.bookTitle}>{story.title}</Text>
                  <Text style={styles.bookRating}>⭐ {story.averageRating.toFixed(1)} / 5</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.text}>לא נמצאו סיפורים מתאימים</Text>
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleGenerateNewStory}>
        <View style={styles.endButton}>
          <Text style={styles.endButtonText}>✨ צור סיפור חדש</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
