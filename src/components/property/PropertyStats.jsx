import React from 'react';
import { Maximize, BedDouble, Bath, Layers, Users } from 'lucide-react';

const PropertyStats = ({ details }) => {
  if (!details) return null;

  const stats = [
    { icon: Maximize, label: `${details.sqm} m²` },
    { icon: BedDouble, label: `${details.beds} Bed` },
    { icon: Bath, label: `${details.baths} Bath` },
    { icon: Layers, label: `${details.floor} Floor` },
    { icon: Users, label: `Max ${details.capacity}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 py-6 border-b border-[#2C3E30]/10">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <stat.icon size={14} className="text-[#2C3E30]/70" />
          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PropertyStats;