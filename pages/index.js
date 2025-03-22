import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://pdfapi-si07.onrender.com";

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);
  const [file, setFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedFile, setUpdatedFile] = useState(null);

  const handleShowEditor = () => setShowEditor(true);
  const handleBack = () => setShowEditor(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !searchText.trim() || !replaceText.trim()) {
      alert("Please complete all fields");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("searchText", searchText);
    formData.append("replaceText", replaceText);

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/pdf/replace-text`, formData);
      setUpdatedFile(`${API_BASE_URL}/pdf/${res.data.filename}`);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("❌ Failed to process PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <nav className="w-full flex items-center justify-between p-4 bg-gray-800 fixed top-0 left-0">
        <button onClick={() => window.location.reload()} className="text-lg font-bold">PDF Editor</button>
        <div className="hidden md:flex gap-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Upload</a>
          <a href="#" className="hover:underline">History</a>
          <a href="#" className="hover:underline">About</a>
        </div>
      </nav>

      <div className="pt-24 w-full flex justify-center">
        {!showEditor ? (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Online PDF Editor</h1>
            <p className="text-gray-400">Add text, annotate, fill and edit PDFs online</p>

            <button
              onClick={handleShowEditor}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold"
            >
              Edit Now!
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold">📄 PDF Text Editor</h2>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-800 rounded"
            />

            <input
              type="text"
              placeholder="Text to find"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
            />

            <input
              type="text"
              placeholder="Replace with"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white w-full"
            >
              {loading ? "Processing..." : "Replace Text"}
            </button>

            {updatedFile && (
              <a
                href={updatedFile}
                download
                className="block mt-4 text-center bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded"
              >
                Download Updated PDF
              </a>
            )}

            <button
              onClick={handleBack}
              className="block mt-2 text-sm text-gray-400 hover:underline"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
