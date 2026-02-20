import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Globe, MapPin, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo2 from '../../assets/logo2.png';
const AppNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMobileMenuOpen]);

  const links = [
    { name: 'Cities', path: '/cities', icon: <MapPin size={14} /> },
    { name: 'For Businesses', path: '/business', icon: <Home size={14} /> },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] h-20 px-6 md:px-12 bg-[#EAE8E4]/90 backdrop-blur-xl transition-shadow duration-300 ${isScrolled ? 'shadow-sm' : 'shadow-none'
          }`}
      >
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex items-center justify-between h-full">

            {/* LOGO */}
            <Link to="/" className="relative z-10 shrink-0 flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src={logo2}
                alt="Arrivio Logo"
                className="h-6 md:h-6 w-auto object-contain transition-all duration-500"
              />
              <span className="font-serif text-3xl md:text-3xl tracking-tighter text-[#2C3E30]">
                Arrivio.
              </span>
            </Link>

            {/* CENTER: ROLLING CURSOR NAV */}
            <motion.div layout className="hidden md:flex items-center p-1 bg-white/40 border border-white/60 rounded-full shadow-sm absolute left-1/2 -translate-x-1/2">
              {links.map((link) => {
                // Check if this link is active
                const isActive = location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative px-6 py-2 rounded-full flex items-center justify-center min-w-[140px]"
                  >
                    {/* THE ROLLING CURSOR (Background) */}
                    {isActive && (
                      <motion.div
                        layoutId="rolling-cursor"
                        className="absolute inset-0 bg-[#2C3E30] rounded-full shadow-md"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                          mass: 0.8
                        }}
                      />
                    )}


                    {/* CONTENT (Sits on top of cursor) */}
                    <span className={`relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${isActive ? 'text-[#EAE8E4]' : 'text-[#2C3E30]/60 hover:text-[#2C3E30]'
                      }`}>
                      {link.icon}
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </motion.div>


            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3 md:gap-8 shrink-0">
              <div className="flex items-center gap-2 text-[#2C3E30]/60 hover:text-[#2C3E30] transition-colors cursor-pointer">
                <Globe size={20} className="md:w-[14px] md:h-[14px]" />
                <span className="hidden md:block font-sans text-[10px] font-bold uppercase tracking-widest">EN</span>
              </div>

              {/* Login/Profile links removed - pages not active */}

              <button
                className="md:hidden p-2 text-[#2C3E30] hover:bg-white/50 rounded-full transition-colors z-20"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] bg-[#EAE8E4] pt-32 px-6 flex flex-col md:hidden h-screen"
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-4 border-b border-[#2C3E30]/10 group active:opacity-60 transition-opacity"
                  >
                    <span className="font-serif text-3xl text-[#2C3E30]">{link.name}</span>
                  </Link>
                ))}
              </div>
              {/* Login/Profile links removed - pages not active */}
              <div className="mt-8 pb-8">
                <span className="text-[10px] uppercase tracking-widest text-[#2C3E30]/40">© 2024 Arrivio</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppNavbar;