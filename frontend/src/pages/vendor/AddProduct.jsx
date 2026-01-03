import React, { useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";

import { Plus, UploadCloud, Tag, IndianRupee } from "lucide-react";

const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};
export default function AddProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categories: "",
    status: "active",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  // Handle Input
  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Images - Upload to Cloudinary
  const handleImages = async (e) => {
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
      const response = await fetch(`${getApiBaseUrl()}/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setForm({ ...form, images: data.urls });
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

  const submit = async (e) => {
    e.preventDefault();

    if (form.images.length === 0) {
      return toast.error("Please upload at least one product image");
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        categories: [form.categories], // Wrap single ID in array
      };

      await API.post("/vendor/products", payload);

      toast.success("Product added successfully!");
      navigate("/vendor/products");
    } catch (err) {
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />

      <div className="flex-1 flex flex-col">
        <VendorTopbar title="Add New Product" />

        <main className="p-6">
          <form
            onSubmit={submit}
            className="max-w-3xl mx-auto bg-white shadow p-8 rounded-2xl space-y-6"
          >
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Create New Product
            </h2>

            {/* Title */}
            <div>
              <label className="font-medium">Product Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={change}
                required
                className="w-full mt-2 p-3 border rounded-xl"
                placeholder="E.g., Handmade Rose Bouquet"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={change}
                rows="4"
                required
                className="w-full mt-2 p-3 border rounded-xl"
                placeholder="Write product details here..."
              ></textarea>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" /> Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={change}
                  required
                  className="w-full mt-2 p-3 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-medium">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={change}
                  required
                  className="w-full mt-2 p-3 border rounded-xl"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="font-medium flex items-center gap-1">
                <Tag className="w-4 h-4" /> Category
              </label>
              <select
                name="categories"
                value={form.categories}
                onChange={change}
                className="w-full mt-2 p-3 border rounded-xl"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={change}
                className="w-full mt-2 p-3 border rounded-xl"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Images */}
            <div>
              <label className="font-medium flex items-center gap-1">
                <UploadCloud className="w-5 h-5" /> Product Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleImages}
                disabled={uploading}
                className="w-full mt-2"
              />

              {uploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading images...</p>
              )}

              {/* Preview */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {form.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="h-28 w-full object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : uploading ? "Uploading images..." : "Create Product"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
