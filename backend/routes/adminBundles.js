const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const bundleController = require("../controllers/bundleController");

router.use(protect, authorize("admin"));

router.get("/", bundleController.list);
router.get("/:id", bundleController.get);
router.put("/:id", bundleController.update);
router.delete("/:id", bundleController.remove);

module.exports = router;
