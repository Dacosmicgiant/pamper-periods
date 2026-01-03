import React, { useEffect, useState } from "react";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import API from "../../api/api";

export default function VendorDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/vendor/dashboard");
        setStats(data);
      } catch (err) {
        console.warn("Dashboard load err", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen">
        <VendorSidebar />
        <div className="flex-1">
          <VendorTopbar title="Dashboard" />
          <main className="p-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-xl border h-24" />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <VendorSidebar />

      <div className="flex-1">
        <VendorTopbar title="Dashboard" />

        <main className="p-6">
          
          <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
            Dashboard Overview
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm">
                Total Products
              </h3>
              <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {stats.totalProducts}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm">
                Total Orders
              </h3>
              <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {stats.totalOrders}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm">
                Revenue Earned
              </h3>
              <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                ₹{stats.totalRevenue?.toLocaleString()}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
