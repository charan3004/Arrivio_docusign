import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, Calendar, CreditCard, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileSidebarLayout = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // If user is null (not loaded yet), we might want to show a loader or nothing
    // But usually ProtectedRoute handles redirect. 
    if (!user) return null;

    const navItems = [
        { icon: User, label: "Personal Details", path: "/profile/edit" },
        { icon: Heart, label: "Shortlist", path: "/profile/wishlist" },
        { icon: Calendar, label: "My Bookings", path: "/profile/bookings" },
        { icon: CreditCard, label: "Payment History", path: "/profile/payments" },
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Helper to get initials
    const getInitials = (name) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User";

    return (
        <div className="min-h-screen bg-[#EAE8E4] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADLINE / BREADCRUMB CONTEXT */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif text-[#2C3E30]">My Account</h1>
                    <p className="text-[#2C3E30]/60 mt-2">Manage your profile and bookings</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR (DESKTOP) --- */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-[#FAF9F6] rounded-2xl p-6 shadow-sm border border-[#2C3E30]/5 sticky top-28">
                            {/* User Mini Profile */}
                            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#2C3E30]/10">
                                <div className="w-12 h-12 rounded-full bg-[#2C3E30] text-[#EAE8E4] flex items-center justify-center font-bold text-lg">
                                    {getInitials(displayName)}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-[#2C3E30] truncate" title={displayName}>{displayName}</p>
                                    <p className="text-xs text-[#2C3E30]/50 uppercase tracking-wider">Member</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                                            ${isActive
                                                ? 'bg-[#2C3E30] text-[#EAE8E4] shadow-md'
                                                : 'text-[#2C3E30]/70 hover:bg-[#2C3E30]/5 hover:text-[#2C3E30]'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <ChevronRight size={16} className={`opacity-0 -translate-x-2 transition-all ${location.pathname === item.path ? 'opacity-100 translate-x-0' : 'group-hover:opacity-50 group-hover:translate-x-0'}`} />
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Logout */}
                            <div className="mt-8 pt-8 border-t border-[#2C3E30]/10">
                                <button
                                    onClick={signOut}
                                    className="flex items-center gap-3 px-4 py-2 text-red-500/80 hover:text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors text-sm font-medium"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* --- MOBILE NAVIGATION --- */}
                    <div className="lg:hidden mb-10 overflow-hidden -mx-4 px-4 pb-2">
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center justify-center gap-2 px-4 py-4 rounded-2xl transition-all duration-300 transform active:scale-95
                                        ${isActive
                                            ? 'bg-[#2C3E30] text-[#EAE8E4] shadow-lg scale-[1.02]'
                                            : 'bg-white text-[#2C3E30]/70 border border-[#2C3E30]/10 hover:border-[#2C3E30]/20 shadow-sm'}
                                    `}
                                >
                                    <item.icon size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-center">{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* --- MAIN CONTENT AREA --- */}
                    <main className="flex-1 min-w-0">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#FAF9F6] rounded-3xl p-4 md:p-8 lg:p-10 shadow-sm border border-[#2C3E30]/5 min-h-[500px]"
                        >
                            <Outlet />
                        </motion.div>
                    </main>

                </div>
            </div>
        </div>
    );
};

export default ProfileSidebarLayout;
