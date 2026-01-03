// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
// const Vendor = require("../models/Vendor");

// module.exports = asyncHandler(async (req, res, next) => {
//   let token;

//   // Check Authorization header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }

//   try {
//     // Decode token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Token must belong to vendor
//     if (decoded.role !== "vendor") {
//       return res.status(403).json({ message: "Forbidden: Not a vendor" });
//     }

//     // Fetch the vendor document
//     const vendor = await Vendor.findById(decoded.id).select("-password");

//     if (!vendor) {
//       return res.status(404).json({ message: "Vendor not found" });
//     }

//     // The REAL fix ✔
//     // Vendor has "user" field → that's the customer account behind the vendor
//     req.user = { _id: vendor.user };  // used in order queries, etc.

//     // We also attach vendor object itself (for vendorId)
//     req.vendor = vendor;

//     next();
//   } catch (err) {
//     console.log("Vendor protect error:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// });
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Vendor = require("../models/Vendor");

module.exports = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "vendor") {
      return res.status(403).json({ message: "Forbidden: Not a vendor" });
    }

    const vendor = await Vendor.findById(decoded.id).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    req.vendor = vendor;

    // FIX: provide correct req.user for role checks
    req.user = { 
      _id: vendor._id,
      role: "vendor"
    };

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid token" });
  }
});
