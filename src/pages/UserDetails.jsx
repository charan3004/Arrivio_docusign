import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, MapPin, Calendar, Check, PartyPopper, Bookmark } from "lucide-react";

import PersonalDetails from "../components/UserDetails/PersonalDetails";
import AddressDetails from "../components/UserDetails/AddressDetails";
import OccupationDetails from "../components/UserDetails/OccupationDetails";
import RequiredDocuments from "../components/UserDetails/RequiredDocuments";
import CameraModal from "../components/UserDetails/CameraModal";

const UserDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Retrieve booking data either from state or fallback (localStorage if saved)
    const bookingData = state || JSON.parse(localStorage.getItem("current_application")) || {};

    const [documents, setDocuments] = useState({
        passport: null,
        visa: null,
        govId: null,
        selfie: null,
        workDocument: null,
        admissionLetter: null
    });

    // Camera state
    const [showCamera, setShowCamera] = useState(false);
    const [modal, setModal] = useState(null); // { type: 'saved' | 'submitted' }

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        phone: "",
        currentAddress: "",

        // Dynamic Occupation Fields
        occupation: "work", // 'work' or 'study'

        // Work Fields
        employer: "",
        jobTitle: "",

        // Study Fields
        university: "",
        course: "",

        income: "", // Shared: Monthly Income or Budget
        emergencyContactName: "",
        emergencyContactPhone: "",
    });

    const [countryCode, setCountryCode] = useState("+49");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Initial state setup: Load draft if exists, else use empty
    // We use a specific key for the draft based on the property or a generic one
    const DRAFT_KEY = `draft_application_${bookingData.title || 'generic'}`;

    useEffect(() => {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setFormData(parsed.formData || {});
                setCountryCode(parsed.countryCode || "+49");
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, [DRAFT_KEY]);

    // Auto-save effect
    useEffect(() => {
        if (!isSubmitted && bookingData.title) {
            const draft = {
                formData,
                countryCode,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        }
    }, [formData, countryCode, isSubmitted, bookingData.title, DRAFT_KEY]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveAndLeave = (e) => {
        e.preventDefault();
        // Force save current state
        const draft = {
            formData,
            countryCode,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setModal('saved');
    };

    // File Handling
    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            setDocuments(prev => ({ ...prev, [type]: e.target.files[0] }));
        }
    };

    const handleCameraConfirm = (dataUrl) => {
        setDocuments(prev => ({ ...prev, selfie: dataUrl }));
        setShowCamera(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        localStorage.removeItem(DRAFT_KEY);
        setModal('submitted');
    };

    if (!bookingData.title) {
        return <div className="p-10 text-center">No active application found. <button onClick={() => navigate('/')} className="underline">Go Home</button></div>;
    }

    // Duration Logic
    const getDurationText = (start, end) => {
        if (!start || !end) return "";
        const s = new Date(start);
        const e = new Date(end);
        if (isNaN(s) || isNaN(e)) return "";

        const diffTime = Math.abs(e - s);
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const months = Math.floor(totalDays / 30);
        const weeks = Math.floor((totalDays % 30) / 7);
        const days = (totalDays % 30) % 7;

        const parts = [];
        if (months > 0) parts.push(`${months} Month${months !== 1 ? 's' : ''}`);
        if (weeks > 0) parts.push(`${weeks} Week${weeks !== 1 ? 's' : ''}`);
        if (days > 0) parts.push(`${days} Day${days !== 1 ? 's' : ''}`);

        return parts.length > 0 ? parts.join(', ') : "1 Day";
    };

    const durationText = getDurationText(bookingData.checkIn, bookingData.checkOut);
    const utilitiesFee = 45; // Estimated utilities
    const monthlyRent = parseFloat(bookingData.monthlyTotal) || 0;
    const totalMonthly = monthlyRent + utilitiesFee;

    return (
        <div className="min-h-screen bg-[#EAE8E4] font-sans text-[#2C3E30]">
            {/* Header */}
            <div className="bg-white border-b border-[#2C3E30]/10 px-6 py-4 sticky top-0 z-20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#F5F5F0] rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-serif text-xl font-bold">Application Details</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#2C3E30]/60">Completing for: <span className="font-bold">{bookingData.title}</span></p>
                            <span className="text-[10px] bg-[#2C3E30]/5 px-2 py-0.5 rounded text-[#2C3E30]/50">Auto-saving drafts</span>
                        </div>
                    </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    In Progress
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* LEFT: FORM */}
                <div className="lg:col-span-3 space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <PersonalDetails
                            formData={formData}
                            handleChange={handleChange}
                            setFormData={setFormData}
                            countryCode={countryCode}
                            setCountryCode={setCountryCode}
                        />

                        <AddressDetails
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <OccupationDetails
                            formData={formData}
                            handleChange={handleChange}
                            documents={documents}
                            handleFileChange={handleFileChange}
                        />

                        <RequiredDocuments
                            documents={documents}
                            handleFileChange={handleFileChange}
                            onStartCamera={() => setShowCamera(true)}
                        />

                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="button"
                                onClick={handleSaveAndLeave}
                                className="bg-[#2C3E30] text-[#EAE8E4] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2C3E30]/10 flex items-center gap-2"
                            >
                                <Save size={16} /> Save & Leave
                            </button>
                            <button
                                type="submit"
                                className="bg-[#2C3E30] text-[#EAE8E4] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2C3E30]/10 flex items-center gap-2"
                            >
                                Save & Continue <ArrowLeft size={16} className="rotate-180" />
                            </button>
                        </div>

                    </form>
                </div>

                {/* RIGHT: SUMMARY CARD */}
                <div className="hidden lg:col-span-2 lg:block">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-[#212E24] rounded-2xl overflow-hidden shadow-2xl text-[#EAE8E4]">
                            <div className="h-40 relative">
                                <img src={bookingData.image} alt="Property" className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#212E24] to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="font-serif text-xl">{bookingData.title}</h3>
                                    <div className="flex items-center gap-1 text-xs text-[#EAE8E4]/80 mt-1 font-medium tracking-wide">
                                        <MapPin size={12} className="text-white/60" />
                                        <span>{bookingData.city || bookingData.location || "Berlin, Germany"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 text-xs">
                                {/* DATES - BOOKING WIDGET STYLE */}
                                <div className="flex mb-2 relative z-20 bg-[#F5F5F0]/10 border border-white/10 rounded-2xl shadow-sm">
                                    {/* MOVE-IN */}
                                    <div className="w-1/2 border-r border-white/10 relative p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="text-white/60">
                                                <Calendar size={18} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <span className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-0.5">
                                                    Move In
                                                </span>
                                                <span className="text-sm font-medium leading-none text-[#EAE8E4]">
                                                    {bookingData.checkIn}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MOVE-OUT */}
                                    <div className="w-1/2 relative p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="text-white/60">
                                                <Calendar size={18} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <span className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-0.5">
                                                    Move Out
                                                </span>
                                                <span className="text-sm font-medium leading-none text-[#EAE8E4]">
                                                    {bookingData.checkOut}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {durationText && (
                                    <div className="bg-[#2C3E30]/60 p-3 rounded-xl mb-4 text-center border border-white/5">
                                        <span className="text-xs font-medium text-[#EAE8E4]/80">Duration: <span className="text-white">{durationText}</span></span>
                                    </div>
                                )}

                                <div className="space-y-2 pb-2 border-t border-white/10 pt-4">
                                    <div className="flex justify-between text-xs">
                                        <span className="opacity-60">Base Rent</span>
                                        <span className="font-medium">€{bookingData.monthlyTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="opacity-60">Utilities & Services</span>
                                        <span className="font-medium">€{utilitiesFee}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-white/10 mt-2">
                                        <span className="font-bold text-[#EAE8E4]">Total Monthly</span>
                                        <span className="font-bold text-white">€{totalMonthly}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 text-center">
                                <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Application Status</p>
                                <p className="text-sm font-bold text-yellow-400 mt-1">Incomplete</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-[#2C3E30]/5 shadow-sm">
                            <h4 className="font-bold text-[#2C3E30] mb-2 text-sm">Need Help?</h4>
                            <p className="text-xs text-[#2C3E30]/60 leading-relaxed mb-4">
                                If you have questions about the application process, our support team is available 24/7.
                            </p>
                            <button className="w-full py-2 border border-[#2C3E30]/10 rounded-lg text-xs font-bold uppercase tracking-widest text-[#2C3E30]/60 hover:bg-[#F5F5F0] transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* CAMERA OVERLAY */}
            {showCamera && (
                <CameraModal
                    onClose={() => setShowCamera(false)}
                    onConfirm={handleCameraConfirm}
                />
            )}

            {/* CUTE MODAL */}
            <AnimatePresence>
                {modal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        onClick={() => { setModal(null); navigate('/profile'); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* ICON */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${modal === 'submitted'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-amber-50 text-amber-500'
                                }`}>
                                {modal === 'submitted'
                                    ? <PartyPopper size={28} />
                                    : <Bookmark size={28} />
                                }
                            </div>

                            {/* TEXT */}
                            <h3 className="font-serif text-xl font-bold text-[#2C3E30] mb-2">
                                {modal === 'submitted' ? 'Application Submitted!' : 'Draft Saved!'}
                            </h3>
                            <p className="text-sm text-[#2C3E30]/60 leading-relaxed mb-6">
                                {modal === 'submitted'
                                    ? 'Your application has been submitted successfully. We\'ll review it and get back to you soon! ✨'
                                    : 'Your progress has been saved. You can come back anytime to pick up where you left off 💾'
                                }
                            </p>

                            {/* BUTTON */}
                            <button
                                onClick={() => { setModal(null); navigate('/profile'); }}
                                className="w-full py-3.5 bg-[#2C3E30] text-[#EAE8E4] rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2C3E30]/20"
                            >
                                {modal === 'submitted' ? 'Back to Profile' : 'Got it!'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default UserDetails;


