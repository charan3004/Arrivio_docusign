

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    Bed,
    Maximize,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight,
    Star,
    User,
    Check,
    Bath,
    Layers
} from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

const PropertyCard = ({ property, activeTab, onClick, onMouseEnter, onMouseLeave, children }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isSaved = isInWishlist(property.id);
    const [copied, setCopied] = useState(false);

    // CAROUSEL STATE
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollRef = useRef(null);

    // Combine cover image and gallery
    const images = [property.image, ...(property.gallery || [])].filter(Boolean);

    const handleShare = useCallback(async (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}/property/${property.id}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: property.title || 'Property', url });
            } catch (err) { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [property.id, property.title]);

    const nextImage = (e) => {
        e?.stopPropagation();
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth, behavior: 'smooth' });
        }
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth, behavior: 'smooth' });
        }
    };

    const handleScroll = (e) => {
        const index = Math.round(e.target.scrollLeft / e.target.offsetWidth);
        if (index !== currentImageIndex) setCurrentImageIndex(index);
    };

    // ======================
    // LOGIC: AVAILABILITY
    // ======================
    const getAvailabilityStatus = (property) => {
        const rows = property.availability;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!rows || rows.length === 0) return { label: "Booked", color: "red" };

        const availableRows = rows.filter(r => r.status === "available");
        if (availableRows.length === 0) return { label: "Booked", color: "red" };

        availableRows.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        const slot = availableRows[0];
        let start = new Date(slot.start_date);

        // If available now or in past
        if (start <= today) return { label: "Available now", color: "green" };

        // Future
        const opts = { day: "numeric", month: "long" };
        const dateStr = start.toLocaleDateString("en-GB", opts);
        return { label: `Available from ${dateStr}`, color: "gray" };
    };

    const { label: availLabel, color: availColor } = getAvailabilityStatus(property);

    // ======================
    // LOGIC: RATINGS
    // ======================
    const rating = property.rating || (4 + Math.random()).toFixed(1); // Mock if missing
    const reviews = property.reviews_count || Math.floor(Math.random() * 20) + 1; // Mock

    return (
        <motion.div
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer bg-white rounded-[16px] overflow-hidden border border-[#EAE8E4] hover:border-[#2C3E30]/20 flex flex-col group/card relative h-full"
        >
            {/* 1. IMAGE CAROUSEL */}
            <div className="relative bg-gray-100 group overflow-hidden" style={{ aspectRatio: '3/2' }}>
                {/* SCROLL CONTAINER */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                >
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={property.title}
                            className="w-full h-full object-cover flex-shrink-0 snap-center"
                            loading="lazy"
                        />
                    ))}
                </div>


                {/* OVERLAY: HEART (Wishlist) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(property);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform group/heart"
                >
                    <Heart
                        size={18}
                        className={`transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-[#2C3E30]/60 group-hover/heart:text-red-500"}`}
                    />
                </button>

                {/* OVERLAY: ARROWS (Hover Only) */}
                {images.length > 1 && (
                    <>
                        {currentImageIndex > 0 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md text-[#2C3E30] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                            >
                                <ChevronLeft size={16} />
                            </button>
                        )}

                        {currentImageIndex < images.length - 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md text-[#2C3E30] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                            >
                                <ChevronRight size={16} />
                            </button>
                        )}

                        {/* DOTS */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
                            {images.slice(0, 5).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* 2. CARD BODY */}
            <div className="p-4 flex flex-col flex-grow">
                {/* TITLE + RATING ROW */}
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-serif text-[17px] leading-[1.3] text-[#2C3E30] line-clamp-2">
                        {property.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        <Star size={14} className="fill-emerald-500 text-emerald-500" />
                        <span className="text-sm font-bold text-[#2C3E30]">{rating}</span>
                        <span className="text-xs text-[#2C3E30]/60">({reviews})</span>
                    </div>
                </div>

                {/* SPECS ROW (ALL IN ONE) */}
                <div className="flex items-center gap-3 text-[#2C3E30]/70 mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                    <div className="flex items-center gap-1 shrink-0" title="Size">
                        <Maximize size={15} strokeWidth={1.5} />
                        <span className="text-[12px] font-medium">
                            {parseInt(property.details?.size) || property.details?.sqm || "-"} m²
                        </span>
                    </div>
                    {activeTab !== "Families" && (
                        <div className="flex items-center gap-1 shrink-0" title="Capacity">
                            <User size={15} strokeWidth={1.5} />
                            <span className="text-[12px] font-medium">
                                {property.capacity || property.details?.beds || 2}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 shrink-0" title="Bedrooms">
                        <Bed size={15} strokeWidth={1.5} />
                        <span className="text-[12px] font-medium">
                            {property.details?.bedrooms || 1}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0" title="Bathrooms">
                        <Bath size={15} strokeWidth={1.5} />
                        <span className="text-[12px] font-medium">
                            {property.details?.bathrooms || 1}
                        </span>
                    </div>

                    {/* FLOOR (Conditional) */}
                    {(property.floor !== undefined || property.details?.floor !== undefined) && (
                        <div className="flex items-center gap-1 shrink-0" title="Floor">
                            <Layers size={15} strokeWidth={1.5} />
                            <span className="text-[12px] font-medium">
                                {(() => {
                                    const val = property.floor ?? property.details?.floor;
                                    if (val === 0 || val === '0') return 'GF';
                                    if (!val) return null;
                                    return isNaN(Number(val)) ? val : val;
                                })()}
                            </span>
                        </div>
                    )}
                </div>

                {/* PRICE ROW */}
                <div className="mt-auto mb-3">
                    <div className="flex items-baseline gap-1">
                        <span className="font-sans text-[18px] font-bold text-[#2C3E30]">
                            €{Number(property.price).toLocaleString()}
                        </span>
                        <span className="text-[11px] text-[#2C3E30]/50 font-medium">
                            /month, incl. utilities
                        </span>
                    </div>
                </div>

                {/* 3. FOOTER: AVAILABILITY (Divider + Status) */}
                <div className="border-t border-[#EAE8E4] pt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${availColor === "green" ? "bg-green-600" : "bg-[#2C3E30]/40"}`} />
                    <span className={`text-[12px] font-bold ${availColor === "green" ? "text-green-700" : "text-[#2C3E30]"}`}>
                        {availLabel}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyCard;




