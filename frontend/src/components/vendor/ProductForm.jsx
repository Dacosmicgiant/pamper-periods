// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import { Plus, Trash } from "lucide-react";

// export default function ProductForm({ onSubmit, submitLabel }) {

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: "",
//     discount: 0,
//     stock: 1,
//     categories: [],
//     images: [],
//     variants: [],
//   });

//   // Load categories
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await API.get("/categories");
//         setCategories(data);
//       } catch (err) {
//         console.log("Category load error", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Image Upload Handler
//   const handleUpload = (e) => {
//     const files = [...e.target.files];
//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setForm((p) => ({
//           ...p,
//           images: [...p.images, reader.result],
//         }));
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (index) => {
//     setForm((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   // Variants
//   const addVariant = () => {
//     setForm((prev) => ({
//       ...prev,
//       variants: [...prev.variants, { name: "", value: "" }],
//     }));
//   };

//   const updateVariant = (i, field, value) => {
//     const updated = [...form.variants];
//     updated[i][field] = value;
//     setForm({ ...form, variants: updated });
//   };

//   const removeVariant = (i) => {
//     setForm({
//       ...form,
//       variants: form.variants.filter((_, idx) => idx !== i),
//     });
//   };

//   const submitForm = () => {
//     if (!form.title.trim()) return alert("Title required");
//     if (!form.price) return alert("Price required");
//     if (form.images.length === 0) return alert("Upload at least 1 image");

//     onSubmit(form);
//   };

//   return (
//     <div className="space-y-6">

//       {/* Basic Info */}
//       <div>
//         <label className="font-semibold">Product Title</label>
//         <input
//           className="w-full p-3 border rounded-xl mt-1"
//           placeholder="Premium Rose Box"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//         />
//       </div>

//       <div>
//         <label className="font-semibold">Description</label>
//         <textarea
//           rows={4}
//           className="w-full p-3 border rounded-xl mt-1"
//           placeholder="Write product description..."
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//         />
//       </div>

//       {/* Price & Discount */}
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="font-semibold">Price (₹)</label>
//           <input
//             type="number"
//             className="w-full p-3 border rounded-xl mt-1"
//             value={form.price}
//             onChange={(e) => setForm({ ...form, price: e.target.value })}
//           />
//         </div>
//         <div>
//           <label className="font-semibold">Discount (%)</label>
//           <input
//             type="number"
//             className="w-full p-3 border rounded-xl mt-1"
//             value={form.discount}
//             onChange={(e) => setForm({ ...form, discount: e.target.value })}
//           />
//         </div>
//       </div>

//       {/* Categories */}
//       <div>
//         <label className="font-semibold">Categories</label>
//         <select
//           multiple
//           className="w-full p-3 border rounded-xl mt-1"
//           value={form.categories}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               categories: [...e.target.selectedOptions].map((o) => o.value),
//             })
//           }
//         >
//           {categories.map((cat) => (
//             <option key={cat._id} value={cat._id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Stock */}
//       <div>
//         <label className="font-semibold">Stock</label>
//         <input
//           type="number"
//           className="w-full p-3 border rounded-xl mt-1"
//           value={form.stock}
//           onChange={(e) => setForm({ ...form, stock: e.target.value })}
//         />
//       </div>

//       {/* Images */}
//       <div>
//         <label className="font-semibold">Images</label>
//         <input type="file" multiple onChange={handleUpload} className="mt-2" />

//         <div className="grid grid-cols-3 gap-4 mt-4">
//           {form.images.map((img, i) => (
//             <div key={i} className="relative group">
//               <img src={img} className="rounded-xl h-32 w-full object-cover" />
//               <button
//                 onClick={() => removeImage(i)}
//                 className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
//               >
//                 <Trash size={16} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Variants */}
//       <div>
//         <label className="font-semibold">Variants</label>

//         {form.variants.map((v, i) => (
//           <div key={i} className="grid grid-cols-3 gap-3 items-center mt-2">
//             <input
//               className="p-3 border rounded-xl"
//               placeholder="Variant Name"
//               value={v.name}
//               onChange={(e) => updateVariant(i, "name", e.target.value)}
//             />

//             <input
//               className="p-3 border rounded-xl"
//               placeholder="Variant Value"
//               value={v.value}
//               onChange={(e) => updateVariant(i, "value", e.target.value)}
//             />

//             <button
//               className="bg-red-500 text-white px-3 py-2 rounded-xl"
//               onClick={() => removeVariant(i)}
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         <button
//           onClick={addVariant}
//           className="mt-3 bg-pink-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
//         >
//           <Plus size={18} /> Add Variant
//         </button>
//       </div>

//       {/* Submit */}
//       <button
//         onClick={submitForm}
//         className="w-full mt-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold"
//       >
//         {submitLabel}
//       </button>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Tag,
  Package,
  FileText,
  DollarSign,
  Percent,
  Layers,
  Hash
} from "lucide-react";

