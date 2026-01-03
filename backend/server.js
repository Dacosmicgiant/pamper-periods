require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const applyFlashSale = require("./middlewares/applyFlashSale");
const flashSaleRoutes = require("./routes/flashSaleRoutes");

const app = express();

// DB Connection
connectDB();

// ------------ GLOBAL MIDDLEWARES ------------
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ------------ CORS CONFIGURATION (FIXED) ------------
const corsOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map(s => s.trim());

console.log('🔐 CORS Allowed Origins:', corsOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (corsOrigins.includes("*") || corsOrigins.includes(origin)) {
      console.log('✅ CORS allowed for:', origin);
      return callback(null, true);
    }
    
    console.log('❌ CORS blocked for:', origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,                                    // ← ADDED: Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],  // ← ADDED: Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],  // ← ADDED: Allowed headers
  exposedHeaders: ['Content-Range', 'X-Content-Range']  // ← ADDED: Exposed headers
}));

// Handle preflight requests explicitly
app.options('*', cors());


// ------------ EXISTING ROUTES ------------
app.use("/api/upload", require("./routes/upload")); // Cloudinary upload routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", applyFlashSale, require("./routes/products"));

app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/bundles", require("./routes/bundles"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/coupons", require("./routes/coupons"));
app.use("/api/admin/analytics", require("./routes/adminAnalytics"));
app.use("/api/flash-sale", require("./routes/flashSaleRoutes"));
app.use("/api/users", require("./routes/wishlistRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/reviews", require("./routes/reviews"));

app.use("/api/admin/bundles", require("./routes/adminBundles"));
// ------------ NEW ADDITION: Vendor Dashboard APIs ------------
app.use("/api/vendor", require("./routes/vendors"));
app.use("/api/vendor/bundles", require("./routes/vendorBundles"));

// vendorRoutes = vendor dashboard login, analytics, add product, edit product
app.use("/api/vendor-public", require("./routes/vendorPublic"));


// ------------ ROOT ROUTE ------------
app.get("/", (req, res) => {
  res.send("GiftStore API Running");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});


// ------------ ERROR HANDLING MIDDLEWARE ------------
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  
  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy: This origin is not allowed to access this resource"
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// ------------ START SERVER ------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS Origins: ${corsOrigins.join(', ')}`);
});