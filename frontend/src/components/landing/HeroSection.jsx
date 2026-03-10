import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import HeroSearchBar from './HeroSearchBar';

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
            }).catch(() => { });
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
            <div className="relative z-30 text-center px-4 max-w-5xl mx-auto -mt-20 flex flex-col items-center gap-8">



                {/* HEADLINES */}
                <div>
                    <h1 className="text-white leading-tight drop-shadow-2xl">
                        <span className="block font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-2">
                            Arrival to <span className="italic text-[#E2D5B2]">Belonging.</span>
                        </span>
                    </h1>
                    <p className="font-sans text-base md:text-xl text-[#F5F5F0] mt-6 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg opacity-90">
                        Thoughtfully designed living spaces made for new beginnings. <br className="hidden md:block" />
                        No paperwork stress. No uncertainty. Just home.
                    </p>
                </div>
            </div>


            {/* --- 3. BOTTOM SEARCH BAR (With Badge Below) --- */}
            <div className="absolute bottom-12 md:bottom-8 left-0 w-full z-40 px-4 flex flex-col items-center gap-4">
                <HeroSearchBar />

                {/* EXPLORE LINK */}
                <div className="text-[#F5F5F0]/90 text-sm font-medium drop-shadow-md animate-fade-in-up md:-mt-2">
                    Not sure? <Link to="/cities" className="text-white hover:text-[#E2D5B2] underline decoration-1 underline-offset-4 transition-colors">Explore all our cities</Link>
                </div>

                {/* LIVE BADGE (Moved Below Search) */}
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg animate-fade-in-down hover:scale-105 transition-transform duration-500 cursor-default group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5F5F0] group-hover:text-white transition-colors">Now Live in Germany</span>
                </div>
            </div>


        </div>
    );
};

export default HeroSection;