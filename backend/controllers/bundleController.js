const asyncHandler = require("express-async-handler");
const Bundle = require("../models/Bundle");
const Vendor = require("../models/Vendor");

// -------------------------
// LIST ACTIVE BUNDLES
// -------------------------
exports.list = asyncHandler(async (req, res) => {
  const bundles = await Bundle.find({ isActive: true })
    .populate("vendor", "shopName avatar")
    .lean();

  res.json(bundles);
});

// -------------------------
// GET SINGLE BUNDLE
// -------------------------
exports.get = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id)
    .populate("vendor", "shopName avatar")
    .lean();

  if (!bundle) return res.status(404).json({ message: "Bundle not found" });

  res.json(bundle);
});

// -------------------------
// CREATE BUNDLE
// -------------------------
exports.create = asyncHandler(async (req, res) => {
  const { title, price, oldPrice, description, images, items } = req.body;

  // vendor = current logged-in vendor (OR admin)
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Vendor profile required to create bundle" });
  }

  const bundle = await Bundle.create({
    title,
    price,
    oldPrice,
    description,
    images,
    items,
    vendor: vendor ? vendor._id : req.body.vendor,
  });

  res.status(201).json(bundle);
});

// -------------------------
// UPDATE BUNDLE
// -------------------------
exports.update = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id);

  if (!bundle) return res.status(404).json({ message: "Bundle not found" });

  // Only admin or owner vendor
  if (req.user.role !== "admin") {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor || vendor._id.toString() !== bundle.vendor.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  Object.assign(bundle, req.body);
  await bundle.save();

  res.json(bundle);
});

// -------------------------
// DELETE BUNDLE
// -------------------------
exports.remove = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id);

  if (!bundle) return res.status(404).json({ message: "Bundle not found" });

  if (req.user.role !== "admin") {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor || vendor._id.toString() !== bundle.vendor.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  await bundle.deleteOne();
  res.json({ message: "Bundle deleted" });
});
