import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, X, Calendar, Info, Check, Eye, FileCheck, RefreshCcw } from 'lucide-react';

// 1. ACCEPT NEW PROPS: title, image
const BookingWidget = ({ price, title, image }) => {
  const navigate = useNavigate();
  // ... (Keep existing state: showCalendar, checkIn, checkOut, nights, areDatesApplied) ...
  // ... (Keep existing derived data: baseRent, utilities, monthlyTotal, etc.) ...

  const [showCalendar, setShowCalendar] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(0);
  const [areDatesApplied, setAreDatesApplied] = useState(false);

  // --- DERIVED DATA ---
  const baseRent = price;
  const utilities = 400; 
  const monthlyTotal = baseRent + utilities;
  const bookingFee = 423; 
  const cleaningFee = 240; 
  const oneTimeTotal = bookingFee + cleaningFee; 
  const deposit = 1660;
  
  const hasDates = checkIn !== '' && checkOut !== '';
  const isAvailable = true; 

  // --- HANDLERS ---
  const toggleCalendar = () => {
      setShowCalendar(!showCalendar);
      if (!showCalendar) setAreDatesApplied(false);
  };
  
  const handleClear = (e) => {
    if(e) e.stopPropagation();
    setCheckIn('');
    setCheckOut('');
    setAreDatesApplied(false);
  };

  const handleApply = () => {
    if (checkIn && checkOut) {
        setAreDatesApplied(true);
        setShowCalendar(false);
    }
  };

  const handleBooking = () => {
    navigate('/signin', { 
        state: { 
            // 2. PASS IMAGE & TITLE HERE
            title: title || "Luxury Apartment", 
            image: image || "", 
            price: price, 
            total: oneTimeTotal + (monthlyTotal * (nights / 30)), 
            nights, 
            checkIn, 
            checkOut,
            guests: 1,
            monthlyTotal,
            oneTimeTotal,
            deposit
        } 
    });
  };

  // --- MATH ---
  useEffect(() => {
    if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        setNights(diffDays > 0 ? diffDays : 0);
    } else {
        setNights(0);
    }
  }, [checkIn, checkOut]);

  return (
    // ... (Keep your exact existing JSX for the widget UI) ...
    // Note: I am not pasting the whole UI again to save space, 
    // just ensure the handleBooking function is updated as above.
    <div className="relative">
       {/* ... Your existing Glass Card UI ... */}
       {/* ... Use the updated handleBooking attached to the button ... */}
       <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative z-20">
         <div className="p-5">
            <div className="flex justify-between items-start mb-5">
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-bold text-[#2C3E30]">€{monthlyTotal.toLocaleString()}</span>
                        <span className="text-sm text-[#2C3E30]/60">/ mo</span>
                    </div>
                    {areDatesApplied ? (
                        <div className="mt-1 flex items-center gap-2">
                            {isAvailable ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Available ({nights} Nights)</span>
                                </>
                            ) : (
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Not available</span>
                            )}
                        </div>
                    ) : (
                        <div className="text-[11px] text-[#2C3E30]/60 mt-1 flex items-center gap-1.5 font-medium">
                            <Info size={12} className="text-[#2C3E30]/40"/> Min. stay: 1 month
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1.5 bg-[#2C3E30] text-[#EAE8E4] px-3 py-1.5 rounded-full shadow-sm cursor-default">
                    <FileCheck size={12} className="text-[#EAE8E4]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#EAE8E4]">Anmeldung</span>
                </div>
            </div>

            <div 
                onClick={toggleCalendar}
                className={`relative bg-white/40 border rounded-2xl mb-5 cursor-pointer transition-all duration-200 ${showCalendar ? 'border-[#2C3E30] ring-1 ring-[#2C3E30]' : 'border-white/50 hover:bg-white/60'}`}
            >
                <div className="flex h-12">
                    <div className="w-1/2 border-r border-white/50 px-4 flex flex-col justify-center">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#2C3E30]/50 mb-0.5">Move In</span>
                        <span className={`block text-xs font-bold ${hasDates ? 'text-[#2C3E30]' : 'text-[#2C3E30]/40'}`}>
                            {checkIn ? checkIn : 'Select Date'}
                        </span>
                    </div>
                    <div className="w-1/2 px-4 flex flex-col justify-center">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#2C3E30]/50 mb-0.5">Move Out</span>
                        <span className={`block text-xs font-bold ${hasDates ? 'text-[#2C3E30]' : 'text-[#2C3E30]/40'}`}>
                            {checkOut ? checkOut : 'Select Date'}
                        </span>
                    </div>
                </div>
                {hasDates && !showCalendar && (
                    <button onClick={(e) => { e.stopPropagation(); handleClear(); }} className="absolute top-1/2 -translate-y-1/2 right-3 p-1 hover:bg-[#2C3E30]/10 rounded-full text-[#2C3E30]/40">
                        <X size={14} />
                    </button>
                )}
            </div>

            {areDatesApplied && isAvailable ? (
                <div className="mb-5 animation-fade-in text-[#2C3E30]/80 space-y-3">
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
                <div className="bg-white/30 rounded-xl p-4 mb-5 text-center border border-white/40">
                    <p className="text-xs text-[#2C3E30]/60 leading-relaxed font-medium">
                        Select your move-in dates to see the complete cost breakdown.
                    </p>
                </div>
            )}

            <button 
                onClick={!areDatesApplied ? toggleCalendar : handleBooking}
                disabled={areDatesApplied && !isAvailable}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg active:scale-[0.98] 
                ${areDatesApplied && !isAvailable 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A1A1A] hover:shadow-xl'}`}
            >
                {areDatesApplied ? (isAvailable ? 'Reserve Now' : 'Not Available') : 'Check Availability'}
            </button>
         </div>

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

      <div className="mt-2 flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm cursor-pointer hover:bg-white/60 hover:border-[#2C3E30]/20 transition-all group">
         <div className="p-2 bg-white/50 rounded-full group-hover:bg-[#2C3E30] transition-colors border border-white/50">
            <Eye size={16} className="text-[#2C3E30] group-hover:text-white transition-colors"/>
         </div>
         <div className="text-sm">
            <span className="text-[#2C3E30]/70 font-medium">Not sure yet? </span>
            <span className="font-bold text-[#2C3E30] group-hover:underline decoration-[#2C3E30]/30 underline-offset-4">Schedule a viewing</span>
         </div>
      </div>

      {showCalendar && (
          <div className="absolute top-20 right-0 left-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm text-[#2C3E30]">Select dates</h4>
                  <button onClick={() => setShowCalendar(false)}><X size={18} className="text-[#2C3E30]/40 hover:text-[#2C3E30]"/></button>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-white/60 mb-4 space-y-4">
                  <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2C3E30]/50 mb-1">Move In Date</label>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-[#F4F3F0] rounded-lg px-3 py-2 text-sm font-bold text-[#2C3E30] focus:ring-1 focus:ring-[#2C3E30] outline-none"/>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2C3E30]/50 mb-1">Move Out Date</label>
                      <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-[#F4F3F0] rounded-lg px-3 py-2 text-sm font-bold text-[#2C3E30] focus:ring-1 focus:ring-[#2C3E30] outline-none"/>
                  </div>
              </div>
              <div className="flex justify-between items-center">
                  <button onClick={handleClear} className="text-xs font-bold text-[#2C3E30]/60 hover:text-[#2C3E30] underline decoration-dotted">Clear dates</button>
                  <button onClick={handleApply} className="px-6 py-2.5 bg-[#2C3E30] text-[#EAE8E4] text-xs font-bold rounded-lg hover:bg-[#1A1A1A] transition-colors shadow-lg">Apply Dates</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default BookingWidget;