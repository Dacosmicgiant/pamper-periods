const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");

exports.list = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});

exports.create = asyncHandler(async (req, res) => {
  const { name, icon, description } = req.body;
  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: "Category already exists" });

  const cat = await Category.create({ name, icon, description });
  res.status(201).json(cat);
});

exports.update = asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(cat);
});

exports.remove = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category removed" });
});
