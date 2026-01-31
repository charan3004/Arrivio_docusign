const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';
const GOOGLE_CLIENT_ID = "303911068133-uete5ufngfa87959bchmc115c05tfi1m.apps.googleusercontent.com";

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Require Admin Role' });
    }
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Arrivio Backend API' });
});

// Auth Routes
app.post('/auth/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [fullName, email, hashedPassword, 'user']
        );
        
        const user = newUser.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({ 
            token, 
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ 
            token, 
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                bio: user.bio
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Auth Routes
app.post('/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        // Method 2: If using Access Token (from useGoogleLogin hook)
        // We fetch user info directly from Google
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!googleRes.ok) {
            throw new Error('Failed to fetch user info from Google');
        }

        const payload = await googleRes.json();
        const { email, name, sub: googleId, picture } = payload;
        
        // Fallback for name if missing
        const fullName = name || email.split('@')[0];

        // Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        let user;
        if (userCheck.rows.length === 0) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            const newUser = await db.query(
                'INSERT INTO users (full_name, email, password_hash, google_id, role, bio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [fullName, email, hashedPassword, googleId, 'user', 'Joined via Google']
            );
            user = newUser.rows[0];
        } else {
            user = userCheck.rows[0];
            if (!user.google_id) {
                 await db.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
            }
        }

        const jwtToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ 
            token: jwtToken, 
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                bio: user.bio
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Google login failed' });
    }
});

// Public Properties Route
app.get('/properties', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM properties ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Query failed', detail: err.message });
  }
});

// Public Single Property Route
app.get('/properties/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM properties WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Property not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Query failed', detail: err.message });
    }
});

// Admin Only: Create Property
app.post('/properties', authenticateToken, isAdmin, async (req, res) => {
    const { title, city, price, image, rating, tags, details, gallery } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO properties (title, city, price, image, rating, tags, details, gallery) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, city, price, image, rating, tags, details, gallery]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Only: Update Property
app.put('/properties/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, city, price, image, rating, tags, details, gallery } = req.body;
    try {
        // We'll use COALESCE in SQL or just pass undefined if not provided? 
        // Better to expect full object or handle partial updates. 
        // For now let's assume the frontend sends the full object back.
        const result = await db.query(
            `UPDATE properties 
             SET title = $1, city = $2, price = $3, image = $4, rating = $5, tags = $6, details = $7, gallery = $8 
             WHERE id = $9 RETURNING *`,
            [title, city, price, image, rating, tags, details, gallery, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Property not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Only: Delete Property
app.delete('/properties/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Property not found' });
        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Only: Get All Users
app.get('/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT id, username, email, role, created_at FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Test DB Connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed', detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
