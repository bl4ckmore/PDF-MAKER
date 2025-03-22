export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Register submitted:", form);
      // You can implement API integration here
    };
  
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded w-full max-w-md space-y-4">
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
  
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold"
          >
            Register
          </button>
  
          <button
            type="button"
            onClick={() => window.location.href = "/"}
            className="block mt-2 text-sm text-gray-400 hover:underline text-center w-full"
          >
            ← Back to Home
          </button>
        </form>
      </div>
    );
  }
  