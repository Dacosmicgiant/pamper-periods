import React, { useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import API from "../../api/api";
import { useToast } from "../../components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  IndianRupee,
  Package,
  Tag,
  Palette,
  Layers,
  Upload,
  ArrowLeft,
  Check,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};
export default function VendorAddBundle() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Main fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Pricing
  const [oldPrice, setOldPrice] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(10);

  // Images (multiple)
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Bundle items
  const [items, setItems] = useState([]);

  // Variants
  const [variants, setVariants] = useState([]);

  // Colors
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [hexColor, setHexColor] = useState("#3b82f6");

  // Categories
  const categories = [
    "Women's Care",
    "Teen Essentials",
    "Postpartum",
    "Sustainable",
    "Travel",
    "Luxury",
    "Active Wear",
    "Education",
    "Self-Care"
  ];

  // ******** IMAGE UPLOAD ********
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("folder", "bundles");

      const token = localStorage.getItem("vendorToken") || localStorage.getItem("token");
      const response = await fetch(`${getApiBaseUrl()}/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setImages((prev) => [...prev, ...data.urls]);
        toast.success(`${data.count} image(s) uploaded successfully!`);
      } else {
        toast.error(data.message || "Failed to upload images");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // ******** ADD BUNDLE ITEM ********
  const addItem = () => {
    setItems([...items, { title: "", price: "", image: "", description: "" }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Upload item image to Cloudinary
  const uploadItemImage = async (index, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "bundles/items");

      const token = localStorage.getItem("vendorToken") || localStorage.getItem("token");
      const response = await fetch(`${getApiBaseUrl()}/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        updateItem(index, "image", data.url);
        toast.success("Item image uploaded!");
      } else {
        toast.error(data.message || "Failed to upload item image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload item image");
    }
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // ******** VARIANTS ********
  const addVariant = () => {
    setVariants([...variants, { name: "", options: [] }]);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    if (field === "options") {
      updated[index].options = value.split(",").map(opt => opt.trim()).filter(opt => opt);
    } else {
      updated[index][field] = value;
    }
    setVariants(updated);
  };

  const deleteVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ******** COLORS ********
  const addColor = () => {
    if (!colorInput.trim()) return;
    const colorData = {
      name: colorInput.trim(),
      hex: hexColor
    };
    setColors([...colors, colorData]);
    setColorInput("");
    setHexColor("#3b82f6");
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Calculate discount
  const calculateDiscount = () => {
    if (!oldPrice || !price || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  // Calculate total items value
  const totalItemsValue = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const bundleSavings = totalItemsValue - (parseFloat(price) || 0);

  // ******** SUBMIT ********
  const handleSubmit = async () => {
    if (!title || !price || !category || images.length === 0) {
      return toast.error("Please fill all required fields and upload at least one image");
    }

    if (items.length === 0) {
      return toast.error("Please add at least one item to the bundle");
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        category,
        oldPrice: oldPrice || null,
        price,
        stock,
        images,
        items,
        variants,
        colors,
        isActive: true
      };

      await API.post("/vendor/bundles", payload);

      toast.success("Bundle created successfully!");
      navigate("/vendor/bundles");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create bundle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <VendorSidebar />

      <div className="flex-1">
        <VendorTopbar title="Add New Bundle" />

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Create New Bundle</h2>
              <p className="text-gray-600 mt-1">Design attractive bundle packages for your customers</p>
            </div>
            <Link
              to="/vendor/bundles"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Bundles
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-600" />
                  Basic Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bundle Title *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="e.g., Premium Menstrual Care Kit, Teen First Period Bundle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                      rows={4}
                      placeholder="Describe what makes this bundle special, what's included, and benefits for customers..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Pricing & Stock */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="0.00"
                        value={oldPrice}
                        onChange={(e) => setOldPrice(e.target.value)}
                      />
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                {/* Discount Display */}
                {oldPrice > 0 && price > 0 && calculateDiscount() > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-red-700">
                          {calculateDiscount()}% Discount Applied
                        </p>
                        <p className="text-sm text-red-600">
                          Customer saves ₹{(oldPrice - price).toLocaleString()}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                        SAVE {calculateDiscount()}%
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Bundle Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    Bundle Items
                  </h3>
                  <button
                    onClick={addItem}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <AnimatePresence>
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-gray-600 mb-2">No items added yet</p>
                      <p className="text-sm text-gray-500">Add products to create your bundle</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Item {index + 1}</h4>
                            <button
                              onClick={() => deleteItem(index)}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                              placeholder="Item Title *"
                              value={item.title}
                              onChange={(e) => updateItem(index, "title", e.target.value)}
                            />
                            <div className="relative">
                              <input
                                type="number"
                                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                placeholder="Item Price *"
                                value={item.price}
                                onChange={(e) => updateItem(index, "price", e.target.value)}
                              />
                              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </div>

                          <textarea
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none mb-4"
                            rows={2}
                            placeholder="Item Description (optional)"
                            value={item.description}
                            onChange={(e) => updateItem(index, "description", e.target.value)}
                          />

                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Item Image
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) uploadItemImage(index, file);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                              />
                            </div>
                            {item.image && (
                              <div className="relative">
                                <img
                                  src={item.image}
                                  className="w-16 h-16 rounded-lg object-cover border"
                                  alt="Item preview"
                                />
                                <button
                                  onClick={() => updateItem(index, "image", "")}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Images Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  Bundle Images *
                </h3>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-pink-500 transition-colors duration-300">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="bundle-images"
                  />
                  <label
                    htmlFor="bundle-images"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {uploading ? "Uploading..." : "Click to upload images"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB each</p>
                      <p className="text-xs text-gray-400 mt-2">At least one image is required</p>
                    </div>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Uploaded Images ({images.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img
                            src={img}
                            className="w-full h-32 object-cover rounded-xl border border-gray-200"
                            alt={`Bundle image ${index + 1}`}
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Primary
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Variants & Colors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-600" />
                  Variants & Colors (Optional)
                </h3>

                {/* Variants */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Product Variants</h4>
                    <button
                      onClick={addVariant}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-3">
                    {variants.map((v, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all mb-2"
                          placeholder="Variant Name (e.g., Size, Type)"
                          value={v.name}
                          onChange={(e) => updateVariant(index, "name", e.target.value)}
                        />
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          placeholder="Options (comma separated, e.g., Small, Medium, Large)"
                          value={v.options.join(", ")}
                          onChange={(e) => updateVariant(index, "options", e.target.value)}
                        />
                        <button
                          onClick={() => deleteVariant(index)}
                          className="mt-2 text-red-600 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Variant
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Available Colors</h4>
                  <div className="flex gap-3 mb-3">
                    <input
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="Color Name (e.g., Rose Pink)"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                    />
                    <input
                      type="color"
                      className="w-12 h-12 cursor-pointer"
                      value={hexColor}
                      onChange={(e) => setHexColor(e.target.value)}
                    />
                    <button
                      onClick={addColor}
                      className="px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:shadow-md transition-all duration-300 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2"
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                          <button
                            onClick={() => removeColor(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Preview & Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Bundle Preview</h3>

                {/* Preview Content */}
                {(title || images.length > 0 || items.length > 0) ? (
                  <div className="space-y-6">
                    {/* Image Preview */}
                    {images[0] && (
                      <img
                        src={images[0]}
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        alt="Bundle preview"
                      />
                    )}

                    {/* Title & Category */}
                    {title && (
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{title}</h4>
                        {category && (
                          <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {category}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Pricing Preview */}
                    {price && (
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">₹{price}</span>
                          {oldPrice > price && (
                            <>
                              <span className="text-lg line-through text-gray-500">₹{oldPrice}</span>
                              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {calculateDiscount()}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Items Summary */}
                    {items.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="font-medium text-gray-900 mb-3">Bundle Includes ({items.length} items)</p>
                        <div className="space-y-2">
                          {items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                              <span className="text-gray-700">{item.title || `Item ${index + 1}`}</span>
                              {item.price && (
                                <span className="ml-auto text-gray-900 font-medium">₹{item.price}</span>
                              )}
                            </div>
                          ))}
                          {items.length > 3 && (
                            <p className="text-sm text-gray-500">+ {items.length - 3} more items</p>
                          )}
                        </div>

                        {/* Value Summary */}
                        {totalItemsValue > 0 && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">Total Value:</span>
                              <span className="font-bold">₹{totalItemsValue.toLocaleString()}</span>
                            </div>
                            {bundleSavings > 0 && (
                              <div className="flex justify-between text-sm mt-1">
                                <span className="text-green-600">You Save:</span>
                                <span className="font-bold text-green-600">₹{bundleSavings.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Stock Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock > 10 ? 'bg-green-100 text-green-700' :
                          stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Preview will appear here</p>
                  </div>
                )}

                {/* Validation Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Requirements Check</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {title ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm">Bundle Title</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {price ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm">Selling Price</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {category ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm">Category</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {images.length > 0 ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm">At least one image</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {items.length > 0 ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm">At least one item</span>
                    </div>
                  </div>
                </div>

                {/* Create Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || uploading || !title || !price || !category || images.length === 0 || items.length === 0}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading Images...
                    </>
                  ) : loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Bundle...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Create Bundle
                    </>
                  )}
                </button>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-700">{items.length}</div>
                      <div className="text-xs text-gray-500">Items</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-700">{images.length}</div>
                      <div className="text-xs text-gray-500">Images</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}