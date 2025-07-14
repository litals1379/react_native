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

You will be given:
- A vowelized Hebrew sentence
- A WAV audio file (attached below)

Your task is to:

1. Transcribe the Hebrew **text** into IPA using Modern Hebrew pronunciation.
2. Transcribe the **spoken audio** into IPA based only on what is actually said.

Return your result in this exact format (no explanation):

Text IPA: [IPA transcription of the written Hebrew text]
Audio IPA: [IPA transcription of what is spoken in the audio]

The inputs are attached below.
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