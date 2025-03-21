import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://pdfapi-si07.onrender.com"; // 🌐 Replace with your actual backend if different

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
      alert("Please upload a file and enter both search and replacement text.");
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
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUpdatedFile(response.data.filename);
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Error replacing text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📄 PDF Text Editor</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4 p-2 w-full max-w-lg bg-gray-800 border border-gray-600 rounded-md"
      />

      {previewUrl && (
        <iframe
          src={previewUrl}
          className="w-full max-w-lg h-72 border border-gray-700 rounded mb-4"
        ></iframe>
      )}

      <input
        type="text"
        placeholder="Text to find"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-3 p-2 w-full max-w-lg bg-gray-800 border border-gray-600 rounded text-white"
      />

      <input
        type="text"
        placeholder="Replace with"
        value={replaceText}
        onChange={(e) => setReplaceText(e.target.value)}
        className="mb-4 p-2 w-full max-w-lg bg-gray-800 border border-gray-600 rounded text-white"
      />

      <button
        onClick={handleUpload}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold disabled:bg-gray-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Replace Text"}
      </button>

      {updatedFile && (
        <a
          href={`${API_BASE_URL}/pdf/${updatedFile}`}
          download
          className="mt-6 inline-block px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
        >
          Download Updated PDF
        </a>
      )}
    </div>
  );
}
