// import React, { useContext, useState } from "react";
// import { CartContext } from "../context/CartContext";
// import API from "../api/api";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function Checkout() {
//   const { cart, total, clearCart } = useContext(CartContext);
//   const stripe = useStripe();
//   const elements = useElements();

//   const [coupon, setCoupon] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const [finalTotal, setFinalTotal] = useState(total);
//   const [loading, setLoading] = useState(false);
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [couponMessage, setCouponMessage] = useState("");

//   // APPLY COUPON
//   const applyCoupon = async () => {
//     if (!coupon.trim()) {
//       setCouponMessage("Please enter a coupon code");
//       return;
//     }

//     try {
//       const { data } = await API.post("/orders/validate-coupon", {
//         code: coupon,
//         total,
//       });

//       setDiscount(data.discountAmount);
//       setFinalTotal(data.finalAmount);
//       setCouponApplied(true);
//       setCouponMessage(`🎉 ${data.message || "Coupon applied successfully!"}`);

//     } catch (err) {
//       setDiscount(0);
//       setFinalTotal(total);
//       setCouponApplied(false);
//       setCouponMessage(err.response?.data?.message || "Invalid coupon code");
//     }
//   };

//   // REMOVE COUPON
//   const removeCoupon = () => {
//     setCoupon("");
//     setDiscount(0);
//     setFinalTotal(total);
//     setCouponApplied(false);
//     setCouponMessage("");
//   };

//   // HANDLE PAYMENT
//   const handlePayment = async () => {
//     if (!stripe || !elements) return;

//     setLoading(true);

//     try {
//       const items = cart.map((item) => ({
//         product: item.product,
//         qty: item.qty,
//         price: item.price,
//         vendor: item.vendor,
//         title: item.title,
//       }));

//       // CREATE ORDER + PAYMENT INTENT
//       const { data } = await API.post("/orders", {
//         items,
//         couponCode: coupon || null,
//         shippingAddress: {
//           name: "User Name",
//           address: "Test Address",
//           phone: "9999999999",
//         },
//       });

//       const clientSecret = data.clientSecret;

//       // Confirm card payment
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: "User Name",
//           },
//         },
//       });

//       if (result.error) {
//         alert(result.error.message);
//         setLoading(false);
//         return;
//       }

//       // CONFIRM ORDER
//       await API.post("/orders/confirm", {
//         paymentIntentId: result.paymentIntent.id,
//       });

//       clearCart();
//       window.location.href = "/payment-success";

//     } catch (err) {
//       alert(err.response?.data?.message );
//       setLoading(false);
//     }
//   };

//   // Calculate item count
//   const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
//           <div className="flex items-center text-gray-600">
//             <Link to="/cart" className="text-pink-600 hover:text-pink-700">Cart</Link>
//             <span className="mx-2">›</span>
//             <span className="font-medium text-gray-900">Payment</span>
//             <span className="mx-2">›</span>
//             <span className="text-gray-500">Confirmation</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Order Summary */}
//           <div className="lg:col-span-2">
//             {/* Cart Items */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
//                 <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
//                   {itemCount} {itemCount === 1 ? 'item' : 'items'}
//                 </span>
//               </div>

//               <div className="space-y-4">
//                 {cart.map((item) => (
//                   <motion.div
//                     key={item.product}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-pink-200 transition-colors"
//                   >
//                     <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
//                       {item.image ? (
//                         <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
//                           <span className="material-symbols-outlined text-pink-400">shopping_bag</span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
//                       <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-gray-900">₹{item.price * item.qty}</p>
//                       <p className="text-sm text-gray-500">₹{item.price} each</p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>

//             {/* Payment Details */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Card Information
//                   </label>
//                   <div className="p-4 border border-gray-300 rounded-xl hover:border-pink-400 transition-colors">
//                     <CardElement 
//                       options={{
//                         style: {
//                           base: {
//                             fontSize: '16px',
//                             color: '#424770',
//                             '::placeholder': {
//                               color: '#a0aec0',
//                             },
//                           },
//                         },
//                       }}
//                     />
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
//                     <span className="material-symbols-outlined text-sm">lock</span>
//                     Your payment is secured with SSL encryption
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-600">
//                   <span className="material-symbols-outlined text-green-500">verified</span>
//                   <span className="text-sm">Secure 256-bit SSL encryption</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Order Total & Actions */}
//           <div>
//             {/* Order Summary Card */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

