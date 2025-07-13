import cors from 'cors';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { comparePhonemes } from './geminiPhoneme.js';

const app = express();
const upload = multer({ dest: 'uploads' });

app.use(cors());
app.use(express.json());

app.post('/analyze', upload.single('audio'), async (req, res) => {
    try {
        console.log('in server');
        const hebrewText = req.body.text;
        const filePath = req.file.path;
        const base64Audio = fs.readFileSync(filePath, { encoding: 'base64' });
        const result = await comparePhonemes(hebrewText, base64Audio);

        fs.unlinkSync(filePath); // Cleanup uploaded file
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', detail: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
