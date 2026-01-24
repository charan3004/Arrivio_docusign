import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Upload, FileText, CheckCircle, CreditCard, ChevronRight, ArrowLeft, PenTool } from 'lucide-react';

// --- IMPORT TRACKER ---
import GameLevelTracker from '../components/shared/GameLevelTracker';

// --- STEP COMPONENTS ---
const StepIdentity = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-serif text-[#2C3E30]">Verify your Identity</h2>
    <p className="text-xs text-[#2C3E30]/60">We need to verify your ID to generate a legal German rental contract.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-dashed border-[#2C3E30]/20 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-[#F4F3F0] hover:bg-white transition-colors cursor-pointer group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"><Upload size={16} className="text-[#2C3E30]"/></div>
            <span className="text-xs font-bold text-[#2C3E30] uppercase tracking-wider mb-1">Upload Passport</span>
        </div>
        <div className="border border-dashed border-[#2C3E30]/20 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-[#F4F3F0] hover:bg-white transition-colors cursor-pointer group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"><Upload size={16} className="text-[#2C3E30]"/></div>
            <span className="text-xs font-bold text-[#2C3E30] uppercase tracking-wider mb-1">Upload Visa / ID</span>
        </div>
    </div>
  </div>
);

const StepSolvency = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-serif text-[#2C3E30]">Proof of Income</h2>
    <p className="text-xs text-[#2C3E30]/60">Landlords require proof that you can afford the monthly rent.</p>
    <div className="bg-white/50 p-4 rounded-xl border border-[#2C3E30]/10 space-y-4">
        <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2C3E30]/50 mb-1">Employment Status</label>
            <select className="w-full bg-[#F4F3F0] rounded-lg px-4 py-3 text-xs font-bold text-[#2C3E30] outline-none"><option>Full-Time Employee</option><option>Freelancer</option></select>
        </div>
        <div className="flex items-center gap-4 p-4 border border-[#2C3E30]/10 rounded-lg bg-[#F4F3F0]">
            <FileText size={20} className="text-[#2C3E30]/40"/>
            <div className="flex-1"><span className="block text-xs font-bold text-[#2C3E30]">Upload Work Contract</span></div>
            <button className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30] border-b border-[#2C3E30]">Upload</button>
        </div>
    </div>
  </div>
);

const StepContract = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-serif text-[#2C3E30]">Sign Lease Agreement</h2>
    <p className="text-xs text-[#2C3E30]/60">Please review the standard German residential lease agreement.</p>
    <div className="h-48 overflow-y-auto custom-scrollbar bg-white p-6 rounded-xl border border-[#2C3E30]/10 text-[10px] leading-relaxed text-justify text-[#2C3E30]/70 font-serif">
        <p className="mb-4"><strong>§ 1 RENTAL OBJECT</strong><br/>The Landlord hereby leases to the Tenant the apartment located at [Address]...</p>
        <p className="mb-4"><strong>§ 2 RENTAL PERIOD</strong><br/>The lease begins on [Start Date]...</p>
        <div className="h-20"></div> 
    </div>
    <div className="flex items-center gap-3 bg-[#2C3E30]/5 p-4 rounded-xl border border-[#2C3E30]/10 cursor-pointer hover:bg-[#2C3E30]/10 transition-colors">
        <div className="w-8 h-8 bg-[#2C3E30] rounded-full flex items-center justify-center text-white"><PenTool size={14}/></div>
        <span className="text-xs font-bold text-[#2C3E30] font-serif italic">Click to digitally sign as "John Doe"</span>
    </div>
  </div>
);

