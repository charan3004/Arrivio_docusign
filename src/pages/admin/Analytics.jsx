import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AnalyticsStats from "../../components/admin/analytics/AnalyticsStats";
import AnalyticsChart from "../../components/admin/analytics/AnalyticsChart";
import BookingInsights from "../../components/admin/analytics/BookingInsights";
import { Users, DollarSign, Calendar, TrendingUp, MapPin, X } from "lucide-react";
import { supabase } from "../../supabase/client";

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeBookings: 0,
        revenue: 0,
        growth: 0
    });
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [cityRevenue, setCityRevenue] = useState([]);
    const [showCityRevenue, setShowCityRevenue] = useState(false);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch all users with created_at
                const [
                    { count: usersCount },
                    { count: bookingsCount },
                    { data: users },
                    { data: bookings }
                ] = await Promise.all([
                    supabase.from('users').select('*', { count: 'exact', head: true }),
                    supabase.from('booking_intents').select('*', { count: 'exact', head: true }),
                    supabase.from('users').select('created_at'),
                    supabase.from('booking_intents').select('created_at, properties(price, utilities, city)')
                ]);

                // ── User Growth by month (last 6 months) ──
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const now = new Date();
                const userMonths = {};
                const revenueMonths = {};

                // Initialize last 6 months
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
                    userMonths[key] = { name: label, users: 0 };
                    revenueMonths[key] = { name: label, revenue: 0 };
                }

                // Count users per month
                (users || []).forEach(u => {
                    const d = new Date(u.created_at);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    if (userMonths[key]) userMonths[key].users++;
                });

                // Accumulate revenue per month + per city
                const cityRevenueMap = {};
                (bookings || []).forEach(b => {
                    const d = new Date(b.created_at);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    const amount = (Number(b.properties?.price) || 0) + (Number(b.properties?.utilities) || 0);
                    if (revenueMonths[key]) revenueMonths[key].revenue += amount;

                    // City-wise
                    const city = b.properties?.city || 'Unknown';
                    cityRevenueMap[city] = (cityRevenueMap[city] || 0) + amount;
                });

                const userGrowth = Object.values(userMonths);
                const revenueGrowth = Object.values(revenueMonths);
                const totalRevenue = revenueGrowth.reduce((sum, m) => sum + m.revenue, 0);

                // Sort cities by revenue descending
                const sortedCityRevenue = Object.entries(cityRevenueMap)
                    .map(([city, revenue]) => ({ city, revenue }))
                    .sort((a, b) => b.revenue - a.revenue);
                setCityRevenue(sortedCityRevenue);

                // Growth rate: compare last month vs. previous month users
                const lastTwo = userGrowth.slice(-2);
                const growthRate = lastTwo[0]?.users > 0
                    ? (((lastTwo[1]?.users || 0) - lastTwo[0].users) / lastTwo[0].users * 100).toFixed(1)
                    : 0;

                setUserGrowthData(userGrowth);
                setRevenueData(revenueGrowth);
                setStats({
                    totalUsers: usersCount || 0,
                    activeBookings: bookingsCount || 0,
                    revenue: totalRevenue,
                    growth: Number(growthRate)
                });
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    // Handle Escape key to close revenue popup
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setShowCityRevenue(false);
            }
        };

        if (showCityRevenue) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showCityRevenue]);

    return (
        <div className="flex bg-[#F4F5F7] min-h-screen">
            <AdminSidebar />

            <main className="ml-64 p-8 w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
                        <p className="text-gray-500 mt-1">Monitor your platform's performance metrics.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-600">
                        Last 6 Months
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnalyticsStats
                                title="Total Users"
                                value={stats.totalUsers}
                                change="12%"
                                changeType="increase"
                                icon={Users}
                                color="bg-blue-500"
                            />
                            <div onClick={() => setShowCityRevenue(!showCityRevenue)} className="cursor-pointer">
                                <AnalyticsStats
                                    title="Total Revenue"
                                    value={`€${stats.revenue.toLocaleString()}`}
                                    change="8%"
                                    changeType="increase"
                                    icon={DollarSign}
                                    color="bg-green-500"
                                    clickable
                                />
                            </div>
                            <AnalyticsStats
                                title="Active Bookings"
                                value={stats.activeBookings}
                                change="3%"
                                changeType="decrease"
                                icon={Calendar}
                                color="bg-purple-500"
                            />
                            <AnalyticsStats
                                title="Growth Rate"
                                value={`${stats.growth}%`}
                                change="2%"
                                changeType="increase"
                                icon={TrendingUp}
                                color="bg-orange-500"
                            />
                        </div>

                        {/* City-wise Revenue Popup */}
                        <AnimatePresence>
                            {showCityRevenue && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                                    onClick={() => setShowCityRevenue(false)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ duration: 0.25 }}
                                        className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                <MapPin size={18} className="text-green-500" />
                                                Revenue by City
                                            </h3>
                                            <button
                                                onClick={() => setShowCityRevenue(false)}
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <X size={18} className="text-gray-400" />
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-400 mb-4">Total: <span className="font-bold text-gray-700">€{stats.revenue.toLocaleString()}</span></p>

                                        <div className="space-y-4">
                                            {cityRevenue.map((c, i) => {
                                                const percentage = stats.revenue > 0 ? Math.round((c.revenue / stats.revenue) * 100) : 0;
                                                return (
                                                    <div key={i}>
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                                                <span className="text-sm font-medium text-gray-700">{c.city}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-gray-400">{percentage}%</span>
                                                                <span className="text-sm font-bold text-gray-900">€{c.revenue.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <AnalyticsChart
                                title="User Growth"
                                data={userGrowthData}
                                type="line"
                                dataKey="users"
                                color="#3B82F6"
                            />
                            <AnalyticsChart
                                title="Revenue Overview"
                                data={revenueData}
                                type="bar"
                                dataKey="revenue"
                                color="#10B981"
                            />
                        </div>

                        {/* Booking Insights */}
                        <BookingInsights />
                    </div>
                )}
            </main>
        </div>
    );
}
