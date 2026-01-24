import React, { useState } from 'react';
import { ShieldCheck, X, Calendar, Info, Check, Eye, FileCheck, RefreshCcw } from 'lucide-react';

const BookingWidget = ({ price }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [datesSelected, setDatesSelected] = useState(false);

  // --- DATA ---
  const baseRent = price;
  const utilities = 400; 
  const monthlyTotal = baseRent + utilities;
  const bookingFee = 423; 
  const cleaningFee = 240; 
  const oneTimeTotal = bookingFee + cleaningFee; 
  const deposit = 1660;
  const isAvailable = true; 

  // Handlers
  const toggleCalendar = () => setShowCalendar(!showCalendar);
  const handleDateSelect = () => {
    setDatesSelected(true);
    setShowCalendar(false);
  };
  const handleClear = (e) => {
    e.stopPropagation();
    setDatesSelected(false);
    setShowCalendar(false);
  };

  return (
    <div className="relative">
      
      {/* --- GLASS CARD --- */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative z-20">
         
         <div className="p-5">
            
            {/* 1. HEADER & PRICE */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-bold text-[#2C3E30]">€{monthlyTotal.toLocaleString()}</span>
                        <span className="text-sm text-[#2C3E30]/60">/ mo</span>
                    </div>
                    
                    {/* STATUS INDICATOR */}
                    {datesSelected ? (
                        <div className="mt-1 flex items-center gap-2">
                            {isAvailable ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Available</span>
                                </>
                            ) : (
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Not available</span>
                            )}
                        </div>
                    ) : (
                        <div className="text-[11px] text-[#2C3E30]/60 mt-1 flex items-center gap-1.5 font-medium">
                            <Info size={12} className="text-[#2C3E30]/40"/> Min. stay: 3 months
                        </div>
                    )}
                </div>
                
                {/* ANMELDUNG BADGE */}
                <div className="flex items-center gap-1.5 bg-[#2C3E30] text-[#EAE8E4] px-3 py-1.5 rounded-full shadow-sm cursor-default">
                    <FileCheck size={12} className="text-[#EAE8E4]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#EAE8E4]">Anmeldung</span>
                </div>
            </div>

            {/* 2. DATES SELECTOR */}
            <div 
                onClick={toggleCalendar}
                className={`relative bg-white/40 border rounded-2xl mb-5 cursor-pointer transition-all duration-200 ${showCalendar ? 'border-[#2C3E30] ring-1 ring-[#2C3E30]' : 'border-white/50 hover:bg-white/60'}`}
            >
                <div className="flex h-12">
                    <div className="w-1/2 border-r border-white/50 px-4 flex flex-col justify-center">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#2C3E30]/50 mb-0.5">Move In</span>
                        <span className={`block text-xs font-bold ${datesSelected ? 'text-[#2C3E30]' : 'text-[#2C3E30]/40'}`}>
                            {datesSelected ? '23 Jan 2026' : 'Select Date'}
                        </span>
                    </div>
                    <div className="w-1/2 px-4 flex flex-col justify-center">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#2C3E30]/50 mb-0.5">Move Out</span>
                        <span className={`block text-xs font-bold ${datesSelected ? 'text-[#2C3E30]' : 'text-[#2C3E30]/40'}`}>
                            {datesSelected ? '15 May 2026' : 'Select Date'}
                        </span>
                    </div>
                </div>
                {datesSelected && (
                    <button onClick={handleClear} className="absolute top-1/2 -translate-y-1/2 right-3 p-1 hover:bg-[#2C3E30]/10 rounded-full text-[#2C3E30]/40">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* 3. COST BREAKDOWN */}
            {datesSelected && isAvailable ? (
                <div className="mb-5 animation-fade-in text-[#2C3E30]/80 space-y-3">
                    
                    {/* ZONE A: MONTHLY COSTS (Boxed) */}
                    <div className="bg-[#2C3E30]/5 rounded-xl p-3 border border-[#2C3E30]/5">
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/50">Monthly Costs</h4>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/30">Recurring</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Base Rent</span>
                            <span>{baseRent.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="flex items-center gap-1.5 opacity-80">Utilities (Flat) <Info size={12} className="opacity-40"/></span>
                            <span>{utilities} €</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-[#2C3E30] pt-2 border-t border-[#2C3E30]/10">
                            <span>Total Monthly</span>
                            <span>{monthlyTotal.toLocaleString()} €</span>
                        </div>
                    </div>

                    {/* ZONE B: ONE-TIME COSTS (Clean) */}
                    <div className="px-1">
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/50">One-Time Costs</h4>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/30">Pay Once</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="opacity-80">Booking Fee</span>
                            <span className="font-medium opacity-80">{bookingFee} €</span>
                        </div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="opacity-80">Final Cleaning</span>
                            <span className="font-medium opacity-80">{cleaningFee} €</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-[#2C3E30] pt-2 border-t border-[#2C3E30]/10">
                            <span>Total One-Time</span>
                            <span>{oneTimeTotal} €</span>
                        </div>
                    </div>

                    {/* ZONE C: DEPOSIT */}
                    <div className="bg-green-50/50 rounded-xl p-3 border border-green-100 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#2C3E30]">Security Deposit</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <RefreshCcw size={10} className="text-green-700"/>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-green-700">100% Refundable</span>
                            </div>
                        </div>
                        <span className="font-bold text-[#2C3E30] text-sm">{deposit.toLocaleString()} €</span>
                    </div>

                </div>
            ) : (
                // EMPTY STATE PLACEHOLDER
                <div className="bg-white/30 rounded-xl p-4 mb-5 text-center border border-white/40">
                    <p className="text-xs text-[#2C3E30]/60 leading-relaxed font-medium">
                        Select your move-in dates to see the complete cost breakdown.
                    </p>
                </div>
            )}

            {/* 4. MAIN ACTION BUTTON */}
            <button 
                onClick={!datesSelected ? toggleCalendar : undefined}
                disabled={datesSelected && !isAvailable}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg active:scale-[0.98] 
                ${datesSelected && !isAvailable 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A1A1A] hover:shadow-xl'}`}
            >
                {datesSelected ? (isAvailable ? 'Reserve Now' : 'Not Available') : 'Check Availability'}
            </button>
         </div>

         {/* 5. FOOTER */}
         <div className="bg-white/30 p-3 border-t border-white/50 flex justify-center gap-6 rounded-b-[2rem]">
            <div className="flex items-center gap-1.5 opacity-60">
                <ShieldCheck size={12} className="text-[#2C3E30]"/>
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#2C3E30]">Verified Listing</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
                <Check size={12} className="text-[#2C3E30]"/>
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#2C3E30]">Secure Payment</span>
            </div>
         </div>
      </div>

      {/* --- SECONDARY CARD: SCHEDULE VIEWING --- */}
      <div className="mt-2 flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm cursor-pointer hover:bg-white/60 hover:border-[#2C3E30]/20 transition-all group">
         <div className="p-2 bg-white/50 rounded-full group-hover:bg-[#2C3E30] transition-colors border border-white/50">
            <Eye size={16} className="text-[#2C3E30] group-hover:text-white transition-colors"/>
         </div>
         <div className="text-sm">
            <span className="text-[#2C3E30]/70 font-medium">Not sure yet? </span>
            <span className="font-bold text-[#2C3E30] group-hover:underline decoration-[#2C3E30]/30 underline-offset-4">Schedule a viewing</span>
         </div>
      </div>

      {/* POPUP CALENDAR */}
      {showCalendar && (
          <div className="absolute top-20 right-0 left-0 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm text-[#2C3E30]">Select dates</h4>
                  <button onClick={() => setShowCalendar(false)}><X size={18} className="text-[#2C3E30]/40 hover:text-[#2C3E30]"/></button>
              </div>
              <div className="bg-white/50 h-56 rounded-xl flex flex-col items-center justify-center text-[#2C3E30]/40 border border-white/60 mb-4">
                  <Calendar size={32} className="mb-3 opacity-50"/>
                  <span className="text-sm font-medium">Interactive Calendar</span>
              </div>
              <div className="flex justify-end">
                  <button onClick={handleDateSelect} className="px-6 py-2.5 bg-[#2C3E30] text-[#EAE8E4] text-xs font-bold rounded-lg hover:bg-[#1A1A1A] transition-colors shadow-lg">Apply Dates</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default BookingWidget;