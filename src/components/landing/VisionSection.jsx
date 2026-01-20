import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Languages, DollarSign, FileCheck } from 'lucide-react';

const VisionSection = () => {
  const features = [
    {
      icon: XCircle,
      title: 'No SCHUFA',
      description: 'Your credit history is history. We qualify based on future potential, not past paperwork.',
    },
    {
      icon: Languages,
      title: 'Multilingual',
      description: 'We speak your language. English-first contracts and 24/7 dedicated support.',
    },
    {
      icon: DollarSign,
      title: 'All-In Pricing',
      description: 'Rent, high-speed WiFi, utilities, and furniture. One single monthly bill.',
    },
    {
      icon: FileCheck,
      title: 'Digital First',
      description: 'Apply on your phone. Upload docs securely. Get approved in 24 hours.',
    },
  ];

  return (
    // Background matches Hero exactly (#EAE8E4) for seamless flow
    <section id="vision" className="relative w-full bg-[#EAE8E4] py-24 px-6 md:px-12">
      
      {/* Subtle Background Gradient to separate it slightly from Hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAE8E4] via-[#EAE8E4] to-[#EAE8E4]/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- 1. HEADER (Centered & Clean) --- */}
        <div className="text-center mb-20">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="inline-flex items-center gap-3 mb-6 opacity-60"
           >
              <div className="w-8 h-[1px] bg-[#2C3E30]"></div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2C3E30] font-sans">
                 The Vision
              </span>
              <div className="w-8 h-[1px] bg-[#2C3E30]"></div>
           </motion.div>

           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] leading-tight"
           >
              Living, <span className="italic text-[#2C3E30]">Simplified.</span>
           </motion.h2>
           
           <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="mt-6 font-sans text-[#5C5C50] text-lg max-w-2xl mx-auto leading-relaxed"
           >
              We stripped away the complexity of renting in Germany to leave only what matters: <br className="hidden md:block"/> 
              A home where you belong.
           </motion.p>
        </div>


        {/* --- 2. THE GLASS PILLARS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
           {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1, duration: 0.6 }}
                   className="group relative flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2"
                 >
                    {/* Glass Card Background */}
                    <div className="absolute inset-0 bg-[#F5F5F0]/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm transition-all duration-500 group-hover:bg-[#F5F5F0]/80 group-hover:shadow-xl group-hover:border-[#2C3E30]/20"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center h-full">
                       
                       {/* Icon Circle */}
                       <div className="w-16 h-16 rounded-full bg-white/50 border border-white flex items-center justify-center mb-8 text-[#2C3E30] shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#2C3E30] group-hover:text-[#EAE8E4]">
                          <Icon size={28} strokeWidth={1.5} />
                       </div>

                       {/* Title */}
                       <h3 className="font-serif text-2xl text-[#1A1A1A] mb-4 group-hover:text-[#2C3E30] transition-colors">
                          {feature.title}
                       </h3>

                       {/* Divider */}
                       <div className="w-8 h-[1px] bg-[#2C3E30]/20 mb-4 group-hover:w-16 transition-all duration-500"></div>

                       {/* Description */}
                       <p className="font-sans text-sm text-[#5C5C50] leading-relaxed group-hover:text-[#1A1A1A] transition-colors">
                          {feature.description}
                       </p>
                    </div>

                 </motion.div>
              );
           })}
        </div>

      </div>
    </section>
  );
};

export default VisionSection;