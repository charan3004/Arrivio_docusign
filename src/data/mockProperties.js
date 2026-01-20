import React from 'react';

export const allProperties = [
  // --- BERLIN ---
  { 
    id: 1, city: "Berlin", title: "Minimalist Loft in Kreuzberg", price: 1450, rating: 4.9, 
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop"
    ],
    details: { sqm: 65, beds: 1, baths: 1, floor: "4th", capacity: 2, heating: "Floor" } 
  },
  { 
    id: 2, city: "Berlin", title: "Sunny Apartment in Mitte", price: 1800, rating: 4.7, 
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 82, beds: 2, baths: 1.5, floor: "2nd", capacity: 3, heating: "Central" }
  },
  { 
    id: 3, city: "Berlin", title: "Artist Studio in Neukölln", price: 1200, rating: 4.6, 
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 45, beds: 1, baths: 1, floor: "Grd", capacity: 1, heating: "Gas" }
  },
  // --- MUNICH ---
  { 
    id: 4, city: "Munich", title: "Modern Flat near Englischer Garten", price: 2100, rating: 4.9, 
    image: "https://images.unsplash.com/photo-1512918760532-446595d04f19?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 90, beds: 2, baths: 2, floor: "3rd", capacity: 4, heating: "Central" }
  },
  { 
    id: 5, city: "Munich", title: "Bavarian Chic in Schwabing", price: 1950, rating: 4.8, 
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 75, beds: 1, baths: 1, floor: "1st", capacity: 2, heating: "Floor" }
  },
  // --- FRANKFURT ---
  { 
    id: 6, city: "Frankfurt", title: "Skyline View Penthouse", price: 2400, rating: 5.0, 
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 110, beds: 2, baths: 2, floor: "12th", capacity: 4, heating: "AC" }
  },
  { 
    id: 7, city: "Frankfurt", title: "Business Suite in Westend", price: 1750, rating: 4.7, 
    image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 55, beds: 1, baths: 1, floor: "5th", capacity: 2, heating: "Central" }
  },
  // --- COLOGNE ---
  { 
    id: 8, city: "Cologne", title: "Belgian Quarter Altbau", price: 1350, rating: 4.8, 
    image: "https://images.unsplash.com/photo-1507089947368-19c1da97ee87?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 68, beds: 1, baths: 1, floor: "3rd", capacity: 2, heating: "Gas" }
  },
  { 
    id: 9, city: "Cologne", title: "Riverside Apartment Deutz", price: 1550, rating: 4.6, 
    image: "https://images.unsplash.com/photo-1534349762913-96c87130f6bf?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 72, beds: 2, baths: 1, floor: "2nd", capacity: 3, heating: "Central" }
  },
  // --- DUSSELDORF ---
  { 
    id: 10, city: "Dusseldorf", title: "Luxury Suite on Königsallee", price: 2200, rating: 5.0, 
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 85, beds: 1, baths: 1.5, floor: "4th", capacity: 2, heating: "AC" }
  },
  { 
    id: 11, city: "Dusseldorf", title: "Modern Loft in MedienHafen", price: 1850, rating: 4.8, 
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 95, beds: 2, baths: 2, floor: "6th", capacity: 4, heating: "Floor" }
  },
  // --- BONN ---
  { 
    id: 12, city: "Bonn", title: "Historic Home in Südstadt", price: 1300, rating: 4.9, 
    image: "https://images.unsplash.com/photo-1513584685908-95c9e2d01361?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 70, beds: 2, baths: 1, floor: "Grd", capacity: 3, heating: "Gas" }
  },
  { 
    id: 13, city: "Bonn", title: "Cozy Flat near Cherry Blossom Ave", price: 1100, rating: 4.7, 
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 50, beds: 1, baths: 1, floor: "2nd", capacity: 2, heating: "Central" }
  },
  // --- AACHEN ---
  { 
    id: 14, city: "Aachen", title: "Smart Apartment near RWTH", price: 850, rating: 4.5, 
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 40, beds: 1, baths: 1, floor: "1st", capacity: 1, heating: "District" }
  },
  { 
    id: 15, city: "Aachen", title: "Pontviertel City Flat", price: 950, rating: 4.6, 
    image: "https://images.unsplash.com/photo-1522771753035-1a5b65d9f342?q=80&w=1000&auto=format&fit=crop",
    details: { sqm: 55, beds: 1, baths: 1, floor: "3rd", capacity: 2, heating: "Gas" }
  },
];