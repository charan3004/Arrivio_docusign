const db = require('../db');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    const username = 'admin';
    const email = 'admin@arrivio.com';
    const password = 'admin'; // Temporary password
    const role = 'admin';

    // Check if admin already exists
    const checkRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkRes.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await db.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [username, email, passwordHash, role]
    );

    console.log(`Admin user created successfully.`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    process.exit();
  }
};

createAdmin();
