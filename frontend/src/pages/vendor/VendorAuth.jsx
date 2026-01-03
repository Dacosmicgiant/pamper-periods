// import React, { useState } from "react";
// import API from "../../api/api";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "../../components/Toast";

// export default function VendorAuth() {
//   const [tab, setTab] = useState("login");

//   // LOGIN STATES
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPass, setLoginPass] = useState("");

//   // REGISTER STATES
//   const [storeName, setStoreName] = useState("");
//   const [regEmail, setRegEmail] = useState("");
//   const [regPass, setRegPass] = useState("");

//   const { toast } = useToast();
//   const navigate = useNavigate();

//   /* ====================================================
//       VENDOR LOGIN
//   ==================================================== */
//   const handleVendorLogin = async () => {
//     if (!loginEmail || !loginPass)
//       return toast.error("Enter email & password");

//     try {
//       const { data } = await API.post("/vendor/login", {
//         email: loginEmail,
//         password: loginPass,
//       });

//       // Remove user token (avoid token conflict)
//       localStorage.removeItem("token");

//       // Save vendor session
//       localStorage.setItem("vendorToken", data.token);
//       localStorage.setItem("vendor", JSON.stringify(data.vendor));

//       toast.success("Login successful!");
//       navigate("/vendor"); // ← Change if your dashboard route is different
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed");
//     }
//   };

//   /* ====================================================
//       VENDOR REGISTER
//   ==================================================== */
//   const handleVendorRegister = async () => {
//     if (!storeName || !regEmail || !regPass)
//       return toast.error("All fields are required");

//     try {
//       const payload = {
//         shopName: storeName, // MUST match backend Vendor model
//         email: regEmail,
//         password: regPass,
//       };

//       const { data } = await API.post("/vendor/register", payload);

//       toast.success("Vendor account created! You can now log in.");
//       setTab("login");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="bg-background-light dark:bg-background-dark text-[#111218] dark:text-white min-h-screen font-display">

//       {/* Header */}
//       <header className="flex items-center justify-between border-b border-[#f0f1f4] dark:border-b-background-dark px-4 sm:px-10 py-3 bg-white dark:bg-[#191d32]">
//         <h2 className="text-lg font-bold">Vendor Marketplace</h2>
//         <a href="/" className="text-sm font-medium hover:text-primary">Return Home</a>
//       </header>

//       {/* Layout */}
//       <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center">

//           {/* Left side */}
//           <div className="hidden lg:flex flex-col gap-6 px-6">
//             <h1 className="text-4xl sm:text-5xl font-black leading-tight">
//               Start Selling to Millions
//             </h1>
//             <p className="text-[#616889] dark:text-gray-300 text-lg">
//               Sell faster with analytics, fast payouts and real vendor tools.
//             </p>
//           </div>

//           {/* Auth Box */}
//           <div className="bg-white dark:bg-[#191d32] rounded-xl shadow-lg p-6 sm:p-10">

//             {/* Tabs */}
//             <div className="flex mb-6">
//               <div className="flex flex-1 items-center bg-[#f0f1f4] dark:bg-background-dark h-10 rounded-lg p-1">
                
//                 <button
//                   onClick={() => setTab("login")}
//                   className={`flex-1 rounded-lg text-sm font-medium ${
//                     tab === "login"
//                       ? "bg-white dark:bg-primary/30 text-[#111218] dark:text-white shadow"
//                       : "text-[#616889] dark:text-gray-400"
//                   }`}
//                 >
//                   Login
//                 </button>

//                 <button
//                   onClick={() => setTab("register")}
//                   className={`flex-1 rounded-lg text-sm font-medium ${
//                     tab === "register"
//                       ? "bg-white dark:bg-primary/30 text-[#111218] dark:text-white shadow"
//                       : "text-[#616889] dark:text-gray-400"
//                   }`}
//                 >
//                   Register
//                 </button>

//               </div>
//             </div>

//             {/* ================= LOGIN ================= */}
//             {tab === "login" && (
//               <div className="flex flex-col gap-6 animate-fadeIn">

//                 <h1 className="text-2xl font-bold text-center">Vendor Login</h1>

//                 <label className="flex flex-col">
//                   <p className="pb-2 text-sm">Business Email</p>
//                   <input
//                     type="email"
//                     value={loginEmail}
//                     onChange={(e) => setLoginEmail(e.target.value)}
//                     placeholder="Enter your email"
//                     className="h-12 border rounded-lg p-3 bg-white dark:bg-background-dark"
//                   />
//                 </label>

//                 <label className="flex flex-col">
//                   <p className="pb-2 text-sm">Password</p>
//                   <input
//                     type="password"
//                     value={loginPass}
//                     onChange={(e) => setLoginPass(e.target.value)}
//                     placeholder="Enter password"
//                     className="h-12 border rounded-lg p-3 bg-white dark:bg-background-dark"
//                   />
//                 </label>

//                 <button
//                   onClick={handleVendorLogin}
//                   className="h-12 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
//                 >
//                   Login to Dashboard
//                 </button>

