import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from './config';
import { useLocalSearchParams } from 'expo-router';




const STORY_TYPES = {
    FAIRY_TALES: 'אגדות',
    SUPERHEROES: 'גיבורי על',
    FAMILY: 'משפחה',
    ADVENTURES: 'הרפתקאות'
};

export const StoryGenerator = {
    async generateStory(storyType, userInput = '') {
        try {
            const apiKey = await ConfigService.getApiKey();
            if (!apiKey) {
                throw new Error('API key not found. Please set your Gemini API key first.');
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: {
                    responseModalities: [
                        'TEXT',
                    ],
                    responseMimeType: 'text/plain',
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            });

            const prompt = userInput || `צור סיפור ילדים מנוקד בעברית של 4 פסקאות בנושא ${storyType}.`;

            // First API call: generate the story
            const result = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }]
                    }
                ]
            });

            const response = await result.response;
            const text = response.text();

            // Split the text into paragraphs
            const paragraphs = text.split('\n\n').filter(p => p.trim());
            console.log(paragraphs);

            // Second API call: generate image prompts
            const imageGenerator = `${paragraphs}. For this story let’s generate descriptions for NAME CHARACTERS, SUBJECTS, AND SETTINGS HERE.

I'm going to use your script for a story, and so I'm going to need images to go along with the text. Please write these image prompts for me with the following guidelines in mind:

Always use the prompt template!

Create exactly 1 image prompt to go along with each paragraph of the story max ${paragraphs.length} prompts. The image should best represent the content and mood of that paragraph.

Make sure each image prompt is connected to, and representative of, the corresponding text.

Consistent characters are key here, so please ensure that the detailed description of each character is always included directly in the image prompt itself, not as separate character descriptions.

Consistent setting elements are 2nd only to consistent characters. Include setting details directly in the image prompt itself as needed.

There doesn’t have to be a character in each scene. Switch between characters and other relevant scenes as appropriate.

Please use a variety of interesting angles (eye-level is fine sometimes, but switch it up to a bird’s eye view, super low ground-level angle, or wide-angle view showing the subject’s full body small in the frame when appropriate).

Here is the prompt template:
Use 3D animation and a 16:9 aspect ratio to create [subject] [detailed description of subject] in [setting/background description]. [The subject] is [placement in frame] and is [describe subject's action]. The POV is [describe the camera angle, focal length, and aperture] at [time of day and/or description of lighting]. The mood is [describe mood] in this scene.

👉 Return only the image prompts in this exact template. Do not include separate character or setting descriptions, explanations, summaries, or any other text beyond the image prompts themselves. Each paragraph should result in exactly one image prompt that best represents it.`;

            const imageResult = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: imageGenerator }]
                    }
                ]
            });

            const imageResponse = await imageResult.response;
            const imagePromptsText = imageResponse.text();
            const imagePrompts = imagePromptsText.split(/(?=Use 3D animation)/).filter(p => p.trim());
            console.log(imagePromptsText);
            console.log(imagePrompts);

            // Generate images for each image prompt using gemini-2.0-flash-preview-image-generation
            const imageGenModel = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-preview-image-generation',
                generationConfig: {
                    responseModalities: ['TEXT', 'IMAGE'],
                }
            });

            // For each image prompt, generate an image
            const images = [];
            for (const prompt of imagePrompts) {
                if (!prompt) {
                    images.push(null);
                    continue;
                }
                try {
                    const imgResult = await imageGenModel.generateContent({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: `${prompt}`
 }]
                            }
                        ]
                    });
                    const imgResponse = await imgResult.response;
                    console.log(imgResponse);
                    // Find the first image in the response
                    let imageData = null;
                    for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
                        if (part.inlineData && part.inlineData.data) {
                            imageData = part.inlineData.data; // base64 string
                            break;
                        }
                    }
                    images.push(imageData);
                } catch (err) {
                    console.error('Error generating image for prompt:', prompt, err);
                    images.push(null);
                }
            }

            // Combine paragraphs with their corresponding image prompts and images
            const storyWithImages = paragraphs.map((paragraph, index) => ({
                text: paragraph,
                imagePrompt: imagePrompts[index] || null,
                image: images[index] || null
            }));

            return {
                paragraphs: storyWithImages,
                error: null
            };
        } catch (error) {
            console.error('Error generating story:', error);
            return {
                paragraphs: [],
                error: error instanceof Error ? error.message : 'An error occurred while generating the story'
            };
        }
    },

    getStoryTypes() {
        return STORY_TYPES;
    }
}; 