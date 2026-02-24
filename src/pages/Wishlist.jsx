import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Heart, Trash2, CheckCircle, Scale } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ComparisonView from "../components/wishlist/ComparisonView";
import PropertyCard from "../components/property/PropertyCard";

const Wishlist = () => {
    const { wishlist, removeFromWishlist, loading } = useWishlist();
    const navigate = useNavigate();

    // SELECTION STATE
    const [selectedIds, setSelectedIds] = React.useState([]);
    const [isCompareOpen, setIsCompareOpen] = React.useState(false);

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(item => item !== id));
        } else {
            if (selectedIds.length >= 3) {
                alert("You can compare up to 3 properties at a time.");
                return;
            }
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleCompare = () => {
        setIsCompareOpen(true);
    };

    const selectedProperties = wishlist.filter(p => selectedIds.includes(p.id));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#EAE8E4]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-[#2C3E30] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-[#2C3E30]">Loading wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto">
                {/* NO HEADER - Keep distinct look? Or standard header? Let's simplify. */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-2">
                    <div>
                        <h2 className="text-2xl font-serif text-[#2C3E30] mb-2">My Shortlist</h2>
                        <p className="text-[#2C3E30]/60 max-w-xl text-sm leading-relaxed">
                            Compare features and check availability for your favorite stays.
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">
                        {wishlist.length > 0 && (
                            <div className="text-right">
                                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#2C3E30]/60">
                                    Select properties to compare
                                </p>
                                <p className="text-[9px] font-medium text-[#2C3E30]/40 uppercase tracking-widest">
                                    (Max 3 items)
                                </p>
                            </div>
                        )}
                    </div>
                </header>

                {/* STICKY ACTIONS BAR - Only visible when selected */}
                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="sticky top-4 z-30 mb-8"
                        >
                            <div className="bg-[#EAE8E4]/90 backdrop-blur-md border border-white/50 shadow-xl rounded-full px-6 py-3 flex justify-between items-center max-w-xl mx-auto">
                                <span className="text-sm font-medium text-[#2C3E30] pl-2">
                                    <span className="font-bold">{selectedIds.length}</span> selected for comparison
                                </span>

                                <div className="flex gap-3 items-center">
                                    <button
                                        onClick={() => setSelectedIds([])}
                                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/50 hover:text-red-600 transition-colors"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={handleCompare}
                                        disabled={selectedIds.length < 2}
                                        className={`
                                            flex items-center gap-2 px-6 py-2 rounded-full transition-all shadow-sm
                                            ${selectedIds.length >= 2
                                                ? "bg-[#2C3E30] text-[#EAE8E4] hover:bg-[#1a261d] hover:shadow-md cursor-pointer"
                                                : "bg-[#2C3E30]/10 text-[#2C3E30]/30 cursor-not-allowed"
                                            }
                                        `}
                                    >
                                        <Scale size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Compare</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* EMPTY STATE */}
                {
                    wishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[32px] border border-[#2C3E30]/5 shadow-sm">
                            <div className="w-20 h-20 bg-[#EAE8E4] rounded-full flex items-center justify-center mb-6">
                                <Heart size={32} className="text-[#C2B280]" />
                            </div>
                            <h2 className="text-2xl font-serif text-[#2C3E30] mb-3">No saved properties</h2>
                            <p className="text-[#2C3E30]/60 mb-8 max-w-sm text-base font-light">
                                Start exploring our curated collection and save your favorite stays.
                            </p>
                            <Link to="/search">
                                <button className="px-8 py-3 rounded-full bg-[#2C3E30] text-[#EAE8E4] text-xs font-bold uppercase tracking-widest hover:bg-[#1a261d] transition-all hover:shadow-lg">
                                    Explore Stays
                                </button>
                            </Link>
                        </div>
                    ) : (
                        /* GRID */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {wishlist.map(property => {
                                const isSelected = selectedIds.includes(property.id);

                                return (
                                    <WishlistItem
                                        key={property.id}
                                        property={property}
                                        isSelected={isSelected}
                                        toggleSelection={toggleSelection}
                                        navigate={navigate}
                                    />
                                );
                            })}
                        </div>
                    )
                }
            </div>

            <AnimatePresence>
                {isCompareOpen && (
                    <ComparisonView
                        properties={selectedProperties}
                        onClose={() => setIsCompareOpen(false)}
                    />
                )}
            </AnimatePresence>

        </>
    );
};

const WishlistItem = ({ property, isSelected, toggleSelection, navigate }) => {
    const timerRef = React.useRef(null);
    const isLongPress = React.useRef(false);

    const startPress = () => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            if (navigator.vibrate) navigator.vibrate(50);
            toggleSelection(property.id);
        }, 500);
    };

    const cancelPress = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleClick = (e) => {
        // If it was a long press, do nothing (selection already toggled)
        if (isLongPress.current) return;
        // Otherwise navigate
        navigate(`/property/${property.id}`);
    };

    return (
        <div
            className="relative group touch-manipulation"
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            onClick={handleClick}
        >
            {/* Selection Ring */}
            <div className={`absolute -inset-1 rounded-[32px] border-2 transition-colors duration-300 pointer-events-none z-0 ${isSelected ? "border-[#2C3E30]" : "border-transparent"}`} />

            <div className="relative z-10 transition-transform duration-300 active:scale-[0.98]">
                <PropertyCard
                    property={property}
                    onClick={() => { }} // Handled by wrapper
                >
                    {/* SELECTION BUTTON - Clear & Visible */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleSelection(property.id);
                        }}
                        className={`
                            absolute top-3 left-3 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg transition-all duration-300
                            ${isSelected
                                ? "bg-[#2C3E30] text-white ring-2 ring-white opacity-100 scale-100"
                                : "bg-white/95 text-[#2C3E30] hover:bg-white opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                            }
                        `}
                    >
                        {isSelected ? <CheckCircle size={14} className="fill-white text-[#2C3E30]" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-[#2C3E30]" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none pt-0.5">
                            {isSelected ? "Selected" : "Select"}
                        </span>
                    </button>
                </PropertyCard>
            </div>
        </div>
    );
};

export default Wishlist;


