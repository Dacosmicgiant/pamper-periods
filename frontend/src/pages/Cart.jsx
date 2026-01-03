import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useContext(CartContext);
  const navigate = useNavigate();

  // Empty Cart UI
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/102/102661.png"
          className="w-28 sm:w-32 mx-auto opacity-70"
          alt="empty"
        />

        <h2 className="text-2xl font-semibold mt-4">Your Cart is Empty</h2>

        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Looks like you haven’t added anything yet.
        </p>

        <Link
          to="/products"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r 
          from-pink-500 to-pink-600 text-white font-semibold shadow-md hover:opacity-90"
        >
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 font-display">

      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">
        Your Cart
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item.uniqueId}
              className="
                flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 bg-white 
                border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition
              "
            >
              {/* Image */}
              <div className="w-full sm:w-32 h-40 sm:h-28 rounded-xl overflow-hidden bg-gray-100">
                <img src={item.image} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>

                {/* Bundle extras */}
                {item.type === "bundle" && (
                  <div className="mt-2 px-3 py-2 bg-pink-50 border border-pink-200 rounded-lg 
                                  text-pink-700 text-sm space-y-1">
                    <div><strong>Variant:</strong> {item.variant}</div>
                    <div><strong>Color:</strong> {item.color}</div>
                  </div>
                )}

                {/* Price */}
                <p className="text-gray-600 text-sm mt-3">
                  Price: <span className="font-bold text-gray-900">₹{item.price}</span>
                </p>

                {/* Qty */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm text-gray-600">Qty:</span>

                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item.uniqueId, Number(e.target.value))
                    }
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.uniqueId)}
                  className="mt-3 text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>

              {/* Final price */}
              <div className="text-right font-semibold text-lg text-gray-800">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Order Summary
          </h3>

          <div className="flex justify-between mb-3 text-gray-700">
            <span>Subtotal</span><span>₹{total}</span>
          </div>

          <div className="flex justify-between mb-3 text-gray-700">
            <span>Shipping</span>
            <span className="text-green-600 font-semibold">FREE</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-2xl font-bold text-gray-900">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="
              w-full mt-6 bg-gradient-to-r from-pink-500 to-pink-600
              hover:opacity-90 text-white py-3 rounded-xl text-lg font-semibold shadow-md
            "
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
