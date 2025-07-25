import React from 'react'
import ChatInterface from './ChatInterface'
import PdfViewer from './PdfViewer'

interface ShowChatAndPdfProps {
  file: File
}

function ShowChatAndPdf({ file }: ShowChatAndPdfProps) {
  console.log("show chat and pdf component")
  const fileUrl = URL.createObjectURL(file) 

  const handlePageClick = (page: number) => {
    console.log(`Navigating to page ${page}`);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 gap-4">
      <div className="w-1/3 min-w-80">
        <ChatInterface handlePageClick={handlePageClick} />
      </div>
      <div className="flex-1">
        <PdfViewer 
          fileUrl={fileUrl}
        />
      </div>
    </div>
  )
}

export default ShowChatAndPdf