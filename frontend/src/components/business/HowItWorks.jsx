import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Home, CheckCircle } from "lucide-react";

// images from your assets folder
import imgTop from "../../assets/business/1.jpg";
import imgBottom from "../../assets/business/2.jpg";

const steps = [
    {
        number: "01",
        icon: CalendarCheck,
        title: "Reserve Capacity",
        description:
            "Secure housing blocks in advance so relocations never get delayed by availability.",
    },
    {
        number: "02",
        icon: Home,
        title: "Homes Prepared",
        description:
            "Homes are verified, furnished, and move-in ready before your talent arrives.",
    },
    {
        number: "03",
        icon: CheckCircle,
        title: "Talent Moves In",
        description:
            "End-to-end management removes paperwork, stress, and last-minute surprises.",
    },
];

const HowItWorksSection = () => {
    return (
        <section className="bg-[#EAE8E4] py-24 px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT COLUMN */}
                    <div className="relative">

                        {/* HEADER */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-[#2C3E30]" />
                                <span className="text-xs uppercase tracking-[0.2em] text-[#2C3E30] font-sans font-medium">
                                    The Process
                                </span>
                                <div className="w-8 h-px bg-[#2C3E30]" />
                            </div>

                            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] leading-tight">
                                How It <span className="italic text-[#2C3E30]">Works</span>
                            </h2>
                        </motion.div>

                        {/* Vertical line */}
                        <div className="absolute left-[28px] top-[140px] bottom-6 w-px bg-[#2C3E30]/10 hidden sm:block" />

                        {/* STEPS */}
                        <div className="space-y-4">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={step.number}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="
                      group relative flex gap-6 p-6 rounded-2xl
                      transition-all duration-300
                      hover:bg-[#F5F5F0]/60
                      hover:shadow-lg
                      hover:-translate-y-1
                    "
                                    >
                                        {/* Icon badge */}
                                        <div className="relative z-10">
                                            <div
                                                className="
                          w-14 h-14 rounded-full
                          bg-white border border-black/10
                          flex items-center justify-center
                          text-[#2C3E30]
                          transition-all duration-300
                          group-hover:bg-[#2C3E30]
                          group-hover:text-[#EAE8E4]
                        "
                                            >
                                                <Icon size={22} strokeWidth={1.5} />
                                                <span
                                                    className="
                            absolute -top-1 -right-1
                            w-5 h-5 rounded-full
                            bg-[#2C3E30] text-[#EAE8E4]
                            text-[10px] font-sans font-medium
                            flex items-center justify-center
                          "
                                                >
                                                    {step.number}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Text */}
                                        <div className="pt-1">
                                            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-2 group-hover:text-[#2C3E30] transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="font-sans text-sm text-[#5C5C50] leading-relaxed group-hover:text-[#1A1A1A] transition-colors">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN – IMAGES */}
                    <div className="relative hidden lg:block">

                        {/* Top image */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="
                relative z-10
                w-[420px] h-[280px]
                rounded-[2rem]
                overflow-hidden
                shadow-xl
                border-[4px] border-white
                ml-auto
                mt-[90px]
              "
                        >
                            <img
                                src={imgTop}
                                alt="Community living"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Bottom image */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="
                absolute
                top-[260px]
                left-0
                w-[420px] h-[280px]
                rounded-[2rem]
                overflow-hidden
                shadow-xl
                border-[4px] border-white
              "
                        >
                            <img
                                src={imgBottom}
                                alt="Residents community"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;

