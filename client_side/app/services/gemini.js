import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from './config';

export const getGeminiResponse = async (prompt) => {
    try {
        const apiKey = await ConfigService.getApiKey();
        if (!apiKey) {
            throw new Error('API key not found. Please set your Gemini API key first.');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return { text: response.text() };
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return {
            text: '',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}; 