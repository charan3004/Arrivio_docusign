import React from 'react';
import { MapPin, Train, Coffee, ShoppingBag, Leaf, Navigation } from 'lucide-react';

const Neighborhood = ({ city }) => {
  
  // Simulated Data (In a real app, this would come from the property prop)
  const hotspots = [
    { icon: <Train size={16}/>, label: "U-Bahn Station", dist: "3 min walk", type: "Transport" },
    { icon: <Coffee size={16}/>, label: "Third Wave Coffee", dist: "5 min walk", type: "Lifestyle" },
    { icon: <ShoppingBag size={16}/>, label: "Organic Grocery", dist: "2 min walk", type: "Essentials" },
    { icon: <Leaf size={16}/>, label: "City Park", dist: "8 min walk", type: "Nature" },
  ];

  return (
    <div className="relative">
       {/* HEADER */}
       <div className="flex items-baseline justify-between mb-6">
           <div>
               <h3 className="font-serif text-2xl text-[#2C3E30] mb-2">The Neighborhood</h3>
               <p className="text-sm text-[#2C3E30]/70 font-medium max-w-lg">
                   Located in the heart of <span className="text-[#2C3E30] font-bold">{city}</span>. 
                   A vibrant area known for its cafe culture, green spaces, and excellent connectivity.
               </p>
           </div>
           {/* Visual Map Link */}
           <button className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2C3E30] hover:opacity-70 transition-opacity">
               <Navigation size={14} /> Open in Maps
           </button>
       </div>

       {/* CONTENT GRID */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* 1. INTERACTIVE MAP CARD (Simulated) */}
           <div className="h-64 lg:h-auto min-h-[250px] bg-gray-200 rounded-3xl relative overflow-hidden group">
               {/* Background Image simulating a Map */}
               <img 
                 src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/13.404954,52.520008,13.5,0/800x600?access_token=YOUR_TOKEN" 
                 alt="Map" 
                 className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                 // Fallback if no internet/token
                 onError={(e) => {e.target.style.display='none'; e.target.parentElement.style.backgroundColor='#E5E5E5'}}
               />
               
               {/* Center Pin */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C3E30] opacity-30"></span>
                        <div className="bg-[#2C3E30] text-white p-2 rounded-full shadow-xl relative z-10">
                            <MapPin size={20} fill="white" />
                        </div>
                        {/* Bubble */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3E30]">The Apartment</span>
                        </div>
                   </div>
               </div>
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
               <div className="mt-2 p-5 bg-[#2C3E30] rounded-2xl text-[#EAE8E4] flex items-center justify-between">
                   <div>
                       <span className="block text-[10px] uppercase tracking-widest opacity-60 mb-1">Commute to City Center</span>
                       <span className="text-lg font-serif font-medium">15 Minutes</span>
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