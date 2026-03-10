import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
  Sofa,
  Wallet,
  Monitor,
  BadgePercent,
  Users,
  Building2,
} from 'lucide-react';

const featureIcons = {
  // Skilled Professionals
  "Prime locations": MapPin,
  "Near business districts": Building2,
  "Fully furnished": Sofa,

  // Students
  "Near universities": GraduationCap,
  "Student-friendly pricing": Wallet,
  "Study spaces": Monitor,

  // Azubis
  "Close to training": MapPin,
  "Affordable options": BadgePercent,
  "Community support": Users,
};


const WhoWeServeSection = () => {
  const personas = [
    {
      title: 'Skilled Professionals',
      description: 'Made for moments of transition; when everything feels new.',
      features: ['Prime locations', 'Near business districts', 'Fully furnished'],
      icon: Briefcase, // Specific icon for visual storytelling
    },
    {
      title: 'Students',
      description: 'Ideal living spaces for students pursuing their education abroad.',
      features: ['Near universities', 'Student-friendly pricing', 'Study spaces'],
      icon: GraduationCap,
    },
    {
      title: 'Azubis',
      description: 'Comfortable housing for apprentices starting their careers.',
      features: ['Close to training', 'Affordable options', 'Community support'],
      icon: Sparkles,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Cards appear one by one
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    // Background: Warm Stone (#EAE8E4) ensures perfect flow from previous section
    <section id="who-we-serve" className="bg-[#EAE8E4] py-24 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto">

        {/* --- HEADER --- */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-6 opacity-60"
          >
            <div className="w-8 h-[1px] bg-[#2C3E30]"></div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2C3E30] font-sans">
              Who We Serve
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
            Designed for <br />
            <span className="italic text-[#2C3E30]">Every Ambition.</span>
          </motion.h2>
        </div>


        {/* --- THE GLASS PILLARS GRID --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {personas.map((persona, index) => {
            const IconComponent = persona.icon;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative flex flex-col p-8 rounded-[2rem] transition-all duration-500 hover:-translate-y-2"
              >
                {/* GLASS CARD BACKGROUND */}
                {/* Default: Semi-transparent. Hover: Solid & Shadowed */}
                <div className="absolute inset-0 bg-[#F5F5F0]/40 backdrop-blur-md border border-white/60 rounded-[2rem] shadow-sm transition-all duration-500 group-hover:bg-[#F5F5F0] group-hover:shadow-2xl group-hover:border-[#2C3E30]/10"></div>

                {/* CONTENT LAYER */}
                <div className="relative z-10 flex flex-col h-full">

                  {/* Icon Circle */}
                  <div className="w-16 h-16 rounded-full bg-white/60 border border-white flex items-center justify-center mb-6 text-[#2C3E30] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-[#2C3E30] group-hover:text-[#EAE8E4]">
                    <IconComponent size={28} strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl text-[#1A1A1A] mb-4 group-hover:text-[#2C3E30] transition-colors">
                    {persona.title}
                  </h3>

                  {/* Decorative Divider (Expands on Hover) */}
                  <div className="w-8 h-[1px] bg-[#2C3E30]/20 mb-6 group-hover:w-full transition-all duration-700"></div>

                  {/* Description */}
                  <p className="font-sans text-[#5C5C50] leading-relaxed mb-8 flex-grow">
                    {persona.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-4 mt-auto">
                    {persona.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 group/item">
                        {(() => {
                          const Icon = featureIcons[feature] || CheckCircle;
                          return (
                            <Icon
                              size={18}
                              className="text-[#2C3E30]/40 flex-shrink-0 mt-0.5 group-hover:text-[#2C3E30] transition-colors"
                            />
                          );
                        })()}

                        <span className="font-sans text-sm text-[#1A1A1A]/70 group-hover:text-[#1A1A1A] transition-colors font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default WhoWeServeSection;

