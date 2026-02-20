import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- YOUR LOCAL IMAGES ---
import berlinImg from '../../assets/cities/berlin.jpeg';
import munichImg from '../../assets/cities/munich.jpeg';
import frankfurtImg from '../../assets/cities/frankfurt.jpeg';
import cologneImg from '../../assets/cities/cologne.jpeg';
import dusseldorfImg from '../../assets/cities/dusseldorf.jpeg';
import bonnImg from '../../assets/cities/bonn.jpeg';
import aachenImg from '../../assets/cities/aachen.jpeg';
import hamburgImg from '../../assets/cities/hamburg.jpeg';
import germanyMap from '../../assets/germany.png';

const locations = [
  { id: 1, name: "Aachen", top: "52%", left: "10%", count: 3, price: "580", label: "Tech & Uni", description: "Innovation meets history.", image: aachenImg },
  { id: 2, name: "Berlin", top: "28%", left: "72%", count: 12, price: "750", label: "The Capital", description: "Vibrant culture & tech hub.", image: berlinImg },
  { id: 3, name: "Bonn", top: "55%", left: "19%", count: 4, price: "650", label: "Historic", description: "Former capital charm.", image: bonnImg },
  { id: 4, name: "Cologne", top: "48%", left: "18%", count: 9, price: "720", label: "Media City", description: "Cathedral city on the Rhine.", image: cologneImg },
  { id: 5, name: "Dusseldorf", top: "42%", left: "15%", count: 7, price: "780", label: "Fashion & Art", description: "Luxury & lifestyle.", image: dusseldorfImg },
  { id: 6, name: "Frankfurt", top: "60%", left: "35%", count: 6, price: "850", label: "Finance Hub", description: "Skyscrapers & connectivity.", image: frankfurtImg },
  { id: 7, name: "Hamburg", top: "18%", left: "40%", count: 10, price: "820", label: "Gateway to World", description: "Maritime charm & media hub.", image: hamburgImg },
  { id: 8, name: "Munich", top: "80%", left: "60%", count: 8, price: "950", label: "Bavarian Heart", description: "Business & tradition.", image: munichImg },



];

const LocationsSection = () => {
  const [activeCityId, setActiveCityId] = useState(1);
  const activeLocation = locations.find(l => l.id === activeCityId);

  // Animation variants for the pop effect
  const popVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 0.5, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 1.1, transition: { duration: 0.2 } }
  };

  return (
    <section className="min-h-screen py-24 bg-[#EAE8E4] relative overflow-hidden scroll-mt-28 flex items-center" id="locations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Content & Controls */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2C3E30] mb-6 leading-tight">
                Explore our <br />
                <span className="italic text-[#C2B280]">prime locations</span>
              </h2>

              <p className="text-[#5C5C50] font-sans text-lg mb-8 leading-relaxed max-w-md">
                Click on a city to preview the lifestyle. Find the vibe that fits your journey.
              </p>
            </motion.div>

            {/* List of Cities */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {locations.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setActiveCityId(city.id)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between group border
                    ${activeCityId === city.id
                      ? 'bg-[#2C3E30] text-white border-[#2C3E30] shadow-lg scale-105'
                      : 'bg-[#F5F5F0]/40 backdrop-blur-sm border-white/60 text-[#2C3E30]/70 hover:border-[#2C3E30]/50 hover:text-[#2C3E30]'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {activeCityId === city.id && <Sparkles size={14} className="animate-pulse text-[#C2B280]" />}
                    {city.name}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${activeCityId === city.id ? 'text-white/60' : 'text-[#2C3E30]/40'}`}>
                    {city.count} homes
                  </span>
                </button>
              ))}
            </div>

            {/* Action Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCityId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#F5F5F0]/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#2C3E30] mb-1">{activeLocation.name}</h3>
                    <p className="text-[#5C5C50] text-sm font-sans">{activeLocation.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#2C3E30]/50 uppercase tracking-widest font-bold">Starting from</p>
                    <p className="text-xl font-serif font-bold text-[#2C3E30]">€{activeLocation.price}<span className="text-sm font-sans font-normal text-[#5C5C50]">/mo</span></p>
                  </div>
                </div>

                <Link to="/business">
                  <button className="w-full h-12 bg-[#C2B280]/20 hover:bg-[#2C3E30] hover:text-white text-[#2C3E30] rounded-xl font-bold font-sans uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2">
                    Schedule a Call
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Map Portal */}
          <div className="order-1 lg:order-2 relative h-[500px] lg:h-[600px] w-full">
            <div className="absolute inset-0 bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white">

              {/* --- IMAGE POP ANIMATION --- */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCityId}
                  variants={popVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeLocation.image})` }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-10" />

              <div className="relative z-20 w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full max-w-[360px]">
                  <img
                    src={germanyMap}
                    alt="Germany Map"
                    className="
                    absolute inset-0 w-full h-full object-contain pointer-events-none
                    scale-110 sm:scale-120 lg:scale-150 opacity-40
                  "
                  />




                  {locations.map((loc) => (
                    <motion.div
                      key={loc.id}
                      className="absolute cursor-pointer"
                      style={{ top: loc.top, left: loc.left }}
                      onClick={() => setActiveCityId(loc.id)}
                    >
                      {activeCityId === loc.id ? (
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-12 h-12 bg-[#C2B280]/20 rounded-full animate-ping"></div>
                          <MapPin size={28} className="text-[#C2B280] relative z-10 fill-[#C2B280]" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 bg-white/40 rounded-full hover:bg-white transition-all"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* HUD Elements */}
              <div className="absolute bottom-8 left-8 z-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLocation.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-white font-serif font-bold text-3xl mb-1">{activeLocation.name.toUpperCase()}</p>
                    <p className="text-[#C2B280] text-[10px] font-bold uppercase tracking-[0.2em]">Available Now</p>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LocationsSection;