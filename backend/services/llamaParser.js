// llamaParse.js
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { envDefaults } from '../envDefaults.js';

export const uploadPdfToLlamaParse = async (filePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), {
    filename: filePath.split('/').pop(),
    contentType: 'application/pdf'
  });

  const headers = {
    ...form.getHeaders(),
    Authorization: `Bearer ${envDefaults.LLAMA_API_KEY}`,
  };

  const response = await axios.post(
    'https://api.cloud.llamaindex.ai/api/v1/parsing/upload',
    form,
    { headers }
  );
  
  console.log("response.data", response.data);
  
  // Check if we have a valid document_id
  if (!response.data || !response.data.document_id) {
    throw new Error(`Invalid response from LlamaParse API: ${JSON.stringify(response.data)}`);
  }
  
  return response.data.document_id;
};

export const fetchParsedResult = async (jobId) => {
  // Validate jobId before making the request
  if (!jobId || jobId === 'undefined') {
    throw new Error('Invalid job ID provided');
  }

  const response = await axios.get(
    `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/markdown`,
    {
      headers: {
        Authorization: `Bearer ${envDefaults.LLAMA_API_KEY}`,
        'accept': 'application/json',
      },
    }
  );

  return response.data;
};
