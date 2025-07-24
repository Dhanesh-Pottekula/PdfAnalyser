import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const envDefaults = {
  LLAMA_API_KEY: process.env.LLAMA_API_KEY || '',
  PORT: process.env.PORT || 3000,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || '',
};
console.log(envDefaults)