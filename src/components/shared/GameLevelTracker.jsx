import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const GameLevelTracker = ({ currentLevel }) => {
  // 3-STEP FLOW
  const steps = [
    { level: 1, label: "Login / Sign Up" },
    { level: 2, label: "Application" },
    { level: 3, label: "Secure Payment" }
  ];

  const progressWidth = ((currentLevel - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -translate-y-1/2 rounded-full z-0" />
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-[#2C3E30] -translate-y-1/2 rounded-full z-0 origin-left"
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex justify-between w-full">
          {steps.map((step) => {
            const isCompleted = step.level < currentLevel;
            const isCurrent = step.level === currentLevel;
            const isActiveOrDone = isCompleted || isCurrent;
            
            return (
              <div key={step.level} className="flex flex-col items-center">
                <motion.div 
                  initial={false}
                  animate={{
                    backgroundColor: isActiveOrDone ? '#2C3E30' : '#EAE8E4',
                    scale: isCurrent ? 1.15 : 1
                  }}
                  className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    transition-colors duration-300
                    ${isActiveOrDone ? 'border-[#2C3E30]' : 'border-gray-300'}
                  `}
                >
                  {isCompleted ? (
                    <Check size={14} className="text-[#EAE8E4] stroke-[3]" />
                  ) : (
                    <span className={`text-[10px] font-bold ${isActiveOrDone ? 'text-[#EAE8E4]' : 'text-gray-400'}`}>
                        {step.level}
                    </span>
                  )}
                </motion.div>
                <span className={`absolute top-10 text-[9px] font-bold uppercase tracking-wider text-center w-24 transition-colors duration-300 ${isActiveOrDone ? 'text-[#2C3E30] opacity-100' : 'text-gray-400 opacity-60'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameLevelTracker;