import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech'; // Import expo-speech for text-to-speech

export default function Story() {
  const { childID, topic } = useLocalSearchParams(); // שימוש בפרמטרים מהנתיב

  const [paragraph, setParagraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch story from the API
  const fetchStory = async (childID, topic) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const text = await response.text(); // Get the response as plain text
      console.log("Response text:", text); // Log the response for debugging
  
      setParagraph(text || "לא נמצאו פסקאות."); // Save the text directly
    } catch (err) {
      console.error("Fetch error:", err.message);
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

  // Function to speak the fetched story
  const speakStory = () => {
    if (paragraph) {
      Speech.speak(paragraph, { language: 'he-IL' }); // Speak the paragraph in Hebrew
    }
  };

  // Function to stop speaking
  const stopStory = () => {
    Speech.stop(); // Stop any ongoing speech
  };

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
          <>
            <Text>{paragraph}</Text>
            <Button title="🔊 השמע סיפור" onPress={speakStory} />
            <Button title="⏸️ עצור קריאה" onPress={stopStory} /> 
          </>
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
