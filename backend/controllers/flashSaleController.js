const FlashSale = require("../models/FlashSale");
const asyncHandler = require("express-async-handler");

exports.getSale = asyncHandler(async (req, res) => {
  const sale = await FlashSale.findOne().sort({ createdAt: -1 }) || {};
  res.json(sale);
});

exports.updateSale = asyncHandler(async (req, res) => {
  const body = req.body;

  const sale = await FlashSale.findOneAndUpdate(
    {},
    {
      title: body.title,
      percentage: body.percentage,
      active: body.active,
      expiresAt: body.expiresAt || null
    },
    { new: true, upsert: true }
  );

  res.json({ message: "Flash sale updated", sale });
});
