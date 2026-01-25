import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Upload, FileText, CheckCircle, ChevronRight, ArrowLeft, PenTool, ChevronDown, RefreshCcw, Calendar } from 'lucide-react';

// --- IMPORT TRACKER ---
import GameLevelTracker from '../components/shared/GameLevelTracker';

// --- SHARED COMPONENT: PRICE BREAKDOWN ---
const DetailedPriceBreakdown = ({ state, theme = "dark" }) => {
    const textColor = theme === "dark" ? "text-[#EAE8E4]" : "text-[#2C3E30]";
    const subtleColor = theme === "dark" ? "text-[#EAE8E4]/60" : "text-[#2C3E30]/60";
    const borderColor = theme === "dark" ? "border-white/10" : "border-[#2C3E30]/10";
    
    // Hardcoded fees for demo logic
    const bookingFee = 423;
    const cleaningFee = 240;
    
    const payNow = state.monthlyTotal + bookingFee; 
    const payLater = state.deposit + cleaningFee;    

    return (
        <div className="space-y-3 text-xs w-full">
            <div>
                <div className={`flex justify-between font-bold mb-0.5 ${textColor}`}>
                    <span>First Month Rent</span>
                    <span>€{state.monthlyTotal?.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between ${subtleColor} text-[10px]`}>
                    <span>Utilities included</span>
                    <span>Yes</span>
                </div>
            </div>

            <div className={`border-t ${borderColor}`}></div>

            <div>
                 <div className={`flex justify-between font-bold mb-0.5 ${textColor}`}>
                    <span>One-Time Fees</span>
                    <span>€{state.oneTimeTotal}</span>
                </div>
                <div className={`flex justify-between ${subtleColor} text-[10px]`}>
                    <span>Booking Fee (Due Now)</span>
                    <span>€{bookingFee}</span>
                </div>
                <div className={`flex justify-between ${subtleColor} text-[10px]`}>
                    <span>Final Cleaning (Pay later)</span>
                    <span>€{cleaningFee}</span>
                </div>
            </div>

            <div className={`border-t ${borderColor}`}></div>

            <div className={`flex justify-between items-center ${subtleColor} px-2 py-1.5 border border-dashed ${borderColor} rounded opacity-80`}>
                <span className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wide">
                    <RefreshCcw size={10}/> Security Deposit
                </span>
                <span className="font-medium">Pay Later (€{state.deposit?.toLocaleString()})</span>
            </div>

            <div className={`pt-3 mt-1`}>
                <div className={`flex justify-between items-center mt-1`}>
                    <span className={`text-xs font-bold uppercase tracking-widest text-green-400`}>Due Today to Reserve</span>
                    <span className={`text-xl font-serif font-bold ${textColor}`}>€{payNow.toLocaleString()}</span>
                </div>
                <p className={`text-[9px] text-right mt-1 ${subtleColor}`}>
                    Remaining €{payLater.toLocaleString()} due at move-in.
                </p>
            </div>
        </div>
    );
};

// --- INTERNAL STEPS ---
const StepIdentity = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-serif text-[#2C3E30]">Verify your Identity</h2>
    <p className="text-xs text-[#2C3E30]/60">We need to verify your ID to generate a legal German rental contract.</p>
    <div className="grid grid-cols-1 gap-4">
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

// --- MAIN PAGE ---
const ApplicationWizard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const totalSteps = 3;

  // --- DEV MODE: FALLBACK DATA ---
  // This ensures the page works even if you refresh or access it directly
  const bookingData = state || {
     title: "Debug Apartment (Dev Mode)",
     image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
     monthlyTotal: 1200,
     oneTimeTotal: 500,
     deposit: 2000,
     checkIn: "2024-01-01",
     checkOut: "2024-02-01",
     nights: 30
  };

  const payNow = bookingData.monthlyTotal + 423;

  const handleNext = () => {
    if (step < totalSteps) {
        setStep(step + 1);
    } else {
        // --- GO TO PAYMENT PAGE ---
        // Pass the booking data along
        navigate('/payment', { state: bookingData });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  return (
    <div className="h-screen w-full bg-[#EAE8E4] flex flex-col md:flex-row overflow-hidden">
      
      {/* 1. MOBILE HEADER */}
      <div className="md:hidden flex-shrink-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#2C3E30]/10 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3" onClick={() => setShowMobileSummary(!showMobileSummary)}>
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                {bookingData.image && <img src={bookingData.image} alt="" className="w-full h-full object-cover" />}
            </div>
            <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/50">Due Today</p>
                <p className="text-sm font-serif font-bold text-[#2C3E30]">€{payNow.toLocaleString()}</p>
            </div>
        </div>
        <button onClick={() => setShowMobileSummary(!showMobileSummary)}>
            <ChevronDown size={16} className={`text-[#2C3E30] transition-transform duration-300 ${showMobileSummary ? 'rotate-180' : ''}`}/>
        </button>
        
        <AnimatePresence>
            {showMobileSummary && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="absolute top-full left-0 right-0 bg-white border-b border-[#2C3E30]/10 shadow-xl overflow-y-auto max-h-[80vh]"
                >
                    <div className="p-4">
                         <div className="p-4 bg-[#F4F3F0] rounded-xl">
                            <DetailedPriceBreakdown state={bookingData} theme="light" />
                         </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* 2. LEFT COLUMN: FORM */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col h-full relative z-0">
        
        {/* TOP: Fixed Tracker & Back */}
        <div className="flex-shrink-0 px-6 pt-6 pb-2 md:px-12 md:pt-12 bg-[#EAE8E4]">
             <div className="w-full mb-6">
                 {/* FIXED LEVEL 2: APPLICATION */}
                 <GameLevelTracker currentLevel={2} />
             </div>

             <div className="flex justify-between items-end mt-4 mb-2">
                 <button onClick={handleBack} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/60 hover:text-[#2C3E30] transition-colors py-2">
                    <ArrowLeft size={14}/> Back
                 </button>
                 
                 <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-1.5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#2C3E30]' : 'bg-[#2C3E30]/10'}`} />
                        ))}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#2C3E30]/40">
                        Step {step} / {totalSteps}
                    </span>
                 </div>
             </div>
        </div>

        {/* MIDDLE: Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-4 custom-scrollbar">
            <div className="py-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {step === 1 && <StepIdentity />}
                        {step === 2 && <StepSolvency />}
                        {step === 3 && <StepContract />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* BOTTOM: Action Button */}
        <div className="flex-shrink-0 p-6 md:p-12 pt-0 bg-[#EAE8E4]">
             <button onClick={handleNext} className="w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2 shadow-lg">
                {step === totalSteps ? "Go to Secure Payment" : "Continue"} <ChevronRight size={14}/>
            </button>
        </div>
      </div>

      {/* 3. RIGHT COLUMN: SUMMARY */}
      <div className="hidden md:flex w-1/2 lg:w-[55%] bg-[#2C3E30] relative flex-col h-full overflow-y-auto custom-scrollbar">
         
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none fixed"></div>
         
         <div className="relative z-10 w-full max-w-[400px] mx-auto my-auto p-8">
            
            <h3 className="text-xl font-serif mb-5 text-[#EAE8E4] opacity-90">Booking Summary</h3>
            
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#212E24] mb-5">
                {bookingData.image && (
                    <div className="h-32 w-full relative">
                        <img src={bookingData.image} alt={bookingData.title} className="w-full h-full object-cover opacity-90" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#212E24] to-transparent">
                            <h3 className="text-sm font-serif font-bold text-white leading-tight">{bookingData.title}</h3>
                        </div>
                    </div>
                )}
                
                <div className="bg-white/5 backdrop-blur-sm px-4 py-2.5 border-b border-white/5 flex justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-[#C2B280]"/>
                            <span className="font-bold text-white">{bookingData.checkIn}</span>
                        </div>
                        <div className="text-white/40">→</div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{bookingData.checkOut}</span>
                            <span className="text-[9px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full">{bookingData.nights} Nights</span>
                        </div>
                </div>

                <div className="p-5">
                    <DetailedPriceBreakdown state={bookingData} theme="dark" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 text-[#EAE8E4] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#C2B280]/20 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="text-[#C2B280]" size={14}/>
                    </div>
                    <div>
                        <h4 className="text-[9px] font-bold uppercase tracking-wider">Scam Protection</h4>
                        <p className="text-[8px] opacity-70">Escrow payments.</p>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 text-[#EAE8E4] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#C2B280]/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="text-[#C2B280]" size={14}/>
                    </div>
                    <div>
                        <h4 className="text-[9px] font-bold uppercase tracking-wider">Legal Contract</h4>
                        <p className="text-[8px] opacity-70">Anmeldung ready.</p>
                    </div>
                </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;