import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, Bed, Bath, Move, FileCheck, X } from 'lucide-react';
import { motion } from 'framer-motion';

// --- IMPORTS ---
import { allProperties } from '../data/properties'; 
import PropertyMap from '../components/search/PropertyMap'; 
import FilterPanel from '../components/search/FilterPanel'; // <--- NEW IMPORT

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- STATE ---
  const initialCity = location.state?.location || "All";
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Consolidated Filter State
  const [filters, setFilters] = useState({
    city: initialCity,
    priceMax: 5000,
    minBeds: 0,
    floor: "Any",
    tags: []
  });

  // Sync router location with filter state
  useEffect(() => {
    if (location.state?.location) {
        setFilters(prev => ({ ...prev, city: location.state.location }));
    }
  }, [location.state]);

  // --- FILTER LOGIC ---
  const safeProperties = allProperties || [];

  const filteredProperties = safeProperties.filter(p => {
    // 1. City Check
    const matchesCity = filters.city === "All" || p.city === filters.city;
    
    // 2. Text Search
    const matchesSearch = 
        searchTerm === "" || 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (filters.city === "All" && p.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // 3. Price Check
    const matchesPrice = p.price <= filters.priceMax;
    
    // 4. Beds Check
    const matchesBeds = filters.minBeds === 0 || p.details.beds >= filters.minBeds;
    
    // 5. Floor Check
    const matchesFloor = 
        filters.floor === "Any" || 
        (filters.floor === "5th+" ? parseInt(p.details.floor) >= 5 : p.details.floor.includes(filters.floor));
    
    // 6. Tags Check
    const matchesTags = 
        filters.tags.length === 0 || 
        filters.tags.some(tag => p.tags?.includes(tag));

    return matchesCity && matchesSearch && matchesPrice && matchesBeds && matchesFloor && matchesTags;
  });

  const resetFilters = () => {
    setFilters({
        city: "All",
        priceMax: 5000,
        minBeds: 0,
        floor: "Any",
        tags: []
    });
    setSearchTerm("");
  };

  return (
    <div className="h-screen w-full bg-[#EAE8E4] pt-20 flex flex-col lg:flex-row overflow-hidden">
      
      {/* --- LEFT PANEL (List) --- */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative z-10">
        <div className="px-4 md:px-8 py-8 pb-32 max-w-5xl mx-auto">
            
            {/* HEADER */}
            <div className="flex flex-col gap-6 mb-8">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/60 pl-1">
                        {filteredProperties.length} Curated Residences
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif text-[#2C3E30] mt-1">
                        Stays in <span className="italic text-[#C2B280]">
                            {filters.city === "All" ? (searchTerm || "Germany") : filters.city}
                        </span>
                    </h1>
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className="relative z-50">
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative group flex-grow">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/50 group-focus-within:text-[#2C3E30]" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search by name..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/40 backdrop-blur-md border border-white/50 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-[#2C3E30] placeholder:text-[#2C3E30]/40 focus:outline-none focus:bg-white/60 focus:border-[#2C3E30]/20 transition-all shadow-sm"
                            />
                        </div>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2.5 rounded-xl border transition-all shadow-sm flex items-center justify-center gap-2 ${
                                showFilters 
                                ? 'bg-[#2C3E30] text-white border-[#2C3E30]' 
                                : 'bg-white/40 backdrop-blur-md border-white/50 text-[#2C3E30] hover:bg-white/60'
                            }`}
                        >
                            {showFilters ? <X size={16} /> : <SlidersHorizontal size={16} />}
                            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Filters</span>
                        </button>
                    </div>

                    {/* SEPARATED FILTER PANEL COMPONENT */}
                    <FilterPanel 
                        isVisible={showFilters}
                        filters={filters}
                        setFilters={setFilters}
                        onReset={resetFilters}
                    />
                </div>
            </div>

            {/* CARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map((property, index) => (
                    <motion.div 
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/property/${property.id}`)}
                        onMouseEnter={() => setHoveredId(property.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`group cursor-pointer backdrop-blur-xl border p-2.5 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 ${
                            hoveredId === property.id 
                            ? 'bg-white/60 border-[#2C3E30]/30 scale-[1.02]' 
                            : 'bg-white/40 border-white/60'
                        }`}
                    >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] mb-3">
                            <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover transition-transform duration-[0.7s] ease-out group-hover:scale-110"
                            />
                            {property.rating >= 4.8 && (
                                <div className="absolute top-2 left-2 bg-[#EAE8E4]/90 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest text-[#2C3E30] shadow-sm">
                                    Exquisite
                                </div>
                            )}
                        </div>

                        <div className="px-1.5 pb-1.5">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-serif text-lg text-[#2C3E30] leading-tight pr-2 truncate">
                                    {property.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/50 truncate">
                                    {property.city} Center
                                </span>
                                <span className="w-0.5 h-0.5 rounded-full bg-[#2C3E30]/30"></span>
                                <div className="flex items-center gap-0.5 text-[#2C3E30]">
                                    <FileCheck size={10} />
                                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-80">Anmeldung</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[#2C3E30]/70 mb-3 bg-white/30 rounded-lg p-2 border border-white/20">
                                <div className="flex items-center gap-1">
                                    <Bed size={12} strokeWidth={2} />
                                    <span className="text-[10px] font-bold">{property.details?.beds || 1}</span>
                                </div>
                                <div className="w-px h-3 bg-[#2C3E30]/10"></div>
                                <div className="flex items-center gap-1">
                                    <Bath size={12} strokeWidth={2} />
                                    <span className="text-[10px] font-bold">{property.details?.baths || 1}</span>
                                </div>
                                <div className="w-px h-3 bg-[#2C3E30]/10"></div>
                                <div className="flex items-center gap-1">
                                    <Move size={12} strokeWidth={2} />
                                    <span className="text-[10px] font-bold">{property.details?.size || '60m²'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-[#2C3E30]/5">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#2C3E30]/40">Monthly Rent</span>
                                    <span className="font-serif text-lg font-bold text-[#2C3E30]">€{property.price.toLocaleString()}</span>
                                </div>
                                <div className="px-3 py-1.5 bg-[#2C3E30] text-[#EAE8E4] rounded-lg text-[10px] font-bold uppercase tracking-widest group-hover:bg-[#1A1A1A] transition-colors">
                                    View
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                    <h3 className="font-serif text-2xl text-[#2C3E30]/40 italic">
                        No homes match your criteria.
                    </h3>
                    <button onClick={resetFilters} className="mt-4 text-[#2C3E30] font-bold underline decoration-dotted hover:decoration-solid">
                        Reset filters
                    </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* --- RIGHT PANEL (Map) --- */}
      <div className="hidden lg:block w-[40%] h-full border-l border-[#2C3E30]/20 z-0">
          <PropertyMap 
             properties={filteredProperties} 
             hoveredId={hoveredId} 
          />
      </div>

    </div>
  );
};

export default Search;