import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, CheckCircle, Mail, Phone } from 'lucide-react'; 
import { motion } from 'framer-motion';

// --- IMPORT TRACKER ---
import GameLevelTracker from '../components/shared/GameLevelTracker';

// --- BRAND ICONS (Inline SVGs for no extra dependencies) ---
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.82 3.44-.71 1.51.18 2.53.76 3.24 1.62-2.92 1.76-2.3 5.48.56 6.84-.5 1.5-1.15 2.89-2.32 4.48zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.18 2.29-1.84 4.21-3.74 4.25z"/></svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2]" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const SignIn = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  
  // State for flow control
  const [step, setStep] = useState(1); // 1 = Input, 2 = OTP
  const [inputValue, setInputValue] = useState(''); // Stores email OR phone
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('email'); // 'email' or 'phone' (detected automatically)

  // --- HANDLER: DETECT INPUT TYPE ---
  const handleInputChange = (val) => {
    setInputValue(val);
    // Simple check: if it contains numbers and no @, treat as phone
    const isPhone = /^[0-9+\s-]*$/.test(val) && val.length > 2;
    setInputType(isPhone ? 'phone' : 'email');
  };

  // --- HANDLER: SEND OTP ---
  const handleSendOtp = (e) => {
    if(e) e.preventDefault();
    if (!inputValue) return;

    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
        setLoading(false);
        setStep(2); // Move to OTP step
    }, 1500);
  };

  // --- HANDLER: SOCIAL LOGIN ---
  const handleSocialLogin = (provider) => {
      // In a real app, this redirects to OAuth provider
      console.log(`Logging in with ${provider}`);
      // Simulate success
      if (state) navigate('/apply', { state: state });
      else navigate('/');
  };

  // --- HANDLER: VERIFY OTP ---
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setLoading(true);
    // Simulate Verification
    setTimeout(() => {
        setLoading(false);
        if (state) {
            navigate('/apply', { state: state });
        } else {
            navigate('/');
        }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#EAE8E4] flex">
      
      {/* LEFT COLUMN: BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-[#2C3E30] relative overflow-hidden items-center justify-center p-20 text-[#EAE8E4]">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="relative z-10 max-w-lg">
            <h1 className="font-serif text-5xl mb-6">Welcome to Arrivio.</h1>
            <p className="text-lg opacity-70 leading-relaxed">
                Join the exclusive community of global citizens. Rent verified homes in Berlin, Munich, and Hamburg with zero paperwork stress.
            </p>
         </div>
      </div>

      {/* RIGHT COLUMN: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        
        {/* TRACKER */}
        <div className="absolute top-0 w-full pt-6">
            <GameLevelTracker currentLevel={1} />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mt-12"
        >
            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-serif text-[#2C3E30] mb-2">
                    {step === 1 ? "Let's get started" : "Verify it's you"}
                </h2>
                <p className="text-xs text-[#2C3E30]/60">
                    {step === 1 
                        ? "Enter your details to create an account or sign in." 
                        : `We sent a 6-digit code to ${inputValue}`}
                </p>
            </div>

            {/* FORM CONTAINER */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#2C3E30]/5">
                
                {/* STEP 1: INPUT + SOCIAL */}
                {step === 1 && (
                    <div className="space-y-6">
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="relative">
                                {/* Dynamic Icon based on input */}
                                {inputType === 'phone' 
                                    ? <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/40" size={16}/>
                                    : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/40" size={16}/>
                                }
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    placeholder="Email or Phone Number" 
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#F4F3F0] border-transparent focus:bg-white border focus:border-[#2C3E30]/20 text-sm font-bold text-[#2C3E30] outline-none transition-all" 
                                    required
                                />
                            </div>
                            <button 
                                disabled={loading || !inputValue}
                                className="w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {loading ? "Sending Code..." : "Continue"} <ArrowRight size={14}/>
                            </button>
                        </form>

                        {/* DIVIDER */}
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-[#2C3E30]/10"></div>
                            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-[#2C3E30]/40 uppercase tracking-widest">Or continue with</span>
                            <div className="flex-grow border-t border-[#2C3E30]/10"></div>
                        </div>

                        {/* SOCIAL BUTTONS GRID */}
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center py-3 rounded-xl border border-[#2C3E30]/10 hover:bg-[#F4F3F0] transition-colors">
                                <GoogleIcon />
                            </button>
                            <button onClick={() => handleSocialLogin('Apple')} className="flex items-center justify-center py-3 rounded-xl border border-[#2C3E30]/10 hover:bg-[#F4F3F0] transition-colors text-[#2C3E30]">
                                <AppleIcon />
                            </button>
                            <button onClick={() => handleSocialLogin('Facebook')} className="flex items-center justify-center py-3 rounded-xl border border-[#2C3E30]/10 hover:bg-[#F4F3F0] transition-colors">
                                <FacebookIcon />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: OTP INPUT */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="flex gap-2 justify-center mb-2">
                             <div className="relative w-full">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/40" size={16}/>
                                <input 
                                    type="text" 
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="000 000" 
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#F4F3F0] border-transparent focus:bg-white border focus:border-[#2C3E30]/20 text-sm font-bold text-[#2C3E30] outline-none transition-all tracking-[0.5em] text-center" 
                                    autoFocus
                                />
                             </div>
                        </div>

                        <button 
                            disabled={loading || otp.length < 6}
                            className="w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Confirm & Continue"} <CheckCircle size={14}/>
                        </button>

                        <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/40 hover:text-[#2C3E30] py-2"
                        >
                            Wrong number/email? Go back
                        </button>
                    </form>
                )}

            </div>
            
            {/* Social Proof */}
            <div className="mt-8 flex justify-center items-center gap-2 text-[#2C3E30]/40">
                <Lock size={12} />
                <span className="text-[10px] font-medium">Secure Passwordless Login</span>
            </div>

        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;