import React from 'react';

const ProfileRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-5 px-5 py-5 hover:bg-[#FAFAFA] rounded-2xl transition-colors group border border-transparent hover:border-[#2C3E30]/5">
        <div className="w-10 h-10 rounded-full bg-[#EAE8E4] group-hover:bg-white flex items-center justify-center text-[#2C3E30] shrink-0 custom-shadow transition-all group-hover:scale-110">
            {icon}
        </div>

        <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-[#2C3E30]/40 font-bold mb-1">
                {label}
            </p>
            <p className="text-base font-medium text-[#2C3E30] truncate">{value}</p>
        </div>
    </div>
);

export default ProfileRow;


