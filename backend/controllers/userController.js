const User = require("../models/User");
const Order = require("../models/Order");

// GET PROFILE
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const { name, avatar } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true }
  ).select("-password");

  res.json(updated);
};

// GET ADDRESSES
exports.getAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.addresses);
};

// ADD ADDRESS
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push(req.body);
    await user.save();

    res.json(user.addresses);

  } catch (err) {
    console.log("ADD ADDRESS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE ADDRESS
exports.updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address)
    return res.status(404).json({ message: "Address not found" });

  Object.assign(address, req.body);
  await user.save();
  res.json(user.addresses);
};

// DELETE ADDRESS
exports.deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses = user.addresses.filter(
    a => a._id.toString() !== req.params.addressId
  );

  await user.save();
  res.json(user.addresses);
};

// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// GET ORDER DETAIL
exports.getOrderDetail = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user._id
  });

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  res.json(order);
};
