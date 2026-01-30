const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function ensureDatabase() {
  const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST = '127.0.0.1',
    DB_PORT = 5432,
    DB_NAME = 'arrivio_db',
  } = process.env;

  const adminClient = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT),
    database: 'postgres',
  });

  try {
    await adminClient.connect();
    console.log('Connected to postgres database. Ensuring target database exists...');
    const res = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );
    if (res.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Database "${DB_NAME}" created.`);
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error('Failed to ensure database:', err.message);
    process.exitCode = 1;
  } finally {
    await adminClient.end().catch(() => {});
  }
}

ensureDatabase();
