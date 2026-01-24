import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Calendar, Users, Home, Download } from 'lucide-react';
import { motion } from 'framer-motion';

// --- IMPORT TRACKER ---
import GameLevelTracker from '../components/shared/GameLevelTracker';

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate('/');
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E4] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- TRACKER (LEVEL 4) --- */}
      <div className="w-full max-w-lg mb-8 relative z-10">
         <GameLevelTracker currentLevel={4} />
      </div>

      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#C2B280]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#2C3E30]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-2xl overflow-hidden relative"
      >
        
        {/* SUCCESS HEADER */}
        <div className="bg-[#2C3E30] p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-[#EAE8E4] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
                <Check size={32} className="text-[#2C3E30] stroke-[3]" />
            </motion.div>
            <h1 className="text-2xl font-serif text-[#EAE8E4] mb-2">Request Sent</h1>
            <p className="text-[#EAE8E4]/60 text-xs font-medium uppercase tracking-widest">Booking Reference #8X29B</p>
        </div>

        {/* RECEIPT BODY */}
        <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
                <p className="text-[#2C3E30]/70 text-sm leading-relaxed">
                    Thank you! Your request to stay for <strong className="text-[#2C3E30]">{state.nights} nights</strong> has been sent to the host.
                </p>
            </div>

            <div className="bg-white/50 border border-[#2C3E30]/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col"><span className="text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/40 mb-1">Check-in</span><div className="flex items-center gap-2 text-[#2C3E30] font-bold text-sm"><Calendar size={14} className="opacity-50"/>{state.checkIn}</div></div>
                    <div className="w-px h-8 bg-[#2C3E30]/10"></div>
                    <div className="flex flex-col items-end"><span className="text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/40 mb-1">Check-out</span><div className="flex items-center gap-2 text-[#2C3E30] font-bold text-sm">{state.checkOut}<Calendar size={14} className="opacity-50"/></div></div>
                </div>
                <div className="border-t border-[#2C3E30]/5"></div>
                <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-2"><Users size={14} className="text-[#2C3E30]/40"/><span className="text-xs font-bold text-[#2C3E30]/60">1 Guest</span></div>
                    <div className="text-right"><span className="block text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/40">Total Paid</span><span className="font-serif text-xl font-bold text-[#2C3E30]">€{state.total.toLocaleString()}</span></div>
                </div>
            </div>

            <div className="space-y-3">
                <button onClick={() => navigate('/')} className="group w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2"><Home size={14} /> Return Home</button>
                <button className="w-full py-3 bg-transparent text-[#2C3E30]/40 hover:text-[#2C3E30] text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"><Download size={14} /> Download Receipt</button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;