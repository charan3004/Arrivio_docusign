import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const MobileNavbar = () => {
    const location = useLocation();
    const { user, openAuthModal } = useAuth();
    const { wishlist } = useWishlist();

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Search, label: "Search", path: "/search" },
        { icon: User, label: "Account", path: "/profile" },
    ];

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] w-full bg-white/95 backdrop-blur-xl border-t border-black/5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="max-w-md mx-auto px-6 py-2 pb-6">
                <div className="flex justify-between items-center">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={(e) => {
                                    if (item.label === "Account" && !user) {
                                        e.preventDefault();
                                        openAuthModal();
                                    }
                                }}
                                className="relative flex flex-col items-center justify-center min-w-[64px] transition-all duration-300 transform active:scale-95 py-1"
                            >
                                <div className={`relative transition-all duration-300 ${active ? "scale-110" : "scale-100"}`}>
                                    <Icon
                                        size={22}
                                        strokeWidth={active ? 2.5 : 2}
                                        className={`transition-all duration-300 ${active ? "text-[#2C3E30]" : "text-stone-400 group-hover:text-stone-600"}`}
                                    />
                                    {item.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>

                                <span className={`text-[10px] font-semibold tracking-tight mt-1 transition-all duration-300 ${active ? "text-[#2C3E30]" : "text-stone-400"}`}>
                                    {item.label}
                                </span>

                                {active && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-transparent rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileNavbar;
