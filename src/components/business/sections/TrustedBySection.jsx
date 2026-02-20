import React from "react";
import { motion } from "framer-motion";
import logo1 from "../../../assets/business/logos/logo1.png";
import logo3 from "../../../assets/business/logos/logo3.jpg";

const logos = [logo1, logo3];

const TrustedBySection = () => {
  return (
    <section className="bg-[#EAE8E4] py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4">
            <span>Trusted by </span>
            <span className="italic text-[#2C3E30]">
              Growing Teams Worldwide
            </span>
          </h2>

          <p className="font-sans text-[#5C5C50] mb-16 max-w-2xl mx-auto leading-relaxed">
            Forward-thinking companies and global teams rely on ARRIVIO to simplify
            international relocations and long-term housing.
          </p>
        </motion.div>

        {/* LOGO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative rounded-2xl p-10 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Glass background */}
              <div
                className="
                  absolute inset-0
                  bg-[#F5F5F0]/40
                  backdrop-blur-md
                  border border-white/60
                  rounded-2xl
                  shadow-sm
                  transition-all duration-500
                  group-hover:bg-[#F5F5F0]/80
                  group-hover:shadow-xl
                  group-hover:border-[#2C3E30]/20
                "
              />

              {/* Content */}
              <div className="relative z-10 flex items-center justify-center h-40">
                <img
                  src={logo}
                  alt={`Partner logo ${i + 1}`}
                  className="
                    max-h-16
                    object-contain
                    opacity-90
                    transition-all duration-500
                    group-hover:scale-110
                  "
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustedBySection;