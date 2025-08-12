const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hotel login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM hotels WHERE email = ? AND status = 1', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hotel = rows[0];

    const isPasswordValid = await bcrypt.compare(password, hotel.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: hotel.hotelid,
        email: hotel.email,
        name: hotel.hotel_name,
        role: 'hotel'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...hotelWithoutPassword } = hotel;

    res.json({
      message: 'Login successful!',
      hotel: hotelWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

module.exports = {
  login
};
