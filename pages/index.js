import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import Link from "next/link";
import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

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
  const [theme, setTheme] = useState("dark");

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
        .then((res) => {
          setEditCount(res.data.history.length);
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    }

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  };

  const handleShowEditor = () => {
    if (!user) {
      alert("🔐 Please log in to use the PDF Editor.");
      return;
    }

    if (user.role !== "premium" && editCount >= 2) {
      alert("🚫 You reached daily free limit. Please upgrade to Premium to update unlimited PDF-s.");
      return;
    }

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
    } catch {
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
    } catch {
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
    <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"} min-h-screen transition-colors duration-300`}>
      {/* Navbar */}
      <nav className="w-full p-4 bg-opacity-80 backdrop-blur-md flex justify-between items-center fixed top-0 z-50 shadow-md bg-black dark:bg-black bg-white">
        <Link href="/" className="text-lg font-bold">PDF Editor</Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-white dark:text-yellow-400 hover:scale-105 transition-transform"
          title="Toggle Theme"
        >
          {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-x-4">
          <Link href="/" className="text-sm text-blue-500 hover:underline">Home</Link>
          {user && (
            <>
              <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">Dashboard</Link>
              {user?.role !== "premium" && (
                <Link href="/upgrade" className="text-sm text-yellow-400 hover:underline">Upgrade</Link>
              )}
            </>
          )}
          {!user ? (
            <>
              <Link href="/login" className="text-sm text-gray-500 hover:underline">Log In</Link>
              <Link href="/register" className="text-sm text-gray-500 hover:underline">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-sm text-red-400 hover:underline">Logout</button>
          )}
        </div>
      </nav>

      {/* Main */}
      <main className="pt-32 pb-10 flex-grow flex justify-center px-4">
        {!showEditor ? (
          <motion.div
            className={`text-center space-y-4 p-8 rounded-xl shadow-xl ${theme === "dark" ? "bg-black bg-opacity-30" : "bg-gray-100"}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold">Edit Your PDF in Seconds</h1>
            <p className="text-lg text-gray-400">No downloads. Just upload and go!</p>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleShowEditor}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold"
            >
              Start Editing
            </motion.button>
            {user && user.role !== "premium" && (
              <p className="mt-2 text-yellow-300 text-sm">
                You are on a free plan. {editCount}/2 edits used. <Link href="/upgrade" className="underline">Upgrade</Link>
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            className={`w-full max-w-xl space-y-4 p-6 rounded-lg shadow-xl ${theme === "dark" ? "bg-black bg-opacity-30" : "bg-gray-100"}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold">📄 PDF Text Editor</h2>

            <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full p-2 bg-gray-800 rounded" />

            <div className="flex justify-center">
              <canvas ref={canvasRef} className="my-4 rounded shadow-md border border-gray-600" style={{ width: "100%", maxWidth: "280px" }} />
            </div>

            <input type="text" placeholder="Text to find" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full p-2 bg-gray-800 rounded" />
            <input type="text" placeholder="Replace with" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} className="w-full p-2 bg-gray-800 rounded" />

            {notFound && (
              <p className="text-red-400 text-sm">❌ The word "{searchText}" was not found in the document.</p>
            )}

            {originalText && (
              <div className="mt-4 bg-gray-800 p-4 rounded text-sm max-h-64 overflow-auto">
                <h3 className="font-semibold text-green-400 mb-1">Original Preview:</h3>
                <p className="mb-2 whitespace-pre-wrap text-gray-300">{originalText}</p>
                <h3 className="font-semibold text-yellow-400 mb-1 mt-2">Modified Preview:</h3>
                <p className="whitespace-pre-wrap text-white">{getModifiedPreview()}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
              onClick={handleUpload}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white w-full transition-all"
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-50 mr-2"></span>
                  Processing...
                </span>
              ) : (
                "Replace Text"
              )}
            </motion.button>

            {updatedFile && (
              <a href={updatedFile} download className="block mt-4 text-center bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded">
                Download Updated PDF
              </a>
            )}

            <button onClick={handleBack} className="block mt-2 text-sm text-gray-400 hover:underline">← Back to Home</button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black bg-opacity-60 text-gray-300">
        <Link href="/terms" className="hover:underline">Terms & Privacy</Link>
      </footer>
    </div>
  );
}
