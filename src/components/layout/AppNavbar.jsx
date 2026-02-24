import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Globe, MapPin, Home, X, Heart, User, LogOut, Calendar, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import LanguageDropdown from "../common/LanguageDropdown";
import UserMenu from "./UserMenu";
import logo2 from '../../assets/logo2.png';

const AppNavbar = ({ property }) => {
  const { user, signOut, openAuthModal } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();


  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const links = [
    { name: "Cities", path: "/cities", icon: <MapPin size={14} /> },
    { name: "Stays", path: "/search", icon: <Home size={14} /> },
  ];

  return (
    <>
      <nav
        className={`${location.pathname === '/search' ? 'absolute' : 'fixed'} top-0 left-0 w-full z-[100] h-20 px-6 md:px-12 bg-[#EAE8E4]/90 backdrop-blur-xl transition-shadow duration-300 ${isScrolled || location.pathname === '/wishlist' || location.pathname.startsWith('/profile') || location.pathname.startsWith('/property') ? "shadow-md" : "shadow-none"
          } shadow-md`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1">
            <img
              src={logo2}
              alt="Arrivio Logo"
              className="h-6 md:h-6 w-auto object-contain transition-all duration-500"
            />
            <span className="font-serif text-3xl md:text-3xl tracking-tighter text-[#2C3E30]">
              Arrivio.
            </span>
          </Link>

          {/* CENTER NAV: SEARCH OR LINKS */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-md items-center justify-center">
            {location.pathname.startsWith('/property') ? (
              /* UNIFIED PROPERTY SEARCH BAR */
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by city, neighborhood, or property..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/search?q=${e.target.value}`);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#2C3E30]/5 focus:border-[#2C3E30]/20 focus:outline-none focus:ring-4 focus:ring-[#2C3E30]/5 text-sm text-[#2C3E30] placeholder:text-[#2C3E30]/40 transition-all shadow-sm hover:shadow-md"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C3E30]/40 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
            ) : (!location.pathname.startsWith('/profile') && location.pathname !== '/wishlist' && (
              /* STANDARD ROLLING LINKS */
              <motion.div
                layout
                className="flex items-center p-1 bg-white/40 border border-white/60 rounded-full shadow-sm"
              >
                {links.map((link) => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="relative px-6 py-2 rounded-full min-w-[140px] flex items-center justify-center"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="rolling-cursor"
                          className="absolute inset-0 bg-[#2C3E30] rounded-full shadow-md"
                        />
                      )}
                      <span
                        className={`relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isActive
                          ? "text-[#EAE8E4]"
                          : "text-[#2C3E30]/60 hover:text-[#2C3E30]"
                          }`}
                      >
                        {link.icon}
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </motion.div>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3 md:gap-2">



            {/* LANGUAGE DROPDOWN */}
            <div className="hidden md:block">
              <LanguageDropdown />
            </div>

            {/* WISHLIST LINK */}
            <Link
              to="/wishlist"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  openAuthModal();
                }
              }}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors relative group"
              title="Shortlist"
            >
              <Heart size={20} className="text-[#2C3E30] group-hover:text-red-500 transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#EAE8E4]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* ✅ AUTH AWARE BUTTON */}
            {user ? (
              <div className="hidden md:block">
                <UserMenu />
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A2E22] transition-colors"
              >
                <User size={14} className="text-[#EAE8E4]" />
                Sign In
              </button>
            )}

            {/* MOBILE TOGGLE OR WISHLIST LINK OR SIGN OUT */}
            {location.pathname === '/search' ? (
              <Link
                to="/wishlist"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    openAuthModal();
                  }
                }}
                className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#2C3E30]/10 text-[#2C3E30] shadow-md ml-2"
              >
                <div className="relative">
                  <Heart size={20} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white border border-white">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Shortlist</span>
              </Link>
            ) : location.pathname.startsWith('/profile') ? (
              <button
                onClick={handleLogout}
                className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-50/50 text-red-600 shadow-sm ml-2"
              >
                <LogOut size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
              </button>
            ) : (
              <button
                className="md:hidden p-2 ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </nav >

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 right-6 w-[280px] z-[110] bg-white rounded-3xl shadow-2xl border border-[#2C3E30]/5 overflow-hidden md:hidden"
          >
            {user ? (
              <div className="flex flex-col">
                {/* USER HEADER */}
                <div className="p-6 border-b border-[#2C3E30]/5">
                  <h3 className="text-lg font-serif text-[#2C3E30] leading-tight">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </h3>
                  <p className="text-xs text-[#2C3E30]/40 font-medium truncate mt-1">
                    {user.email}
                  </p>
                </div>

                {/* MAIN NAV */}
                <div className="p-2">
                  <Link
                    to="/profile/edit"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-black/5 transition-colors group"
                  >
                    <User size={18} className="text-[#2C3E30]/60 group-hover:text-[#2C3E30] transition-colors" />
                    <span className="text-sm font-medium text-[#2C3E30]/80 group-hover:text-[#2C3E30]">Account</span>
                  </Link>
                  <Link
                    to="/profile/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-black/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <Heart size={18} className="text-[#2C3E30]/60 group-hover:text-[#2C3E30] transition-colors" />
                      <span className="text-sm font-medium text-[#2C3E30]/80 group-hover:text-[#2C3E30]">Shortlist</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile/bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-black/5 transition-colors group"
                  >
                    <Calendar size={18} className="text-[#2C3E30]/60 group-hover:text-[#2C3E30] transition-colors" />
                    <span className="text-sm font-medium text-[#2C3E30]/80 group-hover:text-[#2C3E30]">My Bookings</span>
                  </Link>
                </div>

                {/* HELP SECTION */}
                <div className="p-2 border-t border-[#2C3E30]/5">
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-black/5 transition-colors group"
                  >
                    <HelpCircle size={18} className="text-[#2C3E30]/60 group-hover:text-[#2C3E30] transition-colors" />
                    <span className="text-sm font-medium text-[#2C3E30]/80 group-hover:text-[#2C3E30]">Help</span>
                  </Link>
                </div>

                {/* LOGOUT */}
                <div className="p-2 border-t border-[#2C3E30]/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-50 transition-colors group"
                  >
                    <LogOut size={18} className="text-red-500/80 group-hover:text-red-600 transition-colors" />
                    <span className="text-sm font-bold text-red-500 group-hover:text-red-600">Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#2C3E30] text-[#EAE8E4] font-bold text-xs uppercase tracking-widest"
                >
                  Sign In
                </button>
                <Link
                  to="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-2xl border border-[#2C3E30]/10 text-[#2C3E30] font-bold text-xs uppercase tracking-widest text-center"
                >
                  Explore Stays
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppNavbar;

