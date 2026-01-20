import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Handle Background Change (Transparency to Frosted)
      // We keep this at 50px so the "glass" look kicks in early
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Handle Hide/Show on Direction Change
      // --- LOGIC UPDATED: Stay visible for the first 400px (approx 3 scrolls) ---
      if (currentScrollY < 400) {
        setIsVisible(true);
      } 
      // After 400px, if scrolling down, hide it
      else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } 
      // If scrolling up, show it immediately
      else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Vision', path: '/#vision' },
    { name: 'Locations', path: '/#locations' },
    { name: 'Community', path: '/#community' },
    { name: 'Pricing', path: '/#living-spaces' },
  ];

  return (
    <>
      <motion.nav
        // Framer Motion handles the slide up/down perfectly
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -120 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-4 transition-all duration-500 ${
          isScrolled ? 'mt-4' : 'mt-0'
        }`}
      >
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${
          isScrolled 
            // Using the ultra-transparent glass style we discussed
            ? 'bg-[#F5F5F0]/90 backdrop-blur-3xl border border-white/20 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] py-3 px-8 rounded-full' 
            : 'bg-transparent py-5 px-0'
        }`}>
          <div className="flex items-center justify-between">
            
            {/* LOGO */}
            <Link to="/" className="relative z-10">
              <span className="font-serif text-2xl md:text-3xl tracking-tighter text-[#1A1A1A]">
                Arrivio.
              </span>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#2C3E30]/70 hover:text-[#2C3E30] transition-colors"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C2B280] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-4 md:gap-8">
              <div className="hidden lg:flex items-center gap-2 text-[#2C3E30]/40 hover:text-[#2C3E30] transition-colors cursor-pointer">
                <Globe size={14} />
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest">EN</span>
              </div>
              
              <Link to="/login">
                <button className={`hidden md:flex items-center px-8 py-2.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all duration-700 ${
                  isScrolled 
                    ? 'bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A1A1A] shadow-lg' 
                    : 'bg-[#1A1A1A]/5 backdrop-blur-md border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                }`}>
                  Sign In
                </button>
              </Link>

              {/* MOBILE TOGGLE */}
              <button 
                className="md:hidden p-2 text-[#2C3E30]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[#EAE8E4]/95 backdrop-blur-3xl flex flex-col justify-center items-center p-12 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-4xl text-[#1A1A1A]"
                >
                  <Link to={link.path} className="block">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="bg-[#2C3E30] text-[#EAE8E4] px-12 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-xs">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;