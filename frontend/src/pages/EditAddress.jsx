// import React, { useEffect, useState } from "react";
// import API from "../api/api";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditAddress() {
//   const { addressId } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   useEffect(() => {
//     const load = async () => {
//       const { data } = await API.get("/users/addresses");
//       const found = data.find((a) => a._id === addressId);
//       if (found) setForm(found);
//     };
//     load();
//   }, [addressId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await API.put(`/user/addresses/${addressId}`, form);
//     navigate("/profile");
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Edit Address</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {Object.keys(form).map((field) => (
//           <input
//             key={field}
//             name={field}
//             value={form[field]}
//             onChange={(e) =>
//               setForm({ ...form, [field]: e.target.value })
//             }
//             className="border p-3 rounded w-full"
//           />
//         ))}

//         <button className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full">
//           Update
//         </button>
//       </form>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  Building2, 
  Globe, 
  Hash, 
  Save, 
  X,
  Truck
} from "lucide-react";

export default function EditAddress() {
  const { addressId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/user/addresses");
        const found = data.find((a) => a._id === addressId);
        if (found) {
          setForm(found);
        } else {
          navigate("/profile");
        }
      } catch (err) {
        console.error("Failed to load address:", err);
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };
    loadAddress();
  }, [addressId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/user/addresses/${addressId}`, form);
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium italic">Finding your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Link to="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-pink-600 transition-colors mb-4 group text-sm font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Profile
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">
              Edit <span className="italic">Address</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Editing Live Mode</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Section */}
          <div className="lg:col-span-7">
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full h-14 px-5 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Contact Number
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      type="tel"
                      className="w-full h-14 px-5 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Street Details
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full p-5 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Building2 className="w-3 h-3" /> City
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full h-14 px-5 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> State
                    </label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full h-14 px-5 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Hash className="w-3 h-3" /> PIN Code
                    </label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      maxLength="6"
                      className="w-full h-14 px-5 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all font-mono tracking-widest"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {saving ? "Updating..." : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="px-8 h-14 border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - Visual Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full transition-transform group-hover:scale-125" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold italic">Address Preview</h3>
                  <MapPin className="w-5 h-5 text-pink-400" />
                </div>
                
                <div className="space-y-1 mb-8">
                  <p className="text-2xl font-light tracking-tight">{form.name || "Your Name"}</p>
                  <p className="text-slate-400 text-sm">{form.phone || "+91 00000 00000"}</p>
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-sm leading-relaxed text-slate-200">
                    {form.address || "Start typing your address..."}
                  </p>
                  <p className="mt-2 text-sm font-bold tracking-widest uppercase">
                    {form.city}{form.city && form.state ? ", " : ""}{form.state} {form.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Shipping Zone</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Fast Delivery Active</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Verified delivery coverage",
                  "Estimated 2-3 business days",
                  "Secure packaging guaranteed"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}