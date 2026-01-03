import axios from "axios";

// Get API URL from environment variable
const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Ensure URL starts with http:// or https://
const baseURL = raw.startsWith("http://") || raw.startsWith("https://")
  ? raw
  : `https://${raw}`;

// Log for debugging (remove in production)
console.log('🔗 API Base URL:', baseURL);
console.log('🔗 Environment:', import.meta.env.MODE);

const API = axios.create({
  baseURL,
  withCredentials: true,  // ← ADDED: Enable credentials (cookies)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adds authentication tokens
API.interceptors.request.use(
  (req) => {
    const userToken = localStorage.getItem("token");
    const vendorToken = localStorage.getItem("vendorToken");
    const adminToken = localStorage.getItem("adminToken") || localStorage.getItem("token");

    const path = req.url ?? "";

    // Log request for debugging (remove in production)
    console.log(`📤 ${req.method?.toUpperCase()} ${baseURL}${path}`);

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
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors
API.interceptors.response.use(
  (response) => {
    // Log successful response (remove in production)
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    // Log error details
    if (error.response) {
      // Server responded with error status
      console.error('❌ Response error:', {
        status: error.response.status,
        url: error.config?.url,
        message: error.response.data?.message || error.message
      });
    } else if (error.request) {
      // Request made but no response
      console.error('❌ No response received:', {
        url: error.config?.url,
        message: error.message
      });
    } else {
      // Error setting up request
      console.error('❌ Request setup error:', error.message);
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      console.warn('⚠️ Unauthorized - clearing tokens');
      // Uncomment if you want to auto-logout on 401
      // localStorage.clear();
      // window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.warn('⚠️ Forbidden - check CORS or permissions');
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network error - check if backend is running and CORS is configured');
    }

    return Promise.reject(error);
  }
);

export default API;