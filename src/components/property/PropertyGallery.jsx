import React from 'react';
import { ShieldCheck, ImageIcon } from 'lucide-react';

const PropertyGallery = ({ images }) => {
  // Safe fallback if images are missing
  const displayImages = images && images.length >= 5 ? images : Array(5).fill(images?.[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] mb-8 rounded-[2rem] overflow-hidden">
      
      {/* Main Image (Left Half) */}
      <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
        <img 
            src={displayImages[0]} 
            alt="Main" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm z-10 pointer-events-none">
          <ShieldCheck size={14} className="text-[#2C3E30]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]">Arrivio Verified</span>
        </div>
      </div>
      
      {/* Side Images (Right Half) */}
      {displayImages.slice(1, 5).map((img, index) => (
        <div 
          key={index} 
          className={`hidden md:block relative group overflow-hidden cursor-pointer ${
            index === 1 ? 'rounded-tr-[2rem]' : index === 3 ? 'rounded-br-[2rem]' : ''
          }`}
        >
          <img 
            src={img} 
            alt={`Gallery ${index}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          {/* Overlay for "View All" on the last image */}
          {index === 3 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-white border-b border-white/60 pb-1">
                  <ImageIcon size={16} />
                  <span className="font-serif italic text-lg">View All Photos</span>
                </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PropertyGallery;