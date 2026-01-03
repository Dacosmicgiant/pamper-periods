// Helper function for Cloudinary uploads - Production Ready
// File: frontend/src/utils/cloudinaryUpload.js

// Get API base URL from environment variables
const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};

/**
 * Upload single image to Cloudinary
 * @param {File} file - Image file
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<String>} - Cloudinary URL
 */
export const uploadSingleImage = async (file, folder = "uploads") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const token = localStorage.getItem("token");
    const apiBaseUrl = getApiBaseUrl();
    
    const response = await fetch(`${apiBaseUrl}/upload/single`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || "Failed to upload image");
    }

    return data.url;
};

/**
 * Upload multiple images to Cloudinary
 * @param {FileList|Array<File>} files - Image files
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Array<String>>} - Array of Cloudinary URLs
 */
export const uploadMultipleImages = async (files, folder = "uploads") => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
        formData.append("images", file);
    });
    formData.append("folder", folder);

    const token = localStorage.getItem("token");
    const apiBaseUrl = getApiBaseUrl();
    
    const response = await fetch(`${apiBaseUrl}/upload/multiple`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || "Failed to upload images");
    }

    return data.urls;
};