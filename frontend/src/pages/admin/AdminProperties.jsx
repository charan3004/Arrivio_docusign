import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

import AdminSidebar from "../../components/admin/AdminSidebar";
import PropertyCard from "../../components/admin/PropertyCard";
import EditPropertyModal from "../../components/admin/EditPropertyModal";
import AddPropertyModal from "../../components/admin/AddPropertyModal";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  /* ======================
     SEARCH + FILTER STATE
  ====================== */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ======================
     FETCH
  ====================== */
  const fetchProperties = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_availability (
          id,
          start_date,
          end_date,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) setProperties(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  /* ======================
     FILTER LOGIC
  ====================== */
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(search.toLowerCase()) ||
      property.city?.toLowerCase().includes(search.toLowerCase());

    const status =
      property.property_availability?.[0]?.status || "available";

    const matchesFilter =
      filter === "all" ? true : status === filter;

    return matchesSearch && matchesFilter;
  });

  /* ======================
     UI
  ====================== */
  return (
    <div className="flex bg-white min-h-screen">
      <AdminSidebar />

      <div className="ml-64 p-8 w-full">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Properties</h1>
            <p className="text-gray-500 text-sm">
              Manage your apartment portfolio
            </p>
          </div>

          <button
            onClick={() => setAdding(true)}
            className="bg-adminGreen text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
          >
            + Add Property
          </button>
        </div>

        {/* ================= SEARCH + FILTERS ================= */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Search */}
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border w-full max-w-md shadow-sm">
            <span className="text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            {[
              { label: "All", value: "all" },
              { label: "Available", value: "available" },
              { label: "Rented", value: "rented" },
              { label: "Maintenance", value: "maintenance" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-5 py-2 rounded-xl border text-sm transition ${filter === item.value
                    ? "bg-adminGreen text-white border-adminGreen"
                    : "bg-white hover:bg-gray-100"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= GRID ================= */}
        {loading ? (
          <p>Loading properties...</p>
        ) : filteredProperties.length === 0 ? (
          <p className="text-gray-500">No properties found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={() => setEditingId(property.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingId && (
        <EditPropertyModal
          propertyId={editingId}
          onClose={() => setEditingId(null)}
          onSaved={fetchProperties}
        />
      )}

      {/* ================= ADD MODAL ================= */}
      {adding && (
        <AddPropertyModal
          onClose={() => setAdding(false)}
          onSaved={fetchProperties}
        />
      )}
    </div>
  );
}
