import React from 'react';
import { MapPin, Train, Plane, ShoppingBag } from 'lucide-react';

const Neighborhood = ({ city }) => {
  return (
    <div>
        <h3 className="font-serif text-2xl mb-6 text-[#1A1A1A]">The Neighborhood</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 rounded-[2rem] bg-[#D6D3CD] relative overflow-hidden group cursor-pointer shadow-inner">
                <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale group-hover:scale-105 transition-transform duration-700"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#2C3E30] text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-bounce-slow">
                        <MapPin size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Explore {city}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#EAE8E4] rounded-full text-[#2C3E30]"><Train size={18}/></div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#5C5C50]">Public Transport</p>
                            <p className="font-bold text-[#1A1A1A]">Central Station</p>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-[#2C3E30]">12 min</span>
                </div>
                <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#EAE8E4] rounded-full text-[#2C3E30]"><Plane size={18}/></div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#5C5C50]">Airport</p>
                            <p className="font-bold text-[#1A1A1A]">{city} Int'l</p>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-[#2C3E30]">35 min</span>
                </div>
                <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#EAE8E4] rounded-full text-[#2C3E30]"><ShoppingBag size={18}/></div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#5C5C50]">Groceries</p>
                            <p className="font-bold text-[#1A1A1A]">Rewe / Aldi</p>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-[#2C3E30]">5 min walk</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Neighborhood;