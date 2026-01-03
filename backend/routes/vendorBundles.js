const express = require("express");
const router = express.Router();

const vendorController = require("../controllers/vendorController");
const vendorProtect = require("../middlewares/vendorProtect");  // FIXED

router.get("/", vendorProtect, vendorController.getVendorBundles);
router.post("/", vendorProtect, vendorController.createBundle);

router.get("/:id", vendorProtect, vendorController.getBundle);
router.put("/:id", vendorProtect, vendorController.updateBundle);

router.delete("/:id", vendorProtect, vendorController.deleteBundle);

module.exports = router;
