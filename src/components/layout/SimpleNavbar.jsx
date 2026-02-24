import React from 'react';
import { Link } from 'react-router-dom';
import logo2 from '../../assets/logo2.png';

const SimpleNavbar = () => {
  return (
    // CHANGED: 
    // 1. 'absolute' instead of 'fixed' (Scrolls with page, doesn't feel like a sticky bar)
    // 2. 'bg-transparent' (No background color)
    // 3. Removed border and height constraints
    <nav className="absolute top-0 left-0 w-full z-50 h-20 px-6 md:px-12 flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-start">
        <Link to="/" className="relative z-10 hover:opacity-70 transition-opacity flex items-center gap-1">
          <img
            src={logo2}
            alt="Arrivio Logo"
            className="h-6 md:h-6 w-auto object-contain transition-all duration-500"
          />
          <span className="font-serif text-3xl md:text-3xl tracking-tighter text-[#2C3E30]">
            Arrivio.
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default SimpleNavbar;