import React from "react";
import { ArrowRight, Download } from "lucide-react";
import meetImage from "../../assets/business/meet.jpg";

const HeroSection = () => {
    const handleScrollToSchedule = () => {
        const section = document.getElementById("schedule");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="bg-[#EAE8E4] pt-20 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* LEFT */}
                <div>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-[#1A1A1A] mb-6">
                        Simplifying <br />
                        <span className="italic text-[#2C3E30]">
                            Global Relocation.
                        </span>
                    </h1>

                    <p className="font-sans text-lg text-[#5C5C50] max-w-xl mb-10 leading-relaxed">
                        The end-to-end housing solution for international relocation.
                        Reserve capacity in advance and eliminate housing bottlenecks
                        for your new hires.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">

                        {/* Partner with Us */}
                        <button
                            onClick={handleScrollToSchedule}
                            className="group inline-flex items-center justify-center gap-3 px-8 py-4 
              bg-[#2C3E30] text-[#EAE8E4] border border-[#2C3E30] 
              rounded-full transition-all duration-300 
              hover:bg-[#1A2E22] hover:border-[#1A2E22] 
              shadow-lg hover:shadow-xl w-full sm:w-auto"
                        >
                            <span className="font-serif text-base font-medium tracking-wide">
                                Partner with Us
                            </span>

                            <div className="w-6 h-6 rounded-full bg-white/20 
                flex items-center justify-center 
                transition-all duration-300 
                group-hover:bg-white/30"
                            >
                                <ArrowRight size={12} />
                            </div>
                        </button>

                        {/* Download Company Deck */}
                        <a
                            href="/arrivio-b2b-deck.pdf"
                            download
                            className="group inline-flex items-center justify-center gap-3 px-8 py-4 
              bg-transparent text-[#2C3E30] border-2 border-[#2C3E30] 
              rounded-full transition-all duration-300 
              hover:bg-[#2C3E30] hover:text-[#EAE8E4] 
              shadow-md hover:shadow-lg w-full sm:w-auto"
                        >
                            <span className="font-serif text-base font-medium tracking-wide">
                                Download Company Deck
                            </span>

                            <Download size={18} />
                        </a>

                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-full h-[420px] md:h-[520px] rounded-[2.5rem] overflow-hidden shadow-2xl border-[1px] border-white/30">
                    <img
                        src={meetImage}
                        alt="Arrivio business meeting"
                        className="w-full h-full object-cover"
                    />
                </div>

            </div>
        </section>
    );
};

export default HeroSection;

