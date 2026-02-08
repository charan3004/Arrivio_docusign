import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, MapPin, Layers, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG --
const AVAILABLE_TAGS = ["Central", "Balcony", "Loft", "Waterfront", "Workspace", "Pet Friendly", "Altbau"];
const FLOORS = ["Any", "Ground", "1st", "2nd", "3rd", "4th", "5th+"];

// =========================================================
// 1. PRICE HISTOGRAM (Real Data Logic)
// =========================================================
const PriceHistogram = ({ currentMax, maxLimit = 5000, properties = [] }) => {
  const bars = useMemo(() => {
    const bucketCount = 24; // Number of bars
    const step = maxLimit / bucketCount; // Price range per bar (e.g. €200)
    const buckets = new Array(bucketCount).fill(0);
    
    // 1. Scan data and count houses in each price range
    const safeProperties = properties || [];
    safeProperties.forEach(p => {
      if (p.price < maxLimit) {
        const index = Math.floor(p.price / step);
        if (index >= 0 && index < bucketCount) {
          buckets[index]++;
        }
      }
    });

    // 2. Find the tallest bucket to normalize heights
    const maxFrequency = Math.max(...buckets, 1);

    // 3. Return array of percentages (0.1 to 1.0)
    return buckets.map(count => {
        // If count is 0, give it a tiny height (0.1) so the bar still exists visibly
        return count === 0 ? 0.1 : (count / maxFrequency);
    });
  }, [maxLimit]);

  return (
    <div className="flex items-end gap-[2px] h-10 w-full mb-1 px-1">
      {bars.map((heightPercent, i) => {
        // Highlight bars that are INSIDE the selected price range
        const barPricePosition = (i / bars.length) * maxLimit;
        const isActive = barPricePosition < currentMax;

        return (
          <div 
            key={i}
            className={`flex-1 rounded-t-[2px] transition-colors duration-300 ease-in-out ${
              isActive ? 'bg-[#2C3E30]' : 'bg-[#2C3E30]/10'
            }`}
            style={{ 
              height: `${heightPercent * 100}%` 
            }}
          />
        );
      })}
    </div>
  );
};

