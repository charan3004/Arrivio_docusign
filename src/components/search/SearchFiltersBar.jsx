import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, SlidersHorizontal, Bell } from 'lucide-react';
import PriceFilter from './PriceFilter';
import DateFilter from './DateFilter';
import PropertyTypeFilter from './PropertyTypeFilter';
import FacilitiesFilter from './FacilitiesFilter';

const FilterPill = ({ label, active, onClick, hasDropdown }) => (
    <button
        onClick={onClick}
        className={`
      flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap
      ${active
                ? 'border-[#2C3E30] bg-[#2C3E30] text-white shadow-md'
                : 'border-white/60 bg-white/40 text-[#2C3E30] backdrop-blur-md hover:bg-white/60'
            }
    `}
    >
        <span className="max-w-[150px] truncate">{label}</span>
        {hasDropdown && <ChevronDown size={14} className="opacity-50" />}
    </button>
);

const SearchFiltersBar = ({ onOpenFilters, onReset, filters, setFilters, listingCount }) => {
    const [isStuck, setIsStuck] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
    const filterRef = useRef(null);
    const dateFilterRef = useRef(null);
    const propertyTypeRef = useRef(null);
    const facilitiesRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is inside any portal content
            const isInsidePortal = event.target.closest('.date-filter-portal');
            if (isInsidePortal) return;

            // Check if click is outside all regular filter containers
            const isOutsidePrice = filterRef.current && !filterRef.current.contains(event.target);
            const isOutsideDate = dateFilterRef.current && !dateFilterRef.current.contains(event.target);
            const isOutsidePropType = propertyTypeRef.current && !propertyTypeRef.current.contains(event.target);
            const isOutsideFacilities = facilitiesRef.current && !facilitiesRef.current.contains(event.target);

            if (isOutsidePrice && isOutsideDate && isOutsidePropType && isOutsideFacilities) {
                setActiveFilter(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsStuck(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to format property type label
    const getPropertyTypeLabel = () => {
        const types = filters.propertyTypes || [];
        if (types.length === 0) return "Property type";
        if (types.length === 1) return types[0];
        return `${types[0]} +${types.length - 1}`;
    };

    // Helper to format facilities label
    const getFacilitiesLabel = () => {
        const tags = filters.tags || [];
        if (tags.length === 0) return "Facilities & Amenities";
        if (tags.length === 1) return tags[0];
        return `Facilities · ${tags.length}`;
    };

    // Calculate total active filters for "All filters" badge
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.city !== "All") count++;
        if (filters.priceMin > 0 || filters.priceMax < 2000) count++;
        if (filters.availableFrom && filters.availableTo) count++;
        if (filters.propertyTypes && filters.propertyTypes.length > 0) count++;
        if (filters.tags && filters.tags.length > 0) count++;
        if (filters.floor !== "Any") count++;
        if (filters.furniture !== "Any") count++;
        return count;
    };

    const activeFilterCount = getActiveFilterCount();

    return (
        <div className={`sticky top-0 z-30 bg-[#EAE8E4] px-4 md:px-8 transition-all duration-300 ease-in-out ${isStuck ? 'py-5 shadow-sm' : 'py-3'}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* LEFT: SCROLLABLE FILTERS */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mask-gradient-right flex-grow">
                    {/* SEARCH INPUT (Mini version if needed, or just keep filters) */}


                    {/* Dates Filter with Popover */}
                    <div className="relative" ref={dateFilterRef}>
                        <FilterPill
                            label={
                                (filters.availableFrom && filters.availableTo)
                                    ? `${new Date(filters.availableFrom).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${new Date(filters.availableTo).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                                    : "Move-in – Move-out"
                            }
                            hasDropdown
                            active={activeFilter === 'Dates' || (filters.availableFrom && filters.availableTo)}
                            onClick={(e) => {
                                if (activeFilter === 'Dates') {
                                    setActiveFilter(null);
                                } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setPopoverPos({ top: rect.bottom + 8, left: rect.left });
                                    setActiveFilter('Dates');
                                }
                            }}
                        />
                        {activeFilter === 'Dates' && (
                            <DateFilter
                                filters={filters}
                                setFilters={setFilters}
                                onClose={() => setActiveFilter(null)}
                                position={popoverPos}
                                listingCount={listingCount}
                            />
                        )}
                    </div>


                    {/* Price Filter with Popover */}
                    <div className="relative" ref={filterRef}>
                        <FilterPill
                            label={(filters.priceMin > 0 || filters.priceMax < 2000)
                                ? `€${filters.priceMin} - €${filters.priceMax}`
                                : "Price"
                            }
                            hasDropdown
                            active={activeFilter === 'Price' || (filters.priceMin > 0 || filters.priceMax < 2000)}
                            onClick={(e) => {
                                if (activeFilter === 'Price') {
                                    setActiveFilter(null);
                                } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setPopoverPos({ top: rect.bottom + 8, left: rect.left });
                                    setActiveFilter('Price');
                                }
                            }}
                        />
                        {activeFilter === 'Price' && (
                            <PriceFilter
                                filters={filters}
                                setFilters={setFilters}
                                onClose={() => setActiveFilter(null)}
                                position={popoverPos}
                            />
                        )}
                    </div>

                    {/* Property Type Filter with Popover */}
                    <div className="relative" ref={propertyTypeRef}>
                        <FilterPill
                            label={getPropertyTypeLabel()}
                            hasDropdown
                            active={activeFilter === 'PropertyType' || (filters.propertyTypes && filters.propertyTypes.length > 0)}
                            onClick={(e) => {
                                if (activeFilter === 'PropertyType') {
                                    setActiveFilter(null);
                                } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setPopoverPos({ top: rect.bottom + 8, left: rect.left });
                                    setActiveFilter('PropertyType');
                                }
                            }}
                        />
                        {activeFilter === 'PropertyType' && (
                            <PropertyTypeFilter
                                filters={filters}
                                setFilters={setFilters}
                                onClose={() => setActiveFilter(null)}
                                position={popoverPos}
                            />
                        )}
                    </div>

                    {/* Facilities & Amenities Filter with Popover */}
                    <div className="relative" ref={facilitiesRef}>
                        <FilterPill
                            label={getFacilitiesLabel()}
                            hasDropdown
                            active={activeFilter === 'Facilities' || (filters.tags && filters.tags.length > 0)}
                            onClick={(e) => {
                                if (activeFilter === 'Facilities') {
                                    setActiveFilter(null);
                                } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setPopoverPos({ top: rect.bottom + 8, left: rect.left });
                                    setActiveFilter('Facilities');
                                }
                            }}
                        />
                        {activeFilter === 'Facilities' && (
                            <FacilitiesFilter
                                filters={filters}
                                setFilters={setFilters}
                                onClose={() => setActiveFilter(null)}
                                position={popoverPos}
                            />
                        )}
                    </div>



                    <button
                        onClick={onOpenFilters}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/60 bg-white/40 backdrop-blur-md text-[#2C3E30] hover:bg-white/60 transition-all whitespace-nowrap text-sm font-semibold group"
                    >
                        <SlidersHorizontal size={14} className="group-hover:rotate-12 transition-transform" />
                        <span>All filters</span>
                        <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold transition-all ${activeFilterCount > 0
                            ? 'bg-[#2C3E30] text-white shadow-sm'
                            : 'bg-[#2C3E30]/10 text-[#2C3E30]/60'
                            }`}>
                            {activeFilterCount}
                        </span>
                    </button>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={onReset}
                            className="text-xs font-semibold text-slate-400 hover:text-[#2C3E30] transition-colors px-2 py-2"
                        >
                            Clear All
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SearchFiltersBar;


