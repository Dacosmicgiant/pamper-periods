const express = require("express");
const router = express.Router();

const vendorProtect = require("../middlewares/vendorProtect");
const vendorController = require("../controllers/vendorController");
const vendorAnalyticsController = require("../controllers/vendorAnalyticsController");

// -----------------------------------------
// PUBLIC ROUTES
// -----------------------------------------

router.post("/register", vendorController.registerVendor);
router.post("/login", vendorController.loginVendor);

// Update vendor profile
router.put("/me", vendorProtect, vendorController.updateVendorProfile);

// -----------------------------------------
// PROTECTED ROUTES
// -----------------------------------------

// Vendor profile
router.get("/me", vendorProtect, vendorController.getVendorProfile);

// Dashboard
router.get("/dashboard", vendorProtect, vendorController.getDashboardStats);

// Analytics
router.get("/analytics", vendorProtect, vendorAnalyticsController.getVendorAnalytics);

// Orders
router.get("/orders", vendorProtect, vendorController.getVendorOrders);

// Reviews
router.get("/reviews", vendorProtect, vendorController.getVendorReviews);
router.get("/reviews/stats", vendorProtect, vendorController.getVendorRatingStats);

// Vendor-only review actions
router.delete("/reviews/:id", vendorProtect, vendorController.deleteReview);
router.post("/reviews/:id/reply", vendorProtect, vendorController.addReplyToReview);
router.put("/reviews/:id/reply", vendorProtect, vendorController.editReply);
router.delete("/reviews/:id/reply", vendorProtect, vendorController.deleteReply);

// WhatsApp Settings
router.put("/settings/whatsapp", vendorProtect, vendorController.updateWhatsAppSettings);

// 🔥 NEW — Test WhatsApp message


// -----------------------------------------
// PRODUCT ROUTES (CRUD)
// -----------------------------------------

router.post("/products", vendorProtect, vendorController.addProduct);
router.get("/products", vendorProtect, vendorController.getVendorProducts);
router.get("/products/:id", vendorProtect, vendorController.getProductById);
router.put("/products/:id", vendorProtect, vendorController.updateProduct);
router.delete("/products/:id", vendorProtect, vendorController.deleteProduct);

module.exports = router;