// =========================================================
// 2. CUSTOM DROPDOWN
// =========================================================
const CustomDropdown = ({ label, icon: Icon, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <span className="block text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/60 mb-1 ml-1">
        {label}
      </span>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full flex items-center justify-between bg-[#F4F3F0] border rounded-xl py-2 pl-9 pr-3 text-xs font-bold text-[#2C3E30] transition-all shadow-sm ${
            isOpen 
            ? 'border-[#C2B280] ring-1 ring-[#C2B280]' 
            : 'border-[#2C3E30]/10 hover:bg-white'
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={12} className={`text-[#2C3E30]/40 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#C2B280]' : ''}`} />
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C3E30]/40" size={13} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 2, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.99 }}
            transition={{ duration: 0.1 }}
            className="absolute top-full left-0 right-0 mt-0.5 bg-[#F4F3F0] border border-[#2C3E30]/10 rounded-xl shadow-xl overflow-hidden z-[100] max-h-48 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <div 
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors flex justify-between items-center ${
                  value === option 
                  ? 'bg-[#2C3E30] text-white'  
                  : 'text-[#2C3E30] hover:bg-white hover:text-[#C2B280]' 
                }`}
              >
                {option}
                {value === option && <Check size={10} className="text-[#C2B280]" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================
// 3. MAIN FILTER PANEL
// =========================================================
const FilterPanel = ({ isVisible, filters, setFilters, onReset, allProperties, cities }) => {
  useEffect(() => {
    const stored = sessionStorage.getItem("priceFilter");

    if (stored) {
      const { min, max } = JSON.parse(stored);

      setFilters(prev => ({
        ...prev,
        priceMin: min,
        priceMax: max
      }));

      sessionStorage.removeItem("priceFilter");
    }
  }, [setFilters]);
  


  const toggleTag = (tag) => {
    setFilters(prev => ({
        ...prev,
        tags: prev.tags.includes(tag) 
            ? prev.tags.filter(t => t !== tag) 
            : [...prev.tags, tag]
    }));
  };

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="relative z-40"
            >
                <div className="mt-2 p-4 bg-[#EAE8E4]/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl space-y-4">
                    
                    {/* ROW 1: Location & Price Graph */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomDropdown 
                            label="Location"
                            icon={MapPin}
                            value={filters.city}
                            options={cities && cities.length ? cities : ["All"]}
                            onChange={(val) => setFilters(prev => ({...prev, city: val}))}
                        />

                        {/* PRICE SECTION */}
                        <div className="flex flex-col justify-end">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/60 ml-1">Max Rent</span>
                                <span className="text-xs font-bold text-[#2C3E30] bg-white/50 px-2 py-0.5 rounded border border-white/50">
                                    €{filters.priceMax}
                                </span>
                            </div>
                            
                            {/* --- PRICE GRAPH BASED ON CURRENT PROPERTIES --- */}
                            <PriceHistogram currentMax={filters.priceMax} maxLimit={5000} properties={allProperties} />

                            <input 
                                type="range" 
                                min="500" max="5000" step="100"
                                value={filters.priceMax}
                                onChange={(e) => setFilters(prev => ({...prev, priceMax: parseInt(e.target.value)}))}
                                className="w-full h-1 bg-[#2C3E30]/10 rounded-lg appearance-none cursor-pointer accent-[#2C3E30] hover:accent-[#C2B280] transition-all"
                            />
                            
                            <div className="flex justify-between text-[9px] font-bold text-[#2C3E30]/30 mt-1 px-1">
                                <span>€500</span>
                                <span>€5000+</span>
                            </div>
                        </div>
                    </div>

                    {/* ROW 2: Beds & Floor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#2C3E30]/5 pt-3 pb-2">
                        <div>
                            <span className="block text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/60 mb-1 ml-1">Bedrooms (Min)</span>
                            <div className="flex bg-[#2C3E30]/5 p-0.5 rounded-lg">
                                {[0, 1, 2, 3].map(num => (
                                    <button 
                                        key={num}
                                        onClick={() => setFilters(prev => ({...prev, minBeds: num}))}
                                        className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                                            filters.minBeds === num 
                                            ? 'bg-white text-[#2C3E30] shadow-sm scale-100' 
                                            : 'text-[#2C3E30]/50 hover:text-[#2C3E30] hover:bg-white/40'
                                        }`}
                                    >
                                        {num === 0 ? "Any" : `${num}+`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <CustomDropdown 
                            label="Floor Level"
                            icon={Layers}
                            value={filters.floor}
                            options={FLOORS}
                            onChange={(val) => setFilters(prev => ({...prev, floor: val}))}
                        />
                    </div>

                    {/* ROW 3: Amenities */}
                    <div className="border-t border-[#2C3E30]/5 pt-3">
                        <span className="block text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/60 mb-2 ml-1">Amenities</span>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map(tag => {
                                const isActive = filters.tags.includes(tag);
                                return (
                                    <button 
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 flex items-center gap-1 ${
                                            isActive 
                                            ? 'bg-[#2C3E30] text-[#EAE8E4] border-[#2C3E30]' 
                                            : 'bg-white/40 text-[#2C3E30]/60 border-transparent hover:bg-white hover:border-[#2C3E30]/10 hover:text-[#2C3E30]'
                                        }`}
                                    >
                                        {isActive && <Check size={8} />}
                                        {tag}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div className="pt-1 flex justify-end">
                        <button 
                            onClick={onReset}
                            className="text-[9px] font-bold uppercase tracking-widest text-[#C2B280] hover:text-[#2C3E30] transition-colors border-b border-transparent hover:border-[#2C3E30]"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default FilterPanel;