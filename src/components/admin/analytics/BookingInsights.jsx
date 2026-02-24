import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase/client";
import {
    TrendingUp,
    TrendingDown,
    MapPin,
    Home,
    Calendar,
    Loader,
    Crown,
    Award,
} from "lucide-react";

export default function BookingInsights() {
    const [loading, setLoading] = useState(true);
    const [topProperties, setTopProperties] = useState([]);
    const [bottomProperties, setBottomProperties] = useState([]);
    const [topCities, setTopCities] = useState([]);
    const [bottomCities, setBottomCities] = useState([]);
    const [popularDates, setPopularDates] = useState([]);

    useEffect(() => {
        fetchInsights();
    }, []);

    async function fetchInsights() {
        try {
            const { data, error } = await supabase
                .from("booking_intents")
                .select(`
                    id,
                    check_in,
                    check_out,
                    properties (
                        id,
                        title,
                        city,
                        cover_image
                    )
                `)
                .not("properties", "is", null);

            if (error) throw error;

            const bookings = data || [];

            // ── Property rankings ──
            const propertyCounts = {};
            bookings.forEach((b) => {
                const p = b.properties;
                if (!p) return;
                const key = p.id;
                if (!propertyCounts[key]) {
                    propertyCounts[key] = { title: p.title, city: p.city, image: p.cover_image, count: 0 };
                }
                propertyCounts[key].count++;
            });

            const sortedProperties = Object.values(propertyCounts).sort((a, b) => b.count - a.count);
            setTopProperties(sortedProperties.slice(0, 5));
            setBottomProperties([...sortedProperties].reverse().slice(0, 5));

            // ── City rankings ──
            const cityCounts = {};
            bookings.forEach((b) => {
                const city = b.properties?.city;
                if (!city) return;
                cityCounts[city] = (cityCounts[city] || 0) + 1;
            });

            const sortedCities = Object.entries(cityCounts)
                .map(([city, count]) => ({ city, count }))
                .sort((a, b) => b.count - a.count);

            setTopCities(sortedCities.slice(0, 5));
            setBottomCities([...sortedCities].reverse().slice(0, 5));

            // ── Popular dates (months) ──
            const dateCounts = {};
            bookings.forEach((b) => {
                if (!b.check_in) return;
                const d = new Date(b.check_in);
                const monthKey = d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
                dateCounts[monthKey] = (dateCounts[monthKey] || 0) + 1;
            });

            const sortedDates = Object.entries(dateCounts)
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6);

            setPopularDates(sortedDates);
        } catch (err) {
            console.error("Error fetching booking insights:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader className="animate-spin text-gray-400" size={24} />
            </div>
        );
    }

    const rankColors = ["bg-yellow-400 text-white", "bg-gray-400 text-white", "bg-amber-600 text-white"];

    return (
        <div className="space-y-8">
            {/* ── TOP / BOTTOM PROPERTIES ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Properties */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-500" />
                        <h3 className="text-base font-semibold text-gray-800">Most Popular Properties</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {topProperties.length > 0 ? topProperties.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${rankColors[i] || 'bg-gray-100 text-gray-400'}`}>
                                    {i + 1}
                                </span>
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{p.title}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{p.city}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {p.count} booking{p.count !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )) : (
                            <p className="px-6 py-8 text-sm text-gray-400 text-center">No data available</p>
                        )}
                    </div>
                </div>

                {/* Bottom Properties */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
                        <TrendingDown size={18} className="text-red-400" />
                        <h3 className="text-base font-semibold text-gray-800">Least Popular Properties</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {bottomProperties.length > 0 ? bottomProperties.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                <span className="text-sm font-bold text-gray-300 w-8 text-center shrink-0">#{i + 1}</span>
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{p.title}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{p.city}</p>
                                </div>
                                <span className="bg-red-50 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {p.count} booking{p.count !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )) : (
                            <p className="px-6 py-8 text-sm text-gray-400 text-center">No data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── TOP / BOTTOM CITIES ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Cities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
                        <Crown size={18} className="text-amber-500" />
                        <h3 className="text-base font-semibold text-gray-800">Top Cities</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {topCities.length > 0 ? topCities.map((c, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${rankColors[i] || 'bg-gray-100 text-gray-400'}`}>
                                    {i + 1}
                                </span>
                                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-amber-500" />
                                </div>
                                <p className="flex-1 font-medium text-gray-900 text-sm">{c.city}</p>
                                <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {c.count} booking{c.count !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )) : (
                            <p className="px-6 py-8 text-sm text-gray-400 text-center">No data available</p>
                        )}
                    </div>
                </div>

                {/* Bottom Cities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
                        <TrendingDown size={18} className="text-gray-400" />
                        <h3 className="text-base font-semibold text-gray-800">Lowest Picked Cities</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {bottomCities.length > 0 ? bottomCities.map((c, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                <span className="text-sm font-bold text-gray-300 w-8 text-center shrink-0">#{i + 1}</span>
                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-gray-400" />
                                </div>
                                <p className="flex-1 font-medium text-gray-900 text-sm">{c.city}</p>
                                <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {c.count} booking{c.count !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )) : (
                            <p className="px-6 py-8 text-sm text-gray-400 text-center">No data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── POPULAR MOVE-IN DATES ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-500" />
                    <h3 className="text-base font-semibold text-gray-800">Most Popular Move-In Months</h3>
                </div>
                {popularDates.length > 0 ? (
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {popularDates.map((d, i) => {
                                const maxCount = popularDates[0]?.count || 1;
                                const intensity = Math.round((d.count / maxCount) * 100);
                                return (
                                    <div
                                        key={i}
                                        className="relative bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100 overflow-hidden"
                                    >
                                        {/* Background intensity bar */}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-indigo-200/40 transition-all"
                                            style={{ height: `${intensity}%` }}
                                        />
                                        <div className="relative">
                                            {i === 0 && <Award size={18} className="text-indigo-600 mx-auto" />}
                                            <p className="font-bold text-indigo-800 text-sm mt-1">{d.date}</p>
                                            <p className="text-xs text-indigo-500 mt-1">
                                                {d.count} booking{d.count !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="px-6 py-8 text-sm text-gray-400 text-center">No date data available</p>
                )}
            </div>
        </div>
    );
}
