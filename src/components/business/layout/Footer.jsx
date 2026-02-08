import React from "react";
import {
  Instagram,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Globe,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: ["Our Vision", "Community", "Careers", "Contact"],
    Locations: ["Berlin", "Munich", "Frankfurt", "Cologne"],
    Legal: ["Privacy Policy", "Terms of Service", "Imprint"],
  };

  return (
    <footer className="relative bg-[#1A2E22] pt-24 pb-12 px-6 md:px-12 overflow-hidden text-[#EAE8E4]">
      
      {/* Watermark */}
      <div className="absolute bottom-[-10%] right-[-5%] font-serif text-[15rem] md:text-[25rem] opacity-[0.03] pointer-events-none leading-none">
        Arrivio
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand */}
          <div className="lg:col-span-5">
            <h2 className="font-serif text-4xl mb-4">Arrivio.</h2>

            <p className="font-sans text-[#EAE8E4]/60 text-lg max-w-sm mb-10 leading-relaxed">
              Redefining belonging for the global citizen. Stability is the ultimate luxury.
            </p>

            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-[#C2B280]">
              Join our inner circle
            </p>

            <div className="relative max-w-md">
              <input
                placeholder="Email address"
                className="w-full bg-transparent border-b border-[#EAE8E4]/20 py-4 outline-none focus:border-[#C2B280] transition-colors font-serif italic text-xl"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#EAE8E4]/20 flex items-center justify-center hover:bg-[#EAE8E4] hover:text-[#1A2E22] transition-all duration-300">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-[#C2B280]">
                  {title}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li
                      key={link}
                      className="font-sans text-sm text-[#EAE8E4]/60 hover:text-[#EAE8E4] transition-colors cursor-pointer"
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-12 border-t border-[#EAE8E4]/10 flex flex-col md:flex-row justify-between items-center gap-8 font-sans text-[10px] uppercase tracking-widest text-[#EAE8E4]/40">
          <div className="flex items-center gap-4">
            <span>© {currentYear} Arrivio Living GmbH</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-2">
              <Globe size={12} /> Berlin, Germany
            </span>
          </div>

          <div className="flex gap-6">
            <Instagram size={18} className="hover:text-[#EAE8E4] transition-colors cursor-pointer" />
            <Linkedin size={18} className="hover:text-[#EAE8E4] transition-colors cursor-pointer" />
            <Twitter size={18} className="hover:text-[#EAE8E4] transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
