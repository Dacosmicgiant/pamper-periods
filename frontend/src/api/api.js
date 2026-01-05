import axios from "axios";

const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const baseURL = raw.startsWith("http://") || raw.startsWith("https://")
  ? raw
  : `https://${raw}`;

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((req) => {
  const userToken = localStorage.getItem("token");
  const vendorToken = localStorage.getItem("vendorToken");
  const adminToken = localStorage.getItem("adminToken") || localStorage.getItem("token");

  const path = req.url ?? "";

  const isVendorRoute =
    path.startsWith("/vendor") || path.startsWith("/vendor-");

  const isAdminRoute = path.startsWith("/admin");

  // 🔐 Vendor routes
  if (isVendorRoute) {
    if (vendorToken) {
      req.headers.Authorization = `Bearer ${vendorToken}`;
    }
    return req;
  }

  // 🔐 Admin routes
  if (isAdminRoute) {
    if (adminToken) {
      req.headers.Authorization = `Bearer ${adminToken}`;
    }
    return req;
  }

  // 👤 Normal user routes
  if (userToken) {
    req.headers.Authorization = `Bearer ${userToken}`;
  }

  return req;
});




export default API;
