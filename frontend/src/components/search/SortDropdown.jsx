import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SORT_OPTIONS = [
    { label: 'Most relevant', value: 'relevance' },
    { label: 'Availability date', value: 'availability' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest first', value: 'newest' },
];

const SortDropdown = ({ sortBy, setSortBy }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentOption = SORT_OPTIONS.find(opt => opt.value === sortBy) || SORT_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <span className="text-sm font-serif font-bold text-[#2C3E30]">Select sort order</span>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between gap-8 px-4 py-2 bg-white/50 border border-[#2C3E30]/10 rounded-lg min-w-[180px] hover:bg-white hover:border-[#2C3E30]/20 transition-all text-sm font-medium text-[#2C3E30]/70"
                >
                    <span>{currentOption.label}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-[#2C3E30]/5 overflow-hidden z-[100]"
                        >
                            <div className="py-1">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortBy(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-[#2C3E30]/5 ${sortBy === option.value
                                            ? 'text-[#2C3E30] font-bold'
                                            : 'text-[#2C3E30]/60 font-medium'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {sortBy === option.value && <Check size={14} className="text-[#2C3E30]" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SortDropdown;
