// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer from multer
 * @param {String} folder - Cloudinary folder name (e.g., 'products', 'vendors', 'bundles')
 * @returns {Promise<String>} - Cloudinary secure URL
 */
const uploadToCloudinary = (fileBuffer, folder = "uploads") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "auto",
                transformation: [
                    { quality: "auto", fetch_format: "auto" }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        // Convert buffer to stream and pipe to Cloudinary
        const readableStream = Readable.from(fileBuffer);
        readableStream.pipe(uploadStream);
    });
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<Buffer>} fileBuffers - Array of image file buffers
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Array<String>>} - Array of Cloudinary secure URLs
 */
const uploadMultipleToCloudinary = async (fileBuffers, folder = "uploads") => {
    const uploadPromises = fileBuffers.map((buffer) =>
        uploadToCloudinary(buffer, folder)
    );
    return Promise.all(uploadPromises);
};

/**
 * Delete image from Cloudinary by URL
 * @param {String} imageUrl - Cloudinary image URL
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (imageUrl) => {
    try {
        // Extract public_id from URL
        const urlParts = imageUrl.split("/");
        const publicIdWithExtension = urlParts.slice(-2).join("/");
        const publicId = publicIdWithExtension.split(".")[0];

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error;
    }
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    deleteFromCloudinary,
};
