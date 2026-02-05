import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, ChevronRight, ArrowLeft, Calendar, RefreshCcw, ChevronDown, ShieldCheck, CheckCircle, User } from 'lucide-react';
import GameLevelTracker from '../components/shared/GameLevelTracker';
import { useAuth } from '../context/AuthContext';

// Shared Price Breakdown (Stays the same)
const DetailedPriceBreakdown = ({ state, theme = "dark" }) => {
    const textColor = theme === "dark" ? "text-[#EAE8E4]" : "text-[#2C3E30]";
    const subtleColor = theme === "dark" ? "text-[#EAE8E4]/60" : "text-[#2C3E30]/60";
    const borderColor = theme === "dark" ? "border-white/10" : "border-[#2C3E30]/10";
    const bookingFee = 423;
    const payNow = state.monthlyTotal + bookingFee; 
    
    return (
        <div className="space-y-1.5 text-xs w-full text-left">
            <div className={`flex justify-between font-bold ${textColor}`}>
                <span>First Month Rent</span>
                <span>€{state.monthlyTotal?.toLocaleString()}</span>
            </div>
            <div className={`border-t ${borderColor}`}></div>
            <div className={`flex justify-between font-bold ${textColor}`}>
                <span>One-Time Fees</span>
                <span>€{state.oneTimeTotal}</span>
            </div>
            <div className={`flex justify-between items-center ${subtleColor} px-2 py-1 border border-dashed ${borderColor} rounded opacity-80`}>
                <span className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wide"><RefreshCcw size={10}/> Security Deposit</span>
                <span className="font-medium">Pay Later</span>
            </div>
            <div className="pt-2 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-green-400">Due Today</span>
                <span className={`text-xl font-serif font-bold ${textColor}`}>€{payNow.toLocaleString()}</span>
            </div>
        </div>
    );
};

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const bookingData = state || {
     title: "Debug Apartment",
     image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
     monthlyTotal: 1200, oneTimeTotal: 500, deposit: 2000,
     checkIn: "2024-01-01", checkOut: "2024-02-01", nights: 30
  };

  const payNow = bookingData.monthlyTotal + 423;

  return (
    <div className="h-screen w-full bg-[#EAE8E4] flex flex-col md:flex-row overflow-hidden relative">
      
      {/* CSS TO HIDE SCROLLBARS */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* 1. MOBILE HEADER */}
      <div className="md:hidden flex-shrink-0 z-50 bg-white border-b border-[#2C3E30]/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                <img src={bookingData.image} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-serif font-bold text-[#2C3E30]">€{payNow.toLocaleString()}</p>
        </div>
        <button onClick={() => setShowMobileSummary(!showMobileSummary)}><ChevronDown size={16}/></button>
      </div>

      {/* 2. LEFT COLUMN: PAYMENT FORM */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col h-full bg-[#EAE8E4]">
        
        {/* HEADER AREA */}
        <div className="px-6 pt-6 md:px-12 md:pt-10 flex-shrink-0">
             <div className="w-full mb-4"><GameLevelTracker currentLevel={3} /></div>
             <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/40"><ArrowLeft size={12}/> Back</button>
        </div>

        {/* MAIN CONTENT AREA - NO CENTERING, JUST PADDING */}
        <div className="flex-grow px-6 md:px-12 pt-4 overflow-hidden">
            <div className="max-w-sm mx-auto">
                <div className="mb-4">
                    <h2 className="text-3xl font-serif text-[#2C3E30] leading-none mb-1">Final Step</h2>
                    <p className="text-[11px] text-[#2C3E30]/60">Confirm your reservation with a secure payment.</p>
                </div>

                {user && (
                    <div className="mb-6 bg-[#2C3E30]/5 p-3 rounded-xl border border-[#2C3E30]/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2C3E30] flex items-center justify-center text-white flex-shrink-0">
                             <User size={14}/>
                        </div>
                        <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/50">Receipt will be sent to</p>
                             <p className="text-xs font-bold text-[#2C3E30]">{user.email}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-[#2C3E30]/5">
                     <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#2C3E30]/5">
                        <span className="text-[10px] font-bold text-[#2C3E30]/40 uppercase tracking-widest">Due Today</span>
                        <span className="text-xl font-serif font-bold text-[#2C3E30]">€{payNow.toLocaleString()}</span>
                     </div>
                     
                     <div className="space-y-2.5">
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/30" size={14}/>
                            <input type="text" placeholder="Card Number" className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F4F3F0] text-xs font-bold text-[#2C3E30] outline-none"/>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                            <input type="text" placeholder="MM / YY" className="px-4 py-3 rounded-xl bg-[#F4F3F0] text-xs font-bold text-[#2C3E30] outline-none"/>
                            <input type="text" placeholder="CVC" className="px-4 py-3 rounded-xl bg-[#F4F3F0] text-xs font-bold text-[#2C3E30] outline-none"/>
                        </div>
                        <input type="text" placeholder="Cardholder Name" defaultValue={user?.full_name} className="w-full px-4 py-3 rounded-xl bg-[#F4F3F0] text-xs font-bold text-[#2C3E30] outline-none"/>
                     </div>

                     <div className="flex items-center justify-between mt-4 pt-1">
                        <div className="flex gap-3 items-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2.5" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-3" />
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-bold text-[#2C3E30]/30 uppercase"><Lock size={10} /> Secure</div>
                     </div>
                </div>
            </div>
        </div>

        {/* STICKY FOOTER BUTTON */}
        <div className="p-6 md:p-12 md:pt-4">
             <button onClick={() => navigate('/booking-success', { state: bookingData })} className="w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Lock size={14}/> Secure Checkout — Pay €{payNow.toLocaleString()}
            </button>
        </div>
      </div>

      {/* 3. RIGHT COLUMN: DESKTOP SUMMARY */}
      <div className="hidden md:flex w-1/2 lg:w-[55%] bg-[#2C3E30] relative flex-col h-full items-center justify-center overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
         <div className="relative z-10 w-full max-w-[360px]">
            <h3 className="text-lg font-serif mb-4 text-[#EAE8E4] opacity-90">Booking Summary</h3>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#212E24] mb-5">
                <div className="h-28 w-full"><img src={bookingData.image} className="w-full h-full object-cover opacity-80" /></div>
                <div className="p-5"><DetailedPriceBreakdown state={bookingData} theme="dark" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-[#EAE8E4] flex items-center gap-2">
                    <ShieldCheck className="text-[#C2B280]" size={14}/><span className="text-[9px] font-bold uppercase tracking-wider">Scam Protection</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-[#EAE8E4] flex items-center gap-2">
                    <CheckCircle className="text-[#C2B280]" size={14}/><span className="text-[9px] font-bold uppercase tracking-wider">Legal Contract</span>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PaymentPage;