//               <div className="space-y-4">
//                 <div className="flex justify-between py-2">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium">₹{total.toLocaleString()}</span>
//                 </div>

//                 <div className="flex justify-between py-2">
//                   <span className="text-gray-600">Shipping</span>
//                   <span className="font-medium text-green-600">FREE</span>
//                 </div>

//                 {/* Coupon Section */}
//                 <div className="border-t border-b border-gray-200 py-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-gray-600">Discount</span>
//                     {discount > 0 && (
//                       <span className="font-medium text-green-600">-₹{discount.toLocaleString()}</span>
//                     )}
//                   </div>

//                   {couponApplied ? (
//                     <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
//                       <div className="flex items-center gap-2">
//                         <span className="material-symbols-outlined text-green-600">check_circle</span>
//                         <span className="text-green-700 font-medium">{coupon}</span>
//                       </div>
//                       <button
//                         onClick={removeCoupon}
//                         className="text-red-500 hover:text-red-700 text-sm"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="flex gap-2">
//                       <input
//                         className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
//                         placeholder="Coupon code"
//                         value={coupon}
//                         onChange={(e) => setCoupon(e.target.value)}
//                       />
//                       <button
//                         onClick={applyCoupon}
//                         className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   )}

//                   {couponMessage && (
//                     <p className={`mt-2 text-sm ${couponApplied ? 'text-green-600' : 'text-red-600'}`}>
//                       {couponMessage}
//                     </p>
//                   )}
//                 </div>

//                 {/* Total */}
//                 <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//                   <div>
//                     <span className="text-gray-600">Total</span>
//                     <p className="text-sm text-gray-500">Including all taxes</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-3xl font-bold text-gray-900">₹{finalTotal.toLocaleString()}</p>
//                     {discount > 0 && (
//                       <p className="text-sm text-green-600 line-through">₹{total.toLocaleString()}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Pay Button */}
//               <button
//                 onClick={handlePayment}
//                 disabled={loading || !stripe || cart.length === 0}
//                 className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-3"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <span className="material-symbols-outlined">lock</span>
//                     Pay ₹{finalTotal.toLocaleString()}
//                   </>
//                 )}
//               </button>

//               {/* Security Badges */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <p className="text-center text-sm text-gray-600 mb-3">Secure Payment</p>
//                 <div className="flex justify-center gap-6">
//                   <div className="text-center">
//                     <div className="text-2xl">🔒</div>
//                     <p className="text-xs text-gray-500 mt-1">SSL Secure</p>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl">💳</div>
//                     <p className="text-xs text-gray-500 mt-1">Cards</p>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl">🛡️</div>
//                     <p className="text-xs text-gray-500 mt-1">Protected</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Need Help */}
//               <div className="mt-6 p-4 bg-blue-50 rounded-xl">
//                 <div className="flex items-center gap-3">
//                   <span className="material-symbols-outlined text-blue-600">help</span>
//                   <div>
//                     <p className="text-sm font-medium text-blue-800">Need help?</p>
//                     <p className="text-xs text-blue-600">Contact support@example.com</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Continue Shopping */}
//             <Link
//               to="/products"
//               className="mt-4 block text-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
//             >
//               ← Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
/* --- COMPLETE RESPONSIVE CHECKOUT COMPONENT --- */

