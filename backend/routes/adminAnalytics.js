const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const analytics = require("../controllers/adminAnalyticsController");

router.get("/", protect, authorize("admin"), analytics.getStats);

module.exports = router;
