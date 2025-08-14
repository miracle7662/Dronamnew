const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email, password and role' 
      });
    }

    // Validate role
    if (!['agent', 'hotel'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role. Must be agent or hotel' 
      });
    }

    // Query based on role
    let query, user;
    
    if (role === 'agent') {
      query = 'SELECT * FROM agents WHERE email = ? AND status = "active"';
    } else {
      query = 'SELECT * FROM hotels WHERE email = ? AND status = "active"';
    }

    const [rows] = await pool.execute(query, [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    user = rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: role,
        name: role === 'agent' ? user.name : user.hotel_name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: role === 'agent' ? user.name : user.hotel_name,
        role: role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, name, role, ...otherData } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let query, values;
    
    if (role === 'agent') {
      query = 'INSERT INTO agents (email, password, name, phone, status) VALUES (?, ?, ?, ?, "active")';
      values = [email, hashedPassword, name, otherData.phone || null];
    } else {
      query = 'INSERT INTO hotels (email, password, hotel_name, address, status) VALUES (?, ?, ?, ?, "active")';
      values = [email, hashedPassword, name, otherData.address || null];
    }

    const [result] = await pool.execute(query, values);

    res.json({
      success: true,
      message: `${role} registered successfully`,
      userId: result.insertId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let query;
    if (role === 'agent') {
      query = 'SELECT id, email, name, phone, created_at FROM agents WHERE id = ?';
    } else {
      query = 'SELECT id, email, hotel_name as name, address, created_at FROM hotels WHERE id = ?';
    }

    const [rows] = await pool.execute(query, [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: rows[0]
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = {
  login,
  register,
  getProfile
};
