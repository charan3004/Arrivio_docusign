import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, Bed, Bath, Move, FileCheck, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- IMPORT DATA ---
import { allProperties } from '../data/properties'; 

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialCity = location.state?.location || "";
  const [searchTerm, setSearchTerm] = useState(initialCity);

  const safeProperties = allProperties || [];

  const filteredProperties = safeProperties.filter(p => 
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm === ""
  );

  return (
    <div className="min-h-screen bg-[#EAE8E4] pt-28 pb-20 px-4 md:px-12">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1600px] mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/60 pl-1">
                {filteredProperties.length} Curated Residences
             </span>
             <h1 className="text-3xl md:text-5xl font-serif text-[#2C3E30] mt-2">
                Stays in <span className="italic text-[#C2B280]">{searchTerm || "Germany"}</span>
             </h1>
          </div>

          {/* Frosted Search Bar */}
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative group w-full md:w-72">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/50 group-focus-within:text-[#2C3E30]" size={14} />
                <input 
                  type="text" 
                  placeholder="Search city..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/40 backdrop-blur-md border border-white/50 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-[#2C3E30] placeholder:text-[#2C3E30]/40 focus:outline-none focus:bg-white/60 focus:border-[#2C3E30]/20 transition-all shadow-sm"
                />
             </div>
             <button className="p-2.5 bg-white/40 backdrop-blur-md rounded-xl border border-white/50 hover:bg-white/60 text-[#2C3E30] transition-all shadow-sm">
                <SlidersHorizontal size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* --- COMPACT FROSTED GRID (4 Columns) --- */}
      {/* 'xl:grid-cols-4' makes the cards much smaller and compact */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredProperties.length > 0 ? (
           filteredProperties.map((property, index) => (
             <motion.div 
               key={property.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.05 }}
               onClick={() => navigate(`/property/${property.id}`)}
               // Card Container: Smaller padding (p-2.5) for a tighter look
               className="group cursor-pointer bg-white/40 backdrop-blur-xl border border-white/60 p-2.5 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:bg-white/60 transition-all duration-500"
             >
                {/* 1. IMAGE: Compact Frame */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] mb-3">
                   <img 
                     src={property.image} 
                     alt={property.title} 
                     className="w-full h-full object-cover transition-transform duration-[0.7s] ease-out group-hover:scale-110"
                   />
                   
                   {/* 'Exquisite' Badge - Made smaller */}
                   {property.rating >= 4.8 && (
                       <div className="absolute top-2 left-2 bg-[#EAE8E4]/90 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest text-[#2C3E30] shadow-sm">
                           Exquisite
                       </div>
                   )}
                </div>

                {/* 2. TEXT CONTENT: Compact & Information Rich */}
                <div className="px-1.5 pb-1.5">
                   
                   {/* Title & Arrow */}
                   <div className="flex justify-between items-start mb-1">
                       <h3 className="font-serif text-lg text-[#2C3E30] leading-tight pr-2 truncate">
                           {property.title}
                       </h3>
                       <ArrowUpRight size={16} className="text-[#2C3E30]/40 group-hover:text-[#2C3E30] transition-colors"/>
                   </div>

                   {/* Location & Cert */}
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

                   {/* Specs Row - Smaller text */}
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

                   {/* PRICE ROW (Now clearly visible at bottom) */}
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
                {safeProperties.length === 0 ? "Error: Data not loaded." : "No homes found for this search."}
             </h3>
             <button onClick={() => setSearchTerm("")} className="mt-4 text-[#2C3E30] font-bold underline decoration-dotted hover:decoration-solid">Show all listings</button>
           </div>
         )}
      </div>

    </div>
  );
};

export default Search;