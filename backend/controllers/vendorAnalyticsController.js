const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// --------------------------------------------------
// Helper: get date range
// --------------------------------------------------
function getDateRange(range) {
  const now = new Date();
  let start;

  if (range === "day") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (range === "week") {
    start = new Date(now - 7 * 24 * 60 * 60 * 1000);
  } else if (range === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (range === "year") {
    start = new Date(now.getFullYear(), 0, 1);
  } else {
    start = new Date(now - 7 * 24 * 60 * 60 * 1000); // default week
  }

  return { start, end: now };
}

// --------------------------------------------------
// MAIN ANALYTICS CONTROLLER
// --------------------------------------------------
exports.getVendorAnalytics = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const range = req.query.range || "week";
  const { start, end } = getDateRange(range);

  // --------------------------------------------------
  // 1) GET ALL ORDERS FOR THIS RANGE
  // --------------------------------------------------
  const orders = await Order.find({
    "items.vendor": vendorId,
    createdAt: { $gte: start, $lte: end },
  }).lean();

  // Total revenue
  let revenue = 0;
  let orderCount = orders.length;

  orders.forEach(order => {
    revenue += order.totalAmount || 0;
  });

  const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

  // --------------------------------------------------
  // 2) BUILD SALES CHART
  // --------------------------------------------------
  const chartMap = {};

  orders.forEach(order => {
    const day = order.createdAt.toISOString().split("T")[0];

    if (!chartMap[day]) chartMap[day] = { label: day, sales: 0, orders: 0 };

    chartMap[day].sales += order.totalAmount;
    chartMap[day].orders += 1;
  });

  const chart = Object.values(chartMap).sort((a, b) =>
    new Date(a.label) - new Date(b.label)
  );

  // --------------------------------------------------
  // 3) TOP PRODUCTS (REAL)
  // --------------------------------------------------
  const productSalesMap = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      if (String(item.vendor) === String(vendorId)) {
        if (!productSalesMap[item.product]) {
          productSalesMap[item.product] = {
            productId: item.product,
            quantity: 0,
            revenue: 0,
          };
        }

        productSalesMap[item.product].quantity += item.qty;
        productSalesMap[item.product].revenue += item.qty * item.price;
      }
    });
  });

  // Convert to array
  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Attach product name
  const productIds = topProducts.map(p => p.productId);

  const products = await Product.find({ _id: { $in: productIds } })
    .select("title price")
    .lean();

  topProducts.forEach(p => {
    const prod = products.find(x => String(x._id) === String(p.productId));
    if (prod) p.name = prod.title;
  });

  // --------------------------------------------------
  // 4) Conversion Rate (REAL IF WE TRACK VISITORS LATER)
  // --------------------------------------------------
  // For now, fake formula: conversion = (orders / 100 visits) * 100
  // Later we plug your visitor-tracking table

  const conversion = orderCount
    ? ((orderCount / 100) * 100).toFixed(2)
    : 0;

  // --------------------------------------------------
  // 5) Traffic — REAL when we track clicks
  // For now send mock (frontend expects it)
  // --------------------------------------------------
  const traffic = [
    { name: "Direct", value: 40 },
    { name: "Social", value: 30 },
    { name: "Email", value: 20 },
    { name: "Referral", value: 10 },
  ];

  // --------------------------------------------------
  // FINAL RESPONSE
  // --------------------------------------------------
  res.json({
    revenue,
    orders: orderCount,
    aov,
    conversion,
    chart,
    topProducts,
    traffic,
  });
});
