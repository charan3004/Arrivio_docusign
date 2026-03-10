import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Check,
  Calendar,
  Users,
  Home,
  Download,
  RefreshCcw,
  MapPin,
  MessageCircle,
  Instagram
} from 'lucide-react';
import { motion } from 'framer-motion';

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ no static fallback
  const bookingData = state;

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  const batchNumber = useMemo(() => {
    return `ARV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }, []);

  if (!bookingData) return null;

  const remainingDue = bookingData.deposit + 240;

  return (
    <div className="min-h-screen bg-[#EAE8E4] flex justify-center pt-24 p-6 relative overflow-hidden">

      {/* BACKGROUND ORBS */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#C2B280]/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#2C3E30]/10 rounded-full blur-[100px]" />

      {/* ✅ top aligned layout */}
      <div className="flex gap-12 items-start">

        {/* ================= LEFT SUCCESS CARD ================= */}

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white"
        >

          {/* HEADER */}
          <div className="h-48 w-full relative">
            <img
              src={bookingData.image}
              alt={bookingData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute top-6 right-6 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
              <Check size={24} className="text-white stroke-[4]" />
            </div>

            <div className="absolute bottom-6 left-8">
              <h1 className="text-2xl font-serif text-white mb-1">
                Booking Successful
              </h1>
              <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                <MapPin size={12} /> {bookingData.title}
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-8 space-y-6">

            {/* BOOKING INFO */}
            <div className="bg-[#F4F3F0] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">

                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#2C3E30]/40">Check-in</span>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Calendar size={14} className="opacity-40" />
                    {bookingData.checkIn}
                  </div>
                </div>

                <div className="w-px h-8 bg-[#2C3E30]/10" />

                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-widest text-[#2C3E30]/40">Check-out</span>
                  <div className="flex items-center gap-2 font-bold text-sm justify-end">
                    {bookingData.checkOut}
                    <Calendar size={14} className="opacity-40" />
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-[#2C3E30]/10" />

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#2C3E30]/40">Paid Today</span>
                  <span className="font-serif text-2xl font-bold">
                    €{bookingData.total?.toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="flex items-center gap-1 text-[9px] text-green-600 uppercase tracking-widest">
                    <RefreshCcw size={10} /> Due at Move-in
                  </span>
                  <span className="font-bold">
                    €{remainingDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-[#2C3E30]/60 leading-relaxed">
              Your reservation is confirmed. We've sent a copy of your signed contract and receipt to your email.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/')}
                className="w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Home size={14} /> Back to Dashboard
              </button>

              <button className="w-full py-3 text-[#2C3E30]/40 text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <Download size={14} /> Download PDF Receipt
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= RIGHT SIDE PANEL ================= */}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 space-y-6"
        >

          {/* Batch */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-[#2C3E30]/40 font-bold mb-2">
              Batch
            </p>
            <p className="font-bold text-[#2C3E30] text-sm">{batchNumber}</p>
          </div>

          {/* Community */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#2C3E30]/40 font-bold">
              <Users size={14} /> Community
            </div>

            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:opacity-70">
              <MessageCircle size={16} /> WhatsApp
            </a>

            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:opacity-70">
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default BookingSuccess;


