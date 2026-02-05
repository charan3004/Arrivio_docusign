const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const clientConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

const client = new Client(clientConfig);

const allProperties = [
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
      details: { beds: 2, baths: 1, size: '82m²', floor: '2nd' }
    },
    {
      id: 3,
      city: "Berlin",
      title: "Artist Studio in Neukölln",
      price: 1200,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
      tags: ["Cozy", "1 Room"],
      details: { beds: 1, baths: 1, size: '45m²', floor: 'Ground' }
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
      details: { beds: 2, baths: 2, size: '90m²', floor: '5th' }
    },
    {
      id: 17,
      city: "Hamburg",
      title: "Brick Altbau in Altona",
      price: 1250,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop",
      tags: ["Historic", "Quiet"],
      details: { beds: 2, baths: 1, size: '75m²', floor: '1st' }
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
      details: { beds: 3, baths: 2, size: '110m²', floor: '3rd' }
    },
    {
      id: 5,
      city: "Munich",
      title: "Bavarian Chic in Schwabing",
      price: 1950,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop",
      tags: ["Renovated", "Quiet"],
      details: { beds: 2, baths: 1, size: '85m²', floor: '4th' }
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
      details: { beds: 3, baths: 3, size: '140m²', floor: '22nd' }
    },
    {
      id: 7,
      city: "Frankfurt",
      title: "Business Suite in Westend",
      price: 1750,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=1000&auto=format&fit=crop",
      tags: ["Workspace", "Premium"],
      details: { beds: 1, baths: 1, size: '60m²', floor: '10th' }
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
      details: { beds: 2, baths: 1, size: '80m²', floor: '2nd' }
    },
    {
      id: 9,
      city: "Cologne",
      title: "Riverside Apartment Deutz",
      price: 1550,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1534349762913-96c87130f6bf?q=80&w=1000&auto=format&fit=crop",
      tags: ["River View", "Modern"],
      details: { beds: 2, baths: 1, size: '88m²', floor: '6th' }
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
      details: { beds: 2, baths: 2, size: '100m²', floor: '4th' }
    },
    {
      id: 11,
      city: "Dusseldorf",
      title: "Modern Loft in MedienHafen",
      price: 1850,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
      tags: ["Architecture", "Waterfront"],
      details: { beds: 1, baths: 1, size: '75m²', floor: '3rd' }
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
      details: { beds: 3, baths: 2, size: '110m²', floor: 'Ground' }
    },
    {
      id: 13,
      city: "Bonn",
      title: "Cozy Flat near Cherry Blossom Ave",
      price: 1100,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop",
      tags: ["Charming", "Central"],
      details: { beds: 1, baths: 1, size: '50m²', floor: '2nd' }
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
      details: { beds: 1, baths: 1, size: '35m²', floor: '1st' }
    },
    {
      id: 15,
      city: "Aachen",
      title: "Pontviertel City Flat",
      price: 950,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1522771753035-1a5b65d9f342?q=80&w=1000&auto=format&fit=crop",
      tags: ["Nightlife", "Compact"],
      details: { beds: 2, baths: 1, size: '60m²', floor: '3rd' }
    }
];

async function seed() {
  try {
    await client.connect();
    console.log('Connected to DB...');

    // Optional: Clear existing properties to avoid duplicates or messy ID states
    // But we want to preserve if the user added something custom.
    // However, since we are syncing with "website data", maybe we should upsert or clear.
    // Let's truncate for a clean slate as this is "syncing".
    await client.query('TRUNCATE TABLE properties RESTART IDENTITY CASCADE');
    console.log('Cleared existing properties...');

    for (const prop of allProperties) {
      await client.query(
        `INSERT INTO properties (title, city, price, rating, image, tags, details, gallery) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          prop.title,
          prop.city,
          prop.price,
          prop.rating,
          prop.image,
          prop.tags || [],
          prop.details || {},
          prop.gallery || []
        ]
      );
    }

    console.log(`Seeded ${allProperties.length} properties successfully!`);
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
  }
}

seed();
