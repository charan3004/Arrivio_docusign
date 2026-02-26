import { useState } from "react";
import { supabase } from "../../supabase/client";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('arrivio_remember_me') === 'true';
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Persist preference
    localStorage.setItem('arrivio_remember_me', rememberMe.toString());

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
        Admin Login
      </h1>

      <p className="text-sm text-gray-500 text-center mb-6">
        Authorized access only
      </p>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                       focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                       focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Keep me signed in */}
        <div className="flex items-center gap-2">
          <input
            id="admin-remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => {
              setRememberMe(e.target.checked);
              localStorage.setItem('arrivio_remember_me', e.target.checked.toString());
            }}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="admin-remember-me" className="text-sm text-gray-700 cursor-pointer select-none">
            Keep me signed in
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg
                     hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center mt-6">
        © {new Date().getFullYear()} Admin Panel
      </p>
    </div>
  );
}
