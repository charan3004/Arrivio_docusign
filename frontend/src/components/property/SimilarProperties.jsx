import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

const SimilarProperties = () => {
    return (
        <div id="similar" className="pt-20 border-t border-[#2C3E30]/10 scroll-mt-40">
            <div className="flex items-center justify-between mb-10">
                <h3 className="font-serif text-2xl text-[#2C3E30]">Similar Properties</h3>
                <Link to="/search" className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30] hover:opacity-60 flex items-center gap-2 transition-opacity">
                    View All <ArrowLeft size={12} className="rotate-180" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group cursor-pointer">
                    <div className="aspect-[4/3] rounded-3xl bg-[#F5F5F0] overflow-hidden relative mb-4">
                        <div className="absolute inset-0 bg-[#2C3E30]/0 group-hover:bg-[#2C3E30]/10 transition-colors z-10" />
                        <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]">Luxury Studio</span>
                        </div>
                    </div>
                    <h4 className="text-sm font-bold text-[#2C3E30] mb-1">Modern Oasis in Mitte</h4>
                    <div className="flex items-center gap-2 text-xs text-[#2C3E30]/60">
                        <span>€1,850 / month</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Star size={10} className="fill-[#CAA472] text-[#CAA472]" />
                            <span>4.9</span>
                        </div>
                    </div>
                </div>

                <div className="group cursor-pointer">
                    <div className="aspect-[4/3] rounded-3xl bg-[#F5F5F0] overflow-hidden relative mb-4">
                        <div className="absolute inset-0 bg-[#2C3E30]/0 group-hover:bg-[#2C3E30]/10 transition-colors z-10" />
                        <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]">Work-Life Loft</span>
                        </div>
                    </div>
                    <h4 className="text-sm font-bold text-[#2C3E30] mb-1">Industrial Loft with Fiber</h4>
                    <div className="flex items-center gap-2 text-xs text-[#2C3E30]/60">
                        <span>€2,200 / month</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Star size={10} className="fill-[#CAA472] text-[#CAA472]" />
                            <span>4.7</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SimilarProperties);
