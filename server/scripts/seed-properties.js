const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'arrivio_db',
});

(async () => {
  try {
    await client.connect();
    await client.query(
      `INSERT INTO properties (title, city, price)
       VALUES 
       ($1, $2, $3),
       ($4, $5, $6),
       ($7, $8, $9)`,
      [
        'Studio Apartment', 'Berlin', 950,
        '1-Bedroom Flat', 'Munich', 1200,
        'Shared Room', 'Hamburg', 550,
      ]
    );
    console.log('Seed data inserted');
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
})();
