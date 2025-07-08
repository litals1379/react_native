import React, { useState } from 'react';
import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { generateStory, getStoryTypes } from './services/storyGenerator';
import { useLocalSearchParams } from 'expo-router';


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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#ffebee',
        borderRadius: 8,
        marginVertical: 16,
    },
    errorText: {
        color: '#c62828',
        fontSize: 16,
    },
    storyContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
    },
    paragraphContainer: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    paragraphText: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'right',
        marginBottom: 16,
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        aspectRatio: 16 / 9,
        marginBottom: 8,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        backgroundColor: '#f8f8f8',
        alignSelf: 'center',
    },
    paragraphImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    imageLoadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    imageCaption: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
        marginBottom: 8,
        textAlign: 'center',
    },
}); 