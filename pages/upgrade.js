import Link from "next/link";
import { useEffect, useState } from "react";

export default function UpgradePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading upgrade options...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-4">🚀 Upgrade to Premium</h1>

        <p className="text-gray-300 text-center mb-6">
          Unlock unlimited PDF edits, faster processing, priority support, and more!
        </p>

        <div className="bg-gray-700 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">🔥 Premium Plan</h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>Unlimited PDF edits</li>
            <li>Full access to advanced tools</li>
            <li>No daily limits</li>
            <li>Priority customer support</li>
          </ul>
          <p className="mt-4 text-yellow-400 font-semibold text-lg">Only $4.99/month</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => alert("Payment system coming soon!")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold mb-4"
          >
            Upgrade Now
          </button>
          <Link href="/" className="text-gray-400 underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
