// models/FlashSale.js
const mongoose = require("mongoose");

const flashSaleSchema = new mongoose.Schema({
  title: { type: String },
  percentage: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
  expiresAt: { type: Date }, // optional
}, { timestamps: true });

module.exports = mongoose.model("FlashSale", flashSaleSchema);
