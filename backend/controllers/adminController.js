// controllers/adminController.js
const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// ------------------------------
// Admin stats (dashboard)
// ------------------------------
exports.stats = asyncHandler(async (req, res) => {
  // total orders, revenue, users, vendors
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalVendors = await Vendor.countDocuments();
  const revenueAgg = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = (revenueAgg[0] && revenueAgg[0].total) || 0;

  // sales over last 30 days (daily)
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const salesByDay = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // top vendors by revenue (last 90 days)
  const since90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const topVendors = await Order.aggregate([
    { $match: { createdAt: { $gte: since90 } } },
    {
      $group: {
        _id: "$vendor",
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "vendors",
        localField: "_id",
        foreignField: "_id",
        as: "vendor",
      },
    },
    { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        vendorId: "$_id",
        revenue: 1,
        orders: 1,
        shopName: "$vendor.shopName",
      },
    },
  ]);

  res.json({
    totalOrders,
    totalUsers,
    totalVendors,
    totalRevenue,
    salesByDay,
    topVendors,
  });
});

// ------------------------------
// List orders (with optional filter / search)
// ------------------------------
exports.listOrders = asyncHandler(async (req, res) => {
  const { status, q } = req.query;
  const filter = {};

  if (status) filter.status = status;

  if (q) {
    const re = new RegExp(q, "i");
    filter.$or = [
      { orderNumber: re },
      { "shippingAddress.name": re },
      { "shippingAddress.address": re },
      { "shippingAddress.phone": re },
    ];
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("items.product", "title price image")
    .populate("items.vendor", "shopName email")  // CORRECTED
    .limit(500);

  res.json(orders);
});

// ------------------------------
// Update order status (ship / cancel / complete)
// ------------------------------
const ALLOWED_STATUSES = ["pending","processing","shipped","completed","cancelled","refunded"];

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  // Validate orderId
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  // Validate status
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid or missing status" });
  }

  // Find order
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // OPTIONAL: permission check (only admin or relevant vendor)
  // if (req.user.role !== 'admin') return res.status(403)...

  // Save previous status to handle transitions
  const prevStatus = order.status;

  // Update
  order.status = status;

  // Example: reduce stock when moving to shipped (customize to your model)
  try {
    if (prevStatus !== "shipped" && status === "shipped") {
      // decrement product stocks for each item (only if your schema supports stock)
      for (const item of order.items) {
        // if item.product is populated or just an id; fetch product to be safe
        const product = await Product.findById(item.product);
        if (product && typeof product.stock !== "undefined") {
          product.stock = Math.max(0, (product.stock || 0) - (item.qty || 0));
          await product.save();
        }
      }
    }

    // Save order
    const updated = await order.save();

    // Optionally: emit websocket event or send notification here

    return res.json({ message: "Order status updated", order: updated });
  } catch (err) {
    // Log error to console so server logs show stack trace
    console.error("Error updating order status:", err);
    // Return clean JSON error instead of HTML
    return res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
});

// ------------------------------
// List vendors (with approve/ban)
// ------------------------------
exports.listVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(vendors);
});

// exports.activateVendor = asyncHandler(async (req, res) => {
//   const vendor = await Vendor.findById(req.params.id);
//   if (!vendor) return res.status(404).json({ message: "Vendor not found" });
//   vendor.isActive = true;
//   vendor.activatedAt = new Date();
//   await vendor.save();
//   res.json({ message: "Vendor activated", vendor });
// });

// exports.deactivateVendor = asyncHandler(async (req, res) => {
//   const vendor = await Vendor.findById(req.params.id);
//   if (!vendor) return res.status(404).json({ message: "Vendor not found" });
//   vendor.isActive = false;
//   await vendor.save();
//   res.json({ message: "Vendor deactivated", vendor });
// });
// ------------------------------
// Activate / Deactivate Vendor (Toggle)
// ------------------------------
exports.toggleVendorApproval = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body; // true / false

  const vendor = await Vendor.findById(id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.isApproved = approved;

  await vendor.save();

  res.json({
    message: `Vendor ${approved ? "approved" : "unapproved"} successfully`,
    vendor,
  });
});


// ------------------------------
// Ban / unban user
// ------------------------------
exports.listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(1000);
  res.json(users);
});

exports.banUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isBanned = true;
  await user.save();
  res.json({ message: "User banned" });
});

exports.unbanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isBanned = false;
  await user.save();
  res.json({ message: "User unbanned" });
});
