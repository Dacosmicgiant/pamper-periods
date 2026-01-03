const mongoose = require("mongoose");

const bundleItemSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
});

const bundleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true }, // final price after discount
    oldPrice: { type: Number }, // original price
    discountPercent: { type: Number, default: 0 }, // auto-calculated
    stock: { type: Number, default: 10 },

    description: String,
    images: [String],

    items: [bundleItemSchema],

    variants: [
      {
        name: String,
        options: [String],
      },
    ],

    colors: [String],

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bundleSchema.pre("save", function () {
  if (this.oldPrice && this.price) {
    const diff = this.oldPrice - this.price;
    this.discountPercent = Math.round((diff / this.oldPrice) * 100);
  }
});

module.exports = mongoose.model("Bundle", bundleSchema);
