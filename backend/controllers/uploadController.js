import fs from "fs";
import {
  fetchParsedResult,
  getStatusOfPdf,
  uploadPdfToLlamaParse,
} from "../services/llamaparser.js";

// Upload and parse PDF endpoint
export const uploadPdf = async (req, res) => {
  const filePath = req.file?.path;
  console.log(filePath);
  if (!filePath) return res.status(400).json({ error: "No file uploaded" });

  try {
    const documentId = await uploadPdfToLlamaParse(filePath);
    const parsedData = await fetchParsedResult(documentId);
    console.log("parsedData", parsedData);
    // Delete uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({ documentId, parsedData });
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

// Get parsed data by document ID
export const getParsedData = async (req, res) => {
  const { id } = req.params;
  try {
    const parsedData = await fetchParsedResult(id);
    res.json({ parsedData });
  } catch (error) {
    console.error("Error fetching parsed data:", error);
    res.status(500).json({ error: "Failed to fetch parsed data" });
  }
};
export const getJobStatus = async (req, res) => {
  try {
    const job_id = req.params.id;
    // check for the job status
    const status = await getStatusOfPdf(job_id);
    if (status?.status == "SUCCESS") {
      //if job is done then get the markdown of pdf
      const markdown = await fetchParsedResult(job_id);
      console.log(markdown);
    }

    res.json({ status });
  } catch (error) {
    res.status(500).json({ error });
  }
};
