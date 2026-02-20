import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, CheckCircle } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Fragmented Market",
    description:
      "Housing supply is scattered across platforms and landlords. Arrivio brings it together under one trusted partner.",
  },
  {
    icon: Globe,
    title: "Language Barriers",
    description:
      "Relocation shouldn’t get lost in translation. We operate English-first while managing local complexity.",
  },
  {
    icon: CheckCircle,
    title: "Uncertainty",
    description:
      "From availability to timelines, we remove guesswork with reserved capacity and predictable outcomes.",
  },
];

const WhyArrivioSection = () => {
  return (
    <section className="bg-[#EAE8E4] py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6 opacity-60"
          >
            <div className="w-8 h-[1px] bg-[#2C3E30]"></div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2C3E30] font-sans">
              Why Choose Us
            </span>
            <div className="w-8 h-[1px] bg-[#2C3E30]"></div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] leading-tight"
          >
            Why <span className="italic text-[#2C3E30]">ARRIVIO</span>?
          </motion.h2>
        </motion.div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
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
                    {item.title}
                  </h3>

                  {/* Divider */}
                  <div className="w-8 h-[1px] bg-[#2C3E30]/20 mb-4 group-hover:w-16 transition-all duration-500"></div>

                  {/* Description */}
                  <p className="font-sans text-sm text-[#5C5C50] leading-relaxed group-hover:text-[#1A1A1A] transition-colors">
                    {item.description}
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

export default WhyArrivioSection;
