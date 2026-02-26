import React from 'react';
import { Ruler, BedDouble, Bath, Layers, Armchair } from 'lucide-react';

const PropertyStats = ({ details, propertyType, furnishing, capacity }) => {
  if (!details) return null;

  const formatFurnishing = (val) => {
    if (!val) return null;
    const low = val.toLowerCase();
    if (low === 'furnished') return 'Fully Furnished';
    if (low === 'semi-furnished') return 'Semi Furnished';
    if (low === 'unfurnished') return 'No Furnishing';
    return val;
  };

  const formatFloor = (val) => {
    if (val === 0 || val === '0' || val === 'G' || val === 'GF') return 'Ground Floor';
    if (!val) return null;
    const n = parseInt(val);
    if (isNaN(n)) return val;
    const suffix = (n % 10 === 1 && n !== 11) ? 'st' : (n % 10 === 2 && n !== 12) ? 'nd' : (n % 10 === 3 && n !== 13) ? 'rd' : 'th';
    return `${n}${suffix} Floor`;
  };

  const stats = [
    {
      icon: Layers,
      label: "Level",
      value: details.floor,
      format: (v) => formatFloor(v)
    },
    {
      icon: Ruler,
      label: "Size",
      value: parseInt(details.size) || details.sqm,
      format: (v) => `${v} m²`
    },
    {
      icon: BedDouble,
      label: "Room",
      value: details.beds,
      format: (v) => `${v} Bedroom${v > 1 ? 's' : ''}`
    },
    {
      icon: Bath,
      label: "Baths",
      value: details.baths,
      format: (v) => `${v} Bathroom${v > 1 ? 's' : ''}`
    },
    {
      icon: Armchair,
      label: "Furniture",
      value: furnishing,
      format: (v) => formatFurnishing(v)
    },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== "undefined");

  return (
    <div className="py-4 border-y border-[#2C3E30]/5 my-2">
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:flex md:flex-wrap md:items-center md:gap-x-4 md:gap-y-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2.5 relative">
            {/* Minimalist Large Icon */}
            <div className="text-[#2C3E30]/60 flex items-center justify-center shrink-0">
              <stat.icon size={20} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col -space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#2C3E30]/40">
                {stat.label}
              </span>
              <span className="text-sm font-bold text-[#2C3E30] whitespace-nowrap tracking-tight">
                {stat.format(stat.value)}
              </span>
            </div>

            {/* Subtle Vertical Divider - Only on desktop and not for last item */}
            {i < stats.length - 1 && (
              <div className="hidden md:block h-8 w-[1px] bg-[#2C3E30]/10 ml-2 lg:ml-4 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyStats;