import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Star,
  Share2,
  Heart,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useProperty } from "@/supabase/hooks/useProperty";
import { useWishlist } from "@/context/WishlistContext";

import PropertyGallery from "../components/property/PropertyGallery";
import BookingWidget from "../components/property/BookingWidget";
import PropertyStats from "../components/property/PropertyStats";
import Neighborhood from "../components/property/Neighborhood";
import PropertyDetailsSkeleton from "../components/skeletons/PropertyDetailsSkeleton";

import AmenitiesSection from "../components/property/AmenitiesSection";
import ResidentGuidelinesSection from "../components/property/ResidentGuidelinesSection";
import ReviewsMetricsSection from "../components/property/ReviewsMetricsSection";
import PriceBreakdownSection from "../components/property/PriceBreakdownSection";

// Extracted sub-components
import DescriptionSection from "../components/property/DescriptionSection";
import StickyNav from "../components/property/StickyNav";
import AvailabilityBadge from "../components/property/AvailabilityBadge";
import SimilarProperties from "../components/property/SimilarProperties";
import ApplicationDetailsSection from "../components/property/ApplicationDetailsSection";

// =========================
// SECTION IDS (stable ref)
// =========================
const SECTION_IDS = ["about", "amenities", "policies", "details", "price", "neighborhood"];

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { property, loading } = useProperty(id);

  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [copied, setCopied] = useState(false);

  // SECTION OBSERVER FOR STICKY NAV
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -70% 0px",
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    SECTION_IDS.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [property]);

  // Stable callbacks
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: property?.title || 'Property', url });
      } catch (err) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [property?.title]);

  const handleToggleWishlist = useCallback(() => {
    toggleWishlist(property);
  }, [toggleWishlist, property]);

  const openDescriptionModal = useCallback(() => {
    setIsDescriptionModalOpen(true);
  }, []);

  const closeDescriptionModal = useCallback(() => {
    setIsDescriptionModalOpen(false);
  }, []);

  const openBooking = useCallback(() => {
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Memoized gallery images array
  const galleryImages = useMemo(() => {
    if (!property) return [];
    return [property.cover_image, ...(property.gallery || [])].filter(Boolean);
  }, [property?.cover_image, property?.gallery]);

  // Memoized total price
  const totalPrice = useMemo(() => {
    if (!property) return 0;
    return (Number(property.price) + Number(property.utilities)).toLocaleString();
  }, [property?.price, property?.utilities]);

  const wishlisted = isInWishlist(property?.id);

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EAE8E4]">
        <h2 className="text-2xl font-serif text-[#2C3E30] mb-4">
          Property not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm underline font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE8E4] pb-72 md:pb-20">
      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto">

        {/* NAVIGATION: Back Button & Breadcrumbs */}
        <div className="mb-6 space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2C3E30]/60 hover:text-[#2C3E30] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="text-[#2C3E30]/40">/</span>
            <Link to="/cities" className="hover:underline">Cities</Link>
            {property?.city && (
              <>
                <span className="text-[#2C3E30]/40">/</span>
                <Link to={`/search?city=${property.city}`} className="hover:underline">
                  {property.city}
                </Link>
              </>
            )}
            {property?.title && (
              <>
                <span className="text-[#2C3E30]/40">/</span>
                <span className="text-[#2C3E30]/50 truncate max-w-[300px]" title={property.title}>
                  {property.title}
                </span>
              </>
            )}
          </div>
        </div>

        {/* --- GRID HEADER ROW (Tags & Static Actions) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-6">
          {/* LEFT: Status Tags (8 cols) */}
          <div className="lg:col-span-8 flex flex-wrap items-center gap-2">
            <AvailabilityBadge availability={property.availability} />

            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2C3E30] border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#EAE8E4] shadow-md hover:bg-[#324536] transition-colors cursor-default">
              <ShieldCheck size={12} className="text-[#CAA472]" />
              <span>Official Arrivio Residence</span>
            </span>

            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-[#2C3E30]/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#2C3E30] shadow-sm">
              <Star size={12} className="fill-emerald-500 text-emerald-500" />
              <span className="text-[#2C3E30]">{property.rating || "4.8"}</span>
              <span className="text-[#2C3E30]/40 font-medium">({property.reviews_count || "12"})</span>
            </span>
          </div>

          {/* RIGHT: Static Action Icons (4 cols) */}
          <div className="lg:col-span-4 flex items-center justify-end gap-3 px-1">
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white border border-[#2C3E30]/10 shadow-sm hover:shadow-md transition-all group"
                title="Share Property"
              >
                <Share2 size={16} className="text-[#2C3E30] group-hover:scale-110 transition-transform" />
              </button>
              {copied && (
                <span className="absolute -bottom-10 right-0 text-[10px] font-bold uppercase tracking-wider text-[#2C3E30] bg-white px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap z-50 border border-[#2C3E30]/5">
                  Copied!
                </span>
              )}
            </div>

            <button
              onClick={handleToggleWishlist}
              className="p-2.5 rounded-full bg-white border border-[#2C3E30]/10 shadow-sm hover:shadow-md transition-all group"
              title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart
                size={16}
                className={`transition-all ${wishlisted
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-[#2C3E30] group-hover:text-red-500 group-hover:scale-110"
                  }`}
              />
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 transition-all duration-500">

          {/* LEFT: MAIN CONTENT AREA (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. GALLERY */}
            <div className="relative group/gallery">
              <PropertyGallery
                images={galleryImages}
                title={property.title}
                rating={property.rating}
                property={property}
              />
            </div>

            {/* 2. HEADER INFO */}
            <div className="space-y-4">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-serif text-[#2C3E30] tracking-tight leading-tight">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-[#2C3E30]/60 font-medium pb-4">
                  <MapPin size={18} className="text-[#2C3E30]/40" />
                  <span className="underline decoration-[#2C3E30]/20 underline-offset-4 decoration-2">
                    {property.address || `${property.city}, Germany`}
                  </span>
                </div>
              </div>

              {/* 3. CORE STATS */}
              <div className="pt-2">
                <PropertyStats
                  details={property.details}
                  propertyType={property.category}
                  rating={property.rating}
                  furnishing={property.furnishing}
                  capacity={property.capacity}
                />
              </div>
            </div>

            {/* STICKY SECTION NAV */}
            <StickyNav activeSection={activeSection} />

            {/* 4. DESCRIPTION + HOST CARD */}
            <DescriptionSection property={property} onOpenModal={openDescriptionModal} />

            {/* 5. AMENITIES */}
            <AmenitiesSection
              property={property}
              isAmenitiesOpen={isAmenitiesOpen}
              setIsAmenitiesOpen={setIsAmenitiesOpen}
            />

            {/* 6. POLICIES & GUIDELINES */}
            <ResidentGuidelinesSection />

            {/* 6.5. APPLICATION DETAILS */}
            <ApplicationDetailsSection />

            {/* 7. PRICE BREAKDOWN */}
            <PriceBreakdownSection property={property} />

            {/* 8. NEIGHBORHOOD */}
            <div id="neighborhood" className="pt-10 border-t border-[#2C3E30]/10 scroll-mt-40">
              <Neighborhood property={property} />
            </div>

            {/* 9. EXPERIENCE & PROOF */}
            <ReviewsMetricsSection property={property} />

            {/* 10. SIMILAR PROPERTIES */}
            <SimilarProperties />
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-[96px] bottom-10 transition-all duration-300 mt-12 lg:mt-0 space-y-6">
              <BookingWidget property={property} />
            </div>
          </div>
        </div>

        {/* --- MOBILE STICKY BOOKING BAR --- */}
        <div className="lg:hidden fixed bottom-20 left-0 right-0 z-[80] bg-white/95 backdrop-blur-xl border-t border-[#2C3E30]/10 p-4 flex items-center justify-between shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-serif font-bold text-[#2C3E30]">€{totalPrice}</span>
              <span className="text-[10px] font-medium text-[#2C3E30]/60">/ month</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mt-0.5">All bills included</p>
          </div>
          <button
            onClick={openBooking}
            className="px-8 py-3.5 bg-[#2C3E30] text-[#EAE8E4] rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            Start Application
          </button>
        </div>

        {/* --- MOBILE BOOKING MODAL --- */}
        <AnimatePresence>
          {isBookingOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden flex items-end justify-center"
              onClick={closeBooking}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#EAE8E4] w-full max-h-[90vh] rounded-t-[2.5rem] overflow-y-auto"
              >
                <div className="flex justify-center p-4">
                  <div className="w-12 h-1 bg-[#2C3E30]/10 rounded-full" />
                </div>

                <div className="p-4 pb-12">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="font-serif text-2xl text-[#2C3E30]">Reserve Home</h3>
                    <button
                      onClick={closeBooking}
                      className="p-2 bg-[#2C3E30]/5 rounded-full"
                    >
                      <X size={18} className="text-[#2C3E30]" />
                    </button>
                  </div>

                  <BookingWidget property={property} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DESCRIPTION MODAL */}
        <AnimatePresence>
          {isDescriptionModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDescriptionModal}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#EAE8E4] w-full max-w-2xl max-h-[80vh] rounded-[2rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col border border-white/20"
              >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-[#2C3E30]/5 flex items-center justify-between bg-white/60 backdrop-blur-xl sticky top-0 z-10">
                  <div>
                    <h3 className="font-serif text-xl text-[#2C3E30] tracking-tight">About this home</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-5 h-[1px] bg-[#CAA472]"></span>
                      <p className="text-[9px] text-[#CAA472] font-bold uppercase tracking-[0.2em]">The Arrivio Collection</p>
                    </div>
                  </div>
                  <button
                    onClick={closeDescriptionModal}
                    className="p-2 bg-white hover:bg-[#2C3E30] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#2C3E30]/5 group"
                  >
                    <X size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="px-6 py-6 md:px-8 md:py-8 overflow-y-auto flex-1 arrivio-scrollbar">
                  <p className="text-[#2C3E30]/80 text-[15px] leading-[1.75] font-medium whitespace-pre-line tracking-tight">
                    {property.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyDetails;
