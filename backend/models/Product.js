// models/Product.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const productSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },

  title: { type: String, required: true },
  description: String,

  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // vendor discount
  
  isFeatured: { type: Boolean, default: false },

  flashDiscount: { type: Number, default: 0 }, // ⬅ applied automatically
  finalPrice: { type: Number, default: 0 },

  images: [String],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],

  stock: { type: Number, default: 0 },

  reviews: [reviewSchema],
  numReviews: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto compute final price
productSchema.pre("save", function () {
  const base = this.price;

  const vendorDiscount = (base * this.discount) / 100;
  const flash = (base * this.flashDiscount) / 100;

  const off = vendorDiscount + flash;

  this.finalPrice = Math.round(base - off);
});

module.exports = mongoose.model("Product", productSchema);
