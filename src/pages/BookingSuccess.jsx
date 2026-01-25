import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Calendar, Users, Home, Download, RefreshCcw, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // --- DEV MODE FALLBACK ---
  const bookingData = state || {
    title: "Luxury Loft Mitte",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    monthlyTotal: 1200,
    oneTimeTotal: 500,
    deposit: 2000,
    checkIn: "Jan 12, 2024",
    checkOut: "Feb 12, 2024",
    nights: 30,
    total: 1623 // Rent + Booking Fee
  };

  useEffect(() => {
    if (!state && process.env.NODE_ENV === 'production') navigate('/');
  }, [state, navigate]);

  const remainingDue = bookingData.deposit + 240; // Deposit + Cleaning

  return (
    <div className="min-h-screen bg-[#EAE8E4] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* BACKGROUND ORBS */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#C2B280]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#2C3E30]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white"
      >
        
        {/* PROPERTY IMAGE HEADER */}
        <div className="h-48 w-full relative">
            <img 
                src={bookingData.image} 
                alt={bookingData.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            
            {/* SUCCESS ICON OVERLAY */}
            <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute top-6 right-6 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white"
            >
                <Check size={24} className="text-white stroke-[4]" />
            </motion.div>

            <div className="absolute bottom-6 left-8">
                <h1 className="text-2xl font-serif text-white mb-1">Payment Successful</h1>
                <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin size={12} className="text-[#C2B280]"/> {bookingData.title}
                </div>
            </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-8 space-y-6">
            
            {/* BOOKING INFO GRID */}
            <div className="bg-[#F4F3F0] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/40 mb-1">Check-in</span>
                        <div className="flex items-center gap-2 text-[#2C3E30] font-bold text-sm">
                            <Calendar size={14} className="opacity-40"/>
                            {bookingData.checkIn}
                        </div>
                    </div>
                    <div className="w-px h-8 bg-[#2C3E30]/10"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/40 mb-1">Check-out</span>
                        <div className="flex items-center gap-2 text-[#2C3E30] font-bold text-sm">
                            {bookingData.checkOut}
                            <Calendar size={14} className="opacity-40"/>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#2C3E30]/10 border-dashed"></div>

                {/* MONEY DETAILS */}
                <div className="flex justify-between items-end">
                    <div>
                        <span className="block text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/40 mb-1">Paid Today</span>
                        <span className="font-serif text-2xl font-bold text-[#2C3E30]">€{bookingData.total?.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                        <span className="flex items-center gap-1.5 justify-end text-[9px] font-bold uppercase tracking-widest text-green-600 mb-1">
                            <RefreshCcw size={10}/> Due at Move-in
                        </span>
                        <span className="text-sm font-bold text-[#2C3E30]">€{remainingDue.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[#2C3E30]/60 text-xs leading-relaxed px-4">
                    Your reservation is confirmed. We've sent a copy of your signed contract and receipt to your email.
                </p>
            </div>

            {/* ACTIONS */}
            <div className="space-y-3 pt-2">
                <button 
                    onClick={() => navigate('/')} 
                    className="w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    <Home size={14} /> Back to Dashboard
                </button>
                <button 
                    className="w-full py-3 bg-transparent text-[#2C3E30]/40 hover:text-[#2C3E30] text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                    <Download size={14} /> Download PDF Receipt
                </button>
            </div>
        </div>
      </motion.div>
      
      {/* FOOTER NOTE */}
      <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C3E30]/30">
        Booking Reference: ARV-{Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  );
};

export default BookingSuccess;