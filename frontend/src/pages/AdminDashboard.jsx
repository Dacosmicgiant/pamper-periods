import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";
import { motion } from "framer-motion";
import AdminLayout from "../layouts/AdminLayout";

// Brand Palette: Pink, Purple, Cyan, Emerald, Amber
const COLORS = ["#db2777", "#9333ea", "#0891b2", "#059669", "#d97706"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    load();
  }, []);

  // LOADING STATE
  if (!stats)
    return (
      <AdminLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Syncing dashboard data...</p>
        </div>
      </AdminLayout>
    );

  // DATA TRANSFORMATIONS
  const lineData = stats.salesByDay?.map(s => ({
    date: s._id,
    revenue: s.revenue || 0
  })) || [];

  const pieData = stats.topVendors?.map(t => ({
    name: t.shopName,
    value: t.revenue
  })) || [];

  return (
    <AdminLayout>
      <div className="p-4 lg:p-10 font-sans max-w-[1600px] mx-auto">
        
        {/* HEADER SECTION */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Analytics Console</h1>
            <p className="text-gray-500 mt-1 font-medium">Real-time performance metrics for Pamper Period.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-2 rounded-2xl text-sm font-bold text-gray-500 shadow-sm">
               {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="bg-pink-50 text-pink-700 px-4 py-2 rounded-2xl text-sm font-bold border border-pink-100 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
              </span>
              Live Updates
            </div>
          </div>
        </header>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {[
            { label: "Total Orders", val: stats.totalOrders, icon: "local_mall", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Gross Revenue", val: `₹${Math.round(stats.totalRevenue || 0).toLocaleString()}`, icon: "payments", color: "text-pink-600", bg: "bg-pink-50" },
            { label: "Active Vendors", val: stats.totalVendors, icon: "storefront", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((card, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white dark:bg-gray-900 p-7 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-pink-100/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
                  <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                </div>
              </div>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">{card.label}</p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{card.val || 0}</h2>
            </motion.div>
          ))}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* REVENUE LINE CHART */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-pink-600 rounded-full"></span>
              Revenue Flow
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#db2777" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#db2777', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* VENDOR PIE CHART */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
              Market Share
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM QUICK STATS */}
        {/* BOTTOM QUICK STATS - Balanced 3-column grid */}
<div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
  {[
    { 
      label: "Users", 
      val: stats.totalUsers, 
      sub: "Registered Members", 
      icon: "person",
      color: "text-blue-500"
    },
    { 
      label: "Pending", 
      val: stats.pendingOrders, 
      sub: "Awaiting Action", 
      icon: "pending",
      color: "text-amber-500" 
    },
    { 
      label: "Fulfilled", 
      val: stats.completedOrders, 
      sub: "Successful Deliveries", 
      icon: "check_circle",
      color: "text-emerald-500"
    },
  ].map((s, i) => (
    <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-5 group shadow-sm">
      <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-all group-hover:scale-110`}>
        <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{s.label}</p>
        <p className="text-2xl font-black text-gray-800 dark:text-white leading-none">{s.val || 0}</p>
        <p className="text-[10px] text-gray-500 font-medium mt-1">{s.sub}</p>
      </div>
    </div>
  ))}
</div>

      </div>
    </AdminLayout>
  );
}