const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");

exports.getStats = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();
  const vendors = await Vendor.countDocuments();
  const products = await Product.countDocuments();
  const orders = await Order.countDocuments();

  const totalRevenue = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, amount: { $sum: "$total" } } }
  ]);

  res.json({
    users,
    vendors,
    products,
    orders,
    revenue: totalRevenue[0]?.amount || 0
  });
});
