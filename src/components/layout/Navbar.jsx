import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, LogOut, Heart, Calendar, HelpCircle, Settings, Search, MessageSquare, Home, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageDropdown from "../common/LanguageDropdown";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const { user, openAuthModal, signOut } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added hook
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { language, setLanguage, languages, currentLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const lastScrollY = useRef(0);


  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  /* MOBILE DETECTION */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* SCROLL BEHAVIOR */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY < 400) setIsVisible(true);
      else if (currentScrollY > lastScrollY.current) setIsVisible(false);
      else setIsVisible(true);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* LOCK BODY SCROLL */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Community', path: '/#community' },
    { name: 'Pricing', path: '/#living-spaces' },
    { name: 'For Businesses', path: '/business' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isMobile ? 0 : isVisible ? 0 : -120 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 w-full z-[100]
          h-20 px-6 flex items-center justify-center
          ${isScrolled
            ? 'bg-[#EAE8E4]/90 backdrop-blur-xl border-b border-[#2C3E30]/10'
            : 'bg-transparent'
          }
          ${isScrolled
            ? 'md:h-auto md:mt-4 md:px-12 md:bg-transparent md:backdrop-blur-none md:border-b-0'
            : 'md:h-20 md:mt-0 md:px-12 md:bg-transparent'
          }`}
      >
        <div
          className={`w-full mx-auto transition-all duration-500 ease-in-out flex items-center
          ${isScrolled
              ? 'md:bg-[#F5F5F0] md:shadow-sm md:py-3 md:px-8 md:rounded-full md:border md:border-white/20 md:max-w-7xl'
              : 'md:bg-transparent md:h-full md:px-0 md:max-w-7xl'
            }`}
        >
          <div className="flex items-center justify-between w-full">

            {/* LOGO */}
            <Link
              to="/"
              className="relative z-10 shrink-0 flex items-center gap-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                src={isScrolled ? logo2 : logo1}
                alt="Arrivio Logo"
                className="h-6 md:h-6 w-auto object-contain transition-all duration-500"
              />

              <span
                className={`font-serif text-3xl md:text-3xl tracking-tighter leading-none transition-colors duration-500 ${isScrolled ? 'text-[#2C3E30]' : 'text-white'
                  }`}
              >
                Arrivio.
              </span>
            </Link>

            {/* CENTER LINKS */}
            <div className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-6 py-2.5 rounded-full transition-all duration-300 font-serif tracking-wide border
                    ${isScrolled
                      ? 'border-transparent text-[#2C3E30] hover:bg-[#2C3E30]/5 hover:text-[#1A2E22]'
                      : 'border-transparent text-white hover:text-white/70'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3 md:gap-2 shrink-0">
              <div className="hidden md:block">
                <LanguageDropdown
                  className={isScrolled ? 'text-[#2C3E30]' : 'text-white'}
                />
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
                className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors relative group ${isScrolled ? 'text-[#2C3E30] hover:bg-black/5' : 'text-white'
                  }`}
                title="Shortlist"
              >
                <Heart size={20} className={`transition-colors ${isScrolled ? "text-[#2C3E30] group-hover:text-red-500" : "text-white group-hover:text-red-400"}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-transparent shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* AUTH AWARE BUTTON */}
              {user ? (
                <div className="hidden md:block">
                  <UserMenu />
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className={`group hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${isScrolled
                    ? 'border-transparent bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A2E22]'
                    : 'border-white bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-[#2C3E30]'
                    } shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  <User size={14} className={`transition-colors duration-300 ${isScrolled ? "text-[#EAE8E4]" : "text-white group-hover:text-[#2C3E30]"}`} />
                  Sign In
                </button>
              )}

              <button
                className={`md:hidden p-2 transition-colors duration-500 ${isScrolled ? 'text-[#2C3E30]' : 'text-white'
                  }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X size={28} className="text-[#2C3E30]" />
                ) : (
                  <Menu size={28} />
                )}
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

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
                    {/* Status indicator */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
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
                      <div className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold">New</div>
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

                {/* RESEARCH SECTION */}
                <div className="space-y-3">
                  <div className="bg-[#2C3E30] rounded-3xl p-6 shadow-xl shadow-[#2C3E30]/10 relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-white font-serif text-xl mb-1">Find your next home</h3>
                      <p className="text-white/60 text-xs mb-4">Explore our curated collections </p>
                      <Link
                        to="/search"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EAE8E4] text-[#2C3E30] rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                      >
                        <Search size={14} />
                        Explore Homes
                      </Link>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
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

                {/* LOGOUT FOR LOGGED IN USERS */}
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

export default Navbar;
