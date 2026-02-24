import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

const VerifiedStatus = () => {
    return (
        <div className="bg-[#EAE8E4] border border-[#2C3E30]/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#2C3E30]/10 rounded-lg">
                        <ShieldCheck size={24} className="text-[#2C3E30]" />
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/60 mb-0.5">Status</span>
                        <span className="text-lg font-serif text-[#2C3E30]">Verified Member</span>
                    </div>
                </div>
                <p className="text-sm text-[#2C3E30]/70 leading-relaxed mb-6 border-t border-[#2C3E30]/10 pt-4">
                    Your account is verified. You have access to express booking.
                </p>
                <ul className="space-y-3">
                    {['Express Booking', 'Zero Deposit Options', 'Priority Support'].map(item => (
                        <li key={item} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#2C3E30]">
                            <CheckCircle size={14} className="text-[#2C3E30]/40" /> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VerifiedStatus;


