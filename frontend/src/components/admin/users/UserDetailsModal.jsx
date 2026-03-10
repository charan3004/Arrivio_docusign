import React, { useEffect, useState } from "react";
import { X, User, Mail, Phone, Calendar, Shield, Clock, Hash, Heart, FileText, ExternalLink, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../supabase/client";

const UserDetailsModal = ({ user, onClose }) => {
    const [wishlist, setWishlist] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // Helper to format dates safely
    const formatDate = (dateString, dateOnly = false) => {
        if (!dateString) return "N/A";
        const options = dateOnly
            ? { year: "numeric", month: "short", day: "numeric" }
            : { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleString("en-US", options);
    };

    // Helper to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    // Fetch extra data when user is available
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                // 1. Fetch Wishlist
                const { data: wishlistData } = await supabase
                    .from("wishlist")
                    .select("*, property:properties(id, title, city, cover_image, price)")
                    .eq("user_id", user.id);

                if (wishlistData) {
                    setWishlist(wishlistData.map(item => item.property).filter(Boolean));
                }

                // 2. Fetch Bookings (Applications)
                const { data: bookingData } = await supabase
                    .from('booking_intents')
                    .select(`
                *,
                properties (
                    id,
                    title,
                    city,
                    cover_image
                )
            `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (bookingData) {
                    setBookings(bookingData);
                }

            } catch (err) {
                console.error("Error fetching user details:", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [user]);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (user) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [user, onClose]);

    if (!user) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* HEADER */}
                    <div className="flex items-center justify-between p-6 border-b bg-gray-50 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {user.name || "Unknown User"}
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="bg-gray-200 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider">
                                        {user.provider || "email"}
                                    </span>
                                    <span>•</span>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* CONTENT - SCROLLABLE */}
                    <div className="p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* LEFT COLUMN: USER DETAILS */}
                            <div className="lg:col-span-1 space-y-8">
                                {/* SECTION: CONTACT */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2">
                                        Contact Info
                                    </h3>

                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <label className="block text-xs text-gray-400">Email</label>
                                            <p className="text-gray-900 font-medium break-all text-sm">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <label className="block text-xs text-gray-400">Phone</label>
                                            <p className="text-gray-900 font-medium text-sm">
                                                {user.phone || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <label className="block text-xs text-gray-400">Username</label>
                                            <p className="text-gray-900 font-medium text-sm">
                                                {user.username || "Not set"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: SYSTEM */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2">
                                        System Data
                                    </h3>

                                    <div className="flex items-start gap-3">
                                        <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <label className="block text-xs text-gray-400">User ID</label>
                                            <p
                                                className="text-gray-900 font-mono text-xs break-all cursor-pointer hover:bg-gray-100 px-1 -ml-1 rounded transition-colors"
                                                onClick={() => copyToClipboard(user.id)}
                                                title="Click to copy"
                                            >
                                                {user.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <label className="block text-xs text-gray-400">Joined On</label>
                                            <p className="text-gray-900 font-medium text-sm">
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <label className="block text-xs text-gray-400">Last Sign In</label>
                                            <p className="text-gray-900 font-medium text-sm">
                                                {formatDate(user.last_sign_in_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: ACTIVITY (Wishlist & Bookings) */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* BOOKINGS / APPLICATIONS */}
                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-widest border-b pb-2 mb-4">
                                        <FileText size={16} /> Applications ({bookings.length})
                                    </h3>

                                    {loadingData ? (
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Loader size={16} className="animate-spin" /> Loading data...
                                        </div>
                                    ) : bookings.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">No applications found.</p>
                                    ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                            {bookings.map(booking => (
                                                <div key={booking.id} className="flex items-start gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                                    <img
                                                        src={booking.properties?.cover_image || "https://via.placeholder.com/100"}
                                                        alt={booking.properties?.title}
                                                        className="w-16 h-16 object-cover rounded-lg bg-gray-200"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 truncate text-sm">
                                                            {booking.properties?.title || "Unknown Property"}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            {formatDate(booking.check_in, true)} — {formatDate(booking.check_out, true)}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${booking.status === 'Success' || booking.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                                                    booking.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                                    }`}
                                                            >
                                                                {booking.status || 'Pending'}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                ID: {booking.id.slice(0, 8)}...
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* WISHLIST */}
                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-widest border-b pb-2 mb-4">
                                        <Heart size={16} /> Wishlist ({wishlist.length})
                                    </h3>

                                    {loadingData ? (
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Loader size={16} className="animate-spin" /> Loading data...
                                        </div>
                                    ) : wishlist.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">No items in wishlist.</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                            {wishlist.map(property => (
                                                <div key={property.id} className="group flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                                    <img
                                                        src={property.cover_image || property.image || "https://via.placeholder.com/100"}
                                                        alt={property.title}
                                                        className="w-12 h-12 object-cover rounded-lg bg-gray-200"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-medium text-gray-900 truncate text-xs" title={property.title}>
                                                            {property.title}
                                                        </h4>
                                                        <p className="text-[10px] text-gray-500 truncate">{property.city}</p>
                                                        <p className="text-[10px] font-bold text-green-700 mt-0.5">€{property.price}</p>
                                                    </div>
                                                    <a href={`/property/${property.id}`} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-gray-600 p-1">
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* RAW DATA (Optional - mostly for debugging or deep details) */}
                        <div className="mt-8 pt-6 border-t">
                            <details className="group">
                                <summary className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                                    <span>View Raw Metadata</span>
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="mt-3 bg-gray-50 rounded-lg p-3 overflow-x-auto border">
                                    <pre className="text-[10px] text-gray-600 font-mono leading-relaxed">
                                        {JSON.stringify(user.user_metadata || {}, null, 2)}
                                    </pre>
                                </div>
                            </details>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-4 border-t bg-gray-50 flex justify-end shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UserDetailsModal;
