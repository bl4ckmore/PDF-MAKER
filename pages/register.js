// pages/register.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const res = await axios.post("https://pdfapi-si07.onrender.com/api/auth/register", form);
      if (res.data.success) {
        alert("✅ Registered successfully!");
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded w-full max-w-md space-y-4 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Back to Home */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="block mt-2 text-sm text-gray-400 hover:underline text-center w-full"
        >
          ← Back to Home
        </button>
      </form>
    </div>
  );
}
