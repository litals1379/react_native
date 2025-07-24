// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { ConfigService } from './config';
import { useLocalSearchParams } from 'expo-router';

const BASE_URL = 'http://www.storytimetestsitetwo.somee.com/api/Story'; 

export const storyGeneratorService = {
    generateStory: async (topic, level = 1) => {
        try {
            const response = await fetch(`${BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, level }),
            });

            if (!response.ok) {
                const error = await response.text();
                return { error };
            }

            const result = await response.json();
            return result;
        } catch (err) {
            return { error: err.message || 'Network error' };
        }
    }
};