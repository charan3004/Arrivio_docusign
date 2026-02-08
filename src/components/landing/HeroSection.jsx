import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Star, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- IMPORTS ---
import heroVideo1 from '../../assets/hero/video1.mp4'; 
import heroVideo2 from '../../assets/hero/video2.mp4';
import heroVideo3 from '../../assets/hero/video3.mp4';
import heroVideo5 from '../../assets/hero/video5.mp4';
import heroVideo6 from '../../assets/hero/video6.mp4';
import heroVideo7 from '../../assets/hero/video7.mp4';

const HeroSection = () => {
  const navigate = useNavigate();
  
  // --- TWIN PLAYER STATE ---
  const [activePlayer, setActivePlayer] = useState(0); 
  const [playOrder, setPlayOrder] = useState(0);

  const player1Ref = useRef(null);
  const player2Ref = useRef(null);

  const playlist = [
    heroVideo3, heroVideo7, heroVideo2, heroVideo1, heroVideo5, heroVideo6
  ];

  const handleExplore = () => {
    navigate('/cities');
  };

  const getVideoClass = (src) => {
    return src === heroVideo7 ? 'object-center' : 'object-top';
  };

  const handleVideoEnded = () => {
    const nextPlayer = activePlayer === 0 ? 1 : 0;
    const nextRef = nextPlayer === 0 ? player1Ref : player2Ref;
    if (nextRef.current) {
        nextRef.current.play().catch(e => console.log("Play interrupted", e));
    }
    setActivePlayer(nextPlayer);
    setPlayOrder(prev => prev + 1);
  };

  const getSrcForPlayer = (playerId) => {
    const currentPlaylistIndex = playOrder % playlist.length;
    const nextPlaylistIndex = (playOrder + 1) % playlist.length;
    return playerId === activePlayer ? playlist[currentPlaylistIndex] : playlist[nextPlaylistIndex];
  };

  return (
    <div className="relative min-h-screen w-full bg-[#EAE8E4] flex flex-col items-center justify-center pt-24 pb-12 px-4 md:px-8 overflow-hidden">
      
      {/* HEADER */}
      <div className="text-center mb-8 md:mb-12 z-10">
        
        {/* TAG */}
        

        <h1 className="text-[#1A1A1A] leading-tight">
            <span className="block font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight">
                Arrival to <span className="italic text-[#2C3E30]">Belonging.</span>
            </span>
        </h1>
        <p className="font-sans text-sm md:text-base text-[#1A1A1A]/60 mt-4 max-w-2xl mx-auto font-medium">
        Thoughtfully designed living spaces made for new beginnings. <br className="hidden md:block" />
        No paperwork stress. No uncertainty. Just home.
        </p>

      </div>

      {/* LEVITATING MONOLITH */}
      <div className="relative w-full max-w-5xl h-[60vh] md:h-[75vh] z-10 group">
        <div className="absolute -inset-2 bg-[#2C3E30]/30 blur-[80px] rounded-[60px] opacity-100 -z-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-white/40 blur-[80px] -z-10"></div>

        <div className="w-full h-full rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl bg-black relative border-[1px] border-white/30">
            {/* PLAYERS */}
            <div className={`absolute inset-0 transition-opacity duration-0 ${activePlayer === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <video ref={player1Ref} src={getSrcForPlayer(0)} autoPlay={activePlayer === 0} muted playsInline onEnded={() => { if(activePlayer === 0) handleVideoEnded() }} className={`w-full h-full object-cover ${getVideoClass(getSrcForPlayer(0))} opacity-95`} />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-0 ${activePlayer === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <video ref={player2Ref} src={getSrcForPlayer(1)} muted playsInline onEnded={() => { if(activePlayer === 1) handleVideoEnded() }} className={`w-full h-full object-cover ${getVideoClass(getSrcForPlayer(1))} opacity-95`} />
            </div>
            
            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-transparent pointer-events-none z-20"></div>

            {/* CONTROL DECK */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col-reverse md:flex-row items-center justify-between gap-6 z-30">
                
                {/* --- NEW LEFT CORNER: STATUS INDICATOR --- */}
                {/* Hidden on very small screens if needed, or kept for context */}
                <div className="hidden md:flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Live in Germany</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <CheckCircle size={12} className="text-green-400" />
                        <span className="text-xs text-white/80 font-medium">850+ Verified Listings</span>
                    </div>
                </div>

                {/* --- RIGHT CORNER: EXPLORE BUTTON --- */}
                <div className="w-full md:w-auto">
                    <button 
                        onClick={handleExplore} 
                        className="
                            w-full md:w-auto
                            group relative flex items-center justify-between gap-6 
                            
                            /* WARM STONE STYLE */
                            bg-[#EAE8E4] 
                            hover:bg-white
                            text-[#1A1A1A] 
                            
                            px-6 py-3 md:pl-8 md:pr-3 
                            rounded-full 
                            shadow-xl hover:shadow-2xl 
                            transition-all duration-300 hover:scale-[1.02] active:scale-95
                        "
                    >
                        <div className="flex flex-col items-start text-left">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/80">Select a city,</span>
                            <span className="text-lg font-serif italic text-[#1A1A1A]">Rent a Home!</span>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-[#2C3E30] flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-500 shadow-sm">
                            <ArrowRight size={18} />
                        </div>
                    </button>
                </div>

            </div>
        </div>
      </div>
      
      {/* FOOTER METRICS */}
      <div className="w-full max-w-4xl flex justify-between items-center border-t border-[#2C3E30]/10 pt-6 mt-12 opacity-80">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full text-[#2C3E30] shadow-sm"><Briefcase size={14} /></div>
              <div>
                  <span className="block text-[14px] font-serif font-bold text-[#1A1A1A]">850+</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/60">Relocations</span>
              </div>
          </div>
          <div className="w-[1px] h-8 bg-[#2C3E30]/10"></div>
          <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full text-[#2C3E30] shadow-sm"><MapPin size={14} /></div>
              <div>
                  <span className="block text-[14px] font-serif font-bold text-[#1A1A1A]">8 Major</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/60">German Cities</span>
              </div>
          </div>
          <div className="w-[1px] h-8 bg-[#2C3E30]/10"></div>
          <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full text-[#2C3E30] shadow-sm"><Star size={14} /></div>
              <div>
                  <span className="block text-[14px] font-serif font-bold text-[#1A1A1A]">4.9/5</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/60">Tenant Rating</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default HeroSection;