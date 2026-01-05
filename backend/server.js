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
const corsOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map(s => s.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (corsOrigins.includes("*") || corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  }
}));


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

// WhatsApp test endpoint
app.use("/api/whatsapp", require("./routes/testWhatsApp"));



// ------------ ROOT ROUTE ------------
app.get("/", (req, res) => {
  res.send("GiftStore API Running");
});


// ------------ START SERVER ------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server started on port ${PORT}`)
);
