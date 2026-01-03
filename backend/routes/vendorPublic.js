// const express = require("express");
// const router = express.Router();

// const {
//   getPublicVendorStore,
//   addVendorReview
// } = require("../controllers/vendorPublicController");  // <-- Make sure this path & filename is correct

// const vendorProtect = require("../middlewares/vendorProtect");

// // PUBLIC STORE
// router.get("/:id", getPublicVendorStore);

// // ADD REVIEW (must be logged in)
// router.post("/:id/review", vendorProtect, addVendorReview);

// module.exports = router;
const express = require("express");
const router = express.Router();


const {
  getAllPublicVendors,
  getPublicVendorStore,
  addVendorReview
} = require("../controllers/vendorPublicController");

const { protect } = require("../middlewares/auth");

// ⭐ GET ALL PUBLIC VENDORS
router.get("/", getAllPublicVendors);

// ⭐ GET INDIVIDUAL VENDOR PUBLIC PAGE
router.get("/:id", getPublicVendorStore);

// ⭐ ADD REVIEW (customer login required)
router.post("/:id/review", protect, addVendorReview);

module.exports = router;
