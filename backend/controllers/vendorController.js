const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Bundle = require("../models/Bundle");
const Review = require("../models/Review");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Category = require("../models/Category");


// ------------------------------------
// JWT TOKEN GENERATOR
// ------------------------------------
const generateToken = (id) =>
  jwt.sign({ id, role: "vendor" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

/* ============================================================
   VENDOR AUTH — REGISTER / LOGIN
============================================================= */

// REGISTER VENDOR
exports.registerVendor = async (req, res) => {
  try {
    const { shopName, email, password } = req.body;

    if (!shopName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await Vendor.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPass = await bcrypt.hash(password, 10);

    const vendor = await Vendor.create({
      shopName,
      email,
      password: hashedPass,
      role: "vendor",
      status: "pending",
    });

    res.json({
      message: "Vendor Registered Successfully. Awaiting approval.",
      vendor: {
        _id: vendor._id,
        shopName: vendor.shopName,
        email: vendor.email,
        status: vendor.status,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN VENDOR
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor)
      return res.status(400).json({ message: "Vendor not found" });

    // 🔥 FIX — use isApproved instead of status
    if (!vendor.isApproved) {
      return res.status(403).json({
        message: "Your vendor account is not approved yet.",
        approved: vendor.isApproved,
      });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    res.json({
      message: "Login Successful",
      vendor: {
        _id: vendor._id,
        shopName: vendor.shopName,
        email: vendor.email,
        isApproved: vendor.isApproved,
      },
      token: generateToken(vendor._id),
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   VENDOR PROFILE (Protected)
============================================================= */
// GET VENDOR PROFILE
exports.getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user._id).select("-password");

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  res.json(vendor);
});



// UPDATE PROFILE
exports.updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user._id);

  if (!vendor)
    return res.status(404).json({ message: "Vendor not found" });

  const {
    shopName,
    description,
    contactEmail,
    contactPhone,
    website,
    logo,
    banner,
    address,
  } = req.body;

  vendor.shopName = shopName ?? vendor.shopName;
  vendor.description = description ?? vendor.description;

  vendor.contactEmail = contactEmail ?? vendor.contactEmail;
  vendor.contactPhone = contactPhone ?? vendor.contactPhone;
  vendor.website = website ?? vendor.website;

  vendor.logo = logo ?? vendor.logo;
  vendor.banner = banner ?? vendor.banner;

  if (address) {
    vendor.address.street = address.street ?? vendor.address.street;
    vendor.address.city = address.city ?? vendor.address.city;
    vendor.address.state = address.state ?? vendor.address.state;
    vendor.address.pincode = address.pincode ?? vendor.address.pincode;
  }

  await vendor.save();

  res.json({ message: "Profile updated", vendor });
});

/* ============================================================
   DASHBOARD DATA (Protected)
============================================================= */

// GET DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user._id;

    // total products
    const totalProducts = await Product.countDocuments({ vendor: vendorId });

    // only orders containing this vendor
    const orders = await Order.find({
      "items.vendor": vendorId
    });

    // vendor revenue
    const totalRevenue = orders.reduce((sum, o) => {
      // sum only vendor's items
      const vendorItems = o.items.filter(i =>
        i.vendor.toString() === vendorId.toString()
      );
      const vendorTotal = vendorItems.reduce(
        (s, i) => s + i.qty * i.price,
        0
      );
      return sum + vendorTotal;
    }, 0);

    res.json({
      totalProducts,
      totalOrders: orders.length,
      totalRevenue,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ANALYTICS
// exports.getVendorAnalytics = async (req, res) => {
//   try {
//     const vendorId = req.user._id;

//     const last30Orders = await Order.find({
//       "items.vendor": vendorId,
//       createdAt: { $gte: new Date(Date.now() - 30 * 86400000) },
//     });

//     const graph = {};
//     last30Orders.forEach((order) => {
//       const day = order.createdAt.toISOString().split("T")[0];
//       graph[day] = (graph[day] || 0) + order.totalAmount;
//     });

//     res.json(graph);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// GET VENDOR ORDERS
exports.getVendorOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== "vendor") return res.status(403).json({ message: "Forbidden" });

  const vendor = await Vendor.findById(req.user._id);
  if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });

  const orders = await Order.find({ "items.vendor": vendor._id })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const transformed = orders.map(order => {
    const vendorItems = order.items.filter(i => String(i.vendor) === String(vendor._id));

    const vendorTotal = vendorItems.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );

    return {
      ...order,
      vendorItems,
      vendorTotal,
    };
  });

  res.json(transformed);
});






