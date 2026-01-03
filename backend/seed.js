require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    const adminEmail = "vedantvanpro@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin account with email ${adminEmail} already exists.`);
    } else {
      const admin = new User({
        name: "admin_cosmic",
        email: adminEmail,
        password: "12345678", // Will be hashed by pre-save hook
        role: "admin",
      });

      await admin.save();
      console.log("-----------------------------------------");
      console.log("✅ Admin user seeded successfully!");
      console.log(`Email: ${adminEmail}`);
      console.log("Password: 123456");
      console.log("-----------------------------------------");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
