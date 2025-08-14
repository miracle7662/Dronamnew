
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'lodging-superadmin-secret-key-2024';

// Superadmin Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find superadmin by email
    const [rows] = await pool.execute('SELECT * FROM superadmins WHERE email = ? AND status = 1', [email]);
    const superadmin = rows[0];
    
    if (!superadmin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, superadmin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: superadmin.id, 
        email: superadmin.email, 
        name: superadmin.name,
        role: 'superadmin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...superadminWithoutPassword } = superadmin;

    res.json({
      message: 'Login successful!',
      superadmin: superadminWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Get Superadmin Dashboard Data
const getDashboard = async (req, res) => {
  try {
    // Get counts for dashboard
    const [countriesCountRows] = await pool.execute('SELECT COUNT(*) as count FROM countries WHERE status = 1');
    const [statesCountRows] = await pool.execute('SELECT COUNT(*) as count FROM states WHERE status = 1');
    const [districtsCountRows] = await pool.execute('SELECT COUNT(*) as count FROM districts WHERE status = 1');
    const [zonesCountRows] = await pool.execute('SELECT COUNT(*) as count FROM zones WHERE status = 1');

    res.json({
      message: 'Dashboard data retrieved successfully!',
      dashboard: {
        countries: countriesCountRows[0].count,
        states: statesCountRows[0].count,
        districts: districtsCountRows[0].count,
        zones: zonesCountRows[0].count
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data', details: error.message });
  }
};

// Logout (client-side token removal)
const logout = (req, res) => {
  res.json({ message: 'Logout successful!' });
};

// Verify JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {
  login,
  getDashboard,
  logout,
  verifyToken,
  JWT_SECRET
};
