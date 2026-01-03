const router = require("express").Router();
const User = require("../models/User");

// Wishlist must come FIRST
router.get("/:userId/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("wishlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:userId/wishlist", async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    console.error("Wishlist POST error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:userId/wishlist/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
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
