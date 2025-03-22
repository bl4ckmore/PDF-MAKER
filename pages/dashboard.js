// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API_BASE_URL = "https://pdfapi-si07.onrender.com";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user info and PDF edit history
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
        router.push("/login");
      });
  }, [router]);

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">👋 Welcome, {user.name}</h1>

      <h2 className="text-xl font-semibold mb-2">📚 PDF Edit History:</h2>
      {history.length === 0 ? (
        <p>No edits found yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((log) => (
            <li key={log.id} className="bg-gray-800 p-3 rounded">
              🔍 <b>{log.search}</b> → ✍️ <b>{log.replace}</b> <br />
              📁 <a href={`${API_BASE_URL}/pdf/${log.filename}`} target="_blank" rel="noreferrer" className="text-blue-400 underline">{log.filename}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
