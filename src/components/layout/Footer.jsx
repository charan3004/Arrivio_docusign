import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, ArrowUpRight, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: 'Our Vision', path: '/#vision' },
      { name: 'Community', path: '/#community' },
    ],
      Locations: [
      { name: 'Berlin', path: '/cities' },
      { name: 'Munich', path: '/cities' },
      { name: 'Frankfurt', path: '/cities' },
      { name: 'Cologne', path: '/cities' },
      { name: 'Düsseldorf', path: '/cities' },
      { name: 'Aachen', path: '/cities' },
      { name: 'Bonn', path: '/cities' },
      { name: 'Hamburg', path: '/cities' },
      ],
  };

  return (
    // Background: Deep Forest Green (#1A2E22) for a bossy, grounded finish
    <footer className="relative bg-[#1A2E22] pt-24 pb-12 px-6 md:px-12 overflow-hidden text-[#EAE8E4]">
      
      {/* 1. THE BRAND WATERMARK (Subtle & Premium) */}
      <div className="absolute bottom-[-10%] right-[-5%] font-serif text-[15rem] md:text-[25rem] opacity-[0.03] select-none pointer-events-none leading-none">
        Arrivio
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- TOP SECTION: BRAND & LINKS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Left: Brand & Newsletter */}
          <div className="lg:col-span-5">
             <div className="mb-8">
                <h2 className="font-serif text-4xl mb-4">Arrivio.</h2>
                <p className="font-sans text-[#EAE8E4]/60 text-lg max-w-sm leading-relaxed">
                   Redefining belonging for the global citizen. Stability is the ultimate luxury.
                </p>
             </div>

             {/* Newsletter Sign-up */}
             <div className="max-w-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-[#C2B280]">
                   Join our inner circle
                </p>
                <div className="relative group">
                   <input 
                     type="email" 
                     placeholder="Email address"
                     className="w-full bg-transparent border-b border-[#EAE8E4]/20 py-4 outline-none focus:border-[#C2B280] transition-colors font-serif italic text-xl"
                   />
                   <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#EAE8E4]/20 flex items-center justify-center hover:bg-[#EAE8E4] hover:text-[#1A2E22] transition-all">
                      <ArrowUpRight size={18} />
                   </button>
                </div>
             </div>
          </div>

          {/* Right: Sitemap Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
             {Object.entries(footerLinks).map(([title, links]) => (
               <div key={title}>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-[#C2B280]">
                     {title}
                  </h4>

                  <ul
                     className={
                     title === 'Locations'
                        ? 'grid grid-cols-2 gap-x-10 gap-y-4 justify-items-start text-left'
                        : 'space-y-4'
                     }
                  >
                     {links.map((link) => (
                     <li key={link.name}>
                        <Link
                           to={link.path}
                           state={link.state}
                           className="text-sm font-sans text-[#EAE8E4]/60 hover:text-[#EAE8E4] transition-colors flex items-center gap-1 group"
                        >
                           {link.name}
                           <ArrowUpRight
                           size={12}
                           className="opacity-0 group-hover:opacity-100 transition-opacity"
                           />
                        </Link>
                     </li>
                     ))}
                  </ul>
               </div>
               ))}
          </div>
        </div>


        {/* --- BOTTOM SECTION: LEGAL & SOCIAL --- */}
        <div className="pt-12 border-t border-[#EAE8E4]/10 flex flex-col md:flex-row justify-between items-center gap-8">
           
           {/* Copyright */}
           <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#EAE8E4]/40">
              <span>© {currentYear} Arrivio Living GmbH</span>
              <div className="hidden md:block w-1 h-1 bg-[#C2B280] rounded-full"></div>
              <div className="flex items-center gap-2">
                 <Globe size={12} />
                 <span>Headquarters: Berlin, Germany</span>
              </div>
           </div>

           {/* Social Links */}
           <div className="flex items-center gap-6">
              <a href="#" className="w-10 h-10 rounded-full border border-[#EAE8E4]/10 flex items-center justify-center hover:bg-[#EAE8E4]/5 transition-colors">
                 <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#EAE8E4]/10 flex items-center justify-center hover:bg-[#EAE8E4]/5 transition-colors">
                 <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#EAE8E4]/10 flex items-center justify-center hover:bg-[#EAE8E4]/5 transition-colors">
                 <Twitter size={18} />
              </a>
           </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;