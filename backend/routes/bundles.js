const express = require("express");
const router = express.Router();
const bundleController = require("../controllers/bundleController");
const { protect, authorize } = require("../middlewares/auth");

// PUBLIC ROUTES
router.get("/", bundleController.list);
router.get("/:id", bundleController.get);

// VENDOR + ADMIN ROUTES
router.post(
  "/",
  protect,
  authorize("vendor", "admin"),
  bundleController.create
);

router.put(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  bundleController.update
);

router.delete(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  bundleController.remove
);

module.exports = router;
