import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker";

const API_BASE_URL = "https://pdfapi-si07.onrender.com";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);
  const [file, setFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedFile, setUpdatedFile] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const canvasRef = useRef(null);

  const handleShowEditor = () => setShowEditor(true);
  const handleBack = () => {
    setShowEditor(false);
    setPdfPreviewUrl(null);
    setOriginalText("");
    setFile(null);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setOriginalText("");
    setPdfPreviewUrl(null);

    if (selectedFile) {
      const formData = new FormData();
      formData.append("pdf", selectedFile);

      try {
        // Text preview
        const res = await axios.post(`${API_BASE_URL}/api/pdf/extract-text`, formData);
        setOriginalText(res.data.text);

        // Visual preview
        const reader = new FileReader();
        reader.onload = async function () {
          const typedArray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1 });
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          setPdfPreviewUrl(canvas.toDataURL());
        };
        reader.readAsArrayBuffer(selectedFile);
      } catch (err) {
        console.error("Preview Error:", err);
        alert("Failed to preview PDF content");
      }
    }
  };

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

  const getModifiedPreview = () => {
    return originalText
      ? originalText.replace(new RegExp(searchText, "g"), replaceText)
      : "";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <nav className="w-full flex items-center justify-between p-4 bg-gray-800 fixed top-0 left-0 z-10">
        <button onClick={() => window.location.reload()} className="text-lg font-bold">
          PDF Editor
        </button>

        <div className="hidden md:flex gap-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Upload</a>
          <a href="#" className="hover:underline">History</a>
          <a href="#" className="hover:underline">About</a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-white text-2xl">
            ☰
          </button>
        </div>
      </nav>

      {/* Sliding Mobile Menu */}
      <div className={`fixed top-16 right-0 w-64 bg-gray-800 p-4 space-y-2 transform transition-transform duration-300 z-20 ${showMobileMenu ? "translate-x-0" : "translate-x-full"}`}>
        <a href="#" className="block hover:underline">Home</a>
        <a href="#" className="block hover:underline">Upload</a>
        <a href="#" className="block hover:underline">History</a>
        <a href="#" className="block hover:underline">About</a>
      </div>

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

            {pdfPreviewUrl && (
              <div className="my-4">
                <h3 className="text-sm text-gray-400 mb-2">Visual Preview:</h3>
                <canvas ref={canvasRef} className="w-full border rounded"></canvas>
              </div>
            )}

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

            {originalText && (
              <div className="mt-4 bg-gray-800 p-4 rounded text-sm max-h-64 overflow-auto">
                <h3 className="font-semibold text-green-400 mb-1">Original Preview:</h3>
                <p className="mb-2 whitespace-pre-wrap text-gray-300">{originalText}</p>
                <h3 className="font-semibold text-yellow-400 mb-1 mt-2">Modified Preview:</h3>
                <p className="whitespace-pre-wrap text-white">{getModifiedPreview()}</p>
              </div>
            )}

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
