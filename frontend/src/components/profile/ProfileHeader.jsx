import React from 'react';

const ProfileHeader = ({ user, profileData }) => {
    // profileData contains { username, phone, etc } fetched from DB
    const name = user.user_metadata?.full_name || "User";
    const email = user.email;
    const phone = profileData?.phone || "";
    const username = profileData?.username || "";
    const initial = name[0]?.toUpperCase() || "U";

    return (
        <div className="flex flex-col items-center justify-center text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* AVATAR */}
            <div className="relative mb-6 group cursor-pointer">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#2C3E30] text-[#EAE8E4] flex items-center justify-center text-4xl md:text-5xl font-serif shadow-2xl shadow-[#2C3E30]/20 transition-transform duration-500 group-hover:scale-105">
                    {initial}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border-4 border-[#F5F5F0] flex items-center justify-center text-[#2C3E30] shadow-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
            </div>

            {/* INFO */}
            <h1 className="text-3xl md:text-4xl font-serif text-[#2C3E30] mb-2">
                {name}
            </h1>

            <div className="flex items-center gap-2 text-sm md:text-base text-[#2C3E30]/60 font-medium">
                <span>{email}</span>
                {phone && (
                    <>
                        <span className="w-1 h-1 bg-[#2C3E30]/30 rounded-full" />
                        <span>{phone}</span>
                    </>
                )}
            </div>
            {username && (
                <p className="text-xs font-bold uppercase tracking-widest text-[#2C3E30]/40 mt-2">@{username}</p>
            )}
        </div>
    );
};

export default ProfileHeader;


