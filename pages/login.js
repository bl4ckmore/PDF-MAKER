// 📁 pages/login.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://pdfapi-si07.onrender.com/api/auth/login",
        form
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded w-full max-w-md space-y-4 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full mt-2 text-sm text-gray-400 hover:underline"
        >
          ← Back
        </button>
      </form>
    </div>
  );
}
