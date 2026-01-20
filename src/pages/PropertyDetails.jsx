import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Building2, CheckCircle, 
  Clock, Ban, Cigarette, HelpCircle, Star,
  Baby, Dog, FileText, 
  // NEW ICONS FOR AMENITIES
  Wifi, Monitor, Armchair, Tv, Waves, Sofa, 
  ArrowUpFromLine, Lock, Bike, Mail, Sparkles
} from 'lucide-react';

// --- IMPORTS ---
import { allProperties } from '../data/mockProperties'; 
import PropertyGallery from '../components/property/PropertyGallery';
import BookingWidget from '../components/property/BookingWidget';
import PropertyStats from '../components/property/PropertyStats';
import Neighborhood from '../components/property/Neighborhood';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const property = allProperties.find(p => p.id === parseInt(id));

  if (!property) return null;

  // --- SMART ICON MAPPING HELPER ---
  const getAmenityIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('internet') || n.includes('wifi')) return <Wifi size={18} />;
    if (n.includes('monitor')) return <Monitor size={18} />;
    if (n.includes('chair') || n.includes('desk')) return <Armchair size={18} />;
    if (n.includes('tv')) return <Tv size={18} />;
    if (n.includes('cleaning')) return <Sparkles size={18} />;
    if (n.includes('washer') || n.includes('laundry')) return <Waves size={18} />;
    if (n.includes('furnished')) return <Sofa size={18} />;
    if (n.includes('elevator')) return <ArrowUpFromLine size={18} />;
    if (n.includes('secure')) return <Lock size={18} />;
    if (n.includes('bike')) return <Bike size={18} />;
    if (n.includes('mail')) return <Mail size={18} />;
    return <CheckCircle size={18} />; // Fallback
  };

  const amenityCategories = [
    { title: "Productivity", items: ["Fiber Internet", "Dedicated Desk", "Ergonomic Chair", "Monitor"] },
    { title: "Living", items: ["Weekly Cleaning", "Smart TV", "Washer/Dryer", "Fully Furnished"] },
    { title: "Building", items: ["Elevator", "Secure Entry", "Bike Storage", "Mail Service"] }
  ];

  const faqs = [
    { q: "Is Anmeldung possible?", a: "Yes, we provide the Wohnungsgeberbestätigung immediately upon move-in." },
    { q: "Cancellation policy?", a: "Flexible cancellation up to 7 days before move-in." },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* NAV */}
        <div className="flex items-center gap-4 mb-4">
           <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-100 rounded-full hover:shadow-md transition-all">
                <ArrowLeft size={16} className="text-[#1A1A1A]" />
           </button>
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5C5C50]">
                <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black">{property.city}</span>
           </div>
        </div>

        {/* GALLERY */}
        <PropertyGallery images={property.gallery} />

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header & Stats */}
            <div>
                <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">{property.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-[#5C5C50] text-xs font-medium mb-6">
                   <span className="flex items-center gap-1.5"><MapPin size={14}/> {property.city} Center</span>
                   <span className="flex items-center gap-1.5"><Building2 size={14}/> Managed by Arrivio</span>
                   <span className="flex items-center gap-1.5"><Star size={14} className="fill-[#2C3E30] text-[#2C3E30]"/> {property.rating} (Verified)</span>
                </div>
                
                <PropertyStats details={property.details} />
            </div>

            {/* Description */}
            <div>
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-3">About this home</h3>
                <div className={`relative overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-full' : 'max-h-24'}`}>
                    <p className="text-[#5C5C50] text-sm leading-7">
                        Relocate without the stress. This Arrivio apartment is fully furnished, managed, and equipped for immediate move-in. 
                        We handle the paperwork, utilities, and internet setup so you can focus on your new job from day one.
                        <br/><br/>
                        <b>Anmeldung is guaranteed</b> with this rental contract, allowing you to register with the city immediately.
                    </p>
                    {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAFAFA] to-transparent"></div>}
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-[#2C3E30] font-bold text-xs uppercase tracking-widest border-b border-[#2C3E30]">
                    {isExpanded ? "Show Less" : "Read More"}
                </button>
            </div>

            {/* --- UPDATED AMENITIES SECTION --- */}
            <div className="border-t border-gray-100 pt-8">
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-6">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {amenityCategories.map((cat, i) => (
                        <div key={i}>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#5C5C50] mb-3">{cat.title}</h4>
                            <ul className="space-y-3">
                                {cat.items.map((item, j) => (
                                    <li key={j} className="flex items-center gap-3 text-[#1A1A1A] text-sm group">
                                        {/* Dynamic Icon Call */}
                                        <div className="text-[#2C3E30] opacity-80 group-hover:opacity-100 transition-opacity">
                                            {getAmenityIcon(item)}
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Things to Know */}
            <div className="border-t border-gray-100 pt-8">
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-6">Things to know</h3>
                
                <h4 className="text-sm font-bold text-[#1A1A1A] mb-4 uppercase tracking-wide opacity-60">House rules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mb-8">
                    <div className="flex items-center gap-3"><Baby size={20} className="text-[#1A1A1A]"/> <span className="text-sm text-[#1A1A1A] font-medium">Suitable for children</span></div>
                    <div className="flex items-center gap-3"><Dog size={20} className="text-[#1A1A1A]"/> <span className="text-sm text-[#1A1A1A] font-medium">Pets allowed</span></div>
                    <div className="flex items-center gap-3"><Ban size={20} className="text-[#1A1A1A]"/> <span className="text-sm text-[#1A1A1A] font-medium">No parties or events</span></div>
                    <div className="flex items-center gap-3"><Cigarette size={20} className="text-[#1A1A1A]"/> <span className="text-sm text-[#1A1A1A] font-medium">No smoking allowed</span></div>
                </div>

                <h4 className="text-sm font-bold text-[#1A1A1A] mb-4 uppercase tracking-wide opacity-60">Cancellation</h4>
                <div className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <FileText size={20} className="text-[#1A1A1A] shrink-0 mt-0.5"/>
                    <p className="text-[#5C5C50] text-xs leading-relaxed">
                        In any case, we will refund 100% of the payment (excl. card processing fees) if you cancel the booking 30+ days before moving in.
                    </p>
                </div>
            </div>

            {/* Neighborhood & FAQ */}
            <div className="border-t border-gray-100 pt-8">
                <Neighborhood city={property.city} />
            </div>

            <div className="border-t border-gray-100 pt-8">
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">FAQ</h3>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="group">
                            <h4 className="text-sm font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
                                <HelpCircle size={14} className="text-[#5C5C50]"/> {faq.q}
                            </h4>
                            <p className="text-xs text-[#5C5C50] pl-6">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-4">
             <BookingWidget price={property.price} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;