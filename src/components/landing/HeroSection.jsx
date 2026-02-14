import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Briefcase, CheckCircle, Calendar, Building2 } from 'lucide-react';


// --- IMPORTS ---
import heroVideo1 from '../../assets/hero/video1.mp4';
import heroVideo2 from '../../assets/hero/video2.mp4';
import heroVideo3 from '../../assets/hero/video3.mp4';
import heroVideo4 from '../../assets/hero/video4.mp4';
import heroVideo5 from '../../assets/hero/video5.mp4';
import heroVideo6 from '../../assets/hero/video6.mp4';
import heroVideo7 from '../../assets/hero/video7.mp4';

const HeroSection = () => {
    const navigate = useNavigate();

    const [activePlayer, setActivePlayer] = useState(0);
    const [playOrder, setPlayOrder] = useState(0);

    const player1Ref = useRef(null);
    const player2Ref = useRef(null);

    const playlist = [
        heroVideo3, heroVideo4, heroVideo2, heroVideo1, heroVideo5, heroVideo6, heroVideo7
    ];

    const getSrcForPlayer = (playerId) => {
        const currentPlaylistIndex = playOrder % playlist.length;
        const nextPlaylistIndex = (playOrder + 1) % playlist.length;
        return playerId === activePlayer ? playlist[currentPlaylistIndex] : playlist[nextPlaylistIndex];
    };

    const handleVideoEnded = () => {
        const nextPlayer = activePlayer === 0 ? 1 : 0;
        const nextRef = nextPlayer === 0 ? player1Ref : player2Ref;
        const currentRef = activePlayer === 0 ? player1Ref : player2Ref;

        if (nextRef.current) {
            nextRef.current.currentTime = 0;

            // Promise-based play ensures we don't switch until ready
            nextRef.current.play().then(() => {
                // INSTANT CUT: No crossfade, immediate switch
                setActivePlayer(nextPlayer);
                setPlayOrder(prev => prev + 1);

                // Pause valid previous video immediately to save resources
                if (currentRef.current) {
                    currentRef.current.pause();
                }
            }).catch(e => console.log("Transition failed", e));
        }
    };

    return (
        <div className="relative w-full h-screen min-h-[600px] bg-[#1A1A1A] flex flex-col items-center justify-center">

            {/* --- 1. FULL BACKGROUND VIDEO --- */}
            <div className="absolute inset-0 w-full h-full z-0 bg-black">
                {/* PLAYER 1 */}
                <div
                    className={`absolute inset-0 ${activePlayer === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <video
                        ref={player1Ref}
                        src={getSrcForPlayer(0)}
                        autoPlay={true}
                        muted
                        playsInline
                        preload="auto"
                        onEnded={handleVideoEnded}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* PLAYER 2 */}
                <div
                    className={`absolute inset-0 ${activePlayer === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <video
                        ref={player2Ref}
                        src={getSrcForPlayer(1)}
                        muted
                        playsInline
                        preload="auto"
                        onEnded={handleVideoEnded}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* OVERLAY: Reduced from 40% to 20% to make videos pop */}
                <div className="absolute inset-0 bg-black/20 z-20 pointer-events-none"></div>
            </div>


            {/* --- 2. CENTERED TEXT CONTENT (With Top Badge) --- */}
            <div className="relative z-30 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-10">




                {/* HEADLINES */}
                <div>
                    <h1 className="text-white leading-tight drop-shadow-2xl">
                        <span className="block font-serif text-6xl md:text-7xl lg:text-8xl tracking-tight mb-2">
                            Arrival to <span className="italic text-[#E2D5B2]">Belonging.</span>
                        </span>
                    </h1>
                    <p className="font-sans text-base md:text-xl text-[#F5F5F0] mt-6 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg opacity-90">
                        Thoughtfully designed living spaces made for new beginnings. <br className="hidden md:block" />
                        No paperwork stress. No uncertainty. Just home.
                    </p>
                </div>
                {/* CTA BUTTON - Moved Up & Redesigned */}
                {/* DUAL CTA BUTTONS - Responsive Layout */}
                <div className="animate-fade-in-up flex flex-col md:flex-row items-center justify-center gap-4 mt-8">

                    {/* BUTTON 1: EXPLORE CITIES (Primary) */}
                    <Link
                        to="/cities"
                        className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#F5F5F0] text-[#1A1A1A] rounded-full overflow-hidden transition-all duration-500 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] border border-white/50 backdrop-blur-sm min-w-[240px]"
                    >
                        <span className="relative z-10 font-serif text-lg md:text-base font-medium tracking-wide">Explore Cities</span>
                        <div className="relative z-10 w-6 h-6 rounded-full bg-[#2C3E30] text-white flex items-center justify-center transition-colors duration-500 group-hover:bg-[#1A2E22]">
                            <Building2 size={12} className="transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0"></div>
                    </Link>

                    {/* BUTTON 2: BOOK A MEETING (Secondary - Now Identical Style) */}
                    <Link
                        to="/business"
                        className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#F5F5F0] text-[#1A1A1A] rounded-full overflow-hidden transition-all duration-500 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] border border-white/50 backdrop-blur-sm min-w-[240px]"
                    >
                        <span className="relative z-10 font-serif text-lg md:text-base font-medium tracking-wide">Schedule a Call</span>
                        <div className="relative z-10 w-6 h-6 rounded-full bg-[#2C3E30] text-white flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#1A2E22]">
                            <Calendar size={12} className="transition-transform duration-300" />
                        </div>
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0"></div>
                    </Link>

                </div>
            </div>


            {/* --- 3. BOTTOM INDICATOR --- */}
            <div className="absolute bottom-8 left-0 w-full flex justify-center z-30 animate-fade-in-up delay-300">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                    <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                    <span className="text-white/90 text-[10px] md:text-xs font-medium tracking-wide font-sans">Live in Germany</span>
                </div>
            </div>




        </div>
    );
};

export default HeroSection;