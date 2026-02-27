import { useEffect, useState } from "react";
import { Home, Users, DollarSign, Calendar, Eye, Clock } from "lucide-react";
import { supabase } from "../../supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";

export default function AdminDashboard() {
  // =========================
  // STATE
  // =========================
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    revenue: 0,
    bookings: 0,
    intents: 0,
    sessions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);

  const [showIntents, setShowIntents] = useState(false);
  const [intents, setIntents] = useState([]);

  // =========================
  // FETCH COUNTS
  // =========================
  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: properties },
        { count: users },
        { count: intentCount },
        { count: sessions },
        { data: allBookings },
        { data: recentBookings },
      ] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("booking_intents").select("*", { count: "exact", head: true }),
        supabase.from("visitor_sessions").select("*", { count: "exact", head: true }),
        supabase.from("booking_intents").select("created_at, status, properties(price, utilities, city)"),
        supabase
          .from("booking_intents")
          .select("id, created_at, status, users(name, email), properties(title, city)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      // ── Compute revenue ──
      const bookings = allBookings || [];
      let totalRevenue = 0;
      let activeCount = 0;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const revenueMonths = {};

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const label = monthNames[d.getMonth()];
        revenueMonths[key] = { name: label, revenue: 0 };
      }

      bookings.forEach((b) => {
        const amount = (Number(b.properties?.price) || 0) + (Number(b.properties?.utilities) || 0);
        totalRevenue += amount;

        // Active bookings = those with status Pending or In Progress
        const s = b.status?.toLowerCase();
        if (s === "pending" || s === "in progress") activeCount++;

        // Monthly revenue
        const d = new Date(b.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (revenueMonths[key]) revenueMonths[key].revenue += amount;
      });

      setRevenueChart(Object.values(revenueMonths));
      setRecentActivity(recentBookings || []);

      setStats({
        properties: properties || 0,
        users: users || 0,
        revenue: totalRevenue,
        bookings: activeCount,
        intents: intentCount || 0,
        sessions: sessions || 0,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  // =========================
  // FETCH INTENTS TABLE
  // =========================
  async function fetchIntents() {
    const { data } = await supabase
      .from("booking_intents")
      .select(`
        *,
        users(name,email),
        properties(title,city)
      `)
      .order("created_at", { ascending: false });

    setIntents(data || []);
    setShowIntents(true);
  }

  // =========================
  // TIME AGO HELPER
  // =========================
  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="flex bg-[#F4F5F7] min-h-screen">
      <AdminSidebar />

      <main className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <>
            {/* ================= ORIGINAL 4 CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Properties"
                value={stats.properties}
                icon={Home}
                color="bg-blue-500"
              />

              <StatCard
                title="Total Users"
                value={stats.users}
                icon={Users}
                color="bg-green-500"
              />

              <StatCard
                title="Total Revenue"
                value={`€${stats.revenue.toLocaleString()}`}
                icon={DollarSign}
                color="bg-purple-500"
              />

              <StatCard
                title="Active Bookings"
                value={stats.bookings}
                icon={Calendar}
                color="bg-orange-500"
              />
            </div>

            {/* ================= EXTRA CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* CLICKABLE */}
              <div onClick={fetchIntents} className="cursor-pointer">
                <StatCard
                  title="Booking Intents"
                  value={stats.intents}
                  icon={Calendar}
                  color="bg-indigo-500"
                />
              </div>

              {/* NOT CLICKABLE */}
              <StatCard
                title="Visitors"
                value={stats.sessions}
                icon={Eye}
                color="bg-pink-500"
              />
            </div>

            {/* ================= LIVE PANELS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* RECENT ACTIVITY */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  Recent Activity
                </h3>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {(item.users?.name || item.users?.email || "G")[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item.users?.name || "Guest"}{" "}
                            <span className="font-normal text-gray-400">booked</span>{" "}
                            {item.properties?.title || "a property"}
                          </p>
                          <p className="text-xs text-gray-400">{item.properties?.city}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.status?.toLowerCase() === "success" || item.status?.toLowerCase() === "paid"
                            ? "bg-green-100 text-green-600"
                            : item.status?.toLowerCase() === "refunded"
                              ? "bg-red-50 text-red-500"
                              : "bg-yellow-50 text-yellow-600"
                            }`}>
                            {item.status || "Pending"}
                          </span>
                          <p className="text-[10px] text-gray-300 mt-1">{timeAgo(item.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No recent activity.</p>
                )}
              </div>

              {/* REVENUE OVERVIEW CHART */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  Revenue Overview
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueChart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                        tickFormatter={(v) => `€${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                      />
                      <Tooltip
                        formatter={(val) => [`€${val.toLocaleString()}`, "Revenue"]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ================= BOOKING INTENTS TABLE (ONLY WHEN CLICKED) ================= */}
            {showIntents && (
              <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
                <h3 className="font-semibold mb-4">Booking Intents</h3>

                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Property</th>
                      <th className="p-3 text-left">City</th>
                    </tr>
                  </thead>

                  <tbody>
                    {intents.map((i) => (
                      <tr key={i.id} className="border-t">
                        <td className="p-3">{i.users?.name || "Guest"}</td>
                        <td className="p-3">{i.users?.email || "—"}</td>
                        <td className="p-3">{i.properties?.title}</td>
                        <td className="p-3">{i.properties?.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
