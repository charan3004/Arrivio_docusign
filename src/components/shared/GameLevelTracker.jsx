import React from 'react';
import { motion } from 'framer-motion';
import { Check, Home, User, FileText, Key } from 'lucide-react';

const GameLevelTracker = ({ currentLevel }) => {
  
  const levels = [
    { id: 1, label: "Select Home", icon: Home },
    { id: 2, label: "Create Profile", icon: User },
    { id: 3, label: "Application", icon: FileText },
    { id: 4, label: "Get Keys", icon: Key },
  ];

  // Calculate progress width (e.g., Level 2 = 33%, Level 3 = 66%)
  const progressPercentage = ((currentLevel - 1) / (levels.length - 1)) * 100;

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4">
      <div className="relative">
        
        {/* 1. BACKGROUND LINE (Grey) */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#2C3E30]/10 -translate-y-1/2 rounded-full" />

        {/* 2. ACTIVE PROGRESS LINE (Green - Animates) */}
        <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-[#2C3E30] -translate-y-1/2 rounded-full origin-left"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* 3. LEVEL NODES */}
        <div className="relative flex justify-between">
            {levels.map((level) => {
                const isCompleted = currentLevel > level.id;
                const isActive = currentLevel === level.id;

                return (
                    <div key={level.id} className="flex flex-col items-center group relative">
                        
                        {/* THE CIRCLE */}
                        <motion.div 
                            initial={false}
                            animate={{
                                scale: isActive ? 1.2 : 1,
                                backgroundColor: isCompleted || isActive ? '#2C3E30' : '#EAE8E4',
                                borderColor: isCompleted || isActive ? '#2C3E30' : 'rgba(44, 62, 48, 0.2)'
                            }}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-500
                                ${!isCompleted && !isActive ? 'bg-[#EAE8E4]' : ''}
                            `}
                        >
                            {isCompleted ? (
                                <Check size={14} className="text-[#EAE8E4]" strokeWidth={3} />
                            ) : (
                                <level.icon size={14} className={isActive ? "text-[#EAE8E4]" : "text-[#2C3E30]/40"} />
                            )}
                        </motion.div>

                        {/* THE LABEL */}
                        <motion.span 
                            animate={{ opacity: isActive || isCompleted ? 1 : 0.5, y: isActive ? 0 : 0 }}
                            className={`absolute top-10 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap
                                ${isActive ? 'text-[#2C3E30]' : 'text-[#2C3E30]/40'}
                            `}
                        >
                            {level.label}
                        </motion.span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default GameLevelTracker;