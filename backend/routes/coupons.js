const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const couponController = require("../controllers/couponController");

router.get("/", protect, authorize("admin"), couponController.list);
router.post("/", protect, authorize("admin"), couponController.create);
router.put("/:id", protect, authorize("admin"), couponController.update);
router.delete("/:id", protect, authorize("admin"), couponController.remove);

module.exports = router;
