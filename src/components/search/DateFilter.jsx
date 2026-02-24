import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeft, ChevronRight, Plus, Minus, X } from 'lucide-react';

const CustomHeader = ({
    monthDate,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}) => {
    return (
        <div className="flex items-center justify-between px-1 py-2">
            <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="prev-btn hover:bg-gray-100 p-1.5 rounded-full text-[#2C3E30] transition-colors disabled:opacity-0"
            >
                <ChevronLeft size={18} />
            </button>

            <div className="text-sm font-bold text-[#2C3E30] flex items-center gap-1">
                <span>{monthDate.toLocaleString("default", { month: "long" })}</span>
                <span>{monthDate.getFullYear()}</span>
            </div>

            <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="next-btn hover:bg-gray-100 p-1.5 rounded-full text-[#2C3E30] transition-colors disabled:opacity-0"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

const DateFilter = ({ filters, setFilters, onClose, position, listingCount, lockScroll = true, isAbsolute = false, className = "" }) => {
    const [viewMode, setViewMode] = useState('date'); // 'month' or 'date'

    // Date Mode State
    const [startDate, setStartDate] = useState(filters.availableFrom ? new Date(filters.availableFrom) : null);
    const [endDate, setEndDate] = useState(filters.availableTo ? new Date(filters.availableTo) : null);

    // Month Mode State
    const [selectedMonth, setSelectedMonth] = useState(null); // Date object for 1st of selected month
    const [duration, setDuration] = useState(1); // Months

    const isInternalChange = React.useRef(false);

    const containerRef = useRef(null);

    useEffect(() => {
        if (!lockScroll || isAbsolute) return;

        // Body scroll lock on mount
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [lockScroll, isAbsolute]);

    // Handle click outside and Escape key to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Delay attaching to prevent immediate close if the trigger button is outside
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('keydown', handleEscKey);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    // Sync changes to filters for Date Mode
    useEffect(() => {
        if (viewMode === 'date' && !isInternalChange.current) {
            isInternalChange.current = true;
            setFilters(prev => ({
                ...prev,
                availableFrom: startDate,
                availableTo: endDate
            }));
            setTimeout(() => {
                isInternalChange.current = false;
            }, 50);
        }
    }, [startDate, endDate, viewMode, setFilters]);

    // Effect to sync Month Mode changes immediately to filters
    useEffect(() => {
        if (viewMode === 'month' && selectedMonth && !isInternalChange.current) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isCurrentMonth =
                selectedMonth.getMonth() === today.getMonth() &&
                selectedMonth.getFullYear() === today.getFullYear();

            let start, end;

            if (isCurrentMonth) {
                // Starts from TODAY
                start = new Date(today);
                end = new Date(today);
                end.setMonth(end.getMonth() + duration);
            } else {
                // Starts from FIRST DAY of selected month
                start = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
                // Ends on LAST DAY of SELECTED month + (duration - 1)
                end = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + duration, 0);
            }

            isInternalChange.current = true;
            setStartDate(start);
            setEndDate(end);

            setFilters(prev => ({
                ...prev,
                availableFrom: start,
                availableTo: end
            }));

            setTimeout(() => {
                isInternalChange.current = false;
            }, 50);
        }
    }, [selectedMonth, duration, viewMode, setFilters]);

    useEffect(() => {
        // Sync internal state with props only when NOT an internal change
        if (isInternalChange.current) return;

        if (filters.availableFrom) {
            setStartDate(new Date(filters.availableFrom));
        }
        if (filters.availableTo) {
            setEndDate(new Date(filters.availableTo));
        }
    }, [filters.availableFrom, filters.availableTo]);

    const handleApply = () => {
        // Real-time updates already happened, just close
        onClose();
    };

    const handleClear = () => {
        isInternalChange.current = true;
        setStartDate(null);
        setEndDate(null);
        setSelectedMonth(null);
        setDuration(1);
        setFilters(prev => ({
            ...prev,
            availableFrom: null,
            availableTo: null
        }));
        setTimeout(() => {
            isInternalChange.current = false;
        }, 50);
    };

    // Helper for generating next 12 months
    const getNextMonths = () => {
        const months = [];
        const today = new Date();
        // Start from current month
        let current = new Date(today.getFullYear(), today.getMonth(), 1);

        for (let i = 0; i < 12; i++) {
            months.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    };

    const nextMonths = getNextMonths();

    const content = (
        <div
            ref={containerRef}
            className={`${isAbsolute ? 'absolute shadow-xl' : 'fixed shadow-2xl'} bg-white rounded-2xl border border-[#EAE8E4] p-3 z-[9999] animate-in fade-in zoom-in-95 duration-200 ${className.includes('w-') ? '' : 'w-[480px]'} h-[380px] flex flex-col date-filter-portal pointer-events-auto ${className}`}
            style={isAbsolute ? {} : { top: position?.top || 0, left: position?.left || 0 }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {/* Close Button */}
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors z-[1001]"
                aria-label="Close"
            >
                <X size={20} />
            </button>

            {/* Toggle Header */}
            <div className="flex justify-center mb-4 scale-[0.95]">
                <div className="bg-gray-100 p-1 rounded-full flex gap-1 relative z-10">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewMode('month'); }}
                        className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${viewMode === 'month' ? 'bg-[#2C3E30] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        By month
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewMode('date'); }}
                        className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${viewMode === 'date' ? 'bg-[#2C3E30] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        By date
                    </button>
                </div>
            </div>

            {viewMode === 'date' ? (
                /* DATE MODE */
                <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="flex flex-col items-center">
                        <div className="custom-datepicker-wrapper transform scale-[0.72] origin-top mb-0">
                            <DatePicker
                                selected={startDate}
                                onChange={(dates) => {
                                    const [start, end] = dates;
                                    setStartDate(start);
                                    setEndDate(end);
                                }}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                inline
                                monthsShown={2}
                                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                renderCustomHeader={CustomHeader}
                                calendarClassName="border-none font-sans"
                                dayClassName={(date) => {
                                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                    if (isPast) return "past-day";
                                    return "day-cell";
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                /* MONTH MODE */
                <div className="w-full flex-1 overflow-y-auto no-scrollbar scroll-smooth pr-1">
                    <div className="flex flex-col">
                        <h3 className="text-[#2C3E30] font-serif font-bold text-xl mb-4">When's the move-in?</h3>

                        {/* Month Carousel/Grid with Chevrons */}
                        <div className="relative group">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('month-scroll-container').scrollBy({ left: -200, behavior: 'smooth' });
                                }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 p-2 rounded-full shadow-md text-gray-700 hover:text-[#2C3E30] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div
                                id="month-scroll-container"
                                className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 snap-x scroll-smooth"
                                style={{
                                    msOverflowStyle: 'none',
                                    scrollbarWidth: 'none'
                                }}
                            >
                                {nextMonths.map((m, idx) => {
                                    const isSelected = selectedMonth &&
                                        m.getMonth() === selectedMonth.getMonth() &&
                                        m.getFullYear() === selectedMonth.getFullYear();

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedMonth(m)}
                                            className={`
                                            flex-shrink-0 w-20 h-20 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all snap-start
                                            ${isSelected
                                                    ? 'border-[#2C3E30] bg-[#2C3E30] text-white shadow-md'
                                                    : 'border-gray-100 bg-[#F9FAF9] hover:border-[#2C3E30] hover:bg-white'
                                                }
                                        `}
                                        >
                                            <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                                {m.toLocaleString('default', { month: 'short' })}
                                            </span>
                                            <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                                {m.getFullYear()}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('month-scroll-container').scrollBy({ left: 200, behavior: 'smooth' });
                                }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 p-2 rounded-full shadow-md text-gray-700 hover:text-[#2C3E30] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <h3 className="text-[#2C3E30] font-serif font-bold text-xl mt-6 mb-4">How long will you stay?</h3>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700 font-medium w-16">Month</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setDuration(Math.max(1, duration - 1))}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${duration <= 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:border-[#2C3E30] hover:text-[#2C3E30]'}`}
                                    disabled={duration <= 1}
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-8 text-center font-bold text-lg text-[#2C3E30]">{duration}</span>
                                <button
                                    onClick={() => setDuration(duration + 1)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:border-[#2C3E30] hover:text-[#2C3E30] transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                <div className="flex items-center gap-2">
                    {/* Presets removed per user request */}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClear}
                        className="px-5 py-2 rounded-lg border border-[#D1D9D9] text-[#2C3E30] font-bold text-xs hover:bg-[#F4F6F5] transition-colors"
                    >
                        Clear dates
                    </button>
                    <button
                        onClick={handleApply}
                        className="bg-[#2C3E30] text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1f2b22] transition-all shadow-sm hover:shadow-md"
                    >
                        {listingCount !== null && listingCount !== undefined ? `Show ${listingCount} places` : 'Apply'}
                    </button>
                </div>
            </div>

            <style>{`
                .react-datepicker {
                    border: none !important;
                    font-family: inherit !important;
                    display: flex !important;
                }
                .react-datepicker__month-container {
                    padding: 0 0.5rem !important;
                }
                .react-datepicker__header {
                    background: white !important;
                    border-bottom: none !important;
                    padding-top: 0 !important;
                    margin-bottom: -10px !important;
                }
                .react-datepicker__day-name {
                    color: #9ca3af !important;
                    width: 2.1rem !important;
                    line-height: 2.1rem !important;
                    margin: 0.1rem !important;
                    font-weight: 500 !important;
                    font-size: 0.75rem !important;
                }
                .react-datepicker__day {
                    width: 2.1rem !important;
                    line-height: 2.1rem !important;
                    margin: 0.1rem !important;
                    border-radius: 9999px !important; 
                    font-weight: 500 !important;
                    color: #374151;
                    font-size: 0.8rem !important;
                }
                .react-datepicker__day:hover {
                    background-color: #f3f4f6 !important;
                    color: #111827 !important;
                }
                .react-datepicker__day--disabled,
                .past-day {
                    color: #9ca3af !important;
                    background-color: transparent !important;
                    opacity: 0.2 !important;
                    cursor: not-allowed !important;
                    pointer-events: none !important;
                }
                /* 1. Base Range Style (Light Green) */
                .react-datepicker__day--in-range {
                    background-color: rgba(44, 62, 48, 0.08) !important;
                    color: #2C3E30 !important;
                    border-radius: 0 !important;
                }
                /* 2. Endpoints (Dark Green) - Must come AFTER in-range to override */
                .react-datepicker__day--selected,
                .react-datepicker__day--range-start,
                .react-datepicker__day--range-end,
                .selected-day {
                    background-color: #2C3E30 !important;
                    color: white !important;
                    border-radius: 4px !important;
                    opacity: 1 !important;
                    z-index: 20 !important;
                }
                .react-datepicker__day--range-start {
                    border-radius: 4px 0 0 4px !important;
                }
                .react-datepicker__day--range-end {
                    border-radius: 0 4px 4px 0 !important;
                }
                .react-datepicker__day--selected:not(.react-datepicker__day--in-range) {
                    border-radius: 4px !important;
                }
                .react-datepicker__day--keyboard-selected {
                     background-color: transparent !important;
                     color: inherit !important;
                }
                .react-datepicker__day--outside-month {
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
                /* Dual Month Header Logic - Hide internal arrows */
                .react-datepicker__month-container:first-of-type .next-btn {
                    visibility: hidden !important;
                }
                .react-datepicker__month-container:last-of-type .prev-btn {
                    visibility: hidden !important;
                }
                 /* Hide scrollbar for webkit */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );

    return isAbsolute ? content : ReactDOM.createPortal(content, document.body);
};

export default DateFilter;