const StepPayment = ({ state }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-serif text-[#2C3E30]">Secure Payment</h2>
    <p className="text-xs text-[#2C3E30]/60">You will only be charged after the landlord accepts your application.</p>
    <div className="bg-white/60 p-5 rounded-xl border border-[#2C3E30]/10">
        <div className="flex justify-between mb-2"><span className="text-xs text-[#2C3E30]/70">First Month Rent</span><span className="text-xs font-bold text-[#2C3E30]">€{state.monthlyTotal?.toLocaleString()}</span></div>
        <div className="flex justify-between mb-4 pb-4 border-b border-[#2C3E30]/10"><span className="text-xs text-[#2C3E30]/70">One-Time Fees</span><span className="text-xs font-bold text-[#2C3E30]">€{state.oneTimeTotal}</span></div>
        <div className="flex justify-between items-center"><span className="text-sm font-serif text-[#2C3E30]">Total due now</span><span className="text-xl font-serif font-bold text-[#2C3E30]">€{(state.monthlyTotal + state.oneTimeTotal).toLocaleString()}</span></div>
    </div>
    <div className="space-y-3">
        <div className="relative"><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/40" size={16}/><input type="text" placeholder="Card Number" className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F4F3F0] text-xs font-bold text-[#2C3E30] outline-none"/></div>
        <div className="grid grid-cols-2 gap-3"><input type="text" placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl bg-[#F4F3F0] text-xs font-bold text-[#2C3E30] outline-none"/><input type="text" placeholder="CVC" className="w-full px-4 py-3 rounded-xl bg-[#F4F3F0] text-xs font-bold text-[#2C3E30] outline-none"/></div>
    </div>
  </div>
);

// --- MAIN PAGE ---
const ApplicationWizard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  if (!state) { setTimeout(() => navigate('/'), 0); return null; }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else navigate('/booking-success', { state });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#EAE8E4] flex flex-col md:flex-row">
      
      {/* LEFT COLUMN: THE WIZARD */}
      <div className="w-full md:w-1/2 lg:w-[45%] p-8 md:p-16 flex flex-col justify-center min-h-screen relative">
        
        {/* --- TRACKER (LEVEL 3) --- */}
        <div className="absolute top-0 left-0 w-full px-8 pt-6">
             <GameLevelTracker currentLevel={3} />
        </div>

        {/* Back Button */}
        <button onClick={handleBack} className="absolute top-32 left-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/60 hover:text-[#2C3E30] transition-colors">
            <ArrowLeft size={14}/> Back
        </button>

        {/* Progress Text */}
        <div className="mb-10 mt-20">
            <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#2C3E30]' : 'bg-[#2C3E30]/10'}`} />
                ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/40">Internal Step {step} of {totalSteps}</span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center mb-10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {step === 1 && <StepIdentity />}
                    {step === 2 && <StepSolvency />}
                    {step === 3 && <StepContract />}
                    {step === 4 && <StepPayment state={state} />}
                </motion.div>
            </AnimatePresence>
        </div>

        <button onClick={handleNext} className="w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2">
            {step === totalSteps ? "Complete Application" : "Continue"} <ChevronRight size={14}/>
        </button>
      </div>

      {/* RIGHT COLUMN: SUMMARY */}
      <div className="hidden md:block w-1/2 lg:w-[55%] bg-[#2C3E30] relative overflow-hidden p-16 text-[#EAE8E4]">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
                <h3 className="text-3xl font-serif mb-6">Your Stay</h3>
                <div className="space-y-6 text-sm">
                    <div className="flex justify-between border-b border-white/10 pb-4"><span className="opacity-60">Move-in</span><span className="font-bold">{state.checkIn}</span></div>
                    <div className="flex justify-between border-b border-white/10 pb-4"><span className="opacity-60">Move-out</span><span className="font-bold">{state.checkOut}</span></div>
                    <div className="flex justify-between border-b border-white/10 pb-4"><span className="opacity-60">Duration</span><span className="font-bold">{state.nights} Nights</span></div>
                </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4"><ShieldCheck className="text-[#C2B280]" size={20}/><div><h4 className="text-xs font-bold uppercase tracking-wider">Scam Protection</h4><p className="text-[10px] opacity-70">Money held in escrow.</p></div></div>
                <div className="flex items-center gap-3"><CheckCircle className="text-[#C2B280]" size={20}/><div><h4 className="text-xs font-bold uppercase tracking-wider">Housing Contract</h4><p className="text-[10px] opacity-70">Valid for Anmeldung.</p></div></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;