import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ProfileMenuCard = ({ icon: Icon, title, description, to, onClick, count }) => {
    const Content = () => (
        <div className="bg-white p-5 rounded-[24px] border border-[#2C3E30]/5 hover:border-[#2C3E30]/20 hover:shadow-lg transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F0] flex items-center justify-center text-[#2C3E30] group-hover:bg-[#2C3E30] group-hover:text-white transition-colors duration-300">
                    <Icon size={20} strokeWidth={1.5} />
                </div>
                <div className="w-7 h-7 rounded-full border border-[#2C3E30]/10 flex items-center justify-center text-[#2C3E30]/40 group-hover:text-[#2C3E30] group-hover:border-[#2C3E30] transition-colors duration-300">
                    <ChevronRight size={14} />
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg text-[#2C3E30]">{title}</h3>
                    {count > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full shadow-sm">
                            {count}
                        </span>
                    )}
                </div>
                <p className="text-xs text-[#2C3E30]/60 leading-relaxed max-w-[95%]">
                    {description}
                </p>
            </div>
        </div>
    );

    if (onClick) {
        return <div onClick={onClick}><Content /></div>;
    }

    return (
        <Link to={to} className="block h-full">
            <Content />
        </Link>
    );
};

export default ProfileMenuCard;
