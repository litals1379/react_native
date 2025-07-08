import React, { useState } from 'react';
import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { generateStory, getStoryTypes } from './services/storyGenerator';
import { useLocalSearchParams } from 'expo-router';
import { styles } from './Style/storyGenerator';

export const StoryGeneratorDisplay = () => {
    const { childID, topic } = useLocalSearchParams();

    const [selectedType, setSelectedType] = useState(null);
    const [story, setStory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageLoading, setImageLoading] = useState({});

    const storyTypes = StoryGenerator.getStoryTypes();

    const handleGenerateStory = async (type) => {
        setSelectedType(type);
        setIsLoading(true);
        setError(null);

        try {
            const result = await StoryGenerator.generateStory(type);
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>יצירת סיפורים</Text>

            <View style={styles.buttonContainer}>
                {Object.entries(storyTypes).map(([key, value]) => (
                    <Button
                        key={key}
                        title={value}
                        onPress={() => handleGenerateStory(value)}
                        disabled={isLoading}
                    />
                ))}
            </View>

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
                            {/* {paragraph.imagePrompt && (
                                <Text style={styles.imageCaption}>{paragraph.imagePrompt}</Text>
                            )} */}
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
