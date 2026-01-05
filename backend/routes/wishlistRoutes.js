const router = require("express").Router();
const User = require("../models/User");
const { protect } = require("../middlewares/auth");

// Wishlist must come FIRST
// Wishlist must come FIRST
router.get("/wishlist", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/wishlist", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    // Use $addToSet to prevent duplicates automatically
    // Use req.user._id from token instead of insecure URL param
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: productId },
    });

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    console.error("Wishlist POST error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/wishlist/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    );

    res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Any dynamic routes LIKE THESE must come AFTER wishlist
router.get("/:id", async (req, res) => {
  // user profile etc...
});

module.exports = router;
