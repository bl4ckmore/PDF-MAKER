import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import Link from "next/link";

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
      alert("🚫 You reached daily free limit. Please upgrade to Premium.");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <nav className="w-full p-4 bg-gray-800 shadow-lg flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-wide">PDF Editor</Link>
        <div className="hidden md:flex items-center gap-x-6">
          <Link href="/" className="text-sm hover:text-blue-400">Home</Link>
          <Link href="/dashboard" className="text-sm hover:text-blue-400">Dashboard</Link>
          {!user?.role || user?.role !== "premium" ? (
            <Link href="/upgrade" className="text-sm text-yellow-400 hover:underline">Upgrade</Link>
          ) : null}
          {!user ? (
            <>
              <Link href="/login" className="text-sm hover:text-gray-300">Log In</Link>
              <Link href="/register" className="text-sm hover:text-gray-300">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-sm text-red-400 hover:underline">Logout</button>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-white text-2xl">☰</button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-gray-800 text-center py-4 space-y-2">
          <Link href="/" className="block text-sm hover:text-blue-400">Home</Link>
          <Link href="/dashboard" className="block text-sm hover:text-blue-400">Dashboard</Link>
          {!user?.role || user?.role !== "premium" ? (
            <Link href="/upgrade" className="block text-sm text-yellow-400 hover:underline">Upgrade</Link>
          ) : null}
          {!user ? (
            <>
              <Link href="/login" className="block text-sm hover:text-gray-300">Log In</Link>
              <Link href="/register" className="block text-sm hover:text-gray-300">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="block text-sm text-red-400 hover:underline">Logout</button>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 flex-grow flex justify-center px-4 pb-10">
        {!showEditor ? (
          <div className="text-center space-y-6 max-w-lg">
            <h1 className="text-4xl font-extrabold text-white">Edit PDFs Instantly</h1>
            <p className="text-gray-300 text-lg">
              Replace text, annotate, and edit your PDF files in seconds.
            </p>
            <button onClick={handleShowEditor} className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded text-white font-semibold text-lg">
              ✏️ Start Editing
            </button>
            {user && user.role !== "premium" && (
              <p className="text-yellow-400 mt-4">
                Free plan: {editCount}/2 edits used. <Link href="/upgrade" className="underline">Go Premium</Link>
              </p>
            )}
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold">📄 PDF Text Editor</h2>

            <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full p-2 bg-gray-700 rounded" />

            <div className="flex justify-center">
              <canvas ref={canvasRef} className="my-4 rounded shadow border border-gray-600" style={{ width: "100%", maxWidth: "320px" }} />
            </div>

            <input type="text" placeholder="Text to find" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <input type="text" placeholder="Replace with" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />

            {originalText && (
              <div className="bg-gray-700 p-4 rounded text-sm max-h-64 overflow-y-auto">
                <h3 className="font-semibold text-green-400 mb-1">Original:</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{originalText}</p>
                <h3 className="font-semibold text-yellow-400 mt-4 mb-1">Modified:</h3>
                <p className="text-white whitespace-pre-wrap">{getModifiedPreview()}</p>
              </div>
            )}

            <button onClick={handleUpload} disabled={loading} className="bg-green-600 hover:bg-green-700 transition px-6 py-2 rounded text-white w-full">
              {loading ? "Processing..." : "Replace Text"}
            </button>

            {updatedFile && (
              <a href={updatedFile} download className="block mt-4 text-center bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded">
                Download Updated PDF
              </a>
            )}

            <button onClick={handleBack} className="text-sm text-gray-400 hover:underline">← Back to Home</button>
          </div>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 py-4">
        <Link href="/terms" className="hover:underline">Terms & Privacy</Link>
      </footer>
    </div>
  );
}
