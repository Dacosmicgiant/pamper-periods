import React, { useEffect, useState, useCallback } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import API from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";

import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  Tag,
  IndianRupee
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

/* ----------------------------------------------------
   STATUS COLOR HELPER
---------------------------------------------------- */
const getStatusColor = (status = "active") => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "out_of_stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/* ----------------------------------------------------
   PRODUCT CARD
---------------------------------------------------- */
const ProductCard = ({ product, index, navigate, setDeleteConfirm }) => {
  const status = product.status || (product.stock === 0 ? "out_of_stock" : "active");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl border shadow-sm hover:shadow-lg overflow-hidden group transition"
    >
      <div className="relative h-48 bg-gray-100">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
            {status.replace("_", " ")}
          </span>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2">
          <button
            onClick={() => navigate(`/vendor/products/edit/${product._id}`)}
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-100"
          >
            <Edit3 className="w-4 h-4 text-gray-700" />
          </button>

          <button
            onClick={() => setDeleteConfirm(product._id)}
            className="p-2 bg-white rounded-lg shadow hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
          {product.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
          {product.description || "No description"}
        </p>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-gray-600" />
            <span className="text-xl font-bold">{product.price}</span>
          </div>

          <div className="font-semibold text-blue-600">
            {product.stock || 0} units
          </div>
        </div>

        {product.categories?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Tag className="w-4 h-4 text-gray-400" />

            {product.categories.slice(0, 2).map((c, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {c.name}
              </span>
            ))}

            {product.categories.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{product.categories.length - 2} more
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center border-t pt-3">
          <button
            onClick={() => navigate(`/vendor/products/edit/${product._id}`)}
            className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
          >
            <Edit3 className="w-4 h-4" /> Edit
          </button>

          <button
            onClick={() => setDeleteConfirm(product._id)}
            className="p-2 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ----------------------------------------------------
   MAIN PAGE
---------------------------------------------------- */
export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const navigate = useNavigate();
  const { toast } = useToast();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/vendor/products");
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      toast.error("Unable to fetch products.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    let list = [...products];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          (p.description || "").toLowerCase().includes(s)
      );
    }

    if (status !== "all") {
      if (status === "out_of_stock") list = list.filter((p) => p.stock === 0);
      else list = list.filter((p) => p.status === status);
    }

    setFiltered(list);
  }, [products, search, status]);

  const removeProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar />

      <div className="flex-1 flex flex-col">
        <VendorTopbar title="Products" />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Product Management</h1>

            <Link
              to="/vendor/products/add"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 shadow hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" /> Add Product
            </Link>
          </div>

          {/* Search + Filter */}
          <div className="bg-white p-5 rounded-xl shadow mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-3 border rounded-xl"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-16 bg-white rounded-xl shadow">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((p, i) => (
                  <ProductCard
                    key={p._id}
                    index={i}
                    product={p}
                    navigate={navigate}
                    setDeleteConfirm={setDeleteConfirm}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Delete Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold mb-3">Delete Product?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this product?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => removeProduct(deleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
