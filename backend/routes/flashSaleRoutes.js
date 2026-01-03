const express = require("express");
const router = express.Router();
const flashSaleController = require("../controllers/flashSaleController");
const { protect, authorize } = require("../middlewares/auth");

// public - get current flash sale
router.get("/", flashSaleController.getSale);

// admin only - update flash sale
router.put("/", protect, authorize("admin"), flashSaleController.updateSale);

module.exports = router;
