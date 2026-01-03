import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);

        // Calculate time since last update
        const updatedTime = new Date(data.updatedAt);
        const now = new Date();
        const diffHours = Math.floor((now - updatedTime) / (1000 * 60 * 60));

        if (diffHours < 1) {
          setLastUpdated("Just now");
        } else if (diffHours < 24) {
          setLastUpdated(`${diffHours} hours ago`);
        } else {
          setLastUpdated(`${Math.floor(diffHours / 24)} days ago`);
        }
      } catch (err) {
        console.warn("Failed to load order:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  // Order status timeline with icons and descriptions
  const statusTimeline = [
    {
      status: "pending",
      icon: "shopping_bag",
      title: "Order Placed",
      description: "We've received your order",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      status: "processing",
      icon: "sync",
      title: "Processing",
      description: "Preparing your items",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      status: "shipped",
      icon: "local_shipping",
      title: "Shipped",
      description: "Your order is on the way",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      status: "completed",
      icon: "check_circle",
      title: "Delivered",
      description: "Order delivered successfully",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      status: "delivered", // Alias for completed
      icon: "check_circle",
      title: "Delivered",
      description: "Order delivered successfully",
      color: "text-green-600",
      bgColor: "bg-green-100",
      hidden: true
    },
    {
      status: "cancelled",
      icon: "cancel",
      title: "Cancelled",
      description: "Order was cancelled",
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  // Get current status index
  const getStatusIndex = (status) => {
    if (status === "delivered" || status === "completed") return 3;
    return statusTimeline.findIndex(s => s.status === status);
  };

  const currentStatusIndex = getStatusIndex(order?.status);
  const visibleTimeline = statusTimeline.filter(s => !s.hidden);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <div className="space-y-3">
            <Link
              to="/orders"
              className="block px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              View All Orders
            </Link>
            <Link
              to="/"
              className="block px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <Link
              to="/orders"
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Orders
            </Link>
          </div>
          <p className="text-gray-600">Track your order #{id.slice(-8).toUpperCase()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Current Status</h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${order.status === 'delivered' || order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                      }`}>
                      {order.status === 'completed' ? 'Delivered' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">Last updated {lastUpdated}</span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">
                  <p className="text-sm text-gray-600">Order placed on</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {visibleTimeline.map((step, index) => {
                  const isActive = index <= currentStatusIndex;
                  const isCurrent = order.status === step.status || (step.status === "completed" && order.status === "delivered");

                  return (
                    <motion.div
                      key={step.status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex items-start gap-4 mb-6 last:mb-0"
                    >
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${isActive ? step.bgColor : 'bg-gray-100'
                        }`}>
                        <span className={`material-symbols-outlined ${isActive ? step.color : 'text-gray-400'}`}>
                          {step.icon}
                        </span>
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.title}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full animate-pulse">
                              Current
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                        {isCurrent && order.updatedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Updated: {new Date(order.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-pink-200 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
                          <span className="material-symbols-outlined text-pink-400">shopping_bag</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title || item.product}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Delivery */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono font-medium text-gray-900">{order._id.slice(-8).toUpperCase()}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod || 'Credit Card'}</span>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{order.originalTotal?.toLocaleString() || order.subtotal?.toLocaleString()}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{order.discount?.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-green-600">
                    <span>Shipping</span>
                    <span className="font-medium">FREE</span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">₹{order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
                <div>
                  <h3 className="text-xl font-bold">Delivery Information</h3>
                  <p className="text-blue-100 text-sm">Estimated delivery</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-blue-400/30">
                  <span>Estimated Delivery</span>
                  <span className="font-bold">
                    {estimatedDelivery.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-blue-400/30">
                  <span>Delivery Method</span>
                  <span className="font-bold">Standard Shipping</span>
                </div>

                <div className="pt-3">
                  <p className="text-blue-100 text-sm">Tracking updates will appear here</p>
                  <button className="w-full mt-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium">
                    View Tracking Details
                  </button>
                </div>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-pink-600">support_agent</span>
                <h3 className="text-lg font-bold text-gray-900">Need Help?</h3>
              </div>

              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Questions about your order? Our support team is here to help.
                </p>
                <button className="w-full py-3 border-2 border-pink-600 text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-colors">
                  Contact Support
                </button>
                <button className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Updates Footer */}
        <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl border border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-pink-600">notifications</span>
              <div>
                <p className="font-medium text-gray-900">Real-time Tracking</p>
                <p className="text-sm text-gray-600">
                  This page updates automatically. Last checked just now.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">refresh</span>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}