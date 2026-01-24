import React from 'react';
import { Link } from 'react-router-dom';

const SimpleNavbar = () => {
  return (
    // CHANGED: 
    // 1. 'absolute' instead of 'fixed' (Scrolls with page, doesn't feel like a sticky bar)
    // 2. 'bg-transparent' (No background color)
    // 3. Removed border and height constraints
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-start">
      <Link to="/" className="relative z-10 hover:opacity-70 transition-opacity">
        <span className="font-serif text-2xl md:text-3xl tracking-tighter text-[#2C3E30]">
          Arrivio.
        </span>
      </Link>
    </nav>
  );
};

export default SimpleNavbar;