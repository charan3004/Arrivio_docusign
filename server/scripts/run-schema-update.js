const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('DB Config:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    passwordLength: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0
});

async function runSchemaUpdate() {
  try {
    await client.connect();
    console.log('Connected to database...');

    const sql = fs.readFileSync(path.join(__dirname, 'update_schema.sql'), 'utf8');
    await client.query(sql);
    
    console.log('Schema updated successfully!');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await client.end();
  }
}

runSchemaUpdate();
