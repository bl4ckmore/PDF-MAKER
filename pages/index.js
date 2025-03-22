import { useState } from "react";

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);

  const handleShowEditor = () => {
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {!showEditor ? (
        <div className="flex flex-col items-center space-y-6">
          <img src="/pdf-icon.png" className="w-16 h-16" alt="PDF Icon" />
          <h1 className="text-2xl font-bold">Online PDF Editor</h1>
          <p className="text-gray-300">
            Add text, annotate, fill and edit PDFs online
          </p>

          <button
            onClick={handleShowEditor}
            className="w-72 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            📁 Select File
          </button>

          <button className="w-72 border border-gray-600 py-2 px-4 rounded flex items-center justify-center space-x-2">
            <img src="/xodo-icon.png" className="w-5 h-5" alt="Xodo" />
            <span>Xodo Drive</span>
          </button>

          <button className="w-72 border border-gray-600 py-2 px-4 rounded flex items-center justify-center space-x-2">
            <img src="/dropbox-icon.png" className="w-5 h-5" alt="Dropbox" />
            <span>Dropbox</span>
          </button>

          <button className="w-72 border border-gray-600 py-2 px-4 rounded flex items-center justify-center space-x-2">
            <img src="/google-drive-icon.png" className="w-5 h-5" alt="Google Drive" />
            <span>Google Drive</span>
          </button>

          <p className="text-sm text-gray-500 mt-4">Or drop files here</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl px-4">
          <h2 className="text-2xl font-bold mb-4">📄 PDF Text Editor</h2>

          <input
            type="file"
            accept="application/pdf"
            className="mb-4 w-full bg-gray-800 text-white p-2 rounded"
          />

          <input
            type="text"
            placeholder="Text to find"
            className="mb-3 w-full bg-gray-800 text-white p-2 rounded"
          />

          <input
            type="text"
            placeholder="Replace with"
            className="mb-3 w-full bg-gray-800 text-white p-2 rounded"
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded">
            Replace Text
          </button>
        </div>
      )}
    </div>
  );
}
