import React, { useState, useContext } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white relative overflow-hidden font-sans">
      {/* Soft Background Accents */}
      <div className="absolute top-0 -right-20 w-80 h-80 bg-pink-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-purple-50 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(255,182,193,0.25)] rounded-[3rem] p-8 sm:p-12 border border-white">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto bg-pink-600 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-pink-200 mb-6 -rotate-3 transition-transform hover:rotate-0">
              PG
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Join Us</h2>
            <p className="text-gray-500 mt-2 font-medium">
              Start your journey with <span className="text-pink-600">Pamper Period</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all font-medium text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="jane@example.com"
                className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all font-medium text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Choose Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="••••••••"
                className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all font-medium text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              type="submit"
              className={`w-full h-15 py-4 rounded-2xl bg-pink-600 text-white font-black uppercase tracking-widest shadow-xl shadow-pink-200 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 ${
                isLoading ? "opacity-70 cursor-wait" : "hover:bg-pink-700 hover:-translate-y-1"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <span className="material-symbols-outlined text-lg">app_registration</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link className="text-pink-600 hover:text-pink-700 font-black transition" to="/login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
          Privacy Focused • Safe & Secure
        </p>
      </motion.div>
    </div>
  );
}