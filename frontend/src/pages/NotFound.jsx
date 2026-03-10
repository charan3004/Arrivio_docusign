import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#EAE8E4] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-lg"
            >
                {/* 404 Number */}
                <h1 className="font-serif text-[120px] md:text-[180px] leading-none text-[#2C3E30]/10 font-bold select-none">
                    404
                </h1>

                {/* Message */}
                <div className="-mt-6 md:-mt-10">
                    <h2 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-3">
                        Page Not Found
                    </h2>
                    <p className="font-sans text-[#2C3E30]/60 text-sm md:text-base leading-relaxed mb-8">
                        Looks like you've wandered off the map. The page you're looking for
                        doesn't exist or has been moved.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/">
                        <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#2C3E30] text-[#EAE8E4] text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                            <Home size={16} />
                            Go Home
                        </button>
                    </Link>

                    <Link to="/search">
                        <button className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#2C3E30] text-[#2C3E30] text-xs font-bold uppercase tracking-widest hover:bg-[#2C3E30] hover:text-[#EAE8E4] transition-all">
                            <Search size={16} />
                            Find Stays
                        </button>
                    </Link>
                </div>

                {/* Back Link */}
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 inline-flex items-center gap-2 text-[#2C3E30]/40 hover:text-[#2C3E30] text-xs uppercase tracking-widest transition-colors font-sans"
                >
                    <ArrowLeft size={14} />
                    Go Back
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;


