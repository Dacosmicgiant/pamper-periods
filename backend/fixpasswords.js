require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashed = await bcrypt.hash("123456", 10);

  await User.updateMany({}, { password: hashed });

  console.log("🔐 All user passwords updated to 123456");
  process.exit(0);
})();
