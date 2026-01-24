import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User } from 'lucide-react'; 
import { motion } from 'framer-motion';

// --- IMPORT TRACKER ---
import GameLevelTracker from '../components/shared/GameLevelTracker';

const SignIn = () => {
  const { state } = useLocation(); // Contains booking data passed from Widget
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    // In a real app, validate auth here.
    
    if (state) {
        // If booking data exists, go to next step (Application Wizard)
        navigate('/apply', { state: state });
    } else {
        // Standard login
        navigate('/');
    }
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
        
        {/* --- TRACKER (LEVEL 2) --- */}
        <div className="absolute top-0 w-full pt-6">
            <GameLevelTracker currentLevel={2} />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mt-12" // Added margin-top to clear the tracker
        >
            {/* Header */}
            <div className="mb-10">
                <h2 className="text-3xl font-serif text-[#2C3E30] mb-2">
                    {isRegistering ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-xs text-[#2C3E30]/60">
                    {isRegistering ? "Start your relocation journey today." : "Please sign in to continue your booking."}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
                {isRegistering && (
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/40" size={16}/>
                        <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-[#2C3E30]/10 text-xs font-bold text-[#2C3E30] outline-none focus:border-[#2C3E30]" />
                    </div>
                )}

                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/40" size={16}/>
                    <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-[#2C3E30]/10 text-xs font-bold text-[#2C3E30] outline-none focus:border-[#2C3E30]" />
                </div>

                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E30]/40" size={16}/>
                    <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-[#2C3E30]/10 text-xs font-bold text-[#2C3E30] outline-none focus:border-[#2C3E30]" />
                </div>

                <button className="w-full py-4 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-4">
                    {isRegistering ? "Sign Up" : "Sign In"}
                    <ArrowRight size={14}/>
                </button>
            </form>

            <div className="mt-8 text-center">
                <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-xs text-[#2C3E30]/60 hover:text-[#2C3E30] font-medium"
                >
                    {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
            </div>

        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;