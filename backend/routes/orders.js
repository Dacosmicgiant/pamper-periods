// const express = require("express");
// const router = express.Router();
// const { protect, authorize } = require("../middlewares/auth");
// const orderController = require("../controllers/orderController");


// // validate coupon
// router.post("/validate-coupon", protect, orderController.validateCoupon);

// // create order + payment intent
// router.post("/", protect, orderController.createOrder);

// // confirm order after payment
// router.post("/confirm", protect, orderController.confirmOrder);

// // user orders
// router.get("/my-orders", protect, orderController.getMyOrders);
// router.get("/:id", protect, orderController.getOrderById);

// // vendor orders
// router.get("/vendor/list", protect, authorize("vendor"), orderController.getVendorOrders);

// // admin: all orders + update
// router.get("/", protect, authorize("admin"), orderController.getAllOrders);
// router.put("/:id/status", protect, authorize("admin","vendor"), orderController.updateStatus);

// module.exports = router;
const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/auth");
const vendorProtect = require("../middlewares/vendorProtect");

const orderController = require("../controllers/orderController");


const jwt = require("jsonwebtoken");

// COMBINED AUTH
const vendorOrAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "vendor") {
      return vendorProtect(req, res, next);
    } else {
      // Assume admin/user
      return protect(req, res, () => authorize("admin")(req, res, next));
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// validate coupon
router.post("/validate-coupon", protect, orderController.validateCoupon);

// create order + payment intent
router.post("/", protect, orderController.createOrder);

// confirm order after payment
router.post("/confirm", protect, orderController.confirmOrder);

// user orders
router.get("/my-orders", protect, orderController.getMyOrders);


// vendor orders
router.get(
  "/vendor/list",
  vendorProtect,
  orderController.getVendorOrders
);

// admin: all orders
router.get(
  "/",
  protect,
  authorize("admin"),
  orderController.getAllOrders
);

router.get("/:id", protect, orderController.getOrderById);
// UPDATE STATUS (vendor or admin)
router.put(
  "/:id/status",
  vendorOrAdmin,
  orderController.updateStatus
);

module.exports = router;
