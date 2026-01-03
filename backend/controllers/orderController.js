const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Vendor = require("../models/Vendor");
const getRazorpay = require("../utils/razorpay");
const crypto = require("crypto");
const Product = require("../models/Product");
const sendWhatsApp = require("../utils/sendWhatsApp");

// validate coupon (existing)
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, total } = req.body;
  const coupon = await Coupon.findOne({ code });
  if (!coupon) return res.status(400).json({ message: "Invalid coupon" });
  if (coupon.expiresAt < new Date()) return res.status(400).json({ message: "Coupon expired" });
  if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: "Coupon usage exceeded" });
  if (total < coupon.minAmount) return res.status(400).json({ message: "Minimum amount not met" });

  let discountAmount = 0;
  if (coupon.discountType === "percentage") discountAmount = (total * coupon.discountValue) / 100;
  else discountAmount = coupon.discountValue;

  res.json({ discountAmount, finalAmount: total - discountAmount });
});

// create order + razorpay order
exports.createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, couponCode } = req.body;

  if (!items || !items.length)
    return res.status(400).json({ message: "No items to checkout" });

  // 1. Attach vendor, title, and most importantly, SERVER-SIDE PRICE to each item
  // This ensures price integrity and security.
  const itemsWithVendors = await Promise.all(
    items.map(async (it, index) => {
      if (!it.product) {
        throw new Error(`Product ID missing for item at index ${index}.`);
      }

      // Fetch product details including price from the database
      const product = await Product.findById(it.product).select("vendor title price");

      if (!product) {
        throw new Error("Product not found with ID: " + it.product);
      }

      // Use server-side price (product.price) for calculation
      return {
        product: product._id, // Ensure we store the correct ID
        qty: it.qty || 1,
        price: product.price, // ✅ SECURITY FIX: Use price from DB
        vendor: product.vendor,
        title: product.title,
      };
    })
  );

  // 2. Compute total server-side
  let total = 0;
  for (const it of itemsWithVendors) {
    total += Number(it.price) * Number(it.qty);
  }

  let discountAmount = 0;
  let appliedCoupon = null;
  let coupon; // Declare coupon outside if block

  if (couponCode) {
    // Check coupon status (excluding usedCount check, which is handled atomically)
    coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) return res.status(400).json({ message: "Invalid coupon" });
    if (coupon.expiresAt < new Date())
      return res.status(400).json({ message: "Coupon expired" });
    if (total < coupon.minAmount)
      return res.status(400).json({ message: "Minimum amount not met" });

    // ✅ CONCURRENCY FIX: Atomically check and increment usage count
    const updatedCoupon = await Coupon.findOneAndUpdate(
      {
        code: couponCode,
        usedCount: { $lt: coupon.usageLimit }
      },
      {
        $inc: { usedCount: 1 }
      },
      {
        new: true
      }
    );

    if (!updatedCoupon) {
      return res.status(400).json({ message: "Coupon usage exceeded" });
    }

    // Use the original coupon object's values for calculation
    discountAmount =
      coupon.discountType === "percentage"
        ? (total * coupon.discountValue) / 100
        : coupon.discountValue;

    appliedCoupon = coupon.code;
  }

  const finalAmount = Math.max(total - discountAmount, 1);

  const rp = getRazorpay();
  const rpOrder = await rp.orders.create({
    amount: Math.round(finalAmount * 100),
    currency: "INR",
    payment_capture: 1,
  });


  // SAVE order
  const order = await Order.create({
    user: req.user._id,
    items: itemsWithVendors,
    total: finalAmount,
    originalTotal: total,
    discount: discountAmount,
    couponCode: appliedCoupon,
    shippingAddress,
    status: "pending",
    paymentIntentId: rpOrder.id,
  });

  res.json({
    razorpayOrderId: rpOrder.id,
    keyId: process.env.RAZORPAY_KEY_ID,
    orderId: order._id,
    finalAmount,
  });
});


// confirm order after payment succeeded (razorpay signature verify)
exports.confirmOrder = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findOne({ paymentIntentId: razorpay_order_id });
  if (!order) return res.status(404).json({ message: "Order not found" });

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  order.status = "processing";
  await order.save();

  /* ------------------------------
     SEND WHATSAPP TO VENDORS
  --------------------------------*/
  try {
    const vendorItemsMap = {};

    for (const it of order.items) {
      if (!vendorItemsMap[it.vendor]) vendorItemsMap[it.vendor] = [];
      vendorItemsMap[it.vendor].push(it);
    }

    for (const vendorId of Object.keys(vendorItemsMap)) {
      const vendor = await Vendor.findById(vendorId);

      if (!vendor || !vendor.whatsappEnabled) continue;
      if (!vendor.whatsappNumber || !vendor.ultraInstance || !vendor.ultraToken) continue;

      const itemsText = vendorItemsMap[vendorId]
        .map(
          (i) => `• ${i.title} (Qty: ${i.qty}) – ₹${i.price * i.qty}`
        )
        .join("\n");

      const msg = `
🔥 NEW ORDER RECEIVED!

🛒 Order ID: ${order._id}
📦 Items:
${itemsText}

💰 Total: ₹${order.total}

👤 Customer: ${order.shippingAddress.name}
📞 Phone: ${order.shippingAddress.phone}

📍 Address:
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

🕒 Time: ${new Date().toLocaleString()}

— Pamper Periods
`;

      await sendWhatsApp(
        vendor.whatsappNumber,
        msg,
        vendor.ultraInstance,
        vendor.ultraToken
      );
    }
  } catch (err) {
    console.log("WhatsApp error:", err.message);
  }


  res.json({ message: "Order confirmed", order });
});



// get current user's orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.json(orders);
});


// get single order by id (accessible to owner, vendor if includes their items, or admin)
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ message: "Order not found" });

  // owner
  if (String(order.user) === String(req.user._id) || req.user.role === "admin") {
    return res.json(order);
  }

  // vendor: check if any item belongs to vendor
  if (req.user.role === "vendor") {
    const vendor = req.vendor || await Vendor.findOne({ user: req.user._id }); // ✅ FIX: Use req.vendor if available
    if (!vendor) return res.status(403).json({ message: "Forbidden" });
    const has = order.items.some(i => String(i.vendor) === String(vendor._id));
    if (!has) return res.status(403).json({ message: "Forbidden" });
    return res.json(order);
  }

  return res.status(403).json({ message: "Forbidden" });
});

// admin: get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }).lean();
  res.json(orders);
});

// vendor: get all orders that include items belonging to this vendor
exports.getVendorOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== "vendor") return res.status(403).json({ message: "Forbidden" });
  const vendor = req.vendor || await Vendor.findOne({ user: req.user._id });
  if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });

  // find orders where any items.vendor == vendor._id
  const orders = await Order.find({ "items.vendor": vendor._id }).populate("user", "name email").sort({ createdAt: -1 }).lean();
  res.json(orders);
});

// update status (admin or vendor)
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (req.user.role === "vendor") {
    const vendor = req.vendor || await Vendor.findOne({ user: req.user._id }); // ✅ FIX: Lookup Vendor by user ID
    if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });

    const vendorItems = order.items || []; // ✅ FIX: Use order.items directly

    const has = vendorItems.some(
      (i) => String(i.vendor) === String(vendor._id)
    );

    if (!has) return res.status(403).json({ message: "Forbidden" });
  }

  order.status = status;
  await order.save();
  return res.json(order);
});
