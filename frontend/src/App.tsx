import "./App.css";
import UploadPdfComponent from "./components/UploadPdfComponent";
import ShowChatAndPdf from "./components/ShowChatAndPdf";
import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const handleUploadSuccess = (
    file: File,
    fileName: string,
    fileSize: string
  ) => {
    setFile(file);
    setFileName(fileName);
    setFileSize(fileSize);
  };
  return (
    <>
      {file ? (
        <ShowChatAndPdf file={file} fileName={fileName} fileSize={fileSize} />
      ) : (
        <UploadPdfComponent onUploadSuccess={handleUploadSuccess} />
      )}
    </>
  );
}

export default App;
