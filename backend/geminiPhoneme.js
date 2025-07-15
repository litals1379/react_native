// geminiPhoneme.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('🔑 Loaded Gemini API key:', GEMINI_API_KEY ? '✓' : '❌ MISSING');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const comparePhonemes = async (hebrewText, base64Audio) => {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-001', // supports audio with inlineData
        });
        console.log('Gemini Phoneme - Model initialized.'); // New log

        const prompt = `
        You are a Hebrew phonetics expert.
        
        Given:
        - A vowelized Hebrew sentence
        - A WAV audio file
        
        Your task:
        1. Convert the written Hebrew sentence into a full IPA transcription (Modern Hebrew).
        2. Listen to the audio and transcribe only what is actually spoken into IPA (do not infer or guess missing words).
        3. If the audio is silent or unintelligible, write "Read again" instead of the IPA.
        
        ⚠️ Return only two lines with no extra text:
        Line 1: IPA transcription of the Hebrew text  
        Line 2: IPA transcription of the spoken audio or "Read again"
        
        Text: ${hebrewText}
        `.trim();
        


        const contents = [
            {
                role: 'user',
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: 'audio/wav',
                            data: base64Audio,
                        },
                    },
                ],
            },
        ];

        console.log('Gemini Phoneme - Content prepared for API call.'); // New log

        const result = await model.generateContent({ contents });
        console.log('Gemini Phoneme - API call successful, result received.'); // New log

        const response = await result.response.text();
        console.log('Gemini Phoneme - API response text extracted.'); // New log

        return response;
    } catch (error) {
        console.error('❌ Error in comparePhonemes:', error); // Enhanced log
        throw new Error(
            error?.message || 'Failed to generate Gemini audio analysis'
        );
    }
};