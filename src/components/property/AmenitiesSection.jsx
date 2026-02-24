import React from "react";
import {
    Wifi, Monitor, Armchair, Tv, Sparkles, Waves, Sofa,
    ArrowUpFromLine, Lock, Bike, Mail, Users, Car, Printer,
    Package, Wind, Utensils, Coffee, Shirt, Dumbbell, UserCheck,
    Sun, CheckCircle, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const getAmenityIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("internet") || n.includes("wifi") || n.includes("fiber")) return <Wifi size={16} />;
    if (n.includes("monitor")) return <Monitor size={16} />;
    if (n.includes("chair") || n.includes("desk")) return <Armchair size={16} />;
    if (n.includes("tv")) return <Tv size={16} />;
    if (n.includes("cleaning")) return <Sparkles size={16} />;
    if (n.includes("washer") || n.includes("laundry")) return <Waves size={16} />;
    if (n.includes("furnished")) return <Sofa size={16} />;
    if (n.includes("elevator")) return <ArrowUpFromLine size={16} />;
    if (n.includes("secure")) return <Lock size={16} />;
    if (n.includes("bike")) return <Bike size={16} />;
    if (n.includes("mail")) return <Mail size={16} />;
    if (n.includes("meeting")) return <Users size={16} />;
    if (n.includes("parking")) return <Car size={16} />;
    if (n.includes("printer") || n.includes("scanner")) return <Printer size={16} />;
    if (n.includes("office") || n.includes("supplies")) return <Package size={16} />;
    if (n.includes("air") || n.includes("conditioning") || n.includes("ac")) return <Wind size={16} />;
    if (n.includes("dishwasher") || n.includes("utensils")) return <Utensils size={16} />;
    if (n.includes("coffee")) return <Coffee size={16} />;
    if (n.includes("iron")) return <Shirt size={16} />;
    if (n.includes("gym") || n.includes("fitness")) return <Dumbbell size={16} />;
    if (n.includes("concierge")) return <UserCheck size={16} />;
    if (n.includes("rooftop") || n.includes("sun")) return <Sun size={16} />;
    return <CheckCircle size={16} />;
};

