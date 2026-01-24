import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share, Heart, Menu, X } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const PropertyNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        // DYNAMIC CLASS: Shadow appears on scroll
        className={`fixed top-0 left-0 w-full z-[100] h-20 px-6 md:px-12 flex items-center justify-between bg-[#EAE8E4]/90 backdrop-blur-xl transition-shadow duration-300 ${
            isScrolled ? 'shadow-sm' : 'shadow-none'
        }`}
      >
        <div className="flex items-center">
            <Link to="/" className="relative z-10">
                <span className="font-serif text-2xl md:text-3xl tracking-tighter text-[#2C3E30]">
                Arrivio.
                </span>
            </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-[#2C3E30]">
            <button className="p-2 rounded-full hover:bg-[#2C3E30]/5 transition-colors">
                <Share size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-[#2C3E30]/5 transition-colors">
                <Heart size={20} />
            </button>

            <div className="h-5 w-[1px] mx-1 bg-[#2C3E30]/20" />

            <button 
                className="p-2 rounded-full hover:bg-[#2C3E30]/5 transition-colors z-20"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] bg-[#EAE8E4] pt-32 px-6 flex flex-col h-screen"
          >
            <div className="flex flex-col gap-2">
                <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-4 border-b border-[#2C3E30]/10">
                    <span className="font-serif text-3xl text-[#2C3E30]">All Apartments</span>
                </Link>
                <Link to="/cities" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-4 border-b border-[#2C3E30]/10">
                    <span className="font-serif text-3xl text-[#2C3E30]">Locations</span>
                </Link>
            </div>
            <div className="mt-8">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-fit px-10 py-3 rounded-full font-sans text-xs font-bold uppercase tracking-widest bg-[#2C3E30] text-[#EAE8E4] shadow-lg">
                        Sign In
                    </button>
                </Link>
            </div>
            <div className="mt-8 pb-8">
                <span className="text-[10px] uppercase tracking-widest text-[#2C3E30]/40">© 2024 Arrivio</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyNavbar;