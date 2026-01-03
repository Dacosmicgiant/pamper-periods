const Discount = require("../models/Discount");

// CREATE DISCOUNT
exports.createDiscount = async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.json(discount);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating discount" });
  }
};

// GET ALL DISCOUNTS
exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find()
      .populate("applicableCategories", "name");

    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: "Error loading discounts" });
  }
};

// UPDATE DISCOUNT
exports.updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: "Error updating discount" });
  }
};

// DELETE DISCOUNT
exports.deleteDiscount = async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: "Discount deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting discount" });
  }
};
