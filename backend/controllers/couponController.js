const Coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");

exports.list = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

exports.create = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

exports.update = asyncHandler(async (req, res) => {
  const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

exports.remove = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: "Coupon removed" });
});
