import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Story() {
  const { childID, topic } = useLocalSearchParams(); // שימוש בפרמטרים מהנתיב

  const [paragraph, setParagraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStory = async (childID, topic) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setParagraph(data.paragraphs?.[0] || "לא נמצאו פסקאות.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (childID && topic) {
      fetchStory(childID, topic);
    }
  }, [childID, topic]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#65558F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text>{paragraph}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
