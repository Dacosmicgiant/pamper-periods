const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const ctrl = require("../controllers/flashSaleController");

router.get("/", ctrl.getSale);
router.post("/", protect, authorize("admin"), ctrl.updateSale);

module.exports = router;
