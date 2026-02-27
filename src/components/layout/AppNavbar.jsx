import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Globe, MapPin, Home, X, Heart, User, LogOut, Calendar, HelpCircle, Settings, Search, MessageSquare, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageDropdown from "../common/LanguageDropdown";
import UserMenu from "./UserMenu";
import logo2 from '../../assets/logo2.png';

const AppNavbar = ({ property }) => {
  const { user, signOut, openAuthModal } = useAuth();
  const { wishlist } = useWishlist();
  const { language, setLanguage, languages, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
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

      {/* MOBILE SIDE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[310px] bg-[#EAE8E4] z-[120] shadow-2xl flex flex-col md:hidden overflow-hidden"
            >
              {/* Close Button Top */}
              <div className="p-6 flex justify-start">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white/50 backdrop-blur-md rounded-full transition-all active:scale-95 shadow-sm border border-white/40"
                >
                  <X size={20} className="text-[#2C3E30]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-7 pb-10 space-y-7 no-scrollbar">

                {/* PROFILE HEADER SECTION */}
                <div className="flex items-center justify-between mt-2 mb-4">
                  <div className="space-y-1.5">
                    <h2 className="text-[32px] font-serif font-medium text-[#2C3E30] leading-[1.1] tracking-tight">
                      Hello, <br />
                      <span className="italic">{user ? (user.user_metadata?.full_name?.split(' ')[0] || 'User') : 'Guest'}</span>
                    </h2>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#579CC7]/10 rounded-full">
                      <div className="w-1 h-1 rounded-full bg-[#579CC7]" />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#579CC7]">
                        {user ? 'Verified Tenant' : 'New Visitor'}
                      </span>
                    </div>
                  </div>
                  {/* Avatar Container */}
                  <div className="w-20 h-20 rounded-full p-1 bg-white shadow-lg relative group">
                    <div className="w-full h-full rounded-full bg-[#2C3E30] flex items-center justify-center overflow-hidden relative border-2 border-[#EAE8E4]">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-serif text-white uppercase">
                          {(user?.user_metadata?.full_name || user?.email || "?")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACCOUNT SETTINGS LINK */}
                <Link
                  to="/profile/edit"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-5 bg-white/40 backdrop-blur-sm rounded-2xl text-[#2C3E30] font-semibold border border-white/60 shadow-sm active:scale-95 transition-all w-full"
                >
                  <Settings size={18} className="text-[#2C3E30]/70" />
                  <span className="text-xs font-bold tracking-tight">Account settings</span>
                </Link>

                {/* LANGUAGE SELECTOR */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-[#2C3E30]/30 uppercase tracking-[0.2em] ml-1">Language</span>
                  <div
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm transition-all active:bg-white active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Premium Flag Icon */}
                      <div className="w-7 h-7 rounded-full shadow-inner ring-1 ring-black/5 flex items-center justify-center overflow-hidden">
                        <img src={currentLanguage.flag} alt={currentLanguage.code} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-[#2C3E30]">{currentLanguage.label}</span>
                    </div>
                    <ChevronDown size={14} className={`text-[#2C3E30]/40 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dynamic Language List */}
                  <AnimatePresence>
                    {isLangMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setIsLangMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${language === lang.code ? 'bg-[#2C3E30]/5' : 'hover:bg-white/50'
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm">
                                <img src={lang.flag} alt={lang.code} className="h-full w-full object-cover" />
                              </div>
                              <span className={`text-xs font-bold ${language === lang.code ? 'text-[#2C3E30]' : 'text-[#2C3E30]/60'}`}>
                                {lang.label}
                              </span>
                            </div>
                            {language === lang.code && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#2C3E30]" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* MANAGEMENT SECTION */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-[#2C3E30]/30 uppercase tracking-[0.2em] ml-1">Properties</span>
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm overflow-hidden ring-1 ring-black/[0.02]">
                    <Link
                      to="/profile/wishlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-5 py-4.5 hover:bg-white transition-colors border-b border-white/60 active:bg-white group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                          <Heart size={18} className="text-red-500" />
                        </div>
                        <span className="text-sm font-bold text-[#2C3E30]">My Favorites</span>
                      </div>
                    </Link>
                    <Link
                      to="/requests"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-5 py-4.5 hover:bg-white transition-colors active:bg-white"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Home size={18} className="text-emerald-600" />
                      </div>
                      <span className="text-sm font-bold text-[#2C3E30]">Application Status</span>
                    </Link>
                  </div>
                </div>

                {/* SUPPORT SECTION */}
                <div className="space-y-3">
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm overflow-hidden ring-1 ring-black/[0.02]">
                    <Link
                      to="/how-it-works"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-white transition-colors border-b border-white/60 active:bg-white"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <HelpCircle size={16} className="text-blue-500" />
                      </div>
                      <span className="text-xs font-bold text-[#2C3E30]">Knowledge Base</span>
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-white transition-colors active:bg-white"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <MessageSquare size={16} className="text-indigo-500" />
                      </div>
                      <span className="text-xs font-bold text-[#2C3E30]">Support center</span>
                    </Link>
                  </div>
                </div>

                {!user && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal();
                    }}
                    className="w-full py-5 rounded-2xl bg-[#2C3E30] text-[#EAE8E4] font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#2C3E30]/20 active:scale-95 transition-all"
                  >
                    Join Arrivio
                  </button>
                )}

                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-600 transition-colors"
                  >
                    Log out of account
                  </button>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppNavbar;

