const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/auth");

router.get("/", categoryController.list);

router.post("/", protect, authorize("admin"), categoryController.create);

router.put("/:id", protect, authorize("admin"), categoryController.update);

router.delete("/:id", protect, authorize("admin"), categoryController.remove);

module.exports = router;
