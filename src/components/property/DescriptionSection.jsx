import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

const DescriptionSection = ({ property, onOpenModal }) => {
    const descriptionRef = useRef(null);
    const [shouldShowExpand, setShouldShowExpand] = useState(false);

    useEffect(() => {
        if (descriptionRef.current) {
            setShouldShowExpand(descriptionRef.current.scrollHeight > 140);
        }
    }, [property?.description]);

    return (
        <div id="about" className="pt-2 scroll-mt-40">
            <h3 className="font-serif text-3xl text-[#2C3E30] mb-4 mt-4">
                About this home
            </h3>

            <motion.div
                initial={false}
                animate={{ height: shouldShowExpand ? 140 : "auto" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden"
            >
                <div ref={descriptionRef}>
                    <p className="text-[#2C3E30]/80 text-[14px] leading-[1.7] font-medium whitespace-pre-line tracking-tight">
                        {property.description}
                    </p>
                </div>

                {shouldShowExpand && (
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#EAE8E4] to-transparent z-10" />
                )}
            </motion.div>

            {shouldShowExpand && (
                <button
                    onClick={onOpenModal}
                    className="mt-6 text-[#2C3E30] font-bold text-[10px] uppercase tracking-[0.2em] border-b border-[#2C3E30]/20 hover:border-[#2C3E30] transition-all pb-1 hover:opacity-60"
                >
                    Read Full Description
                </button>
            )}

            {/* ARRIVIO TRUSTED MANAGER CARD */}
            <div className="mt-12 p-4 md:p-6 bg-[#F9F8F6] rounded-3xl border border-[#2C3E30]/5 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative shrink-0 group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2C3E30]/5 group-hover:border-[#CAA472]/30 transition-colors">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
                                alt="Manager"
                                loading="lazy"
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-[#2C3E30] rounded-full p-0.5 shadow-md border-2 border-white/10 z-10 transition-transform group-hover:scale-110">
                            <BadgeCheck size={16} className="text-[#CAA472]" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-[#CAA472] mb-3">Arrivio Residence Support</span>
                        <h4 className="text-2xl font-serif text-[#2C3E30] mb-3">Official Arrivio Direct Residence</h4>
                        <p className="text-sm text-[#2C3E30]/50 leading-relaxed font-medium max-w-xl">
                            "At Arrivio, we don't just manage; we own and curate. This residence is part of our private collection, ensuring perfection from the fiber-optic speed to the ergonomic workspace. We are your direct host, 24/7."
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                            <button className="px-8 py-4 bg-[#2C3E30] text-[#EAE8E4] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:shadow-xl active:scale-95 transition-all">
                                Contact Resident Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DescriptionSection);
