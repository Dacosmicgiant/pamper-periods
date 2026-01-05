const express = require("express");
const router = express.Router();
const sendWhatsApp = require("../utils/sendWhatsApp");
const vendorProtect = require("../middlewares/vendorProtect");
const Vendor = require("../models/Vendor");

// Test WhatsApp endpoint - Protected route for vendors
router.post("/test", vendorProtect, async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user._id);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Check if WhatsApp is enabled and configured
        if (!vendor.whatsappEnabled) {
            return res.status(400).json({
                message: "WhatsApp is not enabled for your account",
                hint: "Please enable WhatsApp in your settings first"
            });
        }

        if (!vendor.whatsappNumber || !vendor.ultraInstance || !vendor.ultraToken) {
            return res.status(400).json({
                message: "WhatsApp credentials are incomplete",
                missing: {
                    whatsappNumber: !vendor.whatsappNumber,
                    ultraInstance: !vendor.ultraInstance,
                    ultraToken: !vendor.ultraToken
                },
                hint: "Please configure all WhatsApp settings in your vendor profile"
            });
        }

        // Get test message from request body or use default
        const testMessage = req.body.message || `
🔔 TEST MESSAGE

This is a test message from Pamper Periods WhatsApp Integration.

✅ Your WhatsApp configuration is working correctly!

Vendor: ${vendor.shopName}
Time: ${new Date().toLocaleString()}

— Pamper Periods
`;

        // Use vendor's own number for testing, or allow custom number
        const targetNumber = req.body.targetNumber || vendor.whatsappNumber;

        console.log("📱 Sending test WhatsApp message...");
        console.log("To:", targetNumber);
        console.log("Instance:", vendor.ultraInstance);

        const result = await sendWhatsApp(
            targetNumber,
            testMessage,
            vendor.ultraInstance,
            vendor.ultraToken
        );

        if (result) {
            res.json({
                success: true,
                message: "Test WhatsApp message sent successfully!",
                details: {
                    recipient: targetNumber,
                    vendor: vendor.shopName,
                    timestamp: new Date().toISOString()
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to send WhatsApp message. Check server logs for details."
            });
        }

    } catch (err) {
        console.error("Test WhatsApp Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error while testing WhatsApp",
            error: err.message
        });
    }
});

module.exports = router;