import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import API from "../api/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);


  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(total);
  const [loading, setLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);


  useEffect(() => {
    const loadAddress = async () => {
      try {
        const { data } = await API.get("/user/addresses");
        setAddresses(data || []);
        if (data.length > 0) setSelectedAddress(data[0]);
      } catch (err) { }
    };
    loadAddress();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);


  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }
    try {
      const { data } = await API.post("/orders/validate-coupon", {
        code: coupon,
        total,
      });

      setDiscount(data.discountAmount);
      setFinalTotal(data.finalAmount);
      setCouponApplied(true);
      setCouponMessage(data.message || "Coupon applied!");
    } catch (err) {
      setDiscount(0);
      setFinalTotal(total);
      setCouponApplied(false);
      setCouponMessage(err.response?.data?.message || "Invalid coupon");
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setFinalTotal(total);
    setCouponApplied(false);
    setCouponMessage("");
  };


  const handlePayment = async () => {
    if (!razorpayLoaded) return;
    if (!user) {
      alert("Please login to proceed with payment");
      window.location.href = "/login";
      return;
    }

    // Validate addresses exist
    if (addresses.length === 0) {
      alert("Please add a shipping address before proceeding with payment");
      window.location.href = "/profile";
      return;
    }

    // Validate address is selected
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((i) => ({
        product: i.product || i._id || i.id || i.productId,
        qty: i.qty,
        price: i.price,
        vendor: i.vendor,
        title: i.title,
      }));

      const { data } = await API.post("/orders", {
        items,
        couponCode: coupon || null,
        shippingAddress: selectedAddress,
      });

      const options = {
        key: data.keyId,
        amount: Math.round(Number(data.finalAmount) * 100),
        currency: "INR",
        name: "Checkout",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        prefill: {
          name: selectedAddress.name || user?.name || "",
          email: user?.email || "",
          contact: selectedAddress.phone || "",
        },
        notes: {
          address: selectedAddress.address || "",
        },
        handler: async function (response) {
          try {
            const res = await API.post("/orders/confirm", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            // navigate is already defined via hook in this component? Checking...
            // navigate needs to be defined. It is imported from 'react-router-dom'? No, I see Link. I need to check imports.
            window.location.href = `/payment-success?orderId=${res.data.order._id}`;
            // Better to use window.location.href with query param if navigate is not available or to be safe with callback context, 
            // but query param is supported by PaymentSuccess.jsx (Line 10: query.get("orderId"))
            // So window.location.href = ...?orderId=... is safe and easy.
          } catch (err) {
            alert(err.response?.data?.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },

        theme: { color: "#ec4899" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (resp) {
        setLoading(false);

        // Update order status to failed
        try {
          await API.put(`/orders/${data.orderId}/status`, { status: "failed" });
        } catch (err) {
          console.error("Failed to update order status:", err);
        }

        alert(resp.error?.description || "Payment failed");
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message);
      setLoading(false);
    }
  };


  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);


  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Checkout</h1>

          <div className="flex flex-wrap items-center text-gray-600 text-sm sm:text-base">
            <Link to="/cart" className="text-pink-600 font-medium">Cart</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Payment</span>
            <span className="mx-2">›</span>
            <span className="text-gray-500">Confirmation</span>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* ADDRESS */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Shipping Address</h2>

              {addresses.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No saved address.{" "}
                  <Link to="/profile" className="text-pink-600">Add Address</Link>
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((a, i) => (
                    <label
                      key={a._id || i}
                      className={`block p-4 rounded-xl cursor-pointer border ${selectedAddress?._id === a._id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200"
                        }`}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        checked={selectedAddress?._id === a._id}
                        onChange={() => setSelectedAddress(a)}
                      />
                      <p className="font-medium text-gray-900">{a.name}</p>
                      <p className="text-gray-600 text-sm">{a.address}</p>
                      <p className="text-gray-600 text-sm">📞 {a.phone}</p>
                    </label>
                  ))}
                </div>
              )}
            </div>


            {/* CART */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Order</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  {itemCount} {itemCount > 1 ? "items" : "item"}
                </span>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[360px] pr-2">
                {cart.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm">Qty: {item.qty}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-sm sm:text-base">₹{(Number(item.price) || 0) * (Number(item.qty) || 1)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>


            {/* PAY */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
              <div className="p-4 border rounded-xl">
                <p className="text-sm text-gray-700">Pay using UPI with Razorpay Checkout</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Secure & encrypted
                </p>
              </div>
            </div>
          </div>


          {/* RIGHT summary */}
          <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border shadow-sm">

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{total}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                {/* coupon */}
                <div className="border-t border-b py-4 space-y-2">
                  {couponApplied ? (
                    <div className="flex justify-between bg-green-50 p-3 rounded-lg text-sm">
                      <span className="text-green-600 font-medium">{coupon}</span>
                      <button onClick={removeCoupon} className="text-red-500">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        className="flex-1 px-3 py-2 border rounded-xl text-sm"
                        placeholder="Coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-pink-600 text-white rounded-xl text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponMessage && (
                    <p className={`text-xs ${couponApplied ? "text-green-600" : "text-red-600"}`}>
                      {couponMessage}
                    </p>
                  )}
                </div>

                {/* total */}
                <div className="flex justify-between border-t pt-4">
                  <span>Total</span>
                  <span className="text-xl sm:text-2xl font-bold">₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !razorpayLoaded || cart.length === 0 || !user}
                className="mt-5 w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition text-sm sm:text-lg"
              >
                {loading ? "Processing..." : `Pay ₹${finalTotal}`}
              </button>
            </div>

            <Link
              to="/products"
              className="block text-center px-4 py-3 border rounded-xl text-gray-700 hover:bg-gray-100"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
