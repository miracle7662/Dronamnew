const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { sendWelcomeEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Enhanced login with role-based access
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    const [rows] = await pool.query(`
      SELECT a.*, 
             c.country_name, s.state_name, d.district_name, z.zone_name
      FROM agents a
      LEFT JOIN countries c ON a.country_id = c.country_id
      LEFT JOIN states s ON a.state_id = s.state_id
      LEFT JOIN districts d ON a.district_id = d.district_id
      LEFT JOIN zones z ON a.zone_id = z.zone_id
      WHERE a.email = ? AND a.status = 1
    `, [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials or account blocked' 
      });
    }

    const agent = rows[0];
    const isPasswordValid = await bcrypt.compare(password, agent.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { 
        id: agent.id, 
        email: agent.email, 
        name: agent.name, 
        role: agent.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    const { password: _, ...agentWithoutPassword } = agent;
    
    res.json({
      success: true,
      message: 'Login successful!',
      agent: agentWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed', 
      details: error.message 
    });
  }
};

// Get all agents with pagination and filtering
const getAllAgents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', role = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ` AND (a.name LIKE ? OR a.email LIKE ? OR a.phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== '') {
      whereClause += ` AND a.status = ?`;
      params.push(parseInt(status));
    }

    if (role) {
      whereClause += ` AND a.role = ?`;
      params.push(role);
    }

    // Get total count
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM agents a
      ${whereClause}
    `, params);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
    params.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await pool.query(`
      SELECT a.id, a.email, a.name, a.role, a.phone, a.address, 
             a.country_id, a.state_id, a.district_id, a.zone_id, 
             a.pan_number, a.aadhar_number, a.gst_number, a.status, 
             a.created_by_date, a.updated_by_date,
             c.country_name, s.state_name, d.district_name, z.zone_name,
             creator.name as created_by_name, updater.name as updated_by_name
      FROM agents a
      LEFT JOIN countries c ON a.country_id = c.country_id
      LEFT JOIN states s ON a.state_id = s.state_id
      LEFT JOIN districts d ON a.district_id = d.district_id
      LEFT JOIN zones z ON a.zone_id = z.zone_id
      LEFT JOIN agents creator ON a.created_by_id = creator.id
      LEFT JOIN agents updater ON a.updated_by_id = updater.id
      ${whereClause}
      ORDER BY a.created_by_date DESC
      LIMIT ? OFFSET ?
    `, params);

    res.json({
      success: true,
      agents: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch agents', 
      details: error.message 
    });
  }
};

// Get agent by ID with full details
const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(`
      SELECT a.*, 
             c.country_name, s.state_name, d.district_name, z.zone_name
      FROM agents a
      LEFT JOIN countries c ON a.country_id = c.country_id
      LEFT JOIN states s ON a.state_id = s.state_id
      LEFT JOIN districts d ON a.district_id = d.district_id
      LEFT JOIN zones z ON a.zone_id = z.zone_id
      WHERE a.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Agent not found' 
      });
    }
    
    res.json({
      success: true,
      agent: rows[0]
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch agent', 
      details: error.message 
    });
  }
};

// Create new agent with validation
const createAgent = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { 
      email, 
      password, 
      name, 
      role = 'agent', 
      phone = '', 
      address = '', 
      country_id = null, 
      state_id = null, 
      district_id = null, 
      zone_id = null, 
      pan_number = '', 
      aadhar_number = '',
      gst_number = '',
      created_by_id = 1
    } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false,
        error: 'Email, password, and name are required' 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Check if email already exists
    const [existingRows] = await connection.query(
      'SELECT id FROM agents WHERE email = ?', 
      [email]
    );
    
    if (existingRows.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }

    // Validate foreign key references
    if (country_id) {
      const [countryRows] = await connection.query(
        'SELECT country_id FROM countries WHERE country_id = ?', 
        [country_id]
      );
      if (countryRows.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid country_id' 
        });
      }
    }

    if (state_id) {
      const [stateRows] = await connection.query(
        'SELECT state_id FROM states WHERE state_id = ?', 
        [state_id]
      );
      if (stateRows.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid state_id' 
        });
      }
    }

    if (district_id) {
      const [districtRows] = await connection.query(
        'SELECT district_id FROM districts WHERE district_id = ?', 
        [district_id]
      );
      if (districtRows.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid district_id' 
        });
      }
    }

    if (zone_id) {
      const [zoneRows] = await connection.query(
        'SELECT zone_id FROM zones WHERE zone_id = ?', 
        [zone_id]
      );
      if (zoneRows.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid zone_id' 
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert agent
    const [result] = await connection.query(`
      INSERT INTO agents (
        email, password, name, role, phone, address, 
        country_id, state_id, district_id, zone_id, 
        pan_number, aadhar_number, gst_number, created_by_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      email, hashedPassword, name, role, phone, address,
      country_id, state_id, district_id, zone_id,
      pan_number, aadhar_number, gst_number, created_by_id
    ]);

    // Fetch the newly created agent
    const [newRows] = await connection.query(`
      SELECT a.*, 
             c.country_name, s.state_name, d.district_name, z.zone_name
      FROM agents a
      LEFT JOIN countries c ON a.country_id = c.country_id
      LEFT JOIN states s ON a.state_id = s.state_id
      LEFT JOIN districts d ON a.district_id = d.district_id
      LEFT JOIN zones z ON a.zone_id = z.zone_id
      WHERE a.id = ?
    `, [result.insertId]);

    const newAgent = newRows[0];
    const { password: _, ...agentWithoutPassword } = newAgent;
    
    await connection.commit();

    // Send welcome email asynchronously
