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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) setUser(JSON.parse(storedUser));

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

  if (loading) return <p className="text-white p-6">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between p-4 bg-gray-800 rounded mb-6 shadow-lg">
        <button
          onClick={() => router.push("/")}
          className="text-lg font-bold text-white hover:text-blue-300 transition"
        >
          PDF Editor
        </button>

        <div className="hidden md:flex gap-4 items-center">
          <Link href="/" className="text-sm text-blue-400 hover:underline">Home</Link>
          <Link href="/dashboard" className="text-sm text-blue-400 hover:underline">Dashboard</Link>
          {user?.role !== "premium" && (
            <Link href="/upgrade" className="text-sm text-yellow-400 hover:underline">Upgrade</Link>
          )}
        </div>

        <div className="md:hidden text-white text-2xl">☰</div>
      </nav>

      {/* Welcome Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              👋 Welcome, {user?.name}
              {user?.role === "premium" && (
                <span className="ml-2 px-3 py-1 bg-yellow-500 text-black text-xs rounded-full">
                  PREMIUM
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Total edits: <span className="font-semibold text-white">{history.length}</span>
            </p>
          </div>
          <Link href="/" className="text-sm text-blue-400 hover:underline mt-4 sm:mt-0">
            ← Back to Home
          </Link>
        </div>

        {/* PDF Edit History */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📚 Your PDF Edit History</h2>

          {history.length === 0 ? (
            <p className="text-gray-300">You haven’t edited any PDFs yet.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((log) => (
                <li
                  key={log.id}
                  className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-blue-400 transition"
                >
                  <p className="mb-1">
                    🔍 <span className="font-semibold">{log.search}</span> → ✍️{" "}
                    <span className="font-semibold">{log.replace}</span>
                  </p>
                  <p className="truncate">
                    📁{" "}
                    <a
                      href={`${API_BASE_URL}/pdf/${log.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {log.filename}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
