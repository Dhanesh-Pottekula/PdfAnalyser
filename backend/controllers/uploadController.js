import fs from "fs";
import {
  fetchParsedResult,
  getStatusOfPdf,
  uploadPdfToLlamaParse,
} from "../services/llamaparser.js";
import {
  getEmbeddingsAndStoreInDb,
  retreiveFromVectorStore,
} from "../services/huggingFaceInference.js";
import { demoLlamaParseData } from "../constants/demoData.js";



/**
 * Uploads a PDF file to the LlamaParse API and returns the job ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<Object>} The job ID of the uploaded PDF
 */
// Upload and parse PDF endpoint
export const uploadPdf = async (req, res) => {
  const filePath = req.file?.path;
  console.log(filePath);
  if (!filePath) return res.status(400).json({ error: "No file uploaded" });

  try {
    const documentId = await uploadPdfToLlamaParse(filePath);

    // Delete uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({ documentId });
  } catch (error) {
    console.error(
      "Error during upload/parse:",
      error?.response?.data || error.message
    );

    // Clean up uploaded file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }

    // Provide more specific error message
    const errorMessage =
      error?.response?.data?.detail || error.message || "Failed to process PDF";
    res.status(500).json({ error: errorMessage });
  }
};

/**
 * Get parsed data by document ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<Object>} The parsed data of the PDF
 */
export const getParsedData = async (req, res) => {
  const { id } = req.params;
  try {
    const parsedData = await fetchParsedResult(id);

    // await getEmbeddingsAndStoreInDb(demoLlamaParseData);
    res.json(parsedData);
  } catch (error) {
    console.error("Error fetching parsed data:", error);
    res.status(500).json({ error: "Failed to fetch parsed data" });
  }
};
/**
 * Get the status of a parsing job for a given job ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<Object>} The status of the job
 */
export const getJobStatus = async (req, res) => {
  try {
    const job_id = req.params.id;
    // check for the job status
    const status = await getStatusOfPdf(job_id);
    if (status?.status == "SUCCESS") {
      //if job is done then get the markdown of pdf
      const parsedData = await fetchParsedResult(job_id);
      await getEmbeddingsAndStoreInDb(parsedData);
    }

    res.json({ status });
  } catch (error) {
    res.status(500).json({ error });
  }
};

/**
 * Send a user chat to the vector store
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<Object>} The results of the chat
 */
export const sendUserChat = async (req, res) => {
  const { message, matchCount } = req.body;
  const results = await retreiveFromVectorStore(message, matchCount);
  res.json(results);
};