//               </div>
//             )}

//             {/* ================= REGISTER ================= */}
//             {tab === "register" && (
//               <div className="flex flex-col gap-6 animate-fadeIn">

//                 <h1 className="text-2xl font-bold text-center">Create Your Vendor Account</h1>

//                 <label className="flex flex-col">
//                   <p className="pb-2 text-sm">Store Name</p>
//                   <input
//                     type="text"
//                     name="shopName"
//                     value={storeName}
//                     onChange={(e) => setStoreName(e.target.value)}
//                     placeholder="Your Store Name"
//                     className="h-12 border rounded-lg p-3 bg-white dark:bg-background-dark"
//                   />
//                 </label>

//                 <label className="flex flex-col">
//                   <p className="pb-2 text-sm">Business Email</p>
//                   <input
//                     type="email"
//                     name="email"
//                     value={regEmail}
//                     onChange={(e) => setRegEmail(e.target.value)}
//                     placeholder="you@store.com"
//                     className="h-12 border rounded-lg p-3 bg-white dark:bg-background-dark"
//                   />
//                 </label>

//                 <label className="flex flex-col">
//                   <p className="pb-2 text-sm">Password</p>
//                   <input
//                     type="password"
//                     name="password"
//                     value={regPass}
//                     onChange={(e) => setRegPass(e.target.value)}
//                     placeholder="••••••••"
//                     className="h-12 border rounded-lg p-3 bg-white dark:bg-background-dark"
//                   />
//                 </label>

//                 <button
//                   onClick={handleVendorRegister}
//                   className="h-12 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
//                 >
//                   Create My Store
//                 </button>

//               </div>
//             )}

//           </div>
//         </div>
//       </main>

//     </div>
//   );
// }

import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";

export default function VendorAuth() {
  const [tab, setTab] = useState("login");

  // LOGIN STATES
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // REGISTER STATES
  const [storeName, setStoreName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  /* ====================================================
      VENDOR LOGIN
  ==================================================== */
  const handleVendorLogin = async () => {
    if (!loginEmail || !loginPass)
      return toast.error("Enter email & password");

    try {
      const { data } = await API.post("/vendor/login", {
        email: loginEmail,
        password: loginPass,
      });

      // Remove user token (avoid token conflict)
      localStorage.removeItem("token");

      // Save vendor session
      localStorage.setItem("vendorToken", data.token);
      localStorage.setItem("vendor", JSON.stringify(data.vendor));

      toast.success("Login successful!");
      navigate("/vendor"); // ← Change if your dashboard route is different
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  /* ====================================================
      VENDOR REGISTER
  ==================================================== */
  const handleVendorRegister = async () => {
    if (!storeName || !regEmail || !regPass)
      return toast.error("All fields are required");

    try {
      const payload = {
        shopName: storeName, // MUST match backend Vendor model
        email: regEmail,
        password: regPass,
      };

      const { data } = await API.post("/vendor/register", payload);

      toast.success("Vendor account created! You can now log in.");
      setTab("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 font-display">

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-pink-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">storefront</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-primary dark:from-white dark:to-primary bg-clip-text text-transparent">
                Vendor Marketplace
              </h2>
            </div>
            <a 
              href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium text-sm transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Return Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center">

          {/* Left Side - Hero Content */}
          <div className="flex flex-col gap-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-gray-900 via-primary to-pink-600 dark:from-white dark:via-primary dark:to-pink-400 bg-clip-text text-transparent">
                Start Selling to Millions
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Join our marketplace and reach customers worldwide with powerful vendor tools, fast payouts, and real-time analytics.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">check</span>
                </div>
                <span className="text-sm font-medium">Fast Payouts</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">analytics</span>
                </div>
                <span className="text-sm font-medium">Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">support_agent</span>
                </div>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-sm">trending_up</span>
                </div>
                <span className="text-sm font-medium">Growth Tools</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Card */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            
            {/* Tabs */}
            <div className="flex mb-8">
              <div className="flex flex-1 items-center bg-gray-100 dark:bg-gray-800 h-12 rounded-xl p-1">
                <button
                  onClick={() => setTab("login")}
                  className={`flex-1 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    tab === "login"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setTab("register")}
                  className={`flex-1 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    tab === "register"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Login Form */}
            {tab === "login" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                  <p className="text-gray-500 dark:text-gray-400">Sign in to your vendor dashboard</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full h-12 px-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                        email
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-12 px-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                        lock
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVendorLogin}
                  className="w-full h-12 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">login</span>
                  Login to Dashboard
                </button>
              </div>
            )}

            {/* Register Form */}
            {tab === "register" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Start Your Journey</h1>
                  <p className="text-gray-500 dark:text-gray-400">Create your vendor account in minutes</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Store Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="shopName"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Your Store Name"
                        className="w-full h-12 px-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                        storefront
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@store.com"
                        className="w-full h-12 px-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                        email
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full h-12 px-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                        lock
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVendorRegister}
                  className="w-full h-12 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">add_business</span>
                  Create My Store
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
