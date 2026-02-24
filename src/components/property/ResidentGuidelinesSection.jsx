import React from "react";
import {
    ShieldCheck, CigaretteOff, PawPrint, Music,
    Clock, Calendar, AlertCircle, ShieldAlert, CheckCircle, Users
} from "lucide-react";

const ResidentGuidelinesSection = () => {
    return (
        <div id="policies" className="pt-16 border-t border-[#2C3E30]/10 scroll-mt-40">
            <div className="flex items-center justify-between mb-10">
                <h3 className="font-serif text-3xl text-[#2C3E30]">
                    Resident Guidelines & Policies
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Strict Standards</span>
                    <ShieldCheck size={12} className="text-amber-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Resident Guidelines */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CAA472]">Resident Guidelines</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <CigaretteOff size={18} />
                            </div>
                            <span className="text-sm font-medium text-[#2C3E30]/80">No smoking inside</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <PawPrint size={18} />
                            </div>
                            <span className="text-sm font-medium text-[#2C3E30]/80">No pets allowed</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <Music size={18} />
                            </div>
                            <span className="text-sm font-medium text-[#2C3E30]/80">No parties or events</span>
                        </div>
                    </div>
                </div>

                {/* Logistics */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CAA472]">Logistics</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <Clock size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-[#2C3E30]/80">Check-in: 15:00 onwards</span>
                                <span className="block text-[10px] text-[#2C3E30]/40 font-bold uppercase tracking-widest mt-0.5">Contactless entry</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-[#2C3E30]/80">Check-out: By 11:00 AM</span>
                                <span className="block text-[10px] text-[#2C3E30]/40 font-bold uppercase tracking-widest mt-0.5">Flexible upon request</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer" title="View details">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <AlertCircle size={18} />
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-[#2C3E30]/80">Cancellation Policy</span>
                                <span className="block text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5 underline">Partial refund within 48h</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safety & Service */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CAA472]">Safety & Service</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <ShieldAlert size={18} />
                            </div>
                            <span className="text-sm font-medium text-[#2C3E30]/80">Smoke & CO alarms installed</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <CheckCircle size={18} />
                            </div>
                            <span className="text-sm font-medium text-[#2C3E30]/80">24/7 Dedicated Support</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-2.5 rounded-xl bg-white border border-[#2C3E30]/5 text-[#2C3E30]/60 group-hover:text-[#2C3E30] group-hover:bg-[#EAE8E4] transition-all">
                                <Users size={18} />
                            </div>
                            <span className="text-sm font-medium text-[#2C3E30]/80">Max 2 guests allowed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verified Badge Footer */}
            <div className="mt-12 p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="text-emerald-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-emerald-900 mb-0.5 uppercase tracking-widest">Verified by Arrivio Safety</p>
                    <p className="text-xs text-emerald-800/60 font-medium">This property has been manually inspected to meet all safety and quality standards.</p>
                </div>
            </div>
        </div>
    );
};

export default ResidentGuidelinesSection;
