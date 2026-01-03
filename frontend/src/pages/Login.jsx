import React, { useState, useContext } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // -------- USER LOGIN FIRST ---------
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return navigate("/");
    } catch (err) {
      const status = err.response?.status;
      if (status !== 404) {
        setIsLoading(false);
        return alert(err.response?.data?.message || "Invalid credentials");
      }
    }

    // -------- VENDOR LOGIN FALLBACK --------
    try {
      const { data } = await API.post("/vendor/login", { email, password });
      localStorage.setItem("vendorToken", data.token);
      localStorage.setItem("vendor", JSON.stringify(data.vendor));
      return navigate("/vendor");
    } catch (err2) {
      setIsLoading(false);
      alert(err2.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white relative overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(255,192,203,0.3)] rounded-[2.5rem] p-8 sm:p-10 border border-white">
          
          {/* LOGO & HEADER */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto bg-pink-600 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-pink-200 mb-6 rotate-3">
              PG
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Welcome Back</h2>
            <p className="text-gray-500 mt-2 font-medium">
              Continue your journey with <span className="text-pink-600">Pamper Periods</span>
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="hello@pamper.com"
                className="w-full h-14 px-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="••••••••"
                className="w-full h-14 px-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300"
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" size="sm" className="text-xs font-bold text-pink-600 hover:text-pink-700 transition">
                Forgot Password?
              </Link>
            </div>

            <button
              disabled={isLoading}
              className={`group relative h-14 w-full rounded-2xl bg-pink-600 text-white font-black uppercase tracking-widest shadow-xl shadow-pink-200 transition-all active:scale-95 flex items-center justify-center overflow-hidden ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-700'}`}
              type="submit"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Login <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 font-medium">
              New here?{" "}
              <Link
                to="/register"
                className="text-pink-600 hover:underline font-black"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Floating Support Info */}
        <p className="text-center mt-8 text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">
          Secure Access • Pamper Periods 2024
        </p>
      </motion.div>
    </div>
  );
}