export default function ProductForm({ onSubmit, submitLabel, initialData }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(initialData || {
    title: "",
    description: "",
    price: "",
    discount: 0,
    stock: 1,
    categories: [],
    images: [],
    variants: [],
  });

  // Load categories
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/categories");
        setCategories(data);
      } catch (err) {
        console.log("Category load error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Image Upload Handler with progress simulation
  const handleUpload = async (e) => {
    const files = [...e.target.files];
    if (files.length + form.images.length > 8) {
      alert("Maximum 8 images allowed");
      return;
    }

    setUploading(true);
    
    // Simulate upload progress
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { url: reader.result, loading: false }],
        }));
      };
      reader.readAsDataURL(file);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Variants
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", value: "", price: "" }],
    }));
  };

  const updateVariant = (i, field, value) => {
    const updated = [...form.variants];
    updated[i][field] = value;
    setForm({ ...form, variants: updated });
  };

  const removeVariant = (i) => {
    setForm({
      ...form,
      variants: form.variants.filter((_, idx) => idx !== i),
    });
  };

  const calculateDiscountedPrice = () => {
    const price = parseFloat(form.price) || 0;
    const discount = parseFloat(form.discount) || 0;
    return price - (price * discount) / 100;
  };

  const submitForm = () => {
    if (!form.title.trim()) {
      alert("Please enter a product title");
      return;
    }
    if (!form.price) {
      alert("Please set a price for the product");
      return;
    }
    if (form.images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    onSubmit(form);
  };

  const InputField = ({ label, icon: Icon, children, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-1">
      {/* Basic Information Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Basic Information
        </h2>
        
        <div className="space-y-6">
          <InputField label="Product Title" icon={Package}>
            <input
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter product title (e.g., Premium Rose Box)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </InputField>

          <InputField label="Product Description" icon={FileText}>
            <textarea
              rows={5}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe your product in detail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </InputField>
        </div>
      </div>

      {/* Pricing & Inventory Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Pricing & Inventory
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Price (₹)" icon={DollarSign}>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </InputField>

          <InputField label="Discount (%)" icon={Percent}>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
          </InputField>

          <InputField label="Stock Quantity" icon={Hash}>
            <input
              type="number"
              min="0"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </InputField>
        </div>

        {form.price && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Original Price:</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹{parseFloat(form.price).toLocaleString()}</span>
            </div>
            {form.discount > 0 && (
              <>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="font-semibold text-red-500">-{form.discount}%</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">Discounted Price:</span>
                  <span className="font-semibold text-green-600">₹{calculateDiscountedPrice().toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Categories
        </h2>
        
        <InputField label="Select Categories" icon={Layers}>
          <select
            multiple
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px]"
            value={form.categories}
            onChange={(e) =>
              setForm({
                ...form,
                categories: [...e.target.selectedOptions].map((o) => o.value),
              })
            }
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="p-2">
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Hold Ctrl/Cmd to select multiple categories
          </p>
        </InputField>
      </div>

      {/* Images Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Product Images
        </h2>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-600">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Drag & drop images here or click to browse
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Supports JPG, PNG, WEBP • Max 8 images
          </p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold cursor-pointer hover:bg-blue-700 transition-colors duration-200">
            <Upload className="w-4 h-4" />
            Choose Files
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading || form.images.length >= 8}
            />
          </label>
        </div>

        {form.images.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Uploaded Images ({form.images.length}/8)
              </span>
              {form.images.length > 1 && (
                <button
                  onClick={() => setForm({ ...form, images: [] })}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove All
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {form.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img 
                    src={img.url || img} 
                    className="rounded-xl h-32 w-full object-cover border border-gray-200 dark:border-gray-600 transition-transform duration-200 group-hover:scale-105" 
                    alt={`Product ${i + 1}`}
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-0 group-hover:scale-100 hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Variants Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Product Variants
        </h2>

        {form.variants.map((v, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="md:col-span-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Variant Name
              </label>
              <input
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Color, Size"
                value={v.name}
                onChange={(e) => updateVariant(i, "name", e.target.value)}
              />
            </div>

            <div className="md:col-span-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Variant Value
              </label>
              <input
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Red, Large"
                value={v.value}
                onChange={(e) => updateVariant(i, "value", e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Additional Price (₹)
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0.00"
                value={v.price}
                onChange={(e) => updateVariant(i, "price", e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <button
                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                onClick={() => removeVariant(i)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addVariant}
          className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Variant
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={submitForm}
        disabled={uploading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02]"
      >
        {uploading ? "Uploading Images..." : submitLabel}
      </button>
    </div>
  );
}