import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles as libraryStyles } from './Style/storyFromLibrary';

const StoryGenerator = () => {
  const { childID, childReadingLevel, topic } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

        // ✅ Redirect to storyFromLibrary with the new storyId and childID
        router.replace({
          pathname: '/storyFromLibrary',
          params: {
            storyId: result.id,
            childID,
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
