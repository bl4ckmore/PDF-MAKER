// pages/login.js
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add login logic here
    alert("Login logic goes here 🚀");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Log In</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Log In
        </button>

        <Link
          href="/"
          className="block text-sm text-gray-400 text-center hover:underline"
        >
          ← Back to Home
        </Link>
      </form>
    </div>
  );
}
