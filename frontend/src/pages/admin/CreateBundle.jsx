// import React, { useState } from "react";
// import API from "../../api/api";
// import { useToast } from "../../components/Toast";

// export default function CreateBundle() {
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [oldPrice, setOldPrice] = useState("");
//   const [description, setDescription] = useState("");

//   const [images, setImages] = useState([]);
//   const [items, setItems] = useState([]);

//   const { toast } = useToast();

//   // HANDLE IMAGE UPLOAD
//   const handleImages = (e) => {
//     const files = Array.from(e.target.files);

//     const base64Promises = files.map(
//       (file) =>
//         new Promise((resolve) => {
//           const reader = new FileReader();
//           reader.onloadend = () => resolve(reader.result);
//           reader.readAsDataURL(file);
//         })
//     );

//     Promise.all(base64Promises).then((base64Arr) => {
//       setImages([...images, ...base64Arr]);
//     });
//   };

//   const handleAddItem = () => {
//     setItems([
//       ...items,
//       { title: "", price: "", image: "" }
//     ]);
//   };

//   const submitBundle = async () => {
//     try {
//       await API.post("/bundles", {
//         title,
//         price,
//         oldPrice,
//         description,
//         images,
//         items
//       });

//       toast.success("Bundle created successfully!");
//     } catch (err) {
//       toast.error("Error creating bundle");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10 font-display">
//       <h1 className="text-3xl font-black mb-8">Create New Bundle</h1>

//       {/* FORM */}
//       <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">

//         {/* TITLE */}
//         <input
//           placeholder="Bundle Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="input"
//         />

//         {/* Price */}
//         <div className="flex gap-4">
//           <input
//             type="number"
//             placeholder="Bundle Price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="input flex-1"
//           />
//           <input
//             type="number"
//             placeholder="Old Price (optional)"
//             value={oldPrice}
//             onChange={(e) => setOldPrice(e.target.value)}
//             className="input flex-1"
//           />
//         </div>

//         {/* DESCRIPTION */}
//         <textarea
//           placeholder="Bundle Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="input h-32"
//         />

//         {/* IMAGE UPLOADER */}
//         <div>
//           <label className="font-semibold">Bundle Images</label>
//           <input
//             type="file"
//             multiple
//             onChange={handleImages}
//             className="mt-3"
//           />

//           <div className="grid grid-cols-4 gap-4 mt-3">
//             {images.map((img, idx) => (
//               <div key={idx} className="relative">
//                 <img
//                   src={img}
//                   className="w-full h-28 object-cover rounded-xl border"
//                 />
//                 <button
//                   onClick={() =>
//                     setImages(images.filter((_, i) => i !== idx))
//                   }
//                   className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
//                 >
//                   X
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* BUNDLE ITEMS */}
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-lg">Bundle Items</h3>
//             <button
//               onClick={handleAddItem}
//               className="bg-pink-600 text-white px-4 py-2 rounded-lg"
//             >
//               + Add Item
//             </button>
//           </div>

//           {items.map((it, idx) => (
//             <div
//               key={idx}
//               className="p-4 border rounded-xl bg-gray-50 space-y-3"
//             >
//               <input
//                 placeholder="Item Title"
//                 value={it.title}
//                 onChange={(e) => {
//                   const copy = [...items];
//                   copy[idx].title = e.target.value;
//                   setItems(copy);
//                 }}
//                 className="input"
//               />

//               <input
//                 type="number"
//                 placeholder="Item Price"
//                 value={it.price}
//                 onChange={(e) => {
//                   const copy = [...items];
//                   copy[idx].price = e.target.value;
//                   setItems(copy);
//                 }}
//                 className="input"
//               />

//               {/* Item image base64 */}
//               <input
//                 type="file"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   const reader = new FileReader();

//                   reader.onloadend = () => {
//                     const copy = [...items];
//                     copy[idx].image = reader.result;
//                     setItems(copy);
//                   };

//                   reader.readAsDataURL(file);
//                 }}
//               />

