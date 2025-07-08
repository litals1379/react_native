import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function StorySelection() {
  const { childID, topic } = useLocalSearchParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://www.storytimetestsitetwo.somee.com/api/Story/GetAvailableStoriesForChild/${childID}/${encodeURIComponent(topic)}`)
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleReadStory = (storyId) => {
    router.push({ pathname: "./story", params: { childID, topic, storyId } });
  };

  const handleGenerateNewStory = () => {
    router.push({ pathname: "./GenerateStory", params: { childID, topic } }); // עמוד שיקרא ל-Gemini
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>בחר סיפור:</Text>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleReadStory(item.id)} style={{ marginBottom: 15 }}>
            <Image source={{ uri: item.coverImg }} style={{ height: 150, borderRadius: 8 }} />
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="✨ צור סיפור חדש בלייב" onPress={handleGenerateNewStory} />
    </View>
  );
}
