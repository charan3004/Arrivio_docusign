import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const lastScrollY = useRef(0);

  // 1. DETECT MOBILE
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 2. SCROLL BEHAVIOR
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Thresholds
      if (currentScrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);

      if (currentScrollY < 400) setIsVisible(true);
      else if (currentScrollY > lastScrollY.current) setIsVisible(false);
      else setIsVisible(true);

      lastScrollY.current = currentScrollY;
    };
    
    // 'passive: true' improves scrolling performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. LOCK BODY SCROLL
  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Vision', path: '/#vision' },
    { name: 'Community', path: '/#community' },
    { name: 'Pricing', path: '/#living-spaces' },
    { name: 'Locations', path: '/#locations' },
  ];

  return (
    <>
      {/* NAVBAR CONTAINER */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isMobile ? 0 : (isVisible ? 0 : -120) }}
        transition={{ duration: 0.4, ease: "easeInOut" }} // Faster, smoother hide/show
        
        // FIX: Removed 'transition-all duration-500' to stop fighting Framer Motion
        className={`fixed top-0 left-0 w-full z-[100]
          
          ${/* MOBILE: Fixed 80px */ ''}
          h-20 px-6 bg-[#EAE8E4]/90 backdrop-blur-xl border-b border-[#2C3E30]/10 flex items-center justify-center

          ${/* DESKTOP: */ ''}
          ${isScrolled 
            ? 'md:h-auto md:mt-4 md:px-12 md:bg-transparent md:border-none md:backdrop-blur-none' 
            : 'md:h-20 md:mt-0 md:px-12 md:bg-transparent md:border-none md:backdrop-blur-none'
          }
        `}
      >
        {/* INNER CONTAINER (The Pill) */}
        {/* This one handles the Shape Change (Square -> Pill) via CSS Transition */}
        <div className={`w-full mx-auto transition-all duration-500 ease-in-out flex items-center ${
          isScrolled 
            // SCROLLED: Pill Mode
            ? 'md:bg-[#F5F5F0]/90 md:backdrop-blur-3xl md:shadow-sm md:py-3 md:px-8 md:rounded-full md:border md:border-white/20 md:max-w-7xl' 
            // UNSCROLLED: Full Width
            : 'md:bg-transparent md:h-full md:px-0 md:max-w-7xl'
        }`}>
          <div className="flex items-center justify-between w-full">
            
            {/* LOGO */}
            <Link to="/" className="relative z-10 shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-serif text-2xl md:text-3xl tracking-tighter text-[#2C3E30]">
                Arrivio.
              </span>
            </Link>

            {/* LINKS */}
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

            {/* ACTIONS */}
            <div className="flex items-center gap-3 md:gap-8 shrink-0">
              <div className="flex items-center gap-2 text-[#2C3E30]/60 hover:text-[#2C3E30] transition-colors cursor-pointer">
                  <Globe size={20} className="md:w-[14px] md:h-[14px]" />
                  <span className="hidden md:block font-sans text-[10px] font-bold uppercase tracking-widest">EN</span>
              </div>
              
              {isAuthenticated ? (
                <Link to="/profile">
                  <button className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${
                    isScrolled 
                      ? 'bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A1A1A] shadow-lg' 
                      : 'bg-[#1A1A1A]/5 backdrop-blur-md border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  }`}>
                    <User size={18} />
                  </button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className={`hidden md:flex items-center px-8 py-2.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
                    isScrolled 
                      ? 'bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A1A1A] shadow-lg' 
                      : 'bg-[#1A1A1A]/5 backdrop-blur-md border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  }`}>
                    Sign In
                  </button>
                </Link>
              )}

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
                    {navLinks.map((link) => (
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
                <div className="mt-8">
                    {isAuthenticated ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <span className="font-serif text-2xl text-[#2C3E30]">
                                    {user?.full_name || 'User'}
                                </span>
                                <span className="font-sans text-xs text-[#2C3E30]/70">
                                    {user?.email}
                                </span>
                            </div>
                            <button 
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                    navigate('/');
                                }}
                                className="w-fit px-10 py-3 rounded-full font-sans text-xs font-bold uppercase tracking-widest bg-[#2C3E30] text-[#EAE8E4] shadow-lg active:scale-95 transition-transform flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-fit px-10 py-3 rounded-full font-sans text-xs font-bold uppercase tracking-widest bg-[#2C3E30] text-[#EAE8E4] shadow-lg active:scale-95 transition-transform">
                                Sign In
                            </button>
                        </Link>
                    )}
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

export default Navbar;