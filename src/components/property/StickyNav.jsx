import React from "react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { label: "About", id: "about" },
    { label: "Amenities", id: "amenities" },
    { label: "Guidelines & Policies", id: "policies" },
    { label: "Application Details", id: "details" },
    { label: "Price", id: "price" },
    { label: "Location", id: "neighborhood" }
];

const StickyNav = ({ activeSection }) => {
    return (
        <div className="sticky top-[80px] z-[60] bg-[#EAE8E4] mb-8 mt-6">
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`relative px-4 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${activeSection === item.id
                            ? "text-[#2C3E30]"
                            : "text-[#2C3E30]/30 hover:text-[#2C3E30]/60"
                            }`}
                    >
                        {item.label}
                        {activeSection === item.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2C3E30]"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default React.memo(StickyNav);
