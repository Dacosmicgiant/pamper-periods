// routes/upload.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { uploadToCloudinary, uploadMultipleToCloudinary } = require("../config/cloudinary");
const { protect } = require("../middlewares/auth");
const vendorProtect = require("../middlewares/vendorProtect");
const jwt = require("jsonwebtoken");

// Middleware to allow both Users (Admin/Customer) and Vendors
const protectAny = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === "vendor") {
            return vendorProtect(req, res, next);
        } else {
            return protect(req, res, next);
        }
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

/**
 * POST /api/upload/single
 * Upload a single image to Cloudinary
 */
router.post("/single", protectAny, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const folder = req.body.folder || "uploads";
        const imageUrl = await uploadToCloudinary(req.file.buffer, folder);

        res.json({
            success: true,
            url: imageUrl,
            message: "Image uploaded successfully"
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload image",
            error: error.message
        });
    }
});

/**
 * POST /api/upload/multiple
 * Upload multiple images to Cloudinary
 */
router.post("/multiple", protectAny, upload.array("images", 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const folder = req.body.folder || "uploads";
        const fileBuffers = req.files.map(file => file.buffer);
        const imageUrls = await uploadMultipleToCloudinary(fileBuffers, folder);

        res.json({
            success: true,
            urls: imageUrls,
            count: imageUrls.length,
            message: "Images uploaded successfully"
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload images",
            error: error.message
        });
    }
});

module.exports = router;
