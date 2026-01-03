const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

/* ============================================================
   LIST PRODUCTS (auto-apply flash sale)
   ============================================================ */
exports.list = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    priceMin,
    priceMax,
    sort,
    page = 1,
    limit = 9999, // Default limit remains 12 for public pages
    vendor,
    pincode,
  } = req.query;

  const filter = { isActive: true };

  if (q) filter.title = { $regex: q, $options: "i" };
  if (category) {
    if (mongoose.isValidObjectId(category)) {
      filter.categories = category;
    } else {
      const catDoc = await Category.findOne({ name: category });
      if (catDoc) {
        filter.categories = catDoc._id;
      } else {
        filter.categories = new mongoose.Types.ObjectId();
      }
    }
  }
  if (priceMin) filter.price = { ...filter.price, $gte: Number(priceMin) };
  if (priceMax) filter.price = { ...filter.price, $lte: Number(priceMax) };
  if (vendor) filter.vendor = vendor;

  // ⭐ PINCODE FILTER (Unchanged, looks good)
  if (pincode) {
    // Assuming Vendor model is imported and available
    const vendorList = await Vendor.find({ "address.pincode": pincode }, "_id");

    if (vendorList.length === 0) {
      return res.json({
        total: 0,
        page: Number(page),
        pages: 1,
        items: [],
      });
    }

    filter.vendor = { $in: vendorList.map((v) => v._id) };
  }

  let query = Product.find(filter).populate("vendor", "shopName avatar address").populate("categories", "name");

  // Sorting
  if (sort === "price_asc") query = query.sort({ finalPrice: 1 });
  if (sort === "price_desc") query = query.sort({ finalPrice: -1 });
  if (sort === "newest") query = query.sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  // 💥 NEW LOGIC: Dynamic Pagination Control
  let pageSize = Number(limit);
  let skip = (page - 1) * pageSize;

  // Option 1: If limit is set to a very high number (e.g., 9999), set pageSize to total.
  if (pageSize >= 9999) {
    pageSize = total;
    skip = 0; // If fetching all, start from the beginning
  }
  // Option 2: If you prefer to send limit=0 from the client for 'all'
  /* if (pageSize === 0) {
    pageSize = total;
    skip = 0; 
  }
  */

  let items = await query.skip(skip).limit(pageSize);

  // Apply flash sale (Unchanged)
  if (req.flashSale?.active && req.flashSale.percentage > 0) {
    const flash = req.flashSale.percentage;

    items = items.map((p) => {
      // Create a plain object copy if Mongoose objects are read-only
      const productObj = p.toObject ? p.toObject() : p;

      const base = productObj.price;
      const vendorDiscount = (base * productObj.discount) / 100;
      const flashDiscount = (base * flash) / 100;

      productObj.finalPrice = Math.round(base - vendorDiscount - flashDiscount);
      productObj.flashDiscount = flash;

      return productObj;
    });
  }

  res.json({
    total,
    page: Number(page),
    // Correctly handle pages if we fetched all items (limit=9999)
    pages: pageSize === total ? 1 : Math.ceil(total / pageSize),
    items,
  });
});

/* ============================================================
   GET SINGLE PRODUCT
   ============================================================ */
exports.get = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id)
    .populate("vendor", "shopName avatar")
    .populate("reviews.user", "name avatar");

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.flashSale?.active && req.flashSale.percentage > 0) {
    const flash = req.flashSale.percentage;
    const base = product.price;
    const vendorDiscount = (base * product.discount) / 100;
    const flashDiscount = (base * flash) / 100;

    product.finalPrice = Math.round(base - vendorDiscount - flashDiscount);
    product.flashDiscount = flash;
  }

  res.json(product);
});

/* ============================================================
   CREATE PRODUCT
   ============================================================ */
exports.create = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  const { title, description, price, discount, categories, stock, images = [] } =
    req.body;

  if (!title || !price)
    return res.status(400).json({ message: "Title & Price required" });

  const product = await Product.create({
    vendor: vendor ? vendor._id : req.body.vendor,
    title,
    description,
    price,
    discount,
    categories,
    stock,
    images,
  });

  res.status(201).json(product);
});

/* ============================================================
   UPDATE PRODUCT
   ============================================================ */
exports.update = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.user.role !== "admin") {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor || vendor._id.toString() !== product.vendor.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  Object.assign(product, req.body);
  await product.save();

  res.json(product);
});

/* ============================================================
   DELETE PRODUCT
   ============================================================ */
exports.remove = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.user.role !== "admin") {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor || vendor._id.toString() !== product.vendor.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  await product.deleteOne();
  res.json({ message: "Deleted" });
});

/* ============================================================
   ADD REVIEW
   ============================================================ */
exports.addReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const already = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (already) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });

    await product.save();

    res.json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/* ============================================================
   FEATURED PRODUCTS
   ============================================================ */
exports.getFeaturedProducts = async (req, res) => {
  try {
    // ⭐ Use isFeatured (correct field)
    let featured = await Product.find({ isFeatured: true })
      .select("title images finalPrice price rating")
      .limit(6);

    if (!featured || featured.length === 0) {
      featured = await Product.aggregate([
        { $sample: { size: 12 } },
        {
          $project: {
            title: 1,
            images: 1,
            finalPrice: 1,
            price: 1,
            rating: 1,
          },
        },
      ]);
    }

    res.json(featured);
  } catch (err) {
    console.log("Featured products fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFeaturedStatus = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isFeatured: req.body.featured }, // ⭐ also fix here
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating featured status", error });
  }
};
