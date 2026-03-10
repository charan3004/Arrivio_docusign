import React, { useState, forwardRef, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateFilter from '../search/DateFilter';
import "react-datepicker/dist/react-datepicker.css";

const HeroSearchBar = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDatePopupOpen, setIsDatePopupOpen] = useState(false);
    const dateInfoRef = useRef(null);
    const locationRef = useRef(null);

    // Mobile State: Expanded vs Collapsed
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const locations = [
        "Aachen", "Berlin", "Bonn", "Cologne",
        "Dusseldorf", "Frankfurt", "Hamburg", "Munich"
    ];

    const handleSearch = () => {
        navigate('/search', {
            state: {
                location: location || 'All',
                date: startDate ? startDate.toISOString() : null,
                endDate: endDate ? endDate.toISOString() : null
            }
        });
    };

    // Close dropdowns on outside click
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            // Close Location dropdown if clicking outside
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full max-w-2xl mx-auto mb-2 md:mb-8 relative z-50 px-4"
        >
            {/* --- MOBILE TRIGGER (Visible Only on Mobile when Collapsed) --- */}
            {!isMobileExpanded && (
                <button
                    onClick={() => setIsMobileExpanded(true)}
                    className="md:hidden w-full bg-white/90 backdrop-blur-md border border-white/20 p-2 rounded-full shadow-2xl flex items-center gap-3 transition-transform active:scale-95"
                >
                    <div className="w-10 h-10 bg-[#2C3E30] rounded-full flex items-center justify-center text-[#E2D5B2] shadow-sm ml-1">
                        <Search size={18} />
                    </div>
                    <div className="flex-col items-start hidden sm:flex">
                        {/* Extra detail for slightly larger phones if needed, or keep simple */}
                        <span className="font-serif font-medium text-[#1A1A1A]">Where to?</span>
                    </div>
                    {/* Simple text for all mobile */}
                    <span className="font-serif font-medium text-[#1A1A1A] sm:hidden">Where to?</span>
                </button>
            )}


            {/* --- MAIN SEARCH FORM (Visible on Desktop OR Expanded Mobile) --- */}
            <div className={`${isMobileExpanded ? 'flex' : 'hidden md:flex'} bg-white/90 backdrop-blur-md border border-white/20 p-2 md:p-1.5 rounded-3xl md:rounded-full shadow-2xl flex-col md:flex-row items-center relative transition-colors duration-300 hover:bg-white/95`}>

                {/* Close Button (Mobile Only) */}
                {isMobileExpanded && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMobileExpanded(false); }}
                        className="absolute top-3 right-3 md:hidden p-1.5 bg-black/5 rounded-full text-[#2C3E30]/60 hover:text-[#2C3E30] z-[60]"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* --- LOCATION INPUT --- */}
                <div
                    ref={locationRef}
                    className="relative w-full md:w-[45%] group border-b border-[#2C3E30]/10 md:border-none pb-2 md:pb-0 md:bg-transparent"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                            setIsDatePopupOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 md:py-4 bg-transparent hover:bg-white/40 rounded-2xl md:rounded-l-full transition-colors text-left"
                    >
                        <div className="p-2 bg-white/60 rounded-full text-[#2C3E30] transition-colors group-hover:bg-white">
                            <MapPin size={18} />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/70">Location</p>
                            <p className="text-[#1A1A1A] font-serif font-medium truncate">
                                {location || "All Germany"}
                            </p>
                        </div>
                        <ChevronDown size={14} className={`text-[#2C3E30]/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-[#EAE8E4] py-2 max-h-64 overflow-y-auto no-scrollbar z-50"
                            >
                                <button
                                    onClick={() => { setLocation(""); setIsDropdownOpen(false); }}
                                    className="w-full text-left px-6 py-3 hover:bg-[#F9FAF9] text-[#2C3E30]/80 hover:text-[#2C3E30] font-sans text-sm transition-colors border-b border-[#EAE8E4]/60"
                                >
                                    All Germany
                                </button>
                                {locations.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => { setLocation(city); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-6 py-3 hover:bg-[#F9FAF9] text-[#2C3E30]/80 hover:text-[#2C3E30] font-sans text-sm transition-colors flex items-center justify-between"
                                    >
                                        {city}
                                        {location === city && <div className="w-1.5 h-1.5 rounded-full bg-[#C2B280]" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* DIVIDER (Desktop Only) */}
                <div className="hidden md:block w-[1px] h-10 bg-[#2C3E30]/10 mx-2" />

                {/* --- DATE RANGE PICKER (CUSTOM POPUP) --- */}
                <div
                    className="w-full md:flex-[2] relative group border-b border-[#2C3E30]/10 md:border-none pb-2 md:pb-0"
                    ref={dateInfoRef}
                >
                    <button
                        className="w-full flex items-center gap-3 px-3 py-2 md:px-6 md:py-4 bg-transparent hover:bg-white/20 transition-colors text-left group"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDatePopupOpen(!isDatePopupOpen);
                            setIsDropdownOpen(false);
                        }}
                    >
                        <div className="p-2 bg-white/40 backdrop-blur-sm rounded-full text-[#2C3E30] transition-colors group-hover:bg-white/60">
                            <Calendar size={18} />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/70">Check-in — Check-out</p>
                            <p className={`font-serif font-medium truncate ${startDate ? 'text-[#1A1A1A]' : 'text-[#2C3E30]/40'}`}>
                                {startDate && endDate
                                    ? `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                                    : startDate
                                        ? `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — Move-out`
                                        : "Add dates"
                                }
                            </p>
                        </div>
                    </button>
                </div>

                {/* --- SEARCH BUTTON (Full Width on Mobile with Text) --- */}
                <div className="w-full md:w-auto md:pl-2 pt-2 md:pt-0">
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-14 h-10 md:h-14 bg-[#2C3E30] hover:bg-[#1A261D] text-[#E2D5B2] rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] md:hover:scale-[1.05] transition-all duration-300 group"
                    >
                        <Search size={20} className="transition-transform group-hover:scale-110" />
                        <span className="font-bold uppercase tracking-widest text-xs md:hidden">Search</span>
                    </button>
                </div>

                {/* --- POPUP (Moves here to span full width of the parent container) --- */}
                <AnimatePresence>
                    {isDatePopupOpen && (
                        <DateFilter
                            filters={{ availableFrom: startDate, availableTo: endDate }}
                            setFilters={(updater) => {
                                const next = typeof updater === 'function' ? updater({ availableFrom: startDate, availableTo: endDate }) : updater;
                                setStartDate(next.availableFrom);
                                setEndDate(next.availableTo);
                            }}
                            onClose={() => setIsDatePopupOpen(false)}
                            listingCount={null}
                            lockScroll={false}
                            isAbsolute={true}
                            className="top-full left-0 right-0 w-full mt-4"
                        />
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
};

export default HeroSearchBar;

