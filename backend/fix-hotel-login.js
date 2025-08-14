const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { sendWelcomeEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login hotel - Fixed version
const login = async (req, res) => {
  console.log('Hotel login attempt:', req.body);
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM hotels WHERE email = ? AND status = 1', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials or account not active' });
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
        hotel_name: hotel.hotel_name,
        role: 'hotel'
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' />
    );

    const { password: _, ...hotelData } = hotel;
    
    res.json({
Let me run the schema check script directly without changing directories:

<execute_command>
<command>node Dronam/backend/check-schema.js</command>
</execute_command>
