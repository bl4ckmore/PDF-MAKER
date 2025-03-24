// ✅ UPDATED index.js with full dark/light mode, gradients, and a polished white theme

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";

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
  const [user, setUser] = useState(null);
  const [editCount, setEditCount] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const canvasRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (token) {
      axios
        .get(`${API_BASE_URL}/api/user/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEditCount(res.data.history.length))
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    }
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setDarkMode(false);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  };

  const handleShowEditor = () => {
    if (!user) return alert("🔐 Please log in to use the PDF Editor.");
    if (user.role !== "premium" && editCount >= 2)
      return alert("🚫 Free limit reached. Please upgrade to Premium.");
    setShowEditor(true);
  };

  const handleBack = () => {
    setShowEditor(false);
    setOriginalText("");
    setSearchText("");
    setReplaceText("");
    setUpdatedFile(null);
    setFile(null);
    setNotFound(false);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setOriginalText("");
    setNotFound(false);
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/pdf/extract-text`, formData);
      setOriginalText(res.data.text);
      renderPDFPreview(selectedFile);
    } catch (err) {
      alert("❌ Failed to preview PDF content");
    }
  };

  const renderPDFPreview = async (pdfFile) => {
    try {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 0.6 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      };
      fileReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      console.error("PDF Preview Error:", error);
    }
  };

  const handleUpload = async () => {
    if (!file || !searchText.trim() || !replaceText.trim()) {
      alert("Please complete all fields");
      return;
    }
    if (!originalText.includes(searchText)) {
      setNotFound(true);
      return;
    } else {
      setNotFound(false);
    }
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("searchText", searchText);
    formData.append("replaceText", replaceText);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE_URL}/api/pdf/replace-text`, formData, { headers });
      setUpdatedFile(`${API_BASE_URL}/pdf/${res.data.filename}`);
    } catch (err) {
      alert("❌ Failed to process PDF");
    } finally {
      setLoading(false);
    }
  };

  const getModifiedPreview = () => {
    return originalText ? originalText.replace(new RegExp(searchText, "g"), replaceText) : "";
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Head><title>PDF Editor - Smart PDF Tool</title></Head>
      <div className={`min-h-screen flex flex-col justify-between transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
      }`}>
        <nav className="w-full p-4 bg-black bg-opacity-60 shadow-md flex items-center justify-between fixed z-50">
          <Link href="/" className="text-lg font-bold">PDF Editor</Link>
          <div className="hidden md:flex items-center gap-x-4">
            <Link href="/" className="text-sm text-blue-400 hover:underline">Home</Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-sm text-blue-400 hover:underline">Dashboard</Link>
                {user?.role !== "premium" && (
                  <Link href="/upgrade" className="text-sm text-yellow-400 hover:underline">Upgrade</Link>
                )}
              </>
            )}
            {!user ? (
              <>
                <Link href="/login" className="text-sm text-gray-300 hover:underline">Log In</Link>
                <Link href="/register" className="text-sm text-gray-300 hover:underline">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-sm text-red-400 hover:underline">Logout</button>
            )}
            <button onClick={toggleTheme} className="ml-2 text-sm hover:underline">
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-white text-2xl">☰</button>
          </div>
        </nav>
        {/* Continue content below... */}
      </div>
    </div>
  );
}