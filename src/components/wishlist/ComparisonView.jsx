import React, { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check, Bed, Bath, Expand, Trophy, Crown, Star, MapPin } from "lucide-react";

/**
 * ComparisonView Component
 * Renders a compact comparison table (Difference Table).
 * Fits on one screen (max-height constrained).
 * Includes a "Verdict" section at the bottom.
 */
const ComparisonView = ({ properties, onClose }) => {
    // Basic safety check for props
    if (!properties || !Array.isArray(properties) || properties.length === 0) return null;

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Helper to safely parse area/size
    const parseArea = (p) => {
        if (!p?.details) return 0;
        const val = p.details.size || p.details.sqm || p.details.sqft;
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
            const match = val.match(/(\d+)/);
            return match ? parseInt(match[0], 10) : 0;
        }
        return 0;
    };

    // Helper to find the "best" value for highlighting
    const getBest = (key, type = "high") => {
        if (properties.length < 2) return null;

        const values = properties.map((p) => {
            if (!p) return 0;
            if (key === "price") return Number(p.price) || 0;
            if (key === "sqft") return parseArea(p);
            if (key === "rating") return Number(p.rating) || 0;
            if (key === "beds") return Number(p.details?.beds) || 0;
            return 0;
        });

        const validValues = values.filter(v => typeof v === 'number' && !isNaN(v) && v > 0);
        if (validValues.length === 0) return 0;

        if (type === "low") return Math.min(...validValues);
        return Math.max(...validValues);
    };

    const bestPrice = getBest("price", "low");
    const bestSqft = getBest("sqft", "high");
    const bestRating = getBest("rating", "high");
    const bestBeds = getBest("beds", "high");

    // Calculate Overall Winner
    const winnerData = useMemo(() => {
        if (properties.length < 2) return null;

        const scores = properties.map(p => {
            let score = 0;
            const reasons = [];
            if (!p) return { id: "unknown", score: -1, reasons: [] };

            const price = Number(p.price) || 0;
            const sqft = parseArea(p);
            const rating = Number(p.rating) || 0;
            const beds = Number(p.details?.beds) || 0;

            // Weighted scoring
            // Prioritize Room Size heavily (+30) as it's a huge differentiating factor
            // Balance Price (+15) and Rating (+15) so a slightly better rating doesn't win over huge price/size value
            if (price === bestPrice && price > 0) { score += 15; reasons.push("Best Price"); }
            if (rating === bestRating && rating > 0) { score += 15; reasons.push("Top Rated"); }
            if (sqft === bestSqft && sqft > 0) { score += 30; reasons.push("Most Spacious"); }
            if (beds === bestBeds && beds > 0) { score += 10; reasons.push("More Bedrooms"); }

            return { id: p.id, score, reasons, title: p.title };
        });

        scores.sort((a, b) => b.score - a.score);
        // If tie, just pick first
        return scores[0];
    }, [properties, bestPrice, bestSqft, bestRating, bestBeds]);


    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* MODAL CONTENT */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-5xl bg-[#FDFCF8] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            >
                {/* HEADLINE */}
                <div className="px-5 py-3 bg-white flex justify-between items-center border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-lg font-serif text-[#2C3E30] leading-none">Compare Properties</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition text-[#2C3E30]"><X size={16} /></button>
                </div>

                {/* TABLE CONTENT */}
                <div className="flex-1 overflow-auto p-3 custom-scrollbar">
                    <div className="min-w-max">
                        <div
                            className="grid gap-x-2 gap-y-0"
                            style={{ gridTemplateColumns: `100px repeat(${properties.length}, minmax(140px, 1fr))` }}
                        >
                            {/* --- HEADER ROW (Images) --- */}
                            <div className="pt-4 text-[10px] font-bold text-[#2C3E30]/40 uppercase tracking-widest text-right pr-2 self-end pb-2">
                                Property
                            </div>

                            {properties.map((p, i) => (
                                <div key={p.id || i} className={`relative flex flex-col gap-1.5 p-2 rounded-t-lg transition-colors ${winnerData?.id === p.id ? "bg-white ring-1 ring-[#C2B280]/30 shadow-sm z-10" : ""}`}>
                                    {winnerData?.id === p.id && (
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#C2B280] text-[#2C3E30] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md z-20 whitespace-nowrap">
                                            <Crown size={10} /> WINNER
                                        </div>
                                    )}
                                    <div className="mx-auto w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                                        <img src={p.image || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" onError={(e) => e.target.src = "https://placehold.co/300x200"} />
                                    </div>
                                    <div className="text-center px-0.5">
                                        <h3 className="font-serif text-base font-medium text-[#2C3E30] leading-tight mb-0.5 line-clamp-2">{p.title}</h3>
                                        <p className="text-[10px] uppercase tracking-widest text-[#2C3E30]/50 line-clamp-1">{p.city}</p>
                                    </div>
                                </div>
                            ))}

                            {/* --- PRICE --- */}
                            <div className="py-2.5 text-[10px] font-bold text-[#2C3E30]/60 uppercase tracking-wide text-right pr-3 flex items-center justify-end border-t border-gray-100">
                                Price
                            </div>
                            {properties.map((p, i) => {
                                const val = Number(p.price) || 0;
                                const isBest = val === bestPrice && val > 0;
                                return (
                                    <div key={p.id || i} className={`py-2 px-2 flex items-center justify-center border-t border-gray-100 ${winnerData?.id === p.id ? "bg-white ring-x ring-[#C2B280]/30" : ""} ${isBest ? "bg-[#E6F4EE]/50 rounded-md" : ""}`}>
                                        <span className={`font-serif text-xl ${isBest ? "text-[#2F5D50] font-bold" : "text-[#2C3E30]"}`}>
                                            €{val.toLocaleString()}
                                        </span>
                                        {isBest && <div className="ml-1 bg-[#2F5D50] text-white p-0.5 rounded-full"><Check size={8} /></div>}
                                    </div>
                                );
                            })}

                            {/* --- SQFT --- */}
                            <div className="py-2.5 text-[10px] font-bold text-[#2C3E30]/60 uppercase tracking-wide text-right pr-3 flex items-center justify-end border-t border-gray-100">
                                Area
                            </div>
                            {properties.map((p, i) => {
                                const val = parseArea(p);
                                const isBest = val === bestSqft && val > 0;
                                return (
                                    <div key={p.id || i} className={`py-2 px-2 flex items-center justify-center border-t border-gray-100 ${winnerData?.id === p.id ? "bg-white ring-x ring-[#C2B280]/30" : ""} ${isBest ? "bg-[#EAE8E4] rounded-md" : ""}`}>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-base ${isBest ? "text-[#2C3E30] font-bold" : "text-[#2C3E30]/80"}`}>
                                                {val || "-"}
                                            </span>
                                            <span className="text-[10px] text-[#2C3E30]/50">sqft</span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* --- BEDS / BATHS --- */}
                            <div className="py-2.5 text-[10px] font-bold text-[#2C3E30]/60 uppercase tracking-wide text-right pr-3 flex items-center justify-end border-t border-gray-100">
                                Config
                            </div>
                            {properties.map((p, i) => {
                                const beds = Number(p.details?.beds) || 0;
                                const baths = Number(p.details?.baths) || 0;
                                const isBest = beds === bestBeds && beds > 0;
                                return (
                                    <div key={p.id || i} className={`py-2 px-2 flex items-center justify-center gap-2 border-t border-gray-100 ${winnerData?.id === p.id ? "bg-white ring-x ring-[#C2B280]/30" : ""} ${isBest ? "bg-[#EAE8E4] rounded-md" : ""}`}>
                                        <div className={`flex items-center gap-1 ${isBest ? "text-[#2C3E30] font-bold" : "text-[#2C3E30]/80"}`}>
                                            <Bed size={14} className="text-[#2C3E30]/40" />
                                            <span className="text-sm">{beds}</span>
                                        </div>
                                        <div className="w-px h-3 bg-gray-200"></div>
                                        <div className="flex items-center gap-1 text-[#2C3E30]/80">
                                            <Bath size={14} className="text-[#2C3E30]/40" />
                                            <span className="text-sm">{baths}</span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* --- RATING --- */}
                            <div className="py-2.5 text-[10px] font-bold text-[#2C3E30]/60 uppercase tracking-wide text-right pr-3 flex items-center justify-end border-t border-gray-100">
                                Rating
                            </div>
                            {properties.map((p, i) => {
                                const val = Number(p.rating) || 0;
                                const isBest = val === bestRating && val > 0;
                                return (
                                    <div key={p.id || i} className={`py-2 px-2 flex items-center justify-center gap-1 border-t border-gray-100 ${winnerData?.id === p.id ? "bg-white ring-x ring-[#C2B280]/30" : ""} ${isBest ? "bg-[#FFF9E6] rounded-md" : ""}`}>
                                        <span className={`text-base ${isBest ? "text-[#B49248] font-bold" : "text-[#2C3E30]/80"}`}>{val}</span>
                                        <Star size={12} className={`${isBest ? "text-[#B49248] fill-[#B49248]" : "text-gray-300"}`} />
                                    </div>
                                );
                            })}

                            {/* --- HIGHLIGHTS --- */}
                            <div className="py-2.5 text-[10px] font-bold text-[#2C3E30]/60 uppercase tracking-wide text-right pr-3 flex items-center justify-end border-t border-gray-100">
                                Highlights
                            </div>
                            {properties.map((p, i) => (
                                <div key={p.id || i} className={`py-2 px-2 flex flex-wrap gap-1 justify-center content-start border-t border-gray-100 ${winnerData?.id === p.id ? "bg-white ring-1 ring-[#C2B280]/30 rounded-b-lg border-t-transparent shadow-sm" : ""}`}>
                                    {(Array.isArray(p.amenities) ? p.amenities : []).slice(0, 2).map((am, k) => (
                                        <span key={k} className="text-[9px] bg-[#EAE8E4] border border-[#2C3E30]/5 px-1.5 py-0.5 rounded text-[#2C3E30]/70 font-medium whitespace-nowrap">
                                            {am}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* VERDICT FOOTER */}
                {winnerData && (
                    <div className="bg-[#2C3E30] text-[#EAE8E4] px-5 py-2.5 shrink-0">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-[#C2B280] rounded-full text-[#2C3E30] shadow-lg shadow-[#2C3E30]/50"><Trophy size={14} /></div>
                                <div>
                                    <h3 className="font-serif text-sm leading-none mb-0.5">
                                        <span className="text-[#C2B280] italic">{winnerData.title}</span> is the winner.
                                    </h3>
                                    <p className="text-[10px] text-white/60 font-light">
                                        Top in <span className="text-white/90 font-medium">{winnerData.reasons.join(", ")}</span>.
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-[#C2B280] border border-[#C2B280]/30 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ComparisonView;


