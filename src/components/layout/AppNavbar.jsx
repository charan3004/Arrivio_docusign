import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Globe, MapPin, Grid, X } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const AppNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMobileMenuOpen]);

  const links = [
    { name: 'Locations', path: '/cities', icon: <MapPin size={18}/> },
    { name: 'Apartments', path: '/search', icon: <Grid size={18}/> },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          h-20 px-6 bg-[#EAE8E4]/90 backdrop-blur-xl border-b border-[#2C3E30]/10
          ${isScrolled 
            ? 'md:h-20 md:bg-[#EAE8E4]/90 md:backdrop-blur-xl md:border-[#2C3E30]/10 md:px-12' 
            : 'md:h-[112px] md:bg-[#EAE8E4] md:border-transparent md:px-12'
          }
        `}
      >
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex items-center justify-between h-full">
              
              <Link to="/" className="relative z-10 shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="font-serif text-2xl md:text-3xl tracking-tighter text-[#2C3E30]">
                  Arrivio.
                  </span>
              </Link>

              <div className="hidden md:flex items-center gap-1 bg-white/40 border border-white/60 rounded-full p-1 shadow-sm absolute left-1/2 -translate-x-1/2">
                  {links.map((link) => {
                      const isActive = location.pathname === link.path;
                      return (
                          <Link 
                              key={link.name}
                              to={link.path} 
                              className={`px-6 py-2 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                  isActive 
                                  ? 'bg-[#2C3E30] text-[#EAE8E4] shadow-md' 
                                  : 'text-[#2C3E30]/60 hover:text-[#2C3E30] hover:bg-white/50'
                              }`}
                          >
                              {link.name}
                          </Link>
                      );
                  })}
              </div>

              <div className="flex items-center gap-3 md:gap-8 shrink-0">
                  <div className="flex items-center gap-2 text-[#2C3E30]/60 hover:text-[#2C3E30] transition-colors cursor-pointer">
                      <Globe size={20} className="md:w-[14px] md:h-[14px]" /> 
                      <span className="hidden md:block font-sans text-[10px] font-bold uppercase tracking-widest">EN</span>
                  </div>
                  
                  <Link to="/login">
                      <button className="hidden md:flex items-center px-8 py-2.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all duration-300 bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A1A1A] shadow-lg">
                          Sign In
                      </button>
                  </Link>

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
                
                {/* Links - REMOVED CIRCLE & ICON for Clean Text Look */}
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

                {/* Mobile Actions - BUTTON MADE SMALLER */}
                <div className="mt-8">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-fit px-10 py-3 rounded-full font-sans text-xs font-bold uppercase tracking-widest bg-[#2C3E30] text-[#EAE8E4] shadow-lg active:scale-95 transition-transform">
                            Sign In
                        </button>
                    </Link>
                </div>
                
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