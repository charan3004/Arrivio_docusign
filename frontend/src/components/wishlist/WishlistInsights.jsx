import React, { useMemo } from 'react';
import { Sparkles, TrendingDown, MapPin, Award } from 'lucide-react';

/**
 * WishlistInsights Component
 * Analyzes the wishlist and provides 3 friendly "insights" or suggestions.
 */
const WishlistInsights = ({ wishlist }) => {
    if (!wishlist || wishlist.length === 0) return null;

    const insights = useMemo(() => {
        const list = [];
        if (wishlist.length === 0) return list;

        // 1. BEST VALUE (Lowest Price)
        const sortedByPrice = [...wishlist].sort((a, b) => a.price - b.price);
        const bestValue = sortedByPrice[0];
        list.push({
            icon: <TrendingDown size={20} className="text-[#2C3E30]" />,
            title: "Best Value",
            desc: (
                <span>
                    At <span className="font-bold">€{bestValue.price}/mo</span>, <span className="italic">"{bestValue.title}"</span> is your most wallet-friendly option.
                </span>
            ),
            bg: "bg-[#E6F4EE]",
            border: "border-[#2C3E30]/10"
        });

        // 2. CROWD FAVORITE (Highest Rated)
        const sortedByRating = [...wishlist].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const bestRated = sortedByRating[0];
        if (bestRated.rating >= 4.5) {
            list.push({
                icon: <Award size={20} className="text-[#C2B280]" />,
                title: "Crowd Favorite",
                desc: (
                    <span>
                        Guests love <span className="italic">"{bestRated.title}"</span>! It has a stellar <span className="font-bold">{bestRated.rating} star</span> rating.
                    </span>
                ),
                bg: "bg-[#FDFCF8]",
                border: "border-[#C2B280]/20"
            });
        }

        // 3. LOCATION OBSESSION (Common City)
        const cities = {};
        wishlist.forEach(p => {
            cities[p.city] = (cities[p.city] || 0) + 1;
        });
        const topCity = Object.keys(cities).reduce((a, b) => cities[a] > cities[b] ? a : b);

        if (cities[topCity] > 1) {
            list.push({
                icon: <MapPin size={20} className="text-[#2C3E30]" />,
                title: "City Vibes",
                desc: (
                    <span>
                        You seem to have a soft spot for <span className="font-bold">{topCity}</span>. Great choice!
                    </span>
                ),
                bg: "bg-white",
                border: "border-[#2C3E30]/10"
            });
        } else {
            // Fallback if no specific city preference
            list.push({
                icon: <Sparkles size={20} className="text-[#C2B280]" />,
                title: "Diverse Taste",
                desc: "You have a great eye for unique stays across different locations!",
                bg: "bg-white",
                border: "border-[#C2B280]/20"
            });
        }

        return list;
    }, [wishlist]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, i) => (
                <div
                    key={i}
                    className={`
                        p-6 rounded-[24px] border ${insight.border} ${insight.bg} 
                        flex items-start gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                    `}
                >
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm shrink-0 border border-gray-100">
                        {insight.icon}
                    </div>
                    <div>
                        <h4 className="font-serif text-xl text-[#2C3E30] mb-2 leading-none">{insight.title}</h4>
                        <p className="text-sm text-[#2C3E30]/70 leading-relaxed font-light">
                            {insight.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WishlistInsights;
