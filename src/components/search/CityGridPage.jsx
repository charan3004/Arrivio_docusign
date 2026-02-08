import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- IMPORT LOCAL ASSETS ---
import berlin from '../../assets/cities/berlin.jpeg';
import munich from '../../assets/cities/munich.jpeg';
import dusseldorf from '../../assets/cities/dusseldorf.jpeg';
import frankfurt from '../../assets/cities/frankfurt.jpeg';
import cologne from '../../assets/cities/cologne.jpeg';
import aachen from '../../assets/cities/aachen.jpeg';
import bonn from '../../assets/cities/bonn.jpeg';
import hamburg from '../../assets/cities/hamburg.jpeg';

import { cities } from '../../data/cities';

const CityGridPage = () => {
  const handleCityClick = (city) => {
    // Search page removed - do nothing or show message
  };

  return (
    <div className="min-h-screen w-full bg-[#EAE8E4] px-4 md:px-12 pt-28 pb-12 flex flex-col">

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col items-center justify-center mb-10 border-b border-[#1A1A1A]/10 pb-8">

        <h2 className="font-serif text-4xl md:text-6xl text-[#2C3E30] leading-tight mb-3 text-center">
          Select your <span className="italic text-[#C2B280]">destination.</span>
        </h2>

        <p className="text-[#1A1A1A]/60 font-sans text-sm md:text-base max-w-xl text-center leading-relaxed">
          From the creative avenues of Berlin to the historic streets of Bonn.
          Explore our curated collection of premium apartments.
        </p>

      </div>

      {/* --- CITY GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto w-full pb-12">
        {cities.map((city, index) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleCityClick(city)}
            className="group relative aspect-square w-full rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
          >
            {/* Image */}
            <img
              src={city.img}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
              alt={city.name}
              loading="lazy"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90"></div>
            <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/40 transition-colors duration-500"></div>

            {/* Top Badge */}
            <div className="absolute top-5 right-5 flex items-center gap-2 transition-all duration-300 opacity-100 translate-y-0 md:opacity-0 md:translate-y-[-5px] md:group-hover:opacity-100 md:group-hover:translate-y-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
              <span className="text-white text-[9px] font-bold uppercase tracking-widest drop-shadow-md">
                {city.count} Units
              </span>
            </div>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">

              <div className="flex flex-col items-center transform transition-transform duration-500 translate-y-[-5px] md:translate-y-0 md:group-hover:-translate-y-6">

                <p className="text-white/70 font-serif italic text-xs mb-1 transition-all duration-500 opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                  {city.description}
                </p>

                <h3 className="text-white font-serif text-3xl tracking-tight font-medium drop-shadow-2xl mb-1">
                  {city.name}
                </h3>

                <div className="h-[1px] bg-[#C2B280] mt-1 transition-all duration-500 ease-out w-8 md:w-0 md:group-hover:w-12"></div>
              </div>

              {/* Bottom Action */}
              <div className="absolute bottom-6 transition-all duration-500 delay-150 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[#C2B280] text-xs font-bold uppercase tracking-widest mb-1">
                    Starting from €{city.price}
                  </span>

                  <div className="flex items-center gap-2 text-white border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-[#2C3E30] transition-colors bg-white/5 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      View Homes
                    </span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>

            </div>

            <div className="absolute inset-3 border border-white/10 rounded-[28px] pointer-events-none transition-colors group-hover:border-white/20"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CityGridPage;
