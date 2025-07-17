import cors from 'cors';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { comparePhonemes } from './geminiPhoneme.js';

const app = express();
const upload = multer({ dest: 'uploads' });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🟢 Node.js server is running!');
});


app.post('/analyze', upload.single('audio'), async (req, res) => {
    try {
        console.log('in server - Request received at /analyze.'); // Enhanced log
        const hebrewText = req.body.text;
        console.log('in server - Hebrew Text:', hebrewText); // New log

        // Check if req.file exists after multer processing
        if (!req.file) {
            console.error('in server - No file received by Multer!');
            return res.status(400).json({ error: 'No audio file uploaded.' });
        }

        const filePath = req.file.path;
        console.log('in server - File Path:', filePath); // New log
        console.log('in server - Original Filename:', req.file.originalname); // New log
        console.log('in server - MimeType:', req.file.mimetype); // New log
        console.log('in server - File Size:', req.file.size); // New log


        const base64Audio = fs.readFileSync(filePath, { encoding: 'base64' });
        console.log('in server - Audio file read to Base64. Size of base64 string:', base64Audio.length); // New log

        const result = await comparePhonemes(hebrewText, base64Audio);
        console.log('in server - comparePhonemes returned a result.'); // New log
        console.log(result);
        fs.unlinkSync(filePath); // Cleanup uploaded file
        console.log('in server - Temporary file unlinked.'); // New log

        res.json({ result });
        console.log('in server - Response sent successfully.'); // New log

    } catch (error) {
        console.error('❌ Server error during /analyze:', error); // Enhanced log
        res.status(500).json({ error: 'Internal server error', detail: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

