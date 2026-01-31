import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, Bed, Bath, Move, FileCheck, X, MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTS ---
import { allProperties } from '../data/properties'; 
import PropertyMap from '../components/search/PropertyMap'; 
import FilterPanel from '../components/search/FilterPanel';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  
  // --- STATE ---
  const initialCity = location.state?.location || "All";
  const [searchTerm, setSearchTerm] = useState(initialCity !== "All" ? initialCity : "");
  const [hoveredId, setHoveredId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState({
    city: initialCity,
    priceMax: 5000,
    minBeds: 0,
    floor: "Any",
    tags: []
  });

  // --- SYNC ROUTER STATE ---
  useEffect(() => {
    if (location.state?.location) {
        const selectedCity = location.state.location;
        setFilters(prev => ({ ...prev, city: selectedCity }));
        setSearchTerm(selectedCity !== "All" ? selectedCity : "");
    }
  }, [location.state]);

  // --- CLICK OUTSIDE SUGGESTIONS ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- REVISED FILTER LOGIC ---
  const safeProperties = allProperties || [];

  const filteredProperties = safeProperties.filter(p => {
    // 1. City Check: If "All" is selected, match everything. 
    // Otherwise, match the city OR if the user is currently typing that city name.
    const matchesCity = filters.city === "All" || p.city === filters.city;

    // 2. Adaptive Search Logic
    const searchLower = searchTerm.trim().toLowerCase();
    
    // ACTION: If search box is empty, show all properties in the selected city.
    // Otherwise, match against Title, City, or Tags.
    const matchesSearch = 
        searchLower === "" || 
        (p.title && p.title.toLowerCase().includes(searchLower)) ||
        (p.city && p.city.toLowerCase().includes(searchLower)) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchLower)));
    
    // 3. Structural Filters
    const matchesPrice = (p.price || 0) <= filters.priceMax;
    const matchesBeds = filters.minBeds === 0 || (p.details?.beds || 0) >= filters.minBeds;
    
    return matchesCity && matchesSearch && matchesPrice && matchesBeds;
  });

  // Dynamic Suggestions
  const suggestions = searchTerm.trim().length > 0 
    ? safeProperties.filter(p => 
        (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (p.city && p.city.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5)
    : [];

  const resetFilters = () => {
    setFilters({ city: "All", priceMax: 5000, minBeds: 0, floor: "Any", tags: [] });
    setSearchTerm("");
  };

  return (
    <div className="h-screen w-full bg-[#EAE8E4] pt-20 flex flex-col lg:flex-row overflow-hidden">
      
      {/* --- LEFT PANEL --- */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative z-10">
        <div className="px-4 md:px-8 py-8 pb-32 max-w-5xl mx-auto">
            
            <div className="flex flex-col gap-6 mb-8">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/60 pl-1">
                        {filteredProperties.length} Curated Residences
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif text-[#2C3E30] mt-1 leading-tight">
                        Stays in <span className="italic text-[#C2B280]">
                            {filters.city === "All" ? (searchTerm || "Germany") : filters.city}
                        </span>
                    </h1>
                </div>

                <div className="relative z-50" ref={suggestionsRef}>
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative group flex-grow">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/50" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search by name, city, or area..." 
                                value={searchTerm}
                                onFocus={() => setShowSuggestions(true)}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                className="w-full bg-white/60 backdrop-blur-md border border-[#2C3E30]/10 rounded-xl py-3 pl-10 pr-10 text-xs font-medium text-[#2C3E30] focus:outline-none focus:ring-2 focus:ring-[#2C3E30]/5 transition-all shadow-sm"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C3E30]/40 hover:text-[#2C3E30]">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-3 rounded-xl border transition-all shadow-sm flex items-center justify-center gap-2 ${showFilters ? 'bg-[#2C3E30] text-white border-[#2C3E30]' : 'bg-white text-[#2C3E30] border-[#2C3E30]/10'}`}
                        >
                            <SlidersHorizontal size={16} />
                            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Filters</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#2C3E30]/5 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                            >
                                {suggestions.map((p) => (
                                    <div 
                                        key={p.id}
                                        onClick={() => {
                                            navigate(`/property/${p.id}`);
                                            setShowSuggestions(false);
                                        }}
                                        className="px-4 py-3 hover:bg-[#F4F3F0] cursor-pointer flex items-center justify-between transition-colors border-b border-[#2C3E30]/5 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={p.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#2C3E30]">{p.title}</p>
                                                <p className="text-[10px] text-[#2C3E30]/40 italic">{p.city}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={12} className="text-[#2C3E30]/20" />
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <FilterPanel isVisible={showFilters} filters={filters} setFilters={setFilters} onReset={resetFilters} />
                </div>
            </div>

            {/* CARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map((property, index) => (
                    <motion.div 
                        key={property.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate(`/property/${property.id}`)}
                        onMouseEnter={() => setHoveredId(property.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="group cursor-pointer bg-white border border-[#2C3E30]/5 p-3 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] mb-4">
                            <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="px-2 pb-2">
                            <h3 className="font-serif text-xl text-[#2C3E30] mb-1 leading-tight">{property.title}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/40">{property.city}</span>
                                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                                    <FileCheck size={10} /> Anmeldung
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-[#2C3E30]/5">
                                <div>
                                    <span className="block text-[9px] font-bold uppercase text-[#2C3E30]/30 tracking-wider">Monthly</span>
                                    <span className="font-serif text-lg font-bold text-[#2C3E30]">€{property.price?.toLocaleString()}</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#2C3E30] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="font-serif text-xl text-[#2C3E30]/30 italic">No rooms match your search.</p>
                        <button onClick={resetFilters} className="mt-2 text-xs font-bold uppercase tracking-widest text-[#2C3E30] underline decoration-dotted">Clear all filters</button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* --- RIGHT PANEL (Map) --- */}
      <div className="hidden lg:block w-[40%] h-full bg-[#F4F3F0]">
          <PropertyMap properties={filteredProperties} hoveredId={hoveredId} />
      </div>
    </div>
  );
};

export default Search;