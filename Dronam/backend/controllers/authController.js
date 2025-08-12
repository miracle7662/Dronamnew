const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login for both hotels and agents
const login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({ error: 'Email, password, and type are required' });
    }

    let table = type === 'hotel' ? 'hotels' : 'agents';
    let query = `SELECT * FROM ${table} WHERE email = ? AND status = 1`;

    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // For hotels, check password (assuming it's hashed)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id || user.hotelid, 
        email: user.email, 
        name: user.name || user.hotel_name, 
        role: type,
        type: type
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id || user.hotelid,
        email: user.email,
        name: user.name || user.hotel_name,
        role: type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

module.exports = {
  login
};
