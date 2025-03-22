import { useState, useEffect } from "react";
import axios from "axios";

// 🔗 Your deployed backend URL
const API_BASE_URL = "https://pdfapi-si07.onrender.com";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [updatedFile, setUpdatedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⛏ Handle file input
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file || !searchText.trim() || !replaceText.trim()) {
      alert("Please upload a file and fill both text fields.");
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUpdatedFile(response.data.filename);
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("❌ Error replacing text in PDF.");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Burger toggle
  useEffect(() => {
    const burgerBtn = document.getElementById("burgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeBtn = document.getElementById("closeBtn");

    if (burgerBtn && mobileMenu && closeBtn) {
      burgerBtn.onclick = () => mobileMenu.classList.remove("translate-x-full");
      closeBtn.onclick = () => mobileMenu.classList.add("translate-x-full");
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* ✅ Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold">PDF Editor</h1>
        <button
          id="burgerBtn"
          className="md:hidden focus:outline-none"
          aria-label="Open Menu"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul className="hidden md:flex space-x-6 text-white font-medium">
          <li><a href="#" className="hover:text-blue-400">Home</a></li>
          <li><a href="#" className="hover:text-blue-400">Upload</a></li>
          <li><a href="#" className="hover:text-blue-400">History</a></li>
          <li><a href="#" className="hover:text-blue-400">About</a></li>
        </ul>
      </nav>

      {/* ✅ Mobile menu */}
      <div
        id="mobileMenu"
        className="md:hidden fixed top-0 right-0 w-64 h-full bg-gray-800 text-white transform translate-x-full transition-transform z-50 shadow-lg p-6"
      >
        <button id="closeBtn" className="absolute top-4 right-4 text-white focus:outline-none">✕</button>
        <ul className="mt-12 space-y-4 text-lg font-medium">
          <li><a href="#" className="block hover:text-blue-400">Home</a></li>
          <li><a href="#" className="block hover:text-blue-400">Upload</a></li>
          <li><a href="#" className="block hover:text-blue-400">History</a></li>
          <li><a href="#" className="block hover:text-blue-400">About</a></li>
        </ul>
      </div>

      {/* 🧠 Main UI */}
      <main className="flex flex-col items-center p-6 mt-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4 p-2 w-full max-w-lg bg-gray-800 border border-gray-600 rounded"
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
          className="mb-3 p-2 w-full max-w-lg bg-gray-800 border border-gray-600 rounded"
        />

        <input
          type="text"
          placeholder="Replace with"
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          className="mb-4 p-2 w-full max-w-lg bg-gray-800 border border-gray-600 rounded"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:bg-gray-600"
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
      </main>
    </div>
  );
}
