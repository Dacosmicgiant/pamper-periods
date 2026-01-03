const mongoose = require("mongoose");

const vendorReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const vendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false},

  shopName: { type: String, required: true },

  email: String,
  password: String,

  logo: String,
  banner: String,
  description: String,
  about: String,

  contactEmail: String,
  contactPhone: String,
  website: String,

  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
ultraInstance: String,
ultraToken: String,
whatsappEnabled: { type: Boolean, default: false },
whatsappNumber: String,




  isApproved: { type: Boolean, default: false },

  reviews: [vendorReviewSchema],

  rating: { type: Number, default: 0 },

  badges: {
    topRated: { type: Boolean, default: false },
    fastShipping: { type: Boolean, default: false },
    trusted: { type: Boolean, default: false },
  },

}, { timestamps: true });


module.exports = mongoose.model("Vendor", vendorSchema);
