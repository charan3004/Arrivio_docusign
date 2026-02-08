import React from "react";

const Schedule = () => {
  return (
    <section
      id="schedule"
      className="bg-[#EAE8E4] py-28 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#F5F5F0]/60 backdrop-blur-md rounded-3xl p-10 md:p-16 border border-white/60 shadow-xl">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              <span>Schedule a Meeting with </span>
              <span className="italic text-[#2C3E30]">
                ARRIVIO
              </span>
            </h2>

            <p className="font-sans text-sm md:text-base text-[#5C5C50] max-w-2xl mx-auto leading-relaxed">
              Book a quick call with our team to discuss partnerships, housing
              solutions, or next steps with Arrivio.
            </p>
          </div>

          {/* CAL.COM IFRAME */}
          <div className="max-w-6xl mx-auto mt-16 px-4">
            <iframe
              src="https://cal.com/arrivio-wwthvc/arrivio-strategy-call?theme=light&primaryColor=%231A2E22"
              title="Arrivio Strategy Call"
              className="w-full h-[750px] rounded-2xl border border-black/10 bg-white"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Schedule;
