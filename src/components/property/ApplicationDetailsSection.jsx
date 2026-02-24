import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap,
    Briefcase,
    Users,
    Download,
    ArrowRight,
    Info,
    FileText,
    UserCheck,
    CreditCard,
    Shield,
    Home
} from "lucide-react";

/**
 * ApplicationDetailsSection
 * Displays required documents based on resident type (Student, Professional, Family).
 */
const ApplicationDetailsSection = () => {
    const [residentType, setResidentType] = useState("student");

    const documentProfiles = {
        student: [
            {
                title: "University Enrollment",
                description: "Official certificate of enrollment or letter of acceptance from your university.",
                icon: <GraduationCap className="text-blue-500" size={20} />,
            },
            {
                title: "Identity Verification",
                description: "A valid Passport or National ID card from your home country.",
                icon: <UserCheck className="text-emerald-500" size={20} />,
            },
            {
                title: "Financial Proof",
                description: "Blocked account statement, scholarship letter, or 3 months of bank statements.",
                icon: <CreditCard className="text-amber-500" size={20} />,
            },
            {
                title: "Visa / Residence Permit",
                description: "Your valid German student visa or temporary residence permit (if applicable).",
                icon: <FileText className="text-purple-500" size={20} />,
            }
        ],
        professional: [
            {
                title: "Employment Contract",
                description: "A signed copy of your current employment contract in Germany.",
                icon: <Briefcase className="text-blue-500" size={20} />,
            },
            {
                title: "Last 3 Pay Slips",
                description: "Proof of consistent income from the last three consecutive months.",
                icon: <CreditCard className="text-emerald-500" size={20} />,
            },
            {
                title: "Identity Verification",
                description: "A valid Passport or National ID card.",
                icon: <UserCheck className="text-amber-500" size={20} />,
            },
            {
                title: "Schufa Record",
                description: "A current credit report proving a positive payment history in Germany.",
                icon: <Shield className="text-purple-500" size={20} />,
            }
        ],
        family: [
            {
                title: "Family Proof of Income",
                description: "Combined employment contracts and pay slips for all household earners.",
                icon: <Home className="text-blue-500" size={20} />,
            },
            {
                title: "Members Identification",
                description: "Valid Passports or ID cards for every family member moving in.",
                icon: <Users className="text-emerald-500" size={20} />,
            },
            {
                title: "Tenancy History",
                description: "A certificate of rent paid (Mietschuldenfreiheitsbescheinigung) if applicable.",
                icon: <FileText className="text-amber-500" size={20} />,
            },
            {
                title: "Proof of Relationship",
                description: "Marriage certificate or birth certificates for children if requested.",
                icon: <UserCheck className="text-purple-500" size={20} />,
            }
        ]
    };

    const tabs = [
        { id: "student", label: "Student", icon: <GraduationCap size={14} /> },
        { id: "professional", label: "Professional", icon: <Briefcase size={14} /> },
        { id: "family", label: "Family", icon: <Users size={14} /> }
    ];

    return (
        <div id="details" className="pt-16 border-t border-[#2C3E30]/10 scroll-mt-40">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                <div className="space-y-3">
                    <h3 className="font-serif text-3xl text-[#2C3E30]">Application Details</h3>
                    <p className="text-xs text-[#2C3E30]/50 font-bold uppercase tracking-widest leading-relaxed max-w-xl">
                        Select your profile to view the specific documents required for this residency.
                    </p>
                </div>
            </div>

            {/* Profile Selector Tabs & Global Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex p-1.5 bg-[#F9F8F6] border border-[#2C3E30]/5 rounded-2xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setResidentType(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${residentType === tab.id
                                ? "bg-white text-[#2C3E30] shadow-sm ring-1 ring-[#2C3E30]/5"
                                : "text-[#2C3E30]/40 hover:text-[#2C3E30]/60"
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#2C3E30]/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#2C3E30] hover:bg-[#2C3E30] hover:text-white transition-all shadow-sm ml-auto">
                    <Download size={14} />
                    <span>Download Checklist</span>
                </button>
            </div>

            {/* Documents Grid with Animation */}
            <div className="relative">

                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {/* ... existing motion logic ... */}
                        <motion.div
                            key={residentType}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                            {documentProfiles[residentType].map((doc, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 bg-white/40 border border-[#2C3E30]/5 rounded-[2.5rem] transition-all group lg:p-8"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="p-4 bg-[#EAE8E4] rounded-2xl transition-all duration-500">
                                            {doc.icon}
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            <h4 className="text-sm font-bold text-[#2C3E30]">
                                                {doc.title}
                                            </h4>
                                            <p className="text-xs text-[#2C3E30]/60 leading-relaxed font-medium">
                                                {doc.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Information Note - Centered and narrowed */}
                <div className="mt-8 flex items-center gap-4 px-6 py-4 bg-emerald-50/50 border border-emerald-100/50 rounded-3xl max-w-md mx-auto">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                        <Info size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-[#2C3E30]/70 font-medium leading-relaxed">
                            <span className="font-bold text-[#2C3E30]">Ready to apply?</span> Download the full document checklist for your records.
                        </p>
                        <p className="text-[9px] text-[#2C3E30]/50 font-bold uppercase tracking-widest">
                            Estimated time to complete application: 10-15 minutes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsSection;
