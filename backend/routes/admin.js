// routes/admin.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const flashSaleController = require("../controllers/flashSaleController");
const { protect, authorize } = require("../middlewares/auth");

router.use(protect, authorize("admin"));

// ADMIN STATS
router.get("/stats", adminController.stats);

// ORDERS
router.get("/orders", adminController.listOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);

// VENDORS
router.get("/vendors",authorize("admin"), adminController.listVendors);
router.put("/vendors/:id/approve", adminController.toggleVendorApproval);

// USERS
router.get("/users", adminController.listUsers);
router.put("/users/:id/ban", adminController.banUser);
router.put("/users/:id/unban", adminController.unbanUser);



module.exports = router;
