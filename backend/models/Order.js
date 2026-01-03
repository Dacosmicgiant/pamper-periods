const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  orderNumber: {
    type: String,
    unique: true,   // unique index in DB
  },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: Number,
      price: Number,
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
      title: String,
    }
  ],

  subtotal: Number,
  discount: Number,
  total: Number,
  couponCode: String,

  shippingAddress: {
    name: String,
    address: String,
    phone: String,
  },

  paymentIntentId: String,

  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "shipped", "delivered", "cancelled","completed","refunded"]
  }

}, { timestamps: true });


// ===========================================
// AUTO-GENERATE ORDER NUMBER BEFORE SAVE
// ===========================================
orderSchema.pre("save", async function () {
  if (this.orderNumber) return ;

  // Format: ORD-YYYYMMDD-RANDOM6DIGIT
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  const random = Math.floor(100000 + Math.random() * 900000);

  this.orderNumber = `ORD-${y}${m}${d}-${random}`;

  
});

module.exports = mongoose.model("Order", orderSchema);
