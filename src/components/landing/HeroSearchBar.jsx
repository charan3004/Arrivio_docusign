import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cities } from '../../data/cities';

const HeroSearchBar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setIsOpen(false);
        // Direct navigation or just selection? 
        // User asked for "button to show the cities we have" -> navigate to /cities
        // But if they select a city, maybe go to that city?
        // For now, let's just select it, and the button triggers the action.
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (selectedCity) {
            // If we had individual city pages: navigate(`/cities/${selectedCity.id}`);
            // Since we don't know if they exist yet, let's go to /cities
            navigate('/cities');
        } else {
            navigate('/cities');
        }
    };

    return (
        <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-3">

            {/* MAIN SEARCH BAR */}
            <form
                onSubmit={handleSearch}
                className="relative w-full flex-1 flex items-center p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 group z-50"
                ref={dropdownRef}
            >
                {/* ICON */}
                <div className="pl-4 pr-3 text-white/60 group-focus-within:text-white transition-colors">
                    <MapPin size={20} strokeWidth={2} />
                </div>

                {/* DROPDOWN TRIGGER / INPUT AREA */}
                <div
                    className="flex-1 cursor-pointer py-2 px-1 relative"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className={`text-base font-medium ${selectedCity ? 'text-white' : 'text-white/60'}`}>
                        {selectedCity ? selectedCity.name : "Select a destination for your team..."}
                    </div>
                </div>

                {/* DROPDOWN MENU */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-[#EAE8E4] rounded-2xl shadow-xl overflow-hidden py-2 border border-white/20 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2 text-xs font-bold text-[#2C3E30]/50 uppercase tracking-widest">
                            Available Locations
                        </div>
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                onClick={() => handleCitySelect(city)}
                                className="px-4 py-3 hover:bg-white/50 cursor-pointer flex items-center justify-between group/item"
                            >
                                <span className="font-serif text-[#2C3E30] text-lg">{city.name}</span>
                                <span className="text-xs text-[#2C3E30]/60 group-hover/item:text-[#2C3E30] transition-colors">
                                    {city.count} Units
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* DIVIDER (Desktop only) */}
                <div className="hidden md:block w-px h-8 bg-white/20 mx-2"></div>

                {/* SEARCH BUTTON */}
                <button
                    type="submit"
                    className="hidden md:flex items-center gap-2 bg-[#F5F5F0] hover:bg-white text-[#2C3E30] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                    <span>Check Availability</span>
                </button>
            </form>

            {/* SEPARATE "BROWSE ALL" BUTTON (Mobile or Desktop based on preference, let's keep it next to it or below) */}
            {/* User asked: "also I need a button to show the cities we have presently" */}
            {/* The dropdown kind of does that, but let's add an explicit button if they want a full view */}

            <button
                onClick={() => navigate('/cities')}
                className="md:hidden w-full flex items-center justify-center gap-2 bg-[#2C3E30] text-[#F5F5F0] px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg mt-2"
            >
                <Building2 size={16} />
                <span>Browse All Locations</span>
            </button>
        </div>
    );
};

export default HeroSearchBar;