//               {it.image && (
//                 <img
//                   src={it.image}
//                   className="w-20 h-20 rounded-lg object-cover border"
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* SUBMIT BUTTON */}
//         <button
//           onClick={submitBundle}
//           className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700"
//         >
//           Create Bundle
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import API from "../../api/api";
import { useToast } from "../../components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CreateBundle() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [category, setCategory] = useState("");

  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  // HANDLE IMAGE UPLOAD
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
      setImages([...images, ...base64Arr]);
    });
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { title: "", price: "", image: "", description: "" }
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const submitBundle = async () => {
    if (!title || !price || items.length === 0) {
      toast.error("Please fill in all required fields and add at least one item");
      return;
    }

    setLoading(true);
    try {
      await API.post("/bundles", {
        title,
        price,
        oldPrice,
        description,
        images,
        items,
        status,
        category
      });

      toast.success("Bundle created successfully!");
      navigate("/admin/bundles");
    } catch (err) {
      toast.error("Error creating bundle");
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = () => {
    if (!oldPrice || !price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const totalItemsPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const bundleSavings = totalItemsPrice - (parseFloat(price) || 0);

  return (
    <div className="flex gap-6 px-4 lg:px-6 mt-20 max-w-7xl mx-auto font-display">
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-primary dark:from-white dark:to-primary bg-clip-text text-transparent">
              Create New Bundle
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Create attractive product bundles for your customers
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/bundles")}
            className="mt-4 lg:mt-0 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Bundles
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="xl:col-span-2 space-y-6">
            <motion.div
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Bundle Details</h2>

              {/* TITLE */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bundle Title *
                </label>
                <input
                  placeholder="e.g., Summer Essentials Bundle, Office Setup Kit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                />
              </div>

              {/* PRICES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bundle Price *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-12 px-4 pl-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      currency_rupee
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Original Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={oldPrice}
                      onChange={(e) => setOldPrice(e.target.value)}
                      className="w-full h-12 px-4 pl-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      currency_rupee
                    </span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bundle Description
                </label>
                <textarea
                  placeholder="Describe what makes this bundle special and what customers will get..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                  rows={4}
                />
              </div>

              {/* STATUS & CATEGORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <input
                    placeholder="e.g., Electronics, Fashion, Home"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>

            {/* BUNDLE ITEMS */}
            <motion.div
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bundle Items</h2>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add Item
                </button>
              </div>

              <AnimatePresence>
                {items.map((it, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-4 mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Item {idx + 1}</h4>
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
                        value={it.title}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx].title = e.target.value;
                          setItems(copy);
                        }}
                        className="h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      />

                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Item Price *"
                          value={it.price}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx].price = e.target.value;
                            setItems(copy);
                          }}
                          className="w-full h-12 px-4 pl-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          currency_rupee
                        </span>
                      </div>
                    </div>

                    <textarea
                      placeholder="Item description (optional)"
                      value={it.description}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].description = e.target.value;
                        setItems(copy);
                      }}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                      rows={2}
                    />

                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          const reader = new FileReader();

                          reader.onloadend = () => {
                            const copy = [...items];
                            copy[idx].image = reader.result;
                            setItems(copy);
                          };

                          reader.readAsDataURL(file);
                        }}
                        className="flex-1"
                      />
                      {it.image && (
                        <img
                          src={it.image}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">inventory_2</div>
                  <p>No items added yet</p>
                  <p className="text-sm">Add products to create your bundle</p>
                </div>
              )}
            </motion.div>

            {/* IMAGE UPLOADER */}
            <motion.div
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Bundle Images</h2>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:border-primary dark:hover:border-primary transition-colors duration-300">
                <input
                  type="file"
                  multiple
                  onChange={handleImages}
                  className="hidden"
                  id="bundle-images"
                />
                <label
                  htmlFor="bundle-images"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">add_photo_alternate</span>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Click to upload images</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={img}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                      <button
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
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
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bundle Preview</h2>

              {(title || images.length > 0) && (
                <div className="space-y-4">
                  {images[0] && (
                    <img
                      src={images[0]}
                      className="w-full h-40 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                  )}

                  {title && (
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{title}</h3>
                  )}

                  <div className="space-y-2">
                    {price && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{price}</span>
                        {oldPrice && (
                          <>
                            <span className="text-lg line-through text-gray-400">₹{oldPrice}</span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Save {calculateSavings()}%
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {items.length > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {items.length} items • Total value: ₹{totalItemsPrice.toFixed(2)}
                        {bundleSavings > 0 && (
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            {" "}(Save ₹{bundleSavings.toFixed(2)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(!title && images.length === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">preview</div>
                  <p className="text-sm">Preview will appear here</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={submitBundle}
                disabled={loading || !title || !price || items.length === 0}
                className="w-full mt-6 h-12 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Bundle...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check</span>
                    Create Bundle
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}