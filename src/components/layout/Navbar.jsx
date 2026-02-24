import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, LogOut, Heart, Calendar, HelpCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import LanguageDropdown from "../common/LanguageDropdown";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const { user, openAuthModal, signOut } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added hook
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
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
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-full text-[#2C3E30] font-serif text-lg hover:bg-black/5 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-[#2C3E30]/10 my-2" />
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#2C3E30] text-[#EAE8E4] font-bold text-xs uppercase tracking-widest"
                >
                  Sign In
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
