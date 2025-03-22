import { useState } from "react";

export default function Home() {
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-gray-800 p-4">
        <button
          onClick={() => window.location.href = "/"}
          className="text-xl font-bold text-white hover:text-blue-400"
        >
          PDF Editor
        </button>
        <div className="space-x-4 hidden md:flex">
          <a href="#" className="hover:text-blue-400">Home</a>
          <a href="#" className="hover:text-blue-400">Upload</a>
          <a href="#" className="hover:text-blue-400">History</a>
          <a href="#" className="hover:text-blue-400">About</a>
        </div>
      </nav>

      {/* Center Button */}
      {!showUploadMenu && (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <button
            onClick={() => setShowUploadMenu(true)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-white text-lg font-semibold rounded-lg shadow-lg transition"
          >
            Edit Now!
          </button>
        </div>
      )}

      {/* Upload Menu */}
      {showUploadMenu && (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-center">
            <img src="/pdf-icon.png" alt="PDF Icon" className="w-10 mx-auto mb-2" />
            <h2 className="text-xl font-bold mb-2">Online PDF Editor</h2>
            <p className="text-gray-400 mb-4">Add text, annotate, fill and edit PDFs online</p>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 flex items-center justify-center gap-2">
              <span className="material-icons">computer</span> Select File
            </button>

            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-2 flex items-center justify-center gap-2">
              <img src="/xodo-icon.png" className="w-5 h-5" /> Xodo Drive
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-2 flex items-center justify-center gap-2">
              <img src="/dropbox-icon.png" className="w-5 h-5" /> Dropbox
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4 flex items-center justify-center gap-2">
              <img src="/google-drive-icon.png" className="w-5 h-5" /> Google Drive
            </button>

            <p className="text-gray-500">Or drop files here</p>
          </div>
        </div>
      )}
    </div>
  );
}
