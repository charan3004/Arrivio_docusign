import React from 'react';
import { Train, Coffee, ShoppingBag, Leaf, Navigation } from 'lucide-react';
import PropertyMap from '../search/PropertyMap'; // Import your real map

const Neighborhood = ({ property }) => {
  
  // Safety check: if no property data, show nothing
  if (!property) return null;

  // Neighborhood data from backend (admin-controlled)
  const n = property.details?.neighborhood;

  const hotspots = [
    n?.transport && {
      icon: <Train size={16} />,
      label: n.transport.station || 'Nearest station',
      dist: n.transport.time || '',
      type: 'Transport',
    },
    n?.groceries && {
      icon: <ShoppingBag size={16} />,
      label: n.groceries.name || 'Groceries',
      dist: n.groceries.time || '',
      type: 'Essentials',
    },
    n?.park && {
      icon: <Leaf size={16} />,
      label: n.park.name || 'Park',
      dist: n.park.time || '',
      type: 'Nature',
    },
    n?.coffee && {
      icon: <Coffee size={16} />,
      label: n.coffee.name || 'Coffee',
      dist: n.coffee.time || '',
      type: 'Lifestyle',
    },
  ].filter(Boolean);

  return (
    <div className="relative">
       {/* HEADER */}
       <div className="flex items-baseline justify-between mb-6">
           <div>
               <h3 className="font-serif text-2xl text-[#2C3E30] mb-2">The Neighborhood</h3>
               <p className="text-sm text-[#2C3E30]/70 font-medium max-w-lg">
                   Located in the heart of <span className="text-[#2C3E30] font-bold">{property.city}</span>. 
                   A vibrant area known for its cafe culture, green spaces, and excellent connectivity.
               </p>
           </div>
           
           {/* Visual Map Link (Optional: You could link this to Google Maps) */}
           {property.lat && property.lng ? (
             <a
               className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2C3E30] hover:opacity-70 transition-opacity"
               href={`https://www.google.com/maps?q=${property.lat},${property.lng}`}
               target="_blank"
               rel="noreferrer"
             >
               <Navigation size={14} /> Open in Maps
             </a>
           ) : (
             <button
               className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2C3E30]/40 cursor-not-allowed"
               title="Set Latitude/Longitude in Admin to enable map link"
               disabled
             >
               <Navigation size={14} /> Open in Maps
             </button>
           )}
       </div>

       {/* CONTENT GRID */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* 1. REAL INTERACTIVE MAP */}
           {/* We wrap the map in a container with specific height and rounded corners.
               'overflow-hidden' ensures the map stays inside the curves.
           */}
           <div className="h-64 lg:h-auto min-h-[300px] bg-[#222] rounded-3xl overflow-hidden relative shadow-lg border border-[#2C3E30]/10 z-0">
               <PropertyMap 
                   // Pass ONLY the current property so the map zooms to it
                   properties={[property]} 
                   
                   // Force the pin to be "Selected" (White) permanently
                   hoveredId={property.id} 
               />
           </div>

           {/* 2. LOCAL HOTSPOTS LIST */}
           <div className="flex flex-col gap-3">
               {hotspots.map((item, index) => (
                   <div key={index} className="group flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl hover:bg-white/60 hover:border-[#2C3E30]/20 transition-all cursor-default">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-[#2C3E30] group-hover:scale-110 transition-transform">
                               {item.icon}
                           </div>
                           <div>
                               <h4 className="text-sm font-bold text-[#2C3E30]">{item.label}</h4>
                               <span className="text-[10px] uppercase tracking-wider text-[#2C3E30]/50 font-medium">{item.type}</span>
                           </div>
                       </div>
                       <div className="text-right">
                           <span className="block text-xs font-bold text-[#2C3E30]">{item.dist}</span>
                       </div>
                   </div>
               ))}

               {/* Commute Summary Card */}
               <div className="mt-2 p-5 bg-[#2C3E30] rounded-2xl text-[#EAE8E4] flex items-center justify-between shadow-lg">
                   <div>
                       <span className="block text-[10px] uppercase tracking-widest opacity-60 mb-1">
                         {n?.commuteLabel || 'Commute to City Center'}
                       </span>
                       <span className="text-lg font-serif font-medium">
                         {n?.commuteTime || '15 Minutes'}
                       </span>
                   </div>
                   <div className="h-10 w-10 bg-[#EAE8E4]/10 rounded-full flex items-center justify-center">
                        <Train size={18} />
                   </div>
               </div>
           </div>

       </div>
    </div>
  );
};

export default Neighborhood;