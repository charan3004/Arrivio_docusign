import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, Heart, Home, Calendar, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const UserMenu = ({ scrolled = false, className = "" }) => {
    const { user, signOut } = useAuth();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
        setIsOpen(false);
        navigate("/");
    };

    if (!user) return null;

    // Base styling for the pill button
    // If no className provided, default to smart switching based on 'scrolled' prop
    // But often parent passes specific colors.
    // Let's define default behavior:
    // - Default: White background, Dark text (standard Airbnb style)
    // - If transparent context is needed, we might need adjustments, but usually this pill is solid white/grey.

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-300 hover:shadow-md ${className
                    ? className
                    : "bg-white border-[#2C3E30]/10 text-[#2C3E30]"
                    }`}
            >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2C3E30] text-[#EAE8E4] text-xs font-bold uppercase relative">
                    {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                    {/* Online/Notification dot could go here */}
                </div>
                <Menu size={18} className="opacity-70" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#2C3E30]/10 overflow-hidden z-50 py-2"
                    >
                        {/* SECTION 1 */}
                        <div className="px-4 py-3 border-b border-[#2C3E30]/10 mb-2">
                            <p className="text-xs font-bold text-[#2C3E30] truncate">
                                {user.user_metadata?.full_name || "User"}
                            </p>
                            <p className="text-[10px] text-[#2C3E30]/60 truncate">
                                {user.email}
                            </p>
                        </div>

                        {/* LINKS */}
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2C3E30] hover:bg-[#2C3E30]/5 transition-colors font-sans"
                        >
                            <User size={16} className="opacity-70" />
                            Profile
                        </Link>

                        <Link
                            to="/wishlist"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-[#2C3E30] hover:bg-[#2C3E30]/5 transition-colors font-sans w-full"
                        >
                            <div className="flex items-center gap-3">
                                <Heart size={16} className="opacity-70" />
                                Shortlist
                            </div>
                            {wishlist.length > 0 && (
                                <span className="bg-red-500 text-white text-[9px] font-bold min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        <Link
                            to="/profile/bookings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2C3E30] hover:bg-[#2C3E30]/5 transition-colors font-sans"
                        >
                            <Calendar size={16} className="opacity-70" />
                            My Bookings
                        </Link>

                        <div className="h-px bg-[#2C3E30]/10 my-2" />

                        <Link
                            to="/support"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2C3E30] hover:bg-[#2C3E30]/5 transition-colors font-sans"
                        >
                            <HelpCircle size={16} className="opacity-70" />
                            Help
                        </Link>

                        <div className="h-px bg-[#2C3E30]/10 my-2" />

                        {/* LOGOUT */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-sans"
                        >
                            <LogOut size={16} />
                            Log Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserMenu;


