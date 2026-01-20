import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-softWhite pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4">Contact</h1>
        <p className="text-[#5C5C50] leading-relaxed mb-6">
          This is a placeholder page. Add your contact form or contact details here.
        </p>
        <div className="bg-white/60 border border-white/60 rounded-2xl p-6">
          <p className="text-[#1A1A1A] font-bold mb-1">Email</p>
          <p className="text-[#5C5C50]">hello@arrivio.example</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

