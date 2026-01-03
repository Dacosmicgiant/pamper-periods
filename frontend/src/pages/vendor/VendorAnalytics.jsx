// import React, { useEffect, useState } from "react";
// import VendorSidebar from "../../components/vendor/VendorSidebar";
// import VendorTopbar from "../../components/vendor/VendorTopbar";
// import API from "../../api/api";
// import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// export default function VendorAnalytics() {
//   const [data, setData] = useState({ chart: [], revenue: 0, orders: 0, aov: 0 });

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data: resp } = await API.get("/vendor/analytics");
//         setData(resp);
//       } catch (err) {
//         console.warn("analytics error", err);
//       }
//     })();
//   }, []);

//   return (
//     <div className="flex">
//       <VendorSidebar />
//       <div className="flex-1">
//         <VendorTopbar title="Analytics" />
//         <main className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="p-6 bg-white rounded-xl border">
//               <div className="text-sm text-neutral">Revenue</div>
//               <div className="text-2xl font-bold">₹{data.revenue}</div>
//             </div>
//             <div className="p-6 bg-white rounded-xl border">
//               <div className="text-sm text-neutral">Orders</div>
//               <div className="text-2xl font-bold">{data.orders}</div>
//             </div>
//             <div className="p-6 bg-white rounded-xl border">
//               <div className="text-sm text-neutral">AOV</div>
//               <div className="text-2xl font-bold">₹{data.aov}</div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl border">
//             <h3 className="font-semibold mb-4">Sales (period)</h3>
//             <div style={{ width: "100%", height: 300 }}>
//               <ResponsiveContainer>
//                 <AreaChart data={data.chart || []}>
//                   <XAxis dataKey="label"/>
//                   <Tooltip/>
//                   <Area dataKey="value" stroke="#1132d4" fill="#e7eeff"/>
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import API from "../../api/api";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend 
} from "recharts";

export default function VendorAnalytics() {
  const [data, setData] = useState({ 
    chart: [], 
    revenue: 0, 
    orders: 0, 
    aov: 0,
    topProducts: [],
    traffic: [],
    conversion: 0
  });

  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data: resp } = await API.get(`/vendor/analytics?range=${timeRange}`);
      setData(resp);
    } catch (err) {
      console.warn("analytics error", err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration (remove in production)
  const mockChartData = [
    { label: "Mon", sales: 4200, orders: 12 },
    { label: "Tue", sales: 5200, orders: 18 },
    { label: "Wed", sales: 6100, orders: 21 },
    { label: "Thu", sales: 4800, orders: 14 },
    { label: "Fri", sales: 7200, orders: 25 },
    { label: "Sat", sales: 8900, orders: 32 },
    { label: "Sun", sales: 7500, orders: 28 },
  ];

  const mockTopProducts = [
    { name: "Premium Bundle", sales: 45, revenue: 12500 },
    { name: "Basic Kit", sales: 38, revenue: 8900 },
    { name: "Luxury Set", sales: 22, revenue: 16500 },
    { name: "Starter Pack", sales: 18, revenue: 5400 },
    { name: "Accessories", sales: 12, revenue: 3200 },
  ];

  const trafficData = [
    { name: "Direct", value: 40, color: "#8884d8" },
    { name: "Social", value: 30, color: "#82ca9d" },
    { name: "Email", value: 20, color: "#ffc658" },
    { name: "Referral", value: 10, color: "#ff8042" },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${data.revenue?.toLocaleString() || "0"}`,
      change: "+12.5%",
      trend: "up",
      icon: "💰",
      color: "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    },
    {
      title: "Total Orders",
      value: data.orders || "0",
      change: "+8.2%",
      trend: "up",
      icon: "📦",
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
    },
    {
      title: "Average Order Value",
      value: `₹${data.aov || "0"}`,
      change: "+5.3%",
      trend: "up",
      icon: "📊",
      color: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
    },
    {
      title: "Conversion Rate",
      value: `${data.conversion || "2.4"}%`,
      change: "+1.2%",
      trend: "up",
      icon: "📈",
      color: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200"
    }
  ];

  if (loading) {
    return (
      <div className="flex">
        <VendorSidebar />
        <div className="flex-1">
          <VendorTopbar title="Analytics" />
          <main className="p-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-gray-500">Loading analytics...</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <VendorSidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <VendorTopbar title="Analytics Dashboard" />
        
        <main className="p-4 lg:p-6">
          {/* Header with Time Range Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Overview</h1>
              <p className="text-gray-600 mt-1">Track your store performance and sales metrics</p>
            </div>
            
            <div className="flex gap-2 mt-4 lg:mt-0">
              {["day", "week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    timeRange === range 
                      ? "bg-pink-600 text-white shadow-lg" 
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-all duration-300 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`${stat.color} border rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.trend === "up" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sales Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sales Overview</h3>
                  <p className="text-sm text-gray-600">Revenue and orders over time</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span className="text-xs text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">Orders</span>
                  </div>
                </div>
              </div>
              
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={data.chart.length ? data.chart : mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="label" 
                      stroke="#666" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={12}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'sales' ? `₹${value}` : value,
                        name === 'sales' ? 'Revenue' : 'Orders'
                      ]}
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ec4899" 
                      fill="#fce7f3" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3b82f6" 
                      fill="#dbeafe" 
                      strokeWidth={2}
                      name="Orders"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
                  <p className="text-sm text-gray-600">Best selling items by revenue</p>
                </div>
                <span className="text-sm text-pink-600 font-medium">View All →</span>
              </div>
              
              <div className="space-y-4">
                {mockTopProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-pink-200 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📦</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">₹{(product.revenue / product.sales).toFixed(0)} avg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Traffic Sources</h3>
                <p className="text-sm text-gray-600">Where your visitors come from</p>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                {trafficData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                      <span className="text-sm font-medium text-gray-700">{source.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{source.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">Latest orders and updates</p>
                </div>
                <span className="text-sm text-pink-600 font-medium">View All →</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { action: "New Order", details: "Order #ORD-7892", amount: "₹4,299", time: "2 min ago", status: "success" },
                  { action: "Order Shipped", details: "Order #ORD-7891", amount: "₹2,899", time: "1 hour ago", status: "info" },
                  { action: "Payment Received", details: "Order #ORD-7890", amount: "₹6,499", time: "3 hours ago", status: "success" },
                  { action: "New Customer", details: "John Doe registered", amount: "", time: "5 hours ago", status: "info" },
                  { action: "Product Review", details: "5 stars for Premium Bundle", amount: "", time: "1 day ago", status: "warning" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === "success" ? "bg-green-100 text-green-600" :
                      activity.status === "info" ? "bg-blue-100 text-blue-600" :
                      "bg-yellow-100 text-yellow-600"
                    }`}>
                      <span className="material-symbols-outlined text-lg">
                        {activity.action.includes("Order") ? "shopping_bag" : 
                         activity.action.includes("Payment") ? "payments" :
                         activity.action.includes("Customer") ? "person_add" : "star"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.details}</p>
                    </div>
                    <div className="text-right">
                      {activity.amount && <p className="font-bold text-gray-900">{activity.amount}</p>}
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Section */}
          <div className="mt-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl border border-pink-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">📈 Performance Insights</h3>
                <p className="text-gray-700">
                  Your store is performing <span className="font-bold text-green-600">12.5% better</span> than last {timeRange}. 
                  Keep up the momentum by promoting your top products.
                </p>
              </div>
              <button className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors shadow-lg hover:shadow-xl">
                Download Report
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}