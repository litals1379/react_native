import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { storyGeneratorService } from './services/storyGeneratorService';
import { useLocalSearchParams } from 'expo-router';
import { styles } from './Style/storyGenerator';

const StoryGenerator = () => {
    const { childID, topic } = useLocalSearchParams();

    const [story, setStory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageLoading, setImageLoading] = useState({});

    const handleGenerateStory = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await storyGeneratorService.generateStory(topic); // use passed topic directly
            if (result.error) {
                setError(result.error);
            } else {
                setStory(result.paragraphs);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-run once when topic is received
    useEffect(() => {
        if (topic) {
            handleGenerateStory();
        }
    }, [topic]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>יצירת סיפור בנושא: {topic}</Text>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>יוצר סיפור...</Text>
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {story && !isLoading && !error && (
                <ScrollView style={styles.storyContainer}>
                    {story.map((paragraph, index) => (
                        <View key={index} style={styles.paragraphContainer}>
                            <Text style={styles.paragraphText}>{paragraph.text}</Text>
                            {paragraph.image && (
                                <View style={styles.imageWrapper}>
                                    <Image
                                        source={{ uri: `data:image/png;base64,${paragraph.image}` }}
                                        style={styles.paragraphImage}
                                        resizeMode="cover"
                                        onLoadStart={() => setImageLoading(prev => ({ ...prev, [index]: true }))}
                                        onLoadEnd={() => setImageLoading(prev => ({ ...prev, [index]: false }))}
                                    />
                                    {imageLoading[index] && (
                                        <View style={styles.imageLoadingOverlay}>
                                            <ActivityIndicator size="large" color="#fff" />
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default StoryGenerator;
