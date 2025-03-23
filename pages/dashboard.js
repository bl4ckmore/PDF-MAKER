// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

const API_BASE_URL = "https://pdfapi-si07.onrender.com";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/user/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setHistory(res.data.history);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 🔹 Header */}
      <nav className="w-full flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <Link href="/" className="text-xl font-bold">
          PDF Editor
        </Link>

        {/* Always visible burger menu */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </nav>

      {/* 🔹 Burger Menu Dropdown */}
      {showMobileMenu && (
        <div className="bg-gray-800 w-full text-center p-4 space-y-2 border-b border-gray-700">
          <Link href="/" className="block hover:underline">🏠 Home</Link>
          <Link href="/dashboard" className="block hover:underline">📊 Dashboard</Link>
          <Link href="/upgrade" className="block hover:underline">⚡ Upgrade</Link>
          <button onClick={handleLogout} className="block text-red-400 hover:underline">
            🚪 Logout
          </button>
        </div>
      )}

      {/* 🔹 Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">👋 Welcome, {user.name}</h1>
          <Link
            href="/"
            className="text-sm text-blue-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📚 Your PDF Edit History</h2>

          {history.length === 0 ? (
            <p className="text-gray-300">You haven’t edited any PDFs yet.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((log) => (
                <li
                  key={log.id}
                  className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                >
                  <p className="mb-1">
                    🔍 <span className="font-semibold">{log.search}</span> → ✍️{" "}
                    <span className="font-semibold">{log.replace}</span>
                  </p>
                  <p>
                    📁{" "}
                    <a
                      href={`${API_BASE_URL}/pdf/${log.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline"
                    >
                      {log.filename}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
