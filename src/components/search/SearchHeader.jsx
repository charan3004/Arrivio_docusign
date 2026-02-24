import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchHeader = ({ city, count, searchTerm }) => {
    const displayCity = city === "All" ? (searchTerm || "Germany") : city;

    return (
        <div className="mb-6">
            {/* BREADCRUMBS */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#2C3E30] mb-3">
                <Link to="/" className="hover:underline">Home</Link>
                <span className="text-[#2C3E30]/40">/</span>
                {city && city !== "All" ? (
                    <>
                        <Link to="/cities" className="text-[#2C3E30]/50 hover:underline">cities</Link>
                        <span className="text-[#2C3E30]/40">/</span>
                        <span className="text-[#2C3E30]/50">{city}</span>
                    </>
                ) : (
                    <span className="text-[#2C3E30]/50">Germany</span>
                )}
            </div>

            {/* TITLE */}
            <h1 className="text-lg md:text-xl font-serif text-[#2C3E30] leading-snug">
                <span className="font-bold">{count} rooms, studios and apartments</span> for rent in <span className="italic text-[#C2B280]">{displayCity}</span>
            </h1>
        </div>
    );
};

export default SearchHeader;
