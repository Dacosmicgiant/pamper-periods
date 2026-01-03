const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get latest 10 reviews globally
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(
      { "reviews.0": { $exists: true } },
      { reviews: 1 }
    );

    // extract all reviews
    let allReviews = [];
    products.forEach(p => {
      p.reviews.forEach(r => {
        allReviews.push({
          ...r._doc,
          productId: p._id
        });
      });
    });

    // sort by latest
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allReviews.slice(0, 10));
  } catch (err) {
    res.status(500).json({ message: "Failed to load reviews" });
  }
});

module.exports = router;
