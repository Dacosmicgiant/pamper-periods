import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import API from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { Edit3 } from "lucide-react";

const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};

export default function VendorEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [values, setValues] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    status: "active",
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  /* Load Product */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await API.get(`/vendor/products/${id}`);
        // Ensure values.categories is set correctly for UI (use first ID if array)
        setValues({ ...data, category: data.categories?.[0]?._id || data.categories?.[0] || "" });

        const cats = await API.get("/categories");
        setCategories(cats.data);
      } catch (err) {
        toast.error("Unable to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, toast]);

  /* Handle Input */
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  /* Handle Image Upload */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("folder", "products");

      const token = localStorage.getItem("vendorToken") || localStorage.getItem("token");
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/upload/multiple`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setValues({ ...values, images: [...values.images, ...data.urls] });
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

  /* Remove Image */
  const removeImage = (index) => {
    setValues({
      ...values,
      images: values.images.filter((_, i) => i !== index),
    });
  };

  const handleCategoryChange = (e) => {
    setValues({ ...values, category: e.target.value, categories: [e.target.value] });
  };

  /* Submit Update */
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await API.put(`/vendor/products/${id}`, values);

      toast.success("Product updated successfully!");
      navigate("/vendor/products");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">Loading...</div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />

      <div className="flex-1 flex flex-col">
        <VendorTopbar title="Edit Product" />

        <main className="p-6">
          <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

            <form onSubmit={submit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={values.description}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              {/* Category */}
              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select
                  name="category"
                  value={values.category || ""}
                  onChange={handleCategoryChange}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={values.stock}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="font-semibold block mb-1">Status</label>
                <select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="font-semibold block mb-1">Product Images</label>

                {/* Upload New Images */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full p-2 border rounded-xl mb-3"
                />

                {uploading && (
                  <p className="text-sm text-blue-600 mb-2">Uploading images...</p>
                )}

                {/* Current Images */}
                {values.images?.length > 0 && (
                  <div className="flex gap-3 flex-wrap">
                    {values.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img}
                          alt={`Product ${i + 1}`}
                          className="w-24 h-24 rounded-xl border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {values.images?.length === 0 && (
                  <p className="text-sm text-gray-400">No images uploaded yet</p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-5 h-5" />
                {uploading ? "Uploading..." : saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
