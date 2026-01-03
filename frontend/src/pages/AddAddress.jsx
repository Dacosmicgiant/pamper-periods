import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import useAuth from "../hooks/useAuth";

export default function AddAddress() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await API.post("/user/addresses", form);
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const fieldPlaceholders = {
    name: "John Doe",
    phone: "9876543210",
    address: "Apt 4B, Sunset Boulevard",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <nav className="mb-8">
          <Link 
            to="/profile" 
            className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-pink-600 transition-colors"
          >
            <span className="material-symbols-outlined text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Account
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Form Section */}
          <div className="lg:col-span-7">
            <header className="mb-8">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Add Address</h1>
              <p className="mt-2 text-slate-500 text-lg">Where should we deliver your favorite items?</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 space-y-8">
                {/* Section 1: Contact Details */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-1 bg-pink-500 rounded-full"></div>
                    <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Contact Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={fieldPlaceholders.name}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder={fieldPlaceholders.phone}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Shipping Details */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                    <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Shipping Address</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Street Address</label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder={fieldPlaceholders.address}
                        required
                        rows={2}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">City</label>
                        <input
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder={fieldPlaceholders.city}
                          required
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">State</label>
                        <input
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          placeholder={fieldPlaceholders.state}
                          required
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">PIN Code</label>
                        <input
                          name="pincode"
                          value={form.pincode}
                          onChange={handleChange}
                          placeholder={fieldPlaceholders.pincode}
                          required
                          pattern="[0-9]{6}"
                          maxLength="6"
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-8 bg-slate-50 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                      Confirm and Save Address
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Address Card Preview */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                  <div className="p-3 bg-pink-50 rounded-2xl">
                    <span className="material-symbols-outlined text-pink-600 text-3xl">location_on</span>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Live Preview</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Recipient</p>
                    <p className="text-xl font-bold text-slate-900 leading-tight">
                      {form.name || "Enter Name"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Destination</p>
                    <p className="text-slate-600 line-clamp-2 min-h-[3rem]">
                      {form.address ? (
                        `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`
                      ) : (
                        "Start typing your address to see it here..."
                      )}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-sm">phone_iphone</span>
                    <span className="text-sm font-medium tracking-wide">{form.phone || "+91 XXXXXXXXXX"}</span>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-slate-50 rounded-full -z-0"></div>
              </div>
            </div>

            {/* Helping Information */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-400">offline_bolt</span>
                Delivery Notes
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</span>
                  <p className="text-slate-300 text-sm leading-relaxed">Ensure the <span className="text-white font-medium">PIN Code</span> matches your city to avoid delay.</p>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</span>
                  <p className="text-slate-300 text-sm leading-relaxed">Our couriers deliver between <span className="text-white font-medium">9 AM - 7 PM</span>. Use an office address if you're not home.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}