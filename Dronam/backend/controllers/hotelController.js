const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { sendWelcomeEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login hotel
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
        hotel_name: hotel.hotel_name 
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

// Get all hotels
const getAllHotels = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      ORDER BY h.hotel_name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Get single hotel by ID
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      WHERE h.hotelid = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Failed to fetch hotel', details: error.message });
  }
};

// Create new hotel
const createHotel = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      hotel_name, 
      hotel_type, 
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
      created_by_id
    } = req.body;
    
    if (!email || !password || !hotel_name || !phone) {
      return res.status(400).json({ error: 'Hotel name, email, phone, and password are required' });
    }

    // Check if email already exists
    const [existingRows] = await pool.query('SELECT hotelid FROM hotels WHERE email = ?', [email]);
    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(`
      INSERT INTO hotels 
      (email, password, hotel_name, hotel_type, address, phone, country_id, state_id, 
       district_id, zone_id, gst_no, pan_no, aadhar_no, owner_name, owner_mobile, 
       hotel_timeMorning, hotel_timeEvening, status, created_by_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      email, hashedPassword, hotel_name, hotel_type, address, phone, country_id, state_id,
      district_id, zone_id, gst_no, pan_no, aadhar_no, owner_name, owner_mobile,
      hotel_timeMorning, hotel_timeEvening, status, created_by_id || 1
    ]);

    const [newHotelRows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      WHERE h.hotelid = ?
    `, [result.insertId]);
    
    if (newHotelRows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found after creation' });
    }

    const newHotel = newHotelRows[0];
    const { password: _, ...hotelWithoutPassword } = newHotel;
    
    // Send welcome email with login credentials
    try {
      await sendWelcomeEmail(email, hotel_name, password);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({
      message: 'Hotel created successfully! Welcome email sent.',
      hotel: hotelWithoutPassword
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Failed to create hotel', details: error.message });
  }
};

// Update hotel
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      email, 
      password, 
      hotel_name, 
      hotel_type, 
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
    
    const [hotelRows] = await pool.query('SELECT * FROM hotels WHERE hotelid = ?', [id]);
    if (hotelRows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const hotel = hotelRows[0];

    let hashedPassword = hotel.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await pool.query(`
      UPDATE hotels 
      SET email = ?, password = ?, hotel_name = ?, hotel_type = ?, address = ?, 
          phone = ?, country_id = ?, state_id = ?, district_id = ?, zone_id = ?, 
          gst_no = ?, pan_no = ?, aadhar_no = ?, owner_name = ?, owner_mobile = ?, 
          hotel_timeMorning = ?, hotel_timeEvening = ?, status = ?, 
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP
      WHERE hotelid = ?
    `, [
      email || hotel.email, 
      hashedPassword, 
      hotel_name || hotel.hotel_name, 
      hotel_type || hotel.hotel_type, 
      address || hotel.address, 
      phone || hotel.phone, 
      country_id || hotel.country_id, 
      state_id || hotel.state_id, 
      district_id || hotel.district_id, 
      zone_id || hotel.zone_id, 
      gst_no || hotel.gst_no, 
      pan_no || hotel.pan_no, 
      aadhar_no || hotel.aadhar_no, 
      owner_name || hotel.owner_name, 
      owner_mobile || hotel.owner_mobile, 
      hotel_timeMorning || hotel.hotel_timeMorning, 
      hotel_timeEvening || hotel.hotel_timeEvening, 
      status !== undefined ? status : hotel.status, 
      updated_by_id || 1,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const [updatedRows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      WHERE h.hotelid = ?
    `, [id]);

    const updatedHotel = updatedRows[0];
    const { password: _, ...hotelWithoutPassword } = updatedHotel;
    
    res.json({
      message: 'Hotel updated successfully!',
      hotel: hotelWithoutPassword
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Failed to update hotel', details: error.message });
  }
};

// Toggle hotel status (block/unblock)
const toggleHotelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [hotelRows] = await pool.query('SELECT * FROM hotels WHERE hotelid = ?', [id]);
    if (hotelRows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const newStatus = status === 1 ? 1 : 0;
    
    const [result] = await pool.query('UPDATE hotels SET status = ?, updated_date = CURRENT_TIMESTAMP WHERE hotelid = ?', [newStatus, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const [updatedRows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      WHERE h.hotelid = ?
    `, [id]);
    
    const updatedHotel = updatedRows[0];
    const { password: _, ...hotelWithoutPassword } = updatedHotel;
    
    const statusText = newStatus === 1 ? 'activated' : 'blocked';
    res.json({ 
      message: `Hotel ${statusText} successfully!`,
      hotel: hotelWithoutPassword
    });
  } catch (error) {
    console.error('Error toggling hotel status:', error);
    res.status(500).json({ error: 'Failed to update hotel status', details: error.message });
  }
};

// Delete hotel
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [hotelRows] = await pool.query('SELECT * FROM hotels WHERE hotelid = ?', [id]);
    if (hotelRows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const [result] = await pool.query('DELETE FROM hotels WHERE hotelid = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json({ message: 'Hotel deleted successfully!' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
  }
};

// Get hotels by country
const getHotelsByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    const [rows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      WHERE h.country_id = ?
      ORDER BY h.hotel_name ASC
    `, [countryId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hotels by country:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Get hotels by state
const getHotelsByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    const [rows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      WHERE h.state_id = ?
      ORDER BY h.hotel_name ASC
    `, [stateId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hotels by state:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Get hotels by district
const getHotelsByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;
    const [rows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      WHERE h.district_id = ?
      ORDER BY h.hotel_name ASC
    `, [districtId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hotels by district:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Get hotels by zone
const getHotelsByZone = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const [rows] = await pool.query(`
      SELECT h.*, 
             c.country_name,
             s.state_name,
             d.district_name,
             z.zone_name,
             a.name as created_by_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.country_id
      LEFT JOIN states s ON h.state_id = s.state_id
      LEFT JOIN districts d ON h.district_id = d.district_id
      LEFT JOIN zones z ON h.zone_id = z.zone_id
      LEFT JOIN agents a ON h.created_by_id = a.id
      WHERE h.zone_id = ?
      ORDER BY h.hotel_name ASC
    `, [zoneId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hotels by zone:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

module.exports = {
  login,
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  toggleHotelStatus,
  deleteHotel,
  getHotelsByCountry,
  getHotelsByState,
  getHotelsByDistrict,
  getHotelsByZone
};
