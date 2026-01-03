import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { useToast } from "../../components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "../../components/Loader";

export default function EditBundle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [bundle, setBundle] = useState({
    title: "",
    price: "",
    oldPrice: "",
    description: "",
    status: "draft",
    category: "",
    images: [],
    items: []
  });

  // Fetch bundle data
  useEffect(() => {
    const fetchBundle = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/bundles/${id}`);
        
        // Ensure items array exists
        const bundleData = {
          ...data,
          items: data.items || [],
          images: data.images || []
        };
        
        setBundle(bundleData);
      } catch (err) {
        console.error("Failed to fetch bundle:", err);
        toast.error("Failed to load bundle data");
        navigate("/admin/bundles");
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [id, navigate, toast]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBundle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const base64Promises = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(base64Promises).then((base64Arr) => {
      setBundle(prev => ({
        ...prev,
        images: [...prev.images, ...base64Arr]
      }));
    });
  };

  // Remove image
  const removeImage = (index) => {
    setBundle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Add new item to bundle
  const handleAddItem = () => {
    setBundle(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { 
          title: "", 
          price: "", 
          image: "", 
          description: "",
          _id: Date.now().toString() // Temporary ID for local state
        }
      ]
    }));
  };

  // Update item field
  const updateItem = (index, field, value) => {
    setBundle(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  // Remove item
  const removeItem = (index) => {
    setBundle(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Handle item image upload
  const handleItemImage = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateItem(index, "image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Calculate savings
  const calculateSavings = () => {
    if (!bundle.oldPrice || !bundle.price) return 0;
    const old = parseFloat(bundle.oldPrice);
    const current = parseFloat(bundle.price);
    if (old <= current || isNaN(old) || isNaN(current)) return 0;
    return Math.round(((old - current) / old) * 100);
  };

  // Calculate total items price
  const totalItemsPrice = bundle.items.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0), 
    0
  );
  const bundleSavings = totalItemsPrice - (parseFloat(bundle.price) || 0);

  // Submit updated bundle
  const submitBundle = async () => {
    if (!bundle.title || !bundle.price || bundle.items.length === 0) {
      toast.error("Please fill in all required fields and add at least one item");
      return;
    }

    setSaving(true);
    try {
      // Remove temporary IDs before sending
      const itemsToSend = bundle.items.map(({ _id, ...rest }) => rest);
      
      await API.put(`/bundles/${id}`, {
        ...bundle,
        items: itemsToSend
      });

      toast.success("Bundle updated successfully!");
      navigate("/admin/bundles");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Error updating bundle");
    } finally {
      setSaving(false);
    }
  };

  // Delete bundle
  const deleteBundle = async () => {
    if (!window.confirm("Are you sure you want to delete this bundle? This action cannot be undone.")) {
      return;
    }

    try {
      await API.delete(`/bundles/${id}`);
      toast.success("Bundle deleted successfully!");
      navigate("/admin/bundles");
    } catch (err) {
      toast.error("Failed to delete bundle");
    }
  };

  if (loading) {
    return <Loader message="Loading bundle data..." />;
  }

  return (
    <div className="flex gap-6 px-4 lg:px-6 mt-20 max-w-7xl mx-auto font-display">
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text text-transparent">
              Edit Bundle
            </h1>
            <p className="text-gray-500 mt-2">
              Update your bundle details and items
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <button
              onClick={() => navigate("/admin/bundles")}
              className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Bundles
            </button>
            <button
              onClick={deleteBundle}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">delete</span>
              Delete Bundle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="xl:col-span-2 space-y-6">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Bundle Details</h2>

              {/* TITLE */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Bundle Title *
                </label>
                <input
                  name="title"
                  placeholder="e.g., Summer Essentials Bundle, Office Setup Kit"
                  value={bundle.title}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                />
              </div>

              {/* PRICES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Bundle Price *
                  </label>
                  <div className="relative">
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={bundle.price}
                      onChange={handleChange}
                      className="w-full h-12 px-4 pl-8 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      currency_rupee
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Original Price
                  </label>
                  <div className="relative">
                    <input
                      name="oldPrice"
                      type="number"
                      placeholder="0.00"
                      value={bundle.oldPrice}
                      onChange={handleChange}
                      className="w-full h-12 px-4 pl-8 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      currency_rupee
                    </span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Bundle Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe what makes this bundle special and what customers will get..."
                  value={bundle.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 resize-none"
                  rows={4}
                />
              </div>

              {/* STATUS & CATEGORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={bundle.status}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    name="category"
                    placeholder="e.g., Electronics, Fashion, Home"
                    value={bundle.category}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>

            {/* BUNDLE ITEMS */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Bundle Items</h2>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add Item
                </button>
              </div>

              <AnimatePresence>
                {bundle.items.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4 mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">Item {idx + 1}</h4>
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Item Title *"
                        value={item.title}
                        onChange={(e) => updateItem(idx, "title", e.target.value)}
                        className="h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                      />

                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Item Price *"
                          value={item.price}
                          onChange={(e) => updateItem(idx, "price", e.target.value)}
                          className="w-full h-12 px-4 pl-8 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          currency_rupee
                        </span>
                      </div>
                    </div>

                    <textarea
                      placeholder="Item description (optional)"
                      value={item.description || ""}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 resize-none"
                      rows={2}
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
                            if (file) handleItemImage(idx, file);
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                        />
                      </div>
                      {item.image && (
                        <div className="relative">
                          <img
                            src={item.image}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                            alt="Item preview"
                          />
                          <button
                            onClick={() => updateItem(idx, "image", "")}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {bundle.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="material-symbols-outlined text-4xl text-gray-300 mb-2">inventory_2</div>
                  <p>No items added yet</p>
                  <p className="text-sm">Add products to create your bundle</p>
                </div>
              )}
            </motion.div>

            {/* IMAGE UPLOADER */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Bundle Images</h2>
                <span className="text-sm text-gray-500">{bundle.images.length} images</span>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-pink-500 transition-colors duration-300">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="hidden"
                  id="bundle-images"
                />
                <label
                  htmlFor="bundle-images"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-pink-600 text-xl">add_photo_alternate</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Click to upload more images</p>
                    <p className="text-gray-500 text-sm">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </label>
              </div>

              {bundle.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {bundle.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={img}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                        alt={`Bundle image ${idx + 1}`}
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Preview & Actions */}
          <div className="space-y-6">
            {/* Preview Card */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Bundle Preview</h2>

              {(bundle.title || bundle.images.length > 0) && (
                <div className="space-y-4">
                  {bundle.images[0] && (
                    <img
                      src={bundle.images[0]}
                      className="w-full h-40 object-cover rounded-xl border border-gray-200"
                      alt={bundle.title}
                    />
                  )}

                  {bundle.title && (
                    <h3 className="font-semibold text-gray-900 text-lg">{bundle.title}</h3>
                  )}

                  <div className="space-y-2">
                    {bundle.price && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">₹{bundle.price}</span>
                        {bundle.oldPrice && bundle.oldPrice > bundle.price && (
                          <>
                            <span className="text-lg line-through text-gray-400">₹{bundle.oldPrice}</span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Save {calculateSavings()}%
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {bundle.items.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {bundle.items.length} items • Total value: ₹{totalItemsPrice.toFixed(2)}
                        {bundleSavings > 0 && (
                          <span className="text-green-600 font-semibold">
                            {" "}(Save ₹{bundleSavings.toFixed(2)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {bundle.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">{bundle.description}</p>
                  )}
                </div>
              )}

              {(!bundle.title && bundle.images.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <div className="material-symbols-outlined text-4xl text-gray-300 mb-2">preview</div>
                  <p className="text-sm">Preview will appear here</p>
                </div>
              )}

              {/* Update Button */}
              <button
                onClick={submitBundle}
                disabled={saving || !bundle.title || !bundle.price || bundle.items.length === 0}
                className="w-full mt-6 h-12 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Update Bundle
                  </>
                )}
              </button>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Bundle Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-blue-600 material-symbols-outlined mb-1">inventory</div>
                    <div className="text-sm font-medium text-gray-700">{bundle.items.length} Items</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <div className="text-green-600 material-symbols-outlined mb-1">image</div>
                    <div className="text-sm font-medium text-gray-700">{bundle.images.length} Images</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}