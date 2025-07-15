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
            model: 'gemini-2.0-flash', // supports audio with inlineData
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

        // Split response into two lines, then split each line into array of characters (no spaces)
        const [line1 = '', line2 = ''] = response.split('\n');
        const line1Arr = line1.trim().split(/\s+/);
        const line2Arr = line2.trim().split(/\s+/);
        

        // Compare arrays: 1 if wrong, 0 if correct, for each character in line1Arr
        const minLen = Math.min(line1Arr.length, line2Arr.length);
        const wrongArr = [];
        for (let i = 0; i < minLen; i++) {
            wrongArr.push(line1Arr[i] === line2Arr[i] ? 0 : 1);
        }
        // If line1Arr is longer, mark remaining as wrong
        for (let i = minLen; i < line1Arr.length; i++) {
            wrongArr.push(1);
        }

        return wrongArr;

    } catch (error) {
        console.error('❌ Error in comparePhonemes:', error); // Enhanced log
        throw new Error(
            error?.message || 'Failed to generate Gemini audio analysis'
        );
    }
};