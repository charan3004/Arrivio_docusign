// src/data/properties.js

// --- MASTER PROPERTY LIST ---
export const allProperties = [
  // --- BERLIN ---
  {
    id: 1,
    city: "Berlin",
    title: "Minimalist Loft in Kreuzberg",
    price: 1450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop",
    tags: ["Loft", "High Ceilings"],
    details: { beds: 1, baths: 1, size: '65m²', floor: '4th' },
    // Fixed: Rooftop on Bergmannstraße
    lat: 52.489123, 
    lng: 13.394234,
    gallery: [
       "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000",
       "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000",
       "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000"
    ]
  },
  {
    id: 2,
    city: "Berlin",
    title: "Sunny Apartment in Mitte",
    price: 1800,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop",
    tags: ["Central", "Balcony"],
    details: { beds: 2, baths: 1, size: '82m²', floor: '2nd' },
    // Fixed: Rooftop near Rosenthaler Platz
    lat: 52.530345, 
    lng: 13.402178
  },
  {
    id: 3,
    city: "Berlin",
    title: "Artist Studio in Neukölln",
    price: 1200,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
    tags: ["Cozy", "1 Room"],
    details: { beds: 1, baths: 1, size: '45m²', floor: 'Ground' },
    // Fixed: Rooftop near Weserstraße
    lat: 52.486241, 
    lng: 13.431256
  },

  // --- HAMBURG ---
  {
    id: 16,
    city: "Hamburg",
    title: "Harbor View Loft in HafenCity",
    price: 1650,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
    tags: ["Waterfront", "Modern"],
    details: { beds: 2, baths: 2, size: '90m²', floor: '5th' },
    // Fixed: Rooftop in HafenCity
    lat: 53.541339, 
    lng: 9.998654
  },
  {
    id: 17,
    city: "Hamburg",
    title: "Brick Altbau in Altona",
    price: 1250,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop",
    tags: ["Historic", "Quiet"],
    details: { beds: 2, baths: 1, size: '75m²', floor: '1st' },
    // Fixed: Residential building in Altona-Nord
    lat: 53.558712, 
    lng: 9.941324
  },

  // --- MUNICH ---
  {
    id: 4,
    city: "Munich",
    title: "Modern Flat near Englischer Garten",
    price: 2100,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1512918760532-446595d04f19?q=80&w=1000&auto=format&fit=crop",
    tags: ["Luxury", "Garden View"],
    details: { beds: 3, baths: 2, size: '110m²', floor: '3rd' },
    // Fixed: Rooftop bordering the park
    lat: 48.155412, 
    lng: 11.594123
  },
  {
    id: 5,
    city: "Munich",
    title: "Bavarian Chic in Schwabing",
    price: 1950,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop",
    tags: ["Renovated", "Quiet"],
    details: { beds: 2, baths: 1, size: '85m²', floor: '4th' },
    // Fixed: Residential block in Schwabing
    lat: 48.161245, 
    lng: 11.583456
  },

  // --- FRANKFURT ---
  {
    id: 6,
    city: "Frankfurt",
    title: "Skyline View Penthouse",
    price: 2400,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1000&auto=format&fit=crop",
    tags: ["Penthouse", "Skyline"],
    details: { beds: 3, baths: 3, size: '140m²', floor: '22nd' },
    // Fixed: High-rise residential tower
    lat: 50.113214, 
    lng: 8.675432
  },
  {
    id: 7,
    city: "Frankfurt",
    title: "Business Suite in Westend",
    price: 1750,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=1000&auto=format&fit=crop",
    tags: ["Workspace", "Premium"],
    details: { beds: 1, baths: 1, size: '60m²', floor: '10th' },
    // Fixed: Elegant building in Westend
    lat: 50.121543, 
    lng: 8.660123
  },

  // --- COLOGNE ---
  {
    id: 8,
    city: "Cologne",
    title: "Belgian Quarter Altbau",
    price: 1350,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da97ee87?q=80&w=1000&auto=format&fit=crop",
    tags: ["Altbau", "Nightlife"],
    details: { beds: 2, baths: 1, size: '80m²', floor: '2nd' },
    // Fixed: Classic building near Brüsseler Platz
    lat: 50.939123, 
    lng: 6.935432
  },
  {
    id: 9,
    city: "Cologne",
    title: "Riverside Apartment Deutz",
    price: 1550,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1534349762913-96c87130f6bf?q=80&w=1000&auto=format&fit=crop",
    tags: ["River View", "Modern"],
    details: { beds: 2, baths: 1, size: '88m²', floor: '6th' },
    // Fixed: Apartment complex facing Rhine
    lat: 50.935678, 
    lng: 6.972345
  },

  // --- DUSSELDORF ---
  {
    id: 10,
    city: "Dusseldorf",
    title: "Luxury Suite on Königsallee",
    price: 2200,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
    tags: ["Exclusive", "Shopping"],
    details: { beds: 2, baths: 2, size: '100m²', floor: '4th' },
    // Fixed: Building just off the Kö
    lat: 51.221234, 
    lng: 6.779876
  },
  {
    id: 11,
    city: "Dusseldorf",
    title: "Modern Loft in MedienHafen",
    price: 1850,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
    tags: ["Architecture", "Waterfront"],
    details: { beds: 1, baths: 1, size: '75m²', floor: '3rd' },
    // Fixed: The Gehry buildings area
    lat: 51.215432, 
    lng: 6.751234
  },

  // --- BONN ---
  {
    id: 12,
    city: "Bonn",
    title: "Historic Home in Südstadt",
    price: 1300,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1513584685908-95c9e2d01361?q=80&w=1000&auto=format&fit=crop",
    tags: ["Historic", "Quiet"],
    details: { beds: 3, baths: 2, size: '110m²', floor: 'Ground' },
    // Fixed: Residential street in Südstadt
    lat: 50.725678, 
    lng: 7.101234
  },
  {
    id: 13,
    city: "Bonn",
    title: "Cozy Flat near Cherry Blossom Ave",
    price: 1100,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop",
    tags: ["Charming", "Central"],
    details: { beds: 1, baths: 1, size: '50m²', floor: '2nd' },
    // Fixed: Heerstraße itself
    lat: 50.736543, 
    lng: 7.092134
  },

  // --- AACHEN ---
  {
    id: 14,
    city: "Aachen",
    title: "Smart Apartment near RWTH",
    price: 850,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop",
    tags: ["Student Friendly", "WiFi"],
    details: { beds: 1, baths: 1, size: '35m²', floor: '1st' },
    // Fixed: Building near SuperC
    lat: 50.778901, 
    lng: 6.077890
  },
  {
    id: 15,
    city: "Aachen",
    title: "Pontviertel City Flat",
    price: 950,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1522771753035-1a5b65d9f342?q=80&w=1000&auto=format&fit=crop",
    tags: ["Nightlife", "Compact"],
    details: { beds: 2, baths: 1, size: '60m²', floor: '3rd' },
    // Fixed: Pontstraße residential area
    lat: 50.782345, 
    lng: 6.081234
  }
];