/* ============================================================
   PRODUCT MANAGEMENT (Protected)
============================================================= */

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;

    let { categories } = req.body;

    // Convert category strings to ObjectIds
    if (categories && Array.isArray(categories)) {
      categories = await Promise.all(
        categories.map(async (cat) => {
          // if it's already an ObjectId → return
          if (mongoose.isValidObjectId(cat)) return cat;

          // if it's a string → find category by name
          const found = await Category.findOne({ name: cat.trim() });

          // if found → return its ObjectId
          if (found) return found._id;

          // else → create new category
          const newCat = await Category.create({ name: cat.trim() });
          return newCat._id;
        })
      );
    }

    const product = await Product.create({
      ...req.body,
      categories,   // <- now all ObjectIds
      vendor: vendorId,
    });

    res.json({ message: "Product added successfully", product });

  } catch (err) {
    console.log("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const productId = req.params.id;

    // Verify product belongs to this vendor
    const exists = await Product.findOne({ _id: productId, vendor: vendorId });

    if (!exists) {
      return res.status(403).json({
        message: "Unauthorized or product not found",
      });
    }

    let { categories } = req.body;

    // Convert category names → ObjectIds (same as addProduct)
    if (categories && Array.isArray(categories)) {
      categories = await Promise.all(
        categories.map(async (cat) => {
          if (mongoose.isValidObjectId(cat)) return cat;

          const found = await Category.findOne({ name: cat.trim() });
          if (found) return found._id;

          const newCat = await Category.create({ name: cat.trim() });
          return newCat._id;
        })
      );

      req.body.categories = categories;
    }

    const updated = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Product updated", updated });

  } catch (err) {
    console.log("🔥 UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const productId = req.params.id;

    const exists = await Product.findOne({
      _id: productId,
      vendor: vendorId,
    });

    if (!exists)
      return res.status(403).json({
        message: "Unauthorized or product not found",
      });

    await Product.findByIdAndDelete(productId);

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// GET ALL PRODUCTS OF LOGGED-IN VENDOR
exports.getVendorProducts = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;

  const products = await Product.find({ vendor: vendorId }).sort({ createdAt: -1 });

  res.json(products);
});
/* ============================================================
   PUBLIC APIs ― For Home Page and Store Pages
============================================================= */

// ⭐ LIST ALL APPROVED VENDORS
// GET /api/vendor-public/
exports.getPublicVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: "approved" })
      .select("shopName logo banner description");

    res.json(vendors);
  } catch (err) {
    console.log("Vendor list error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    vendor: req.user._id
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});


// ⭐ GET INDIVIDUAL VENDOR STORE PAGE
// GET /api/vendor-public/:id
exports.getPublicVendorStore = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await Vendor.findById(vendorId)
      .select("-password -email")
      .lean();

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    const products = await Product.find({ vendor: vendorId }).lean();

    res.json({ vendor, products });
  } catch (err) {
    console.log("Vendor public API error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



// GET vendor bundles
exports.getVendorBundles = async (req, res) => {
  try {
    const bundles = await Bundle.find({ vendor: req.vendor._id });
    res.json(bundles);
  } catch (err) {
    res.status(500).json({ message: "Failed fetching bundles" });
  }
};

// CREATE bundle
exports.createBundle = async (req, res) => {
  const data = req.body;

  if (data.oldPrice && data.price) {
    const diff = data.oldPrice - data.price;
    data.discountPercent = Math.round((diff / data.oldPrice) * 100);
  }

  const bundle = await Bundle.create({
    vendor: req.vendor._id,
    ...data,
  });

  res.json(bundle);
};


// GET single bundle (for edit)
exports.getBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findOne({
      _id: req.params.id,
      vendor: req.vendor._id,
    });

    if (!bundle)
      return res.status(404).json({ message: "Bundle not found" });

    res.json(bundle);
  } catch (err) {
    res.status(500).json({ message: "Failed fetching bundle" });
  }
};

// UPDATE bundle
exports.updateBundle = async (req, res) => {
  let data = req.body;

  if (data.oldPrice && data.price) {
    const diff = data.oldPrice - data.price;
    data.discountPercent = Math.round((diff / data.oldPrice) * 100);
  }

  const bundle = await Bundle.findOneAndUpdate(
    { _id: req.params.id, vendor: req.vendor._id },
    data,
    { new: true }
  );

  res.json(bundle);
};


