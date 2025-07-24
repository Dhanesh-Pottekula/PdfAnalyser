// server.js
import express from 'express';
import multer from 'multer';

import fs from 'fs';
import { fetchParsedResult, uploadPdfToLlamaParse } from './services/llamaparser.js';
import { envDefaults } from './envDefaults.js';
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
app.post('/upload', upload.single('pdf'), async (req, res) => {
  const filePath = req.file?.path;
  console.log(filePath)
  if (!filePath) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const documentId = await uploadPdfToLlamaParse(filePath);
    
    // Additional validation for documentId
    if (!documentId || documentId === 'undefined') {
      throw new Error('Failed to get valid document ID from LlamaParse API');
    }
    
    const parsedData = await fetchParsedResult(documentId);

    // Delete uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({ documentId, parsedData });
  } catch (error) {
    console.error('Error during upload/parse:', error?.response?.data || error.message);
    
    // Clean up uploaded file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    // Provide more specific error message
    const errorMessage = error?.response?.data?.detail || error.message || 'Failed to process PDF';
    res.status(500).json({ error: errorMessage });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));