// const Vendor = require("../models/Vendor");
// const Product = require("../models/Product");

// /* ===================================================
//    ⭐ GET PUBLIC VENDOR STORE PAGE
//    GET /api/vendor-public/:id
// =================================================== */
// exports.getVendorPublic = async (req, res) => {
//   try {
//     const vendorId = req.params.id;

//     const vendor = await Vendor.findById(vendorId)
//       .select("-password -email")
//       .lean();

//     if (!vendor)
//       return res.status(404).json({ message: "Vendor not found" });

//     // Convert badges object → array for UI
//     vendor.badgesArray = [];
//     if (vendor.badges?.topRated) vendor.badgesArray.push("Top Rated");
//     if (vendor.badges?.fastShipping) vendor.badgesArray.push("Fast Shipping");
//     if (vendor.badges?.trusted) vendor.badgesArray.push("Trusted Seller");

//     // Convert description fields so UI doesn't break
//     vendor.avatar = vendor.logo || "/placeholder.jpg";
//     vendor.bio = vendor.description || "No description available.";

//     const products = await Product.find({ vendor: vendorId }).lean();

//     res.json({
//       vendor,
//       products,
//     });
//   } catch (err) {
//     console.log("Vendor public API error:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// /* ===================================================
//    ⭐ ADD REVIEW
//    POST /api/vendor-public/:id/review
// =================================================== */
// exports.addVendorReview = async (req, res) => {
//   try {
//     const vendorId = req.params.id;
//     const { rating, comment } = req.body;

//     const vendor = await Vendor.findById(vendorId);
//     if (!vendor) return res.status(404).json({ message: "Vendor not found" });

//     // Prevent duplicate reviews
//     const exists = vendor.reviews.find(r => String(r.user) === String(req.user._id));
//     if (exists)
//       return res.status(400).json({ message: "You already reviewed this vendor" });

//     vendor.reviews.push({
//       user: req.user._id,
//       rating,
//       comment,
//       createdAt: new Date(),
//     });

//     // Recalculate rating
//     const total = vendor.reviews.reduce((s, r) => s + r.rating, 0);
//     vendor.rating = (total / vendor.reviews.length).toFixed(1);

//     // Auto badges
//     vendor.badges.topRated = vendor.rating >= 4.5;
//     vendor.badges.trusted = vendor.reviews.length >= 20;

//     await vendor.save();

//     res.json({ message: "Review added successfully", vendor });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error adding review" });
//   }
// };
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");

/* =====================================================
    GET PUBLIC VENDOR STORE + PRODUCTS
    Route: GET /api/vendor-public/:id
===================================================== */
exports.getPublicVendorStore = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await Vendor.findById(vendorId)
      .select("-password -email") // Hide sensitive fields
      .lean();

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const products = await Product.find({ vendor: vendorId })
      .select("title price finalPrice images stock rating numReviews")
      .lean();

    res.json({ vendor, products });

  } catch (err) {
    console.log("Vendor public API error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllPublicVendors = async (req, res) => {
  try {
    let vendors = await Vendor.find()
      .select("_id shopName storeName logo rating specialty")
      .lean();

    for (let v of vendors){
      v.productsCount = await Product.countDocuments({ vendor: v._id });
    }

    res.json(vendors);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


/* =====================================================
    ADD REVIEW TO VENDOR
    Route: POST /api/vendor-public/:id/review
===================================================== */
/* =====================================================
    ADD REVIEW TO VENDOR
    Route: POST /api/vendor-public/:id/review
===================================================== */
exports.addVendorReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Basic validation
    if (!rating)
      return res.status(400).json({ message: "Rating is required" });

    const vendor = await Vendor.findById(req.params.id);

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    // Ensure arrays & objects exist
    vendor.reviews = vendor.reviews || [];
    vendor.badges = vendor.badges || { topRated: false, trusted: false };

    // Prevent duplicate review
    const already = vendor.reviews.find(
      r => String(r.user) === String(req.user._id)
    );

    if (already)
      return res.status(400).json({ message: "You already reviewed this vendor" });

    // Add new review
    vendor.reviews.push({
      user: req.user._id,
      rating: Number(rating),
      comment: comment || ""
    });

    // Recalculate rating safely
    const totalRatings = vendor.reviews.reduce((sum, r) => sum + r.rating, 0);
    vendor.rating = Number(totalRatings / vendor.reviews.length);

    // Update vendor badges dynamically
    vendor.badges.topRated = vendor.rating >= 4.5;
    vendor.badges.trusted = vendor.reviews.length >= 20;

    await vendor.save();

    res.json({
      message: "Review added",
      vendor: {
        _id: vendor._id,
        rating: vendor.rating,
        numReviews: vendor.reviews.length,
        badges: vendor.badges
      }
    });

  } catch (err) {
    console.log("Vendor Review Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
