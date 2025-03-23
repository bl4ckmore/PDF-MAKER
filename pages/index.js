// pages/index.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import Link from "next/link";
import { motion } from "framer-motion";

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
  }, []);

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
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setOriginalText("");

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/pdf/extract-text`, formData);
      setOriginalText(res.data.text);
      renderPDFPreview(selectedFile);
    } catch (err) {
      console.error("Error extracting text:", err);
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
      alert("🔍 Search text not found in the PDF.");
      return;
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-600 via-purple-700 to-cyan-600 text-white">
      {/* NAVBAR */}
      <nav className="bg-black bg-opacity-70 w-full px-4 py-3 flex justify-between items-center fixed top-0 left-0 z-50">
        <Link href="/" className="text-lg font-bold">PDF Editor</Link>

        <div className="hidden md:flex gap-4 items-center text-sm">
          <Link href="/" className="text-blue-400 hover:underline">Home</Link>
          {user && (
            <>
              <Link href="/dashboard" className="text-blue-400 hover:underline">Dashboard</Link>
              {user.role !== "premium" && (
                <Link href="/upgrade" className="text-yellow-400 hover:underline">Upgrade</Link>
              )}
            </>
          )}
          {!user ? (
            <>
              <Link href="/login" className="text-gray-300 hover:underline">Login</Link>
              <Link href="/register" className="text-gray-300 hover:underline">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-400 hover:underline">Logout</button>
          )}
        </div>

        {/* Mobile Burger */}
        <div className="md:hidden text-white text-2xl">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}>☰</button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {showMobileMenu && (
        <div className="md:hidden bg-black bg-opacity-80 text-center py-4 space-y-2 mt-12 z-40">
          <Link href="/" className="block text-blue-400 hover:underline">Home</Link>
          {user && (
            <>
              <Link href="/dashboard" className="block text-blue-400 hover:underline">Dashboard</Link>
              {user.role !== "premium" && (
                <Link href="/upgrade" className="block text-yellow-400 hover:underline">Upgrade</Link>
              )}
            </>
          )}
          {!user ? (
            <>
              <Link href="/login" className="block text-gray-300 hover:underline">Login</Link>
              <Link href="/register" className="block text-gray-300 hover:underline">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="block text-red-400 hover:underline">Logout</button>
          )}
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-black bg-opacity-70 p-8 rounded-xl shadow-xl w-full max-w-xl text-center backdrop-blur-md"
        >
          {!showEditor ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Edit Your PDF in Seconds</h1>
              <p className="text-gray-300 mb-6">No downloads. No hassle. Just upload and go!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowEditor}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold"
              >
                Start Editing
              </motion.button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">📄 PDF Text Editor</h2>

              <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full p-2 bg-gray-800 rounded mb-2" />
              <canvas ref={canvasRef} className="my-2 rounded shadow border border-gray-600 mx-auto" style={{ width: "100%", maxWidth: "280px" }} />

              <input type="text" placeholder="Text to find" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full p-2 bg-gray-800 rounded mb-2" />
              <input type="text" placeholder="Replace with" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} className="w-full p-2 bg-gray-800 rounded mb-2" />

              {originalText && (
                <div className="bg-gray-800 rounded p-4 max-h-48 overflow-auto text-left text-sm">
                  <p className="text-green-400 font-bold mb-1">Original:</p>
                  <p className="text-gray-300 whitespace-pre-wrap mb-2">{originalText}</p>
                  <p className="text-yellow-400 font-bold mb-1">Modified:</p>
                  <p className="text-white whitespace-pre-wrap">{getModifiedPreview()}</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleUpload}
                disabled={loading}
                className="mt-4 bg-green-600 hover:bg-green-700 w-full py-2 rounded"
              >
                {loading ? "Processing..." : "Replace Text"}
              </motion.button>

              {updatedFile && (
                <a href={updatedFile} download className="block mt-4 bg-blue-700 hover:bg-blue-800 py-2 rounded">
                  Download Updated PDF
                </a>
              )}

              <button onClick={handleBack} className="mt-3 text-sm text-gray-400 hover:underline">← Back</button>
            </>
          )}
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black bg-opacity-70 text-center py-4 text-sm text-gray-400">
        <Link href="/terms" className="hover:underline">Terms & Privacy</Link>
      </footer>
    </div>
  );
}
