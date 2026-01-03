import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import API from "../api/api";

export default function PaymentSuccess() {
  const loc = useLocation();
  // expect orderId passed via location.state or query param ?orderId=
  const [order, setOrder] = useState(null);
  const query = new URLSearchParams(loc.search);
  const orderId = loc.state?.orderId || query.get("orderId");

  useEffect(() => {
    if (!orderId) return;
    const load = async () => {
      try {
        const { data } = await API.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.warn(err);
      }
    };
    load();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="bg-white p-10 rounded-xl shadow-sm">
        <h2 className="text-3xl font-semibold">Payment Successful 🎉</h2>
        <p className="mt-4 text-gray-600">Thank you — your order was placed successfully.</p>

        {order ? (
          <div className="mt-6 text-left">
            <div><strong>Order ID:</strong> {order._id}</div>
            <div><strong>Status:</strong> {order.status}</div>
            <div className="mt-3">
              <h4 className="font-semibold">Items</h4>
              <ul className="mt-2 space-y-2">
                {order.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{it.title || it.product}</span>
                    <span>₹{it.price} x {it.qty}</span>   
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <Link to={`/track/${order._id}`} className="px-4 py-2 bg-brandPink text-white rounded">Track Order</Link>
            </div>
          </div>
        ) : (
          <div className="mt-6">If you don't see order details immediately, check your profile later.</div>
        )}

        <div className="mt-6">
          <Link to="/" className="text-sm text-gray-500">Back to shopping</Link>
        </div>
      </div>
    </div>
  );
}
