import "./App.css";
import UploadPdfComponent from "./components/UploadPdfComponent";
import ShowChatAndPdf from "./components/ShowChatAndPdf";
import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleUploadSuccess = (
    file: File,
  ) => {
    setFile(file);
  };
  console.log(" app.js : file")
  return (
    <>
      {file ? (
        <ShowChatAndPdf file={file} />
      ) : (
        <UploadPdfComponent onUploadSuccess={handleUploadSuccess} />
      )}
    </>
  );
}

export default App;
