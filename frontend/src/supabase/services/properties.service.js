import { supabase } from "../client";

/*
  Normalize DB → frontend shape
*/
/*
  Normalize DB → frontend shape
*/
export function normalizeProperty(data) {
  return {
    ...data,

    // keep frontend naming clean
    image: data.cover_image || data.image,
    thingsToKnow: data.things_to_know,

    // Normalize db fields to camelCase so they are parsed correctly by UI
    bookingFee: data.booking_fee || 0,
    cleaningFee: data.cleaning_fee || 0,
    securityDeposit: data.security_deposit || 0,
    utilities: data.utilities || 0,

    // already renamed in query, so just fallback
    availability: data.availability || []
  };
}

/* =========================================================
   GET ALL PROPERTIES (with availability join)
========================================================= */
export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      availability:property_availability (
        id,
        start_date,
        end_date,
        status
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return (data || []).map(normalizeProperty);
}

/* =========================================================
   GET SINGLE PROPERTY (with availability join)
========================================================= */
export async function getPropertyById(id) {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      availability:property_availability (
        id,
        start_date,
        end_date,
        status
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    throw error;
  }

  return normalizeProperty(data);
}
