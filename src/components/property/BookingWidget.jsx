import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Info,
  Check,
  Eye,
  FileCheck,
  RefreshCcw,
  Calendar
} from 'lucide-react';

const BookingWidget = ({ price, title, image }) => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(0);

  // today (blocks past dates)
  const today = new Date().toISOString().split('T')[0];

  // add days helper
  const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // duration formatter
  const formatDuration = (totalDays) => {
    if (!totalDays || totalDays <= 0) return '';

    const months = Math.floor(totalDays / 30);
    const remainingAfterMonths = totalDays % 30;
    const weeks = Math.floor(remainingAfterMonths / 7);
    const days = remainingAfterMonths % 7;

    const parts = [];
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

    return parts.join(' ');
  };

  const areDatesApplied = checkIn && checkOut;

  // pricing
  const baseRent = price;
  const utilities = 400;
  const monthlyTotal = baseRent + utilities;
  const bookingFee = 423;
  const cleaningFee = 240;
  const oneTimeTotal = bookingFee + cleaningFee;
  const deposit = 1660;

  // nights calc
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 0);
    }
  }, [checkIn, checkOut]);

  const handleBooking = () => {
    navigate('/signin', {
      state: {
        title: title || 'Luxury Apartment',
        image: image || '',
        price,
        total: oneTimeTotal + (monthlyTotal * (nights / 30)),
        nights,
        checkIn,
        checkOut,
        guests: 1,
        monthlyTotal,
        oneTimeTotal,
        deposit,
      },
    });
  };

  return (
    <div className="relative">
      <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow relative z-20">
        <div className="p-5">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif font-bold text-[#2C3E30]">
                  €{monthlyTotal.toLocaleString()}
                </span>
                <span className="text-sm text-[#2C3E30]/60">/ month</span>
              </div>

              {/* DURATION */}
              {areDatesApplied ? (
                <div className="text-[11px] text-[#2C3E30]/80 mt-1 font-semibold">
                  {formatDuration(nights)}
                </div>
              ) : (
                <div className="text-[11px] text-[#2C3E30]/60 mt-1 flex items-center gap-1.5 font-medium">
                  <Info size={12} className="text-[#2C3E30]/40" />
                  Minimum stay: 31 nights
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-[#2C3E30] text-[#EAE8E4] px-3 py-1.5 rounded-full">
              <FileCheck size={12} />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                Anmeldung
              </span>
            </div>
          </div>

          {/* MOVE IN / MOVE OUT */}
          <div className="relative bg-white/40 border border-white/50 rounded-2xl mb-5 overflow-hidden">

            {/* DISPLAY */}
            <div className="flex h-12 pointer-events-none relative z-10">
              <div className="w-1/2 border-r border-white/50 px-4 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-[#2C3E30]/50">
                    Move In
                  </span>
                  <span className="text-xs font-bold text-[#2C3E30]">
                    {checkIn || 'Select date'}
                  </span>
                </div>
                <Calendar size={16} className="text-[#2C3E30]/40" />
              </div>

              <div className="w-1/2 px-4 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-[#2C3E30]/50">
                    Move Out
                  </span>
                  <span className="text-xs font-bold text-[#2C3E30]">
                    {checkOut || 'Select date'}
                  </span>
                </div>
                <Calendar size={16} className="text-[#2C3E30]/40" />
              </div>
            </div>

            {/* REAL INPUTS */}
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setCheckOut('');
              }}
              onClick={(e) => e.currentTarget.showPicker?.()}
              className="absolute top-0 left-0 w-1/2 h-full cursor-pointer bg-transparent text-transparent focus:outline-none"
              style={{ opacity: 0.01 }}
            />

            <input
              type="date"
              value={checkOut}
              min={checkIn ? addDays(checkIn, 31) : today}
              onChange={(e) => setCheckOut(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              className="absolute top-0 right-0 w-1/2 h-full cursor-pointer bg-transparent text-transparent focus:outline-none"
              style={{ opacity: 0.01 }}
            />
          </div>

          {/* COST BREAKDOWN */}
          {areDatesApplied ? (
            <div className="mb-5 space-y-3 text-[#2C3E30]/80">

              <div className="bg-[#2C3E30]/5 rounded-xl p-3 border border-[#2C3E30]/5">
                <div className="flex justify-between text-sm mb-1">
                  <span>Base Rent</span>
                  <span>{baseRent} €</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Utilities</span>
                  <span>{utilities} €</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total Monthly</span>
                  <span>{monthlyTotal} €</span>
                </div>
              </div>

              <div className="px-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Booking Fee</span>
                  <span>{bookingFee} €</span>
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span>Final Cleaning</span>
                  <span>{cleaningFee} €</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total One-Time</span>
                  <span>{oneTimeTotal} €</span>
                </div>
              </div>

              <div className="bg-green-50/50 rounded-xl p-3 border border-green-100 flex justify-between">
                <div>
                  <span className="text-xs font-bold">Security Deposit</span>
                  <div className="flex items-center gap-1 mt-1">
                    <RefreshCcw size={10} className="text-green-700" />
                    <span className="text-[9px] font-bold text-green-700 uppercase">
                      100% Refundable
                    </span>
                  </div>
                </div>
                <span className="font-bold">{deposit} €</span>
              </div>

            </div>
          ) : (
            <div className="bg-white/30 rounded-xl p-4 mb-5 text-center border border-white/40">
              <p className="text-xs text-[#2C3E30]/60 font-medium">
                Select your move-in date — minimum stay is 31 nights.
              </p>
            </div>
          )}

          <button
            onClick={areDatesApplied ? handleBooking : undefined}
            className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1A1A1A] transition-all shadow-lg"
          >
            {areDatesApplied ? 'Reserve Now' : 'Select Dates'}
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm cursor-pointer hover:bg-white/60 transition-all group">
        <div className="p-2 bg-white/50 rounded-full group-hover:bg-[#2C3E30] transition-colors border">
          <Eye size={16} className="group-hover:text-white" />
        </div>
        <div className="text-sm">
          <span className="opacity-70">Not sure yet? </span>
          <span className="font-bold group-hover:underline">Schedule a viewing</span>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;
