import { Pencil } from "lucide-react";

export default function PropertyCard({ property, onEdit }) {
  const availability = property.property_availability?.[0];
  const status = availability?.status || "available";

  const statusStyles = {
    available: "bg-green-100 text-green-700",
    rented: "bg-blue-100 text-blue-700",
    maintenance: "bg-yellow-100 text-yellow-700",
    blocked: "bg-gray-200 text-gray-700",
  };

  return (
    <div
      onClick={onEdit} // ✅ OPEN MODAL
      className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden relative group"
    >
      {/* IMAGE */}
      <div className="relative h-48">
        <img
          src={property.cover_image || "/placeholder.jpg"}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* STATUS */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full font-medium ${statusStyles[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>

        {/* ✏️ EDIT ICON */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // ⛔ stop card click
            onEdit();            // ✅ OPEN MODAL
          }}
          className="
            absolute top-3 right-3
            bg-white/90 backdrop-blur
            p-2 rounded-full shadow
            opacity-0 group-hover:opacity-100
            transition
            hover:bg-white
          "
          title="Edit property"
        >
          <Pencil size={16} className="text-gray-700" />
        </button>
      </div>

      {/* DETAILS */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{property.title}</h3>

        <p className="text-sm text-gray-500">📍 {property.city}</p>

        <div className="flex gap-4 text-sm text-gray-500">
          <span>🛏 {property.details?.beds || 1}</span>
          <span>🛁 {property.details?.baths || 1}</span>
          <span>📐 {property.details?.size || "--"} m²</span>
        </div>

        <div className="pt-2">
          <p className="text-xl font-bold">
            €{property.price}
            <span className="text-sm text-gray-400"> / month</span>
          </p>
        </div>
      </div>
    </div>
  );
}
