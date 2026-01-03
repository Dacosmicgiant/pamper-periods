import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  shopName: String,
  email: String,
  password: String,
  avatar: String,
  role: { type: String, default: "vendor" },
});

export default mongoose.model("Vendor", vendorSchema);
