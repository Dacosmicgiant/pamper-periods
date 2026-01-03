const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const {
  getCart,
  saveCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middlewares/auth");

// ---- PROFILE ----
router.get("/me", protect, userController.getProfile);
router.put("/me", protect, userController.updateProfile);

// ---- ADDRESSES ----
router.get("/addresses", protect, userController.getAddresses);
router.post("/addresses", protect, userController.addAddress);
router.put("/addresses/:addressId", protect, userController.updateAddress);
router.delete("/addresses/:addressId", protect, userController.deleteAddress);

// ---- ORDERS ----
router.get("/orders", protect, userController.getUserOrders);
router.get("/orders/:orderId", protect, userController.getOrderDetail);

// --------------------------------------------------------
// 🚨 VERY IMPORTANT — CART ROUTES LAST
// --------------------------------------------------------
router.get("/cart", protect, getCart);
router.post("/cart", protect, saveCart);
router.delete("/cart", protect, clearCart);


module.exports = router;
