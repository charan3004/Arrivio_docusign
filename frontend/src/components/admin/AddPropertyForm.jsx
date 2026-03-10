import { useState } from "react";
import { supabase } from "../../supabase/client";
import { AMENITY_OPTIONS } from "../../data/amenities";
import { PROPERTY_TYPES } from "../../data/propertyTypes";


/* ======================
   UI HELPERS (SAME AS EDIT)
====================== */
const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3E6B4E] transition";

export default function AddPropertyForm({ onSuccess }) {

  /* ======================
     STATES
  ====================== */
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");

  const [utilities, setUtilities] = useState("");
  const [bookingFee, setBookingFee] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [minStayNights, setMinStayNights] = useState("31");

  const [image, setImage] = useState("");
  const [gallery, setGallery] = useState(""); // ✅ NEW
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [amenities, setAmenities] = useState({
    productivity: [],
    living: [],
    building: [],
  });

  const [thingsToKnow, setThingsToKnow] = useState({
    rules: [],
    cancellation: "",
  });

  const [details, setDetails] = useState({
    beds: "",
    baths: "",
    size: "",
    floor: "",
  });

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [status, setStatus] = useState("available");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ======================
     HELPERS
  ====================== */
  /* ======================
     HELPERS
  ====================== */
  const handleAmenityToggle = (type, value) => {
    setAmenities((prev) => {
      const currentList = prev[type] || [];
      const exists = currentList.includes(value);

      return {
        ...prev,
        [type]: exists
          ? currentList.filter((item) => item !== value)
          : [...currentList, value],
      };
    });
  };

  const handleRulesChange = (value) => {
    setThingsToKnow((prev) => ({
      ...prev,
      rules: value.split(",").map((v) => v.trim()).filter(Boolean),
    }));
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      type: propertyType,
      city,
      price: Number(price),
      rating: rating ? Number(rating) : null,

      utilities: Number(utilities) || 0,
      booking_fee: Number(bookingFee) || 0,
      cleaning_fee: Number(cleaningFee) || 0,
      security_deposit: Number(securityDeposit) || 0,
      min_stay_nights: Number(minStayNights) || 31,

      cover_image: image || null,
      gallery: gallery.split(",").map((g) => g.trim()).filter(Boolean), // ✅ NEW
      description,

      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),

      amenities,
      things_to_know: thingsToKnow,
      details,

      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
    };

    const { data, error } = await supabase
      .from("properties")
      .insert([payload])
      .select()
      .single();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    // create availability row
    await supabase.from("property_availability").insert({
      property_id: data.id,
      start_date: availableFrom,
      end_date: availableTo || null,
      status,
    });

    if (onSuccess) onSuccess();
  };

  /* ======================
     UI
  ====================== */
  return (
    <form onSubmit={handleSubmit} className="max-w-6xl space-y-8">
      {/* BASIC */}
      <Section title="Basic Information">
        <div className="grid md:grid-cols-3 gap-6">
          <Field label="Title">
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>

          <Field label="Property Type">
            <select
              className={inputClass}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </Field>

          <Field label="City">
            <input className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>

          <Field label="Base Rent (Monthly)">
            <input type="number" className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
          </Field>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Field label="Rating">
            <input className={inputClass} value={rating} onChange={(e) => setRating(e.target.value)} />
          </Field>

          <Field label="Cover Image URL">
            <input className={inputClass} value={image} onChange={(e) => setImage(e.target.value)} />
          </Field>

          <Field label="Tags">
            <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} />
          </Field>
        </div>

        {/* ✅ NEW GALLERY FIELD */}
        <div className="grid md:grid-cols-1 gap-6 pt-6">
          <Field label="Gallery Images (comma separated URLs)">
            <textarea
              rows={2}
              className={inputClass}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              value={gallery}
              onChange={(e) => setGallery(e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* PRICING */}
      <Section title="Pricing">
        <div className="grid md:grid-cols-5 gap-6">
          <Field label="Utilities"><input type="number" className={inputClass} value={utilities} onChange={(e) => setUtilities(e.target.value)} /></Field>
          <Field label="Booking Fee"><input type="number" className={inputClass} value={bookingFee} onChange={(e) => setBookingFee(e.target.value)} /></Field>
          <Field label="Cleaning Fee"><input type="number" className={inputClass} value={cleaningFee} onChange={(e) => setCleaningFee(e.target.value)} /></Field>
          <Field label="Security Deposit"><input type="number" className={inputClass} value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} /></Field>
          <Field label="Minimum Stay (Days)"><input type="number" className={inputClass} value={minStayNights} onChange={(e) => setMinStayNights(e.target.value)} /></Field>
        </div>
      </Section>

      {/* DESCRIPTION */}
      <Section title="Description">
        <Field label="Property Description">
          <textarea rows={4} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </Section>

      {/* DETAILS */}
      <Section title="Property Details">
        <div className="grid md:grid-cols-4 gap-6">
          <Field label="Beds"><input className={inputClass} value={details.beds} onChange={(e) => setDetails({ ...details, beds: e.target.value })} /></Field>
          <Field label="Baths"><input className={inputClass} value={details.baths} onChange={(e) => setDetails({ ...details, baths: e.target.value })} /></Field>
          <Field label="Size"><input className={inputClass} value={details.size} onChange={(e) => setDetails({ ...details, size: e.target.value })} /></Field>
          <Field label="Floor"><input className={inputClass} value={details.floor} onChange={(e) => setDetails({ ...details, floor: e.target.value })} /></Field>
        </div>
      </Section>

      {/* AMENITIES */}
      <Section title="Amenities">
        <div className="space-y-6">
          {Object.entries(AMENITY_OPTIONS).map(([category, options]) => (
            <div key={category}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-3">
                {category} Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                  const isSelected = amenities[category]?.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAmenityToggle(category, option)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isSelected
                        ? "bg-[#3E6B4E] text-white border-[#3E6B4E]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* AVAILABILITY */}
      <Section title="Availability">
        <div className="grid md:grid-cols-3 gap-6">
          <Field label="Available From">
            <input type="date" className={inputClass} value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
          </Field>

          <Field label="Available To">
            <input type="date" className={inputClass} value={availableTo} onChange={(e) => setAvailableTo(e.target.value)} />
          </Field>

          <Field label="Status">
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
              <option value="blocked">Blocked</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* THINGS TO KNOW */}
      <Section title="Resident Guidelines">
        <Field label="Resident Guidelines (comma separated)">
          <input className={inputClass} onChange={(e) => handleRulesChange(e.target.value)} />
        </Field>

        <Field label="Cancellation Policy">
          <textarea rows={3} className={inputClass} value={thingsToKnow.cancellation} onChange={(e) => setThingsToKnow({ ...thingsToKnow, cancellation: e.target.value })} />
        </Field>
      </Section>

      {/* LOCATION */}
      <Section title="Location">
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Latitude"><input className={inputClass} value={lat} onChange={(e) => setLat(e.target.value)} /></Field>
          <Field label="Longitude"><input className={inputClass} value={lng} onChange={(e) => setLng(e.target.value)} /></Field>
        </div>
      </Section>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button className="bg-[#3E6B4E] text-white px-8 py-3 rounded-xl">
          {saving ? "Saving..." : "Add Property"}
        </button>

        <button
          type="button"
          onClick={onSuccess}
          className="border px-6 py-3 rounded-xl"
        >
          Cancel
        </button>

      </div>

      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