// DELETE bundle
exports.deleteBundle = async (req, res) => {
  try {
    await Bundle.findOneAndDelete({
      _id: req.params.id,
      vendor: req.vendor._id,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed deleting bundle" });
  }
};

exports.getVendorReviews = asyncHandler(async (req, res) => {
  try {
    const vendorId = req.user._id;

    // Find reviews where the product belongs to this vendor
    const reviews = await Review.find()
      .populate({
        path: "product",
        select: "title images vendor",
        populate: { path: "vendor", select: "shopName" }
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Filter reviews to only those whose product.vendor equals vendorId
    const vendorReviews = reviews.filter(r => r.product && r.product.vendor && r.product.vendor.toString() === vendorId.toString());

    res.json(vendorReviews);
  } catch (err) {
    console.error("Vendor review error:", err);
    res.status(500).json({ message: "Failed to load reviews" });
  }
});

/**
 * Get rating stats (avg rating + total reviews) per product for vendor
 */
exports.getVendorRatingStats = asyncHandler(async (req, res) => {
  try {
    const vendorId = req.user._id;

    // Aggregate reviews joined to products and group by product
    const stats = await Review.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData"
        }
      },
      { $unwind: "$productData" },
      { $match: { "productData.vendor": vendorId } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    // Populate product details (title/images)
    const populated = await Product.populate(stats, {
      path: "_id",
      select: "title images"
    });

    // reformat for frontend convenience: item._id -> product object
    const out = populated.map(item => ({
      _id: item._id,
      avgRating: item.avgRating,
      totalReviews: item.totalReviews
    }));

    res.json(out);
  } catch (err) {
    console.error("Rating stats error:", err);
    res.status(500).json({ message: "Failed to load rating stats" });
  }
});

/**
 * Delete review (vendor-only) — can only delete reviews for vendor's products
 */
exports.deleteReview = asyncHandler(async (req, res) => {
  try {
    const vendorId = req.user._id;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId).populate("product", "vendor");
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (!review.product || review.product.vendor.toString() !== vendorId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

/**
 * Add vendor reply to a review
 */
exports.addReplyToReview = asyncHandler(async (req, res) => {
  try {
    const vendorId = req.user._id;
    const reviewId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) return res.status(400).json({ message: "Reply text required" });

    const review = await Review.findById(reviewId).populate("product", "vendor");
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (!review.product || review.product.vendor.toString() !== vendorId.toString()) {
      return res.status(403).json({ message: "Not authorized to reply to this review" });
    }

    review.reply = { text: text.trim(), date: new Date() };
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    console.error("Add reply error:", err);
    res.status(500).json({ message: "Failed to add reply" });
  }
});

/**
 * Edit vendor reply
 */
exports.editReply = asyncHandler(async (req, res) => {
  try {
    const vendorId = req.user._id;
    const reviewId = req.params.id;
    const { text } = req.body;

    const review = await Review.findById(reviewId).populate("product", "vendor");
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (!review.product || review.product.vendor.toString() !== vendorId.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this reply" });
    }

    review.reply = { text: text?.trim() || "", date: new Date() };
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    console.error("Edit reply error:", err);
    res.status(500).json({ message: "Failed to edit reply" });
  }
});

/**
 * Delete vendor reply
 */
exports.deleteReply = asyncHandler(async (req, res) => {
  try {
    const vendorId = req.user._id;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId).populate("product", "vendor");
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (!review.product || review.product.vendor.toString() !== vendorId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this reply" });
    }

    review.reply = undefined;
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    console.error("Delete reply error:", err);
    res.status(500).json({ message: "Failed to delete reply" });
  }
});

// UPDATE WHATSAPP SETTINGS
// UPDATE WHATSAPP SETTINGS
exports.updateWhatsAppSettings = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user._id);

  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.whatsappEnabled = req.body.whatsappEnabled;
  vendor.whatsappNumber = req.body.whatsappNumber;
  vendor.ultraInstance = req.body.ultraInstance; // UltraMsg instance ID
  vendor.ultraToken = req.body.ultraToken;       // UltraMsg token

  await vendor.save();

  res.json({ message: "WhatsApp settings updated successfully!", vendor });
});


