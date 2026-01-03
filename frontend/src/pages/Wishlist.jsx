import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { CartContext } from "../context/CartContext";
import useAuth from "../hooks/useAuth";

export default function Wishlist() {
  const { user } = useAuth();
  const { addToCart } = useContext(CartContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);



  const removeItem = async (productId) => {
    try {
      await API.delete(`/users/${user._id}/wishlist/${productId}`);

      setItems((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const fetchWishlist = async () => {
      try {
        const { data } = await API.get(`/users/${user._id}/wishlist`);
        if (isMounted) setItems(data || []);
      } catch (err) {
        console.error(err);
      }
      if (isMounted) setLoading(false);
    };

    fetchWishlist();
    return () => { isMounted = false; };
  }, [user?._id]);

  /* skeleton */
  const Skeleton = () => (
    <div className="animate-pulse border rounded-2xl p-4 shadow-sm bg-white/70">
      <div className="h-40 bg-gray-200 rounded-xl mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  );

  if (!user)
    return (
      <div className="text-center py-32 px-4 text-lg font-semibold text-gray-700">
        Please login to view your wishlist.
      </div>
    );

  if (loading)
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 py-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 font-display">

      {/* heading */}
      <h1 className="text-3xl sm:text-4xl font-black mb-10 text-gray-800 flex items-center gap-2">
        <span className="text-pink-600">❤️</span> My Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white/60 rounded-3xl border shadow-md px-6">
          <p className="text-2xl font-semibold text-gray-700 mb-2">
            Your wishlist is empty 💔
          </p>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Save items you love and shop later!
          </p>

          <Link
            to="/products"
            className="px-5 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition inline-block"
          >
            Browse Products →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="group bg-white backdrop-blur-xl rounded-2xl border shadow-md transition hover:shadow-lg hover:-translate-y-1"
            >
              {/* IMAGE */}
              <Link to={`/product/${item._id}`}>
                <div
                  className="w-full h-44 sm:h-48 bg-center bg-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${item.images?.[0] || "/placeholder.jpg"}")`,
                  }}
                />
              </Link>

              {/* details */}
              <div className="p-4 sm:p-5">
                <Link to={`/product/${item._id}`}>
                  <h2
                    className="font-semibold text-gray-800 text-base sm:text-lg line-clamp-2 group-hover:text-pink-600 transition"
                  >
                    {item.title}
                  </h2>
                </Link>

                <p className="text-xl font-bold text-gray-900 mt-1">₹{item.price}</p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white shadow hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition shadow"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
