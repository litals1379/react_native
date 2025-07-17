import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { storyGeneratorService } from './services/storyGeneratorService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { styles } from './Style/storyGenerator';

const StoryGenerator = () => {
    const { topic, childReadingLevel } = useLocalSearchParams();
    const [story, setStory] = useState(null);
    const [storyTitle, setStoryTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageLoading, setImageLoading] = useState({});

    const handleGenerateStory = async () => {
    setIsLoading(true);
    setError(null);
    console.log("📘 Topic:", topic);
    console.log("📚 Child reading level:", childReadingLevel);

    try {
        const result = await storyGeneratorService.generateStory(topic, childReadingLevel);

        console.log("✅ Raw story result from server:", result);

        if (result.error) {
            setError(result.error);
        } else {
            let normalizedParagraphs = [];
            if (result.storyParagraph) {
                result.storyParagraph.forEach((p, i) => {
                    console.log(`🧩 Paragraph ${i + 1}:`);
                    console.log("📄 Text:", p.text);
                    console.log("🖼️ Image prompt:", p.imagePrompt || "(none)");
                    if (p.image) {
                        console.log("✅ Image returned for this paragraph.");
                    } else {
                        console.warn("⚠️ No image returned for this paragraph.");
                    }
                });
                normalizedParagraphs = result.storyParagraph.map(p => ({
                    ...p,
                    text: p.text.normalize('NFC')
                }));
            } else if (result.paragraphs && result.imagesUrls) {
                // New format: paragraphs is an object, imagesUrls is an object
                const paraKeys = Object.keys(result.paragraphs).sort();
                normalizedParagraphs = paraKeys.map((key, idx) => ({
                    text: (result.paragraphs[key] || '')
                        .replace(/^([\\]+n|[\\\n\r\s])+/g, '') // Remove all leading \, \n, whitespace, newlines
                        .replace(/\\+n/g, '\n') // Replace all \n with real newlines
                        .replace(/^\s+|\s+$/g, '') // Trim again just in case
                        .normalize('NFC'),
                    image: result.imagesUrls[`img${idx}`] || null
                }));
                normalizedParagraphs.forEach((p, i) => {
                    console.log(`🧩 Paragraph ${i + 1}:`);
                    console.log("📄 Text:", p.text);
                    console.log("🖼️ Image URL:", p.image || "(none)");
                });
            } else {
                setError("פורמט סיפור לא נתמך מהשרת.");
                setStory([]);
                setStoryTitle('');
                return;
            }
            setStory(normalizedParagraphs);
            setStoryTitle(result.title || '');
        }

    } catch (err) {
        console.error("❌ Error during story generation:", err);
        setError(err.message || 'שגיאה בעת יצירת הסיפור.');
    } finally {
        setIsLoading(false);
    }
};


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

            {!isLoading && story && !error && (
                <ScrollView style={styles.storyContainer}>
                    {storyTitle !== '' && (
                        <Text style={styles.storyTitle}>{storyTitle}</Text>
                    )}

                    {story.map((paragraph, index) => (
                        <View key={index} style={styles.paragraphContainer}>
                            <Text style={styles.paragraphText}>{paragraph.text.normalize('NFC')}</Text>

                            {paragraph.image && (
                                <View style={styles.imageWrapper}>
                                    <Image
                                        source={{
                                            uri: paragraph.image.startsWith('http')
                                                ? paragraph.image.trim().replace(/\s+/g, '%20').replace(/\n/g, '')
                                                : `data:image/png;base64,${paragraph.image}`
                                        }}
                                        style={styles.paragraphImage}
                                        resizeMode="cover"
                                        onLoadStart={() =>
                                            setImageLoading(prev => ({ ...prev, [index]: true }))
                                        }
                                        onLoadEnd={() =>
                                            setImageLoading(prev => ({ ...prev, [index]: false }))
                                        }
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
