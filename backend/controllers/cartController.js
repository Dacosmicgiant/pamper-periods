const User = require("../models/User");
const asyncHandler = require("express-async-handler");
// GET user cart
// GET user cart
exports.getCart = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ message: "Please login" });

    const user = await User.findById(req.user._id);

    return res.json({ cart: user.cart || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get cart" });
  }
};

// SAVE / REPLACE user cart
exports.saveCart = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!req.user?._id)
      return res.status(401).json({ message: "Please login" });

    await User.findByIdAndUpdate(req.user._id, {
      cart: cart || [],
    });

    res.json({ message: "Cart saved", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save cart" });
  }
};

// CLEAR cart
exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, { cart: [] });

  res.json({ message: "Cart cleared" });
});