const AmenitiesSection = ({ property, isAmenitiesOpen, setIsAmenitiesOpen }) => {
    if (!property?.amenities) return null;

    const allAmenities = Object.values(property.amenities).flat();

    // Categorization Logic based on the reference image
    const billsIncludedKeywords = ["wifi", "internet", "fiber", "gas", "heating", "water", "electric", "power", "utilities"];
    const safetyKeywords = ["secure", "lock", "cctv", "fire", "alarm", "security", "assistance", "support", "guard"];

    const billsIncluded = allAmenities.filter(item =>
        billsIncludedKeywords.some(key => item.toLowerCase().includes(key))
    );

    const safetyAndSecurity = allAmenities.filter(item =>
        safetyKeywords.some(key => item.toLowerCase().includes(key)) && !billsIncluded.includes(item)
    );

    const commonAmenities = allAmenities.filter(item =>
        !billsIncluded.includes(item) && !safetyAndSecurity.includes(item)
    );

    // Mock utility estimates for display as seen in the reference image
    const getUtilityCostLabel = (name) => {
        const n = name.toLowerCase();
        if (n.includes("wifi") || n.includes("internet")) return "€15/week";
        if (n.includes("electric")) return "€12/week";
        if (n.includes("gas")) return "€10/week";
        if (n.includes("heating")) return "€8/week";
        if (n.includes("water")) return "€5/week";
        return "Est. N/A*";
    };

    return (
        <>
            <div id="amenities" className="pt-10 border-t border-[#2C3E30]/10 scroll-mt-40">
                <h3 className="font-serif text-3xl text-[#2C3E30] mb-8">
                    Amenities
                </h3>

                <div className="space-y-12">
                    {/* 1. BILLS INCLUDED */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 px-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CAA472]">Bills Included</h4>
                            <span className="text-[10px] font-medium text-[#2C3E30]/40 uppercase tracking-widest">(in rent)</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {billsIncluded.slice(0, 12).map((item, i) => (
                                <div key={i} className="flex items-center gap-2 group p-1.5 pr-3 bg-white/40 border border-[#2C3E30]/5 rounded-xl hover:bg-white transition-all hover:shadow-sm w-fit">
                                    <div className="p-1.5 rounded-lg bg-[#EAE8E4]/50 border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] transition-all shrink-0">
                                        {React.cloneElement(getAmenityIcon(item), { size: 12 })}
                                    </div>
                                    <span className="text-[12px] font-medium text-[#2C3E30]/80 leading-tight whitespace-nowrap">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. COMMON AMENITIES */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CAA472] mb-6 px-1">Common Amenities</h4>
                        <div className="flex flex-wrap gap-2.5">
                            {commonAmenities.slice(0, 12).map((item, i) => (
                                <div key={i} className="flex items-center gap-2 group p-1.5 pr-3 bg-white/40 border border-[#2C3E30]/5 rounded-xl hover:bg-white transition-all hover:shadow-sm w-fit">
                                    <div className="p-1.5 rounded-lg bg-[#EAE8E4]/50 border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] transition-all shrink-0">
                                        {React.cloneElement(getAmenityIcon(item), { size: 12 })}
                                    </div>
                                    <span className="text-[12px] font-medium text-[#2C3E30]/80 leading-tight whitespace-nowrap">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. SAFETY & SECURITY */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CAA472] mb-6 px-1">Safety and Security</h4>
                        <div className="flex flex-wrap gap-2.5">
                            {safetyAndSecurity.slice(0, 12).map((item, i) => (
                                <div key={i} className="flex items-center gap-2 group p-1.5 pr-3 bg-white/40 border border-[#2C3E30]/5 rounded-xl hover:bg-white transition-all hover:shadow-sm w-fit">
                                    <div className="p-1.5 rounded-lg bg-[#EAE8E4]/50 border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] transition-all shrink-0">
                                        {React.cloneElement(getAmenityIcon(item), { size: 12 })}
                                    </div>
                                    <span className="text-[12px] font-medium text-[#2C3E30]/80 leading-tight whitespace-nowrap">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-start">
                    <button
                        onClick={() => setIsAmenitiesOpen(true)}
                        className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C3E30] hover:opacity-60 transition-all px-1"
                    >
                        <span>View all {allAmenities.length} amenities</span>
                        <ArrowUpFromLine size={12} className="rotate-90 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* AMENITIES MODAL */}
            <AnimatePresence>
                {isAmenitiesOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsAmenitiesOpen(false)}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#EAE8E4] w-full max-w-2xl max-h-[80vh] rounded-[2rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col border border-white/20"
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-[#2C3E30]/5 flex items-center justify-between bg-white/60 backdrop-blur-xl sticky top-0 z-10">
                                <div>
                                    <h3 className="font-serif text-xl text-[#2C3E30] tracking-tight">Amenities</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-5 h-[1px] bg-[#CAA472]"></span>
                                        <p className="text-[9px] text-[#CAA472] font-bold uppercase tracking-[0.2em]">Full Residence Inventory</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAmenitiesOpen(false)}
                                    className="p-2 bg-white hover:bg-[#2C3E30] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#2C3E30]/5 group"
                                >
                                    <X size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            {/* List */}
                            <div className="px-6 py-6 overflow-y-auto flex-1 arrivio-scrollbar">
                                <div className="space-y-6">
                                    {Object.entries(property.amenities).map(([category, items]) => (
                                        <div key={category}>
                                            <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#CAA472] mb-3 pb-1.5 border-b border-[#2C3E30]/5">
                                                {category}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2 group p-1.5 pr-3 bg-white/50 border border-[#2C3E30]/5 rounded-xl hover:bg-white transition-all hover:shadow-sm w-fit">
                                                        <div className="p-1.5 rounded-lg bg-[#EAE8E4]/80 border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] transition-all shrink-0">
                                                            {React.cloneElement(getAmenityIcon(item), { size: 12 })}
                                                        </div>
                                                        <span className="text-[12px] font-medium text-[#2C3E30]/80 leading-tight whitespace-nowrap">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AmenitiesSection;
