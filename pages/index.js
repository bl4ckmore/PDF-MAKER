import { useState } from "react";
import axios from "axios";

// ✅ Live backend URL
const API_BASE_URL = "https://pdfapi-si07.onrender.com";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [updatedFile, setUpdatedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!file || !searchText.trim() || !replaceText.trim()) {
      alert("Please upload a file and enter both search and replacement text.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file); // ✅ Must be "pdf" to match backend's req.files.pdf
    formData.append("searchText", searchText);
    formData.append("replaceText", replaceText);

    1;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/pdf/replace-text`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUpdatedFile(response.data.filename);
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("❌ Error replacing text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      {/* 🔥 Navbar */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
  
        {/* ✅ Desktop Nav */}
        <ul className="hidden md:flex space-x-6 text-white font-medium">
          <li><a href="#" className="hover:text-blue-400">Home</a></li>
          <li><a href="#" className="hover:text-blue-400">Upload</a></li>
          <li><a href="#" className="hover:text-blue-400">History</a></li>
          <li><a href="#" className="hover:text-blue-400">About</a></li>
        </ul>
      </nav>
  
      {/* ✅ Mobile Menu */}
      <div
        id="mobileMenu"
        className="md:hidden fixed top-0 right-0 w-64 h-full bg-gray-800 text-white transform translate-x-full transition-transform z-50 shadow-lg p-6"
      >
        <button
          id="closeBtn"
          className="absolute top-4 right-4 text-white focus:outline-none"
        >
          ✕
        </button>
        <ul className="mt-12 space-y-4 text-lg font-medium">
          <li><a href="#" className="block hover:text-blue-400">Home</a></li>
          <li><a href="#" className="block hover:text-blue-400">Upload</a></li>
          <li><a href="#" className="block hover:text-blue-400">History</a></li>
          <li><a href="#" className="block hover:text-blue-400">About</a></li>
        </ul>
      </div>
  
      {/* Your existing content like file upload, input, etc */}
      <main className="p-6">{/* Your form UI here */}</main>
  
      {/* JS Toggle */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function () {
            const burgerBtn = document.getElementById("burgerBtn");
            const mobileMenu = document.getElementById("mobileMenu");
            const closeBtn = document.getElementById("closeBtn");
  
            burgerBtn.addEventListener("click", () => {
              mobileMenu.classList.remove("translate-x-full");
            });
  
            closeBtn.addEventListener("click", () => {
              mobileMenu.classList.add("translate-x-full");
            });
          });
        `,
      }} />
    </div>
  );
  
}
