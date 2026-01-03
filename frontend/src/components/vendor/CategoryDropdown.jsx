import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search } from "lucide-react";

export default function CategoryDropdown({ selected, setSelected }) {
  const [open, setOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [search, setSearch] = useState("");

  // Load categories from API
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get("/categories");
        setAllCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    load();
  }, []);

  const toggleCategory = (cat) => {
    if (selected.some((c) => c._id === cat._id)) {
      setSelected(selected.filter((c) => c._id !== cat._id));
    } else {
      setSelected([...selected, cat]);
    }
  };

  const filtered = allCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border bg-white px-4 py-3 rounded-xl flex justify-between items-center shadow-sm hover:bg-gray-50 transition"
      >
        <span className="text-gray-700">
          {selected.length === 0
            ? "Select categories"
            : selected.map((c) => c.name).join(", ")}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-xl border max-h-64 overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search category..."
                  className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Category list */}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No results</p>
              ) : (
                filtered.map((cat) => {
                  const isSelected = selected.some((c) => c._id === cat._id);
                  return (
                    <div
                      key={cat._id}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <span className="text-gray-700">{cat.name}</span>

                      {isSelected && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
