const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login for hotels, agents, and superadmin
const login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({ error: 'Email, password, and type are required' });
    }

    let table, idField, nameField;
    
    switch(type) {
      case 'hotel':
        table = 'hotels';
        idField = 'hotelid';
        nameField = 'hotel_name';
        break;
      case 'agent':
        table = 'agents';
        idField = 'id';
        nameField = 'name';
        break;
      case 'superadmin':
        table = 'superadmin';
        idField = 'id';
        nameField = 'username';
        break;
      default:
        return res.status(400).json({ error: 'Invalid user type' });
    }

    const query = `SELECT * FROM ${table} WHERE email = ? AND status = 1`;
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials or account not active' });
    }

    const user = rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user[idField], 
        email: user.email, 
        name: user[nameField], 
        role: type
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userData } = user;

    res.json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

module.exports = {
  login
};
