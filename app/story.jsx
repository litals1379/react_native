import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Story() {
  const router = useRouter();
  const { childID, topic } = router.query;  // מקבלים את ה-childID וה-topic מה-URL

  const [paragraph, setParagraph] = useState(null);
  const [loading, setLoading] = useState(true); // מצב טעינה
  const [error, setError] = useState(null); // שגיאה אם יש

  useEffect(() => {
    if (childID && topic) {
      const apiUrl = `https://localhost:7209/api/Story/GetStoryForChild/${childID}/${encodeURIComponent(topic)}`;

      const fetchStory = async () => {
        try {
          const response = await fetch(apiUrl, {
            method: 'GET',  // מציין ששימוש ב-GET
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch story');
          }
          const data = await response.json();
          setParagraph(data.paragraphs[0]);  // מניח שהפסקה הראשונה נמצאת בתוך מערך "paragraphs"
        } catch (error) {
          setError(error.message);  // שמירת שגיאה במידה ויש
        } finally {
          setLoading(false);  // סיום טעינה
        }
      };

      fetchStory();
    }
  }, [childID, topic]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#65558F" />  {/* מציג סמל טעינה */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text> // הצגת שגיאה אם יש
        ) : paragraph ? (
          <Text>{paragraph}</Text>
        ) : (
          <Text>לא נמצא סיפור עבור הילד והנושא הנבחרים.</Text>  
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
