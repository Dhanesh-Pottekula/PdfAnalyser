// server.js
import express from 'express';
import multer from 'multer';

import fs from 'fs';
import { envDefaults } from './envDefaults.js';
import { uploadPdf, getParsedData, getJobStatus } from './controllers/uploadController.js';
const app = express();
const PORT = envDefaults.PORT;

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// === Upload Endpoint ===
app.post('/upload', upload.single('pdf'), uploadPdf);

app.get('/getparseddata/:id', getParsedData);
app.get("/get_job_status/:id",getJobStatus)
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));