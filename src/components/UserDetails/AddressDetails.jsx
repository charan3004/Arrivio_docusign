import React from "react";
import { MapPin } from "lucide-react";

const AddressDetails = ({ formData, handleChange }) => {
    return (
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#2C3E30]/5">
            <div className="flex items-center gap-3 mb-6 border-b border-[#2C3E30]/10 pb-4">
                <div className="p-2 bg-[#2C3E30]/5 rounded-lg text-[#2C3E30]"><MapPin size={20} /></div>
                <h2 className="font-serif text-xl">Current Residence</h2>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#2C3E30]/60">Full Address</label>
                <textarea
                    name="currentAddress" rows="3" required
                    className="w-full bg-[#faefe5]/70 border border-[#2C3E30]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2C3E30]/30 transition-colors resize-none"
                    placeholder="Street, City, Zip Code, Country"
                    onChange={handleChange}
                    value={formData.currentAddress || ""}
                ></textarea>
            </div>
        </section>
    );
};

export default AddressDetails;
