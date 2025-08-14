const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { sendWelcomeEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hotel Login - Following same pattern as superadmin and agent
const login = async (req, res) => {
    console.log("Login attempt:", req.body); // Debugging log
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find hotel by email and ensure it's active
    const [rows] = await pool.execute(
      'SELECT * FROM hotels WHERE email = ? AND status = 1', 
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const hotel = rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, hotel.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
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

    // Remove password from response
    const { password: _, ...hotelWithoutPassword } = hotel;

    res.json({
      success: true,
      message: 'Hotel login successful!',
      token,
      user: {
        id: hotel.hotelid,
        email: hotel.email,
        name: hotel.hotel_name,
        role: 'hotel'
      }
    });

  } catch (error) {
    console.error('Hotel login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during hotel login',
      details: error.message 
    });
  }
};

// Get all hotels
const getAllHotels = async (req, res) => {
  try {
    const query = `
      SELECT h.*, 
             c.country_name, 
             s.state_name, 
             d.district_name, 
             z.zone_name 
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      ORDER BY h.hotelid DESC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get hotel by ID
const getHotelById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT h.*, 
             c.country_name, 
             s.state_name, 
             d.district_name, 
             z.zone_name 
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      WHERE h.hotelid = ?
    `;
    const [rows] = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new hotel
const createHotel = async (req, res) => {
  const {
    email,
    password,
    hotel_name,
    hotel_type,
    role = 'hotel',
    address,
    phone,
    country_id,
    state_id,
    district_id,
    zone_id,
    gst_no,
    pan_no,
    aadhar_no,
    owner_name,
    owner_mobile,
    hotel_timeMorning,
    hotel_timeEvening,
    status = 1,
    created_by_id,
    masteruserid
  } = req.body;

  try {
    // Check if email already exists
    const emailCheckQuery = 'SELECT * FROM hotels WHERE email = ?';
    const [existingEmails] = await pool.query(emailCheckQuery, [email]);
    
    if (existingEmails.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO hotels (
        email, password, hotel_name, hotel_type, role, address, phone,
        country_id, state_id, district_id, zone_id, gst_no, pan_no,
        aadhar_no, owner_name, owner_mobile, hotel_timeMorning, hotel_timeEvening,
        status, created_by_id, masteruserid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      email,
      hashedPassword,
      hotel_name,
      hotel_type,
      role,
      address,
      phone,
      country_id,
      state_id,
      district_id,
      zone_id,
      gst_no,
      pan_no,
      aadhar_no,
      owner_name,
      owner_mobile,
      hotel_timeMorning,
      hotel_timeEvening,
      status,
      created_by_id,
      masteruserid
    ]);

    const newHotel = {
      hotelid: result.insertId,
      email,
      hotel_name,
      hotel_type,
      role,
      address,
      phone,
      country_id,
      state_id,
      district_id,
      zone_id,
      gst_no,
      pan_no,
      aadhar_no,
      owner_name,
      owner_mobile,
      hotel_timeMorning,
      hotel_timeEvening,
      status,
      created_by_id,
      masteruserid
    };

    // Send welcome email
    try {
      await sendWelcomeEmail(email, hotel_name);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    res.status(201).json(newHotel);
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update hotel
const updateHotel = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    password,
    hotel_name,
    hotel_type,
    role,
    address,
    phone,
    country_id,
    state_id,
    district_id,
    zone_id,
    gst_no,
    pan_no,
    aadhar_no,
    owner_name,
    owner_mobile,
    hotel_timeMorning,
    hotel_timeEvening,
    status,
    updated_by_id
  } = req.body;

  try {
    // Check if email exists for another hotel
    const emailCheckQuery = 'SELECT * FROM hotels WHERE email = ? AND hotelid != ?';
    const [existingEmails] = await pool.query(emailCheckQuery, [email, id]);
    
    if (existingEmails.length > 0) {
      return res.status(400).json({ message: 'Email already exists for another hotel' });
    }

    // Prepare update query
    let query = `
      UPDATE hotels SET
        email = ?, 
        hotel_name = ?, 
        hotel_type = ?, 
        role = ?, 
        address = ?, 
        phone = ?, 
        country_id = ?, 
        state_id = ?, 
        district_id = ?, 
        zone_id = ?, 
        gst_no = ?, 
        pan_no = ?, 
        aadhar_no = ?, 
        owner_name = ?, 
        owner_mobile = ?, 
        hotel_timeMorning = ?, 
        hotel_timeEvening = ?, 
        status = ?, 
        updated_by_id = ?,
        updated_date = NOW()
    `;

    const values = [
      email,
      hotel_name,
      hotel_type,
      role,
      address,
      phone,
      country_id,
      state_id,
      district_id,
      zone_id,
      gst_no,
      pan_no,
      aadhar_no,
      owner_name,
      owner_mobile,
      hotel_timeMorning,
      hotel_timeEvening,
      status,
      updated_by_id
    ];

    // Add password to update if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = ?`;
      values.push(hashedPassword);
    }

    query += ` WHERE hotelid = ?`;
    values.push(id);

    await pool.query(query, values);
    res.json({ message: 'Hotel updated successfully' });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete hotel
const deleteHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM hotels WHERE hotelid = ?';
    await pool.query(query, [id]);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check user by email
const checkUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const query = 'SELECT * FROM hotels WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    if (rows.length > 0) {
      return res.json({ exists: true, user: rows[0] });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Search hotels
const searchHotels = async (req, res) => {
  const { query } = req.query;
  try {
    const searchQuery = `
      SELECT * FROM hotels 
      WHERE hotel_name LIKE ? OR email LIKE ? OR phone LIKE ?
      ORDER BY hotelid DESC
    `;
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query(searchQuery, [searchTerm, searchTerm, searchTerm]);
    res.json(rows);
  } catch (error) {
    console.error('Error searching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get hotels by status
const getHotelsByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const query = `
      SELECT h.*, 
             c.country_name, 
             s.state_name, 
             d.district_name, 
             z.zone_name 
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      WHERE h.status = ?
      ORDER BY hotelid DESC
    `;
    const [rows] = await pool.query(query, [status]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hotels by status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get hotels count
const getHotelsCount = async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) as count FROM hotels';
    const [rows] = await pool.query(query);
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error('Error fetching hotels count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  login,
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  checkUserByEmail,
  searchHotels,
  getHotelsByStatus,
  getHotelsCount
};
