import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles as libraryStyles } from './Style/storyFromLibrary';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoryGenerator = () => {
  const { childID, childReadingLevel, topic, characterID } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const AddStoryToReadingHistoryUrl = 'http://www.storytimetestsitetwo.somee.com/api/User/';

  useEffect(() => {
    const handleGenerateStory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://www.storytimetestsitetwo.somee.com/api/Story/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic, level: childReadingLevel }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText || 'שגיאה לא מזוהה מהשרת.');
          return;
        }

        const result = await response.json();

        if (!result?.id) {
          setError('לא הצלחנו ליצור סיפור חדש.');
          return;
        }

        handleAddStory(result.id);

        // ✅ Redirect to storyFromLibrary with the new storyId and childID
        router.replace({
          pathname: '/storyFromLibrary',
          params: {
            storyId: result.id,
            childId: childID,
            characterID: characterID,
          },
        });
      } catch (err) {
        setError(err.message || 'שגיאה בעת יצירת הסיפור.');
      } finally {
        setIsLoading(false);
      }
    };

    if (topic && childReadingLevel) {
      handleGenerateStory();
    }
  }, [topic, childReadingLevel]);

  const handleAddStory = async (storyId) => {
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
  };

  if (isLoading) {
    return (
      <View style={[libraryStyles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        <Text style={[libraryStyles.bookTitle, { textAlign: 'center', marginBottom: 24 }]}>
          {`יוצר סיפור בנושא ${topic}`}
        </Text>
        <ActivityIndicator size={80} color="#65558F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[libraryStyles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        <Text style={libraryStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return null;
};

export default StoryGenerator;
