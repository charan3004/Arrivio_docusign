import React from "react";
import { Info, HelpCircle } from "lucide-react";

const PriceBreakdownSection = ({ property }) => {
    if (!property) return null;

    const baseRent = Number(property.price) || 0;
    const utilitiesCost = Number(property.utilities) || 0;
    const bookingFee = Number(property.booking_fee) || 0;
    const cleaningFee = Number(property.cleaning_fee) || 0;
    const deposit = Number(property.security_deposit) || 0;
    const monthlyTotal = baseRent + utilitiesCost;
    const oneTimeTotal = bookingFee + cleaningFee;

    return (
        <div id="price" className="pt-10 border-t border-[#2C3E30]/10 scroll-mt-40">
            <div className="flex items-center gap-3 mb-8">
                <h3 className="font-serif text-3xl text-[#2C3E30]">Price Breakdown</h3>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <Info size={12} className="text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Full Transparency</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Costs */}
                <div className="p-8 bg-white/40 border border-[#2C3E30]/5 rounded-3xl hover:bg-white transition-all">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[#CAA472] mb-6">Recurring Monthly Costs</span>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#2C3E30]/60">Monthly Base Rent</span>
                            <span className="font-bold text-[#2C3E30]">€{baseRent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#2C3E30]/60">Flat-rate Utilities</span>
                            <span className="font-bold text-[#2C3E30]">€{utilitiesCost.toLocaleString()}</span>
                        </div>
                        <div className="pt-4 border-t border-[#2C3E30]/5 flex justify-between items-center">
                            <span className="text-sm font-bold text-[#2C3E30]">Total Monthly</span>
                            <span className="text-xl font-serif font-bold text-[#2C3E30]">€{monthlyTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] text-[#2C3E30]/40 font-medium italic">
                        * All-inclusive pricing covering electricity, water, heating, and high-speed fiber internet.
                    </p>
                </div>

                {/* Move-in Costs */}
                <div className="p-8 bg-[#F9F8F6] border border-[#2C3E30]/5 rounded-3xl">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[#CAA472] mb-6">Initial Move-in Costs</span>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#2C3E30]/60">One-time Fees</span>
                                <HelpCircle size={14} className="text-[#2C3E30]/20" />
                            </div>
                            <span className="font-bold text-[#2C3E30]">€{oneTimeTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pl-4 opacity-60 italic text-xs">
                            <span>Arrivio Service & Cleaning</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#2C3E30]/60">Fully Refundable Deposit</span>
                            <span className="font-bold text-[#2C3E30]">€{deposit.toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] text-[#2C3E30]/40 font-medium leading-relaxed">
                        Fees cover professional deep cleaning before and after your stay, and 24/7 resident support throughout your residency.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PriceBreakdownSection;
