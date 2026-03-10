import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, MapPin } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const WishlistPreview = () => {
    const { wishlist } = useWishlist();
    const previewItems = wishlist.slice(0, 3); // Top 3

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-[#2C3E30]/5 overflow-hidden h-full flex flex-col">
            {/* HEADER */}
            <div className="px-8 py-6 border-b border-[#2C3E30]/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <Heart size={18} className="fill-current" />
                    </div>
                    <div>
                        <h2 className="font-serif text-lg text-[#2C3E30] leading-none mb-1">Shortlist</h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/40">
                            {wishlist.length} Saved Properties
                        </p>
                    </div>
                </div>
                <Link to="/wishlist" className="w-8 h-8 rounded-full border border-[#2C3E30]/10 flex items-center justify-center text-[#2C3E30] hover:bg-[#2C3E30] hover:text-white transition-colors">
                    <ChevronRight size={16} />
                </Link>
            </div>

            {/* LIST */}
            <div className="p-4 flex-1">
                {previewItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-50">
                        <Heart size={32} className="mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">No shortlist yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {previewItems.map(item => (
                            <Link key={item.id} to={`/property/${item.id}`} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-[#F5F5F0] transition-colors group">
                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-serif text-sm text-[#2C3E30] truncate group-hover:text-[#C2B280] transition-colors">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-[10px] text-[#2C3E30]/50 mb-1">
                                        <MapPin size={10} />
                                        <span className="truncate">{item.city}</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#2C3E30]">€{item.price}<span className="text-[10px] font-normal opacity-60">/mo</span></p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            {previewItems.length > 0 && (
                <div className="px-4 py-3 bg-[#FAFAFA] border-t border-[#2C3E30]/5 text-center">
                    <Link to="/wishlist" className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/60 hover:text-[#2C3E30] transition-colors">
                        View Shortlist
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPreview;
