const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const sql = fs.readFileSync(path.resolve(__dirname, 'migrations.sql'), 'utf8');

const clientConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'arrivio_db',
    };

const client = new Client(clientConfig);

(async () => {
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migrations applied');
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
})();
