import React, { useState } from 'react';
import { ShieldCheck, X, Calendar, Info, Check, Eye, FileCheck } from 'lucide-react';

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
    <div className="sticky top-24 relative">
      
      {/* --- TRANSACTION CARD --- */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative z-20">
         
         <div className="p-5">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif font-bold text-[#1A1A1A]">€{monthlyTotal.toLocaleString()}</span>
                        <span className="text-xs text-[#5C5C50]">/ mo</span>
                    </div>
                    
                    {/* DYNAMIC STATUS */}
                    {datesSelected ? (
                        <div className="mt-0.5 flex items-center gap-1.5">
                            {isAvailable ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Available</span>
                                </>
                            ) : (
                                <>
                                    <X size={10} strokeWidth={4} className="text-red-600"/> 
                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Not available</span>
                                </>
                            )}
                        </div>
                    ) : (
                        // STATE 1: Policy
                        <div className="text-[10px] text-[#5C5C50] mt-0.5 flex items-center gap-1.5 font-medium relative z-50">
                            <span className="relative group cursor-default flex items-center gap-1.5">
                                <Info size={10} className="text-[#5C5C50] group-hover:text-[#2C3E30] transition-colors"/>
                                Min. stay: 3 months
                                {/* TOOLTIP */}
                                <div className="absolute bottom-full left-0 mb-2 w-48 px-3 py-2 bg-[#1A1A1A] text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    <div className="font-bold mb-1 border-b border-white/20 pb-1">Rental Terms</div>
                                    <p className="leading-relaxed text-gray-300">
                                        Fixed term for the first 3 months. Afterwards, the contract auto-renews monthly. Cancel anytime with 30 days' notice.
                                    </p>
                                    <div className="absolute top-full left-2 border-4 border-transparent border-t-[#1A1A1A]"></div>
                                </div>
                            </span>
                        </div>
                    )}
                </div>
                
                {/* --- THE BRAND GREEN BADGE --- */}
                {/* Reverted to #2C3E30 to match your color flow */}
                <div className="flex items-center gap-1.5 bg-[#2C3E30] text-white px-3 py-1.5 rounded-full shadow-sm cursor-default">
                    <FileCheck size={11} className="text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white">Anmeldung Certified</span>
                </div>
            </div>

            {/* DATE INPUTS */}
            <div 
                onClick={toggleCalendar}
                className={`relative border rounded-xl mb-5 cursor-pointer transition-all duration-200 ${showCalendar ? 'border-[#2C3E30] ring-1 ring-[#2C3E30]' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex h-12">
                    <div className="w-1/2 border-r border-gray-200 px-3 py-2">
                        <span className="block text-[10px] font-bold uppercase text-[#5C5C50]">Move In</span>
                        <span className={`block text-xs font-medium ${datesSelected ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                            {datesSelected ? '23 Jan 2026' : 'Add date'}
                        </span>
                    </div>
                    <div className="w-1/2 px-3 py-2">
                        <span className="block text-[10px] font-bold uppercase text-[#5C5C50]">Move Out</span>
                        <span className={`block text-xs font-medium ${datesSelected ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                            {datesSelected ? '15 May 2026' : 'Add date'}
                        </span>
                    </div>
                </div>
                {datesSelected && (
                    <button onClick={handleClear} className="absolute top-1/2 -translate-y-1/2 right-2 p-1 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* BREAKDOWN */}
            {datesSelected && isAvailable ? (
                <div className="mb-5 animation-fade-in">
                    
                    {/* A: Monthly */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C5C50] opacity-70">Monthly Recurring</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#5C5C50] mb-1">
                            <span>Base Rent</span>
                            <span>{baseRent.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#5C5C50] mb-2">
                            <span className="flex items-center gap-1.5 cursor-default relative group">
                                Utilities (Flat) 
                                <Info size={12} className="opacity-50 group-hover:opacity-100 group-hover:text-[#2C3E30] transition-all"/>
                                
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 bg-[#1A1A1A] text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    <div className="font-bold mb-1 border-b border-white/20 pb-1">Includes:</div>
                                    <ul className="space-y-0.5 text-gray-300">
                                        <li>• Electricity & Heating</li>
                                        <li>• Water & Sewage</li>
                                        <li>• High-speed WiFi</li>
                                    </ul>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]"></div>
                                </div>
                            </span>
                            <span>{utilities} €</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-gray-200/60">
                            <span>Monthly Total</span>
                            <span>{monthlyTotal.toLocaleString()} €</span>
                        </div>
                    </div>

                    {/* B: One-Time */}
                    <div className="rounded-xl p-3 mb-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C5C50] opacity-70">Pay Once</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#5C5C50] mb-1">
                            <span>Booking Fee</span>
                            <span>{bookingFee} €</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#5C5C50] mb-2">
                            <span>Final Cleaning</span>
                            <span>{cleaningFee} €</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-gray-100">
                            <span>Total One-time</span>
                            <span>{oneTimeTotal} €</span>
                        </div>
                    </div>

                    {/* C: Deposit */}
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-100 px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[#5C5C50]">Deposit</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-1.5 py-0.5 rounded">100% Refundable</span>
                        </div>
                        <span className="text-[#5C5C50] font-medium">{deposit.toLocaleString()} €</span>
                    </div>
                </div>
            ) : (
                <div className="bg-[#F5F5F0] rounded-xl p-4 mb-5 text-center border border-transparent hover:border-[#2C3E30]/10 transition-colors">
                    <p className="text-xs text-[#5C5C50] leading-relaxed">
                        Select dates to see the full breakdown of rent, utilities, and one-time fees.
                    </p>
                </div>
            )}

            {/* BUTTON */}
            <button 
                onClick={!datesSelected ? toggleCalendar : undefined}
                disabled={datesSelected && !isAvailable}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg active:scale-[0.98] 
                ${datesSelected && !isAvailable 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A1A1A]'}`}
            >
                {datesSelected ? (isAvailable ? 'Reserve Now' : 'Not Available') : 'Check Availability'}
            </button>
         </div>

         {/* FOOTER */}
         <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-center gap-6 rounded-b-2xl">
            <div className="flex items-center gap-1.5 opacity-60 grayscale hover:grayscale-0 transition-all">
                <ShieldCheck size={12}/>
                <span className="text-[10px] font-bold uppercase tracking-wide">Verified Listing</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60 grayscale hover:grayscale-0 transition-all">
                <Check size={12}/>
                <span className="text-[10px] font-bold uppercase tracking-wide">Secure Payment</span>
            </div>
         </div>
      </div>

      {/* --- SECONDARY ACTION --- */}
      <div className="mt-4 flex items-center justify-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-[#2C3E30]/30 transition-all group">
         <div className="p-1.5 bg-[#F5F5F0] rounded-full group-hover:bg-[#2C3E30] transition-colors">
            <Eye size={14} className="text-[#2C3E30] group-hover:text-white transition-colors"/>
         </div>
         <div className="text-xs">
            <span className="text-[#5C5C50]">Not sure yet? </span>
            <span className="font-bold text-[#2C3E30]">Schedule a viewing</span>
         </div>
      </div>

      {/* POPUP */}
      {showCalendar && (
          <div className="absolute top-16 right-0 left-0 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm">Select dates</h4>
                  <button onClick={() => setShowCalendar(false)}><X size={16} className="text-gray-400"/></button>
              </div>
              <div className="bg-gray-50 h-48 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-gray-100 mb-3">
                  <Calendar size={24} className="mb-2 opacity-50"/>
                  <span className="text-xs font-medium">Interactive Calendar</span>
              </div>
              <div className="flex justify-end">
                  <button onClick={handleDateSelect} className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-lg">Apply Dates</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default BookingWidget;