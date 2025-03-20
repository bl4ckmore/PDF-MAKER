import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://pdfapi-2xdf.onrender.com";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [updatedFile, setUpdatedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file || !searchText || !replaceText) {
      alert("Please upload a file and enter text to replace.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("searchText", searchText);
    formData.append("replaceText", replaceText);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/pdf/replace-text`,
        formData
      );
      setUpdatedFile(response.data.filename);
    } catch (error) {
      alert("Error replacing text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-3xl font-bold mb-5">📄 PDF Text Editor</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4 p-3 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200"
      />

      {previewUrl && (
        <iframe
          src={previewUrl}
          className="w-full max-w-lg h-80 border-2 border-gray-500 rounded-lg mt-4 shadow-lg"
        />
      )}

      <input
        type="text"
        placeholder="Text to find"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mt-4 p-3 w-full max-w-lg bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Replace with"
        value={replaceText}
        onChange={(e) => setReplaceText(e.target.value)}
        className="mt-4 p-3 w-full max-w-lg bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleUpload}
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg transition-all duration-200 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Replace Text"}
      </button>

      {updatedFile && (
        <a
          href={`${API_BASE_URL}/pdf/${updatedFile}`}
          className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold text-lg transition-all duration-200 shadow-lg"
          download
        >
          Download Updated PDF
        </a>
      )}
    </div>
  );
}
