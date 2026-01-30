import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Building2, CheckCircle, 
  Monitor, Armchair, Tv, Waves, Sofa, 
  ArrowUpFromLine, Lock, Bike, Mail, Sparkles,
  Star, Baby, Dog, Ban, Cigarette, FileText, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTS ---
import { API_BASE_URL } from '../config';
import PropertyGallery from '../components/property/PropertyGallery';
import BookingWidget from '../components/property/BookingWidget';
import PropertyStats from '../components/property/PropertyStats';
import Neighborhood from '../components/property/Neighborhood';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => { 
      window.scrollTo(0, 0); 
      fetch(`${API_BASE_URL}/properties/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Property not found') {
                setProperty(null);
            } else {
                setProperty(data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EAE8E4]">Loading...</div>;

  if (!property) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#EAE8E4]">
              <h2 className="text-2xl font-serif text-[#2C3E30] mb-4">Property not found</h2>
              <button onClick={() => navigate(-1)} className="text-sm underline font-bold">Go Back</button>
          </div>
      );
  }

  const getAmenityIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('internet') || n.includes('wifi')) return <Wifi size={16} />;
    if (n.includes('monitor')) return <Monitor size={16} />;
    if (n.includes('chair') || n.includes('desk')) return <Armchair size={16} />;
    if (n.includes('tv')) return <Tv size={16} />;
    if (n.includes('cleaning')) return <Sparkles size={16} />;
    if (n.includes('washer') || n.includes('laundry')) return <Waves size={16} />;
    if (n.includes('furnished')) return <Sofa size={16} />;
    if (n.includes('elevator')) return <ArrowUpFromLine size={16} />;
    if (n.includes('secure')) return <Lock size={16} />;
    if (n.includes('bike')) return <Bike size={16} />;
    if (n.includes('mail')) return <Mail size={16} />;
    return <CheckCircle size={16} />;
  };

  const amenityCategories = [
    { title: "Productivity", items: ["Fiber Internet", "Dedicated Desk", "Ergonomic Chair", "Monitor"] },
    { title: "Living", items: ["Weekly Cleaning", "Smart TV", "Washer/Dryer", "Fully Furnished"] },
    { title: "Building", items: ["Elevator", "Secure Entry", "Bike Storage", "Mail Service"] }
  ];

  return (
    <div className="min-h-screen bg-[#EAE8E4] pb-20">
      
      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto">
        
        {/* NAV / BREADCRUMBS */}
        <div className="flex items-center gap-4 mb-6">
           <button onClick={() => navigate(-1)} className="p-2 bg-white/50 backdrop-blur border border-white/50 rounded-full hover:bg-white hover:shadow-sm transition-all group">
                <ArrowLeft size={16} className="text-[#2C3E30] group-hover:-translate-x-0.5 transition-transform" />
           </button>
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/60">
                <Link to="/" className="hover:text-[#2C3E30] transition-colors">Home</Link> / <span className="text-[#2C3E30]">{property.city}</span>
           </div>
        </div>

        {/* GALLERY */}
        <div className="mb-5">
            <PropertyGallery images={property.gallery || [property.image]} />
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Header & Stats */}
            <div>
                <h1 className="text-3xl md:text-5xl font-serif font-medium text-[#2C3E30] mb-4 leading-tight">{property.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3 text-[#2C3E30]/70 text-xs font-medium">
                   <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 border border-white/50 rounded-full">
                        <MapPin size={12}/> {property.city} Center
                   </span>
                   <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 border border-white/50 rounded-full">
                        <Star size={12} className="fill-[#C2B280] text-[#C2B280]"/> {property.rating} (Exquisite)
                   </span>
                   <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 border border-white/50 rounded-full">
                        <Building2 size={12}/> Managed by Arrivio
                   </span>
                </div>
                
                <PropertyStats details={property.details} />
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-[#2C3E30]/10"> 
                <h3 className="font-serif text-2xl text-[#2C3E30] mb-4 pt-8">About this home</h3>
                
                <motion.div 
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 100 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="relative overflow-hidden"
                >
                    <p className="text-[#2C3E30]/80 text-sm leading-7 font-medium font-sans">
                        Relocate without the stress. This Arrivio apartment is fully furnished, managed, and equipped for immediate move-in. 
                        We handle the paperwork, utilities, and internet setup so you can focus on your new job from day one.
                        <br/><br/>
                        <span className="text-[#2C3E30] font-bold bg-white/50 px-1 rounded">Anmeldung is guaranteed</span> with this rental contract, allowing you to register with the city immediately.
                        <br/><br/>
                        The living area features a custom-designed sofa, 55" Smart TV, and a dining area that doubles as a workspace. The kitchen is fully stocked with premium appliances, Nespresso machine, and cooking essentials.
                    </p>
                    
                    <AnimatePresence>
                        {!isExpanded && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#EAE8E4] to-transparent"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="mt-4 text-[#2C3E30] font-bold text-[10px] uppercase tracking-widest border-b border-[#2C3E30] hover:opacity-70 transition-opacity"
                >
                    {isExpanded ? "Show Less" : "Read More"}
                </button>
            </div>

            {/* Amenities */}
            <div className="pt-8 border-t border-[#2C3E30]/10">
                <h3 className="font-serif text-2xl text-[#2C3E30] mb-8 pt-4">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {amenityCategories.map((cat, i) => (
                        <div key={i}>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/50 mb-4">{cat.title}</h4>
                            <ul className="space-y-3">
                                {cat.items.map((item, j) => (
                                    <li key={j} className="flex items-center gap-3 text-[#2C3E30] text-sm group">
                                        <div className="w-8 h-8 rounded-full bg-white/50 border border-white/50 flex items-center justify-center text-[#2C3E30] group-hover:border-[#2C3E30] transition-colors">
                                            {getAmenityIcon(item)}
                                        </div>
                                        <span className="font-medium opacity-80 group-hover:opacity-100 transition-opacity">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Things to Know */}
            <div className="pt-8 border-t border-[#2C3E30]/10">
                <h3 className="font-serif text-2xl text-[#2C3E30] mb-8 pt-4">Things to know</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mb-8">
                    <div className="flex items-center gap-3"><Baby size={18} className="text-[#2C3E30]/60"/> <span className="text-sm text-[#2C3E30]/80 font-medium">Suitable for children</span></div>
                    <div className="flex items-center gap-3"><Dog size={18} className="text-[#2C3E30]/60"/> <span className="text-sm text-[#2C3E30]/80 font-medium">Pets allowed</span></div>
                    <div className="flex items-center gap-3"><Ban size={18} className="text-[#2C3E30]/60"/> <span className="text-sm text-[#2C3E30]/80 font-medium">No parties or events</span></div>
                    <div className="flex items-center gap-3"><Cigarette size={18} className="text-[#2C3E30]/60"/> <span className="text-sm text-[#2C3E30]/80 font-medium">No smoking allowed</span></div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white/40 border border-white/60 rounded-xl shadow-sm hover:border-[#2C3E30]/20 transition-colors cursor-default">
                    <FileText size={20} className="text-[#2C3E30] shrink-0 mt-0.5"/>
                    <p className="text-[#2C3E30]/80 text-xs leading-relaxed">
                        In any case, we will refund 100% of the payment (excl. card processing fees) if you cancel the booking 30+ days before moving in.
                    </p>
                </div>
            </div>

            {/* Neighborhood */}
            <div className="pt-8 border-t border-[#2C3E30]/10">
                {/* --- FIX IS HERE: Passing 'property' instead of 'city' --- */}
                <Neighborhood property={property} />
            </div>

          </div>

          {/* RIGHT COLUMN (Sticky Widget) */}
          <div className="lg:col-span-5 relative">
             <div className="sticky top-24 h-fit">
                {/* 👇 UPDATED WIDGET USAGE 👇 */}
                <BookingWidget 
                  price={property.price} 
                  title={property.title}
                  image={property.image}
                />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;