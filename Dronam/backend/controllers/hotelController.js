const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login hotel/user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const hotel = db.prepare('SELECT * FROM hotels WHERE email = ? AND status = 1').get(email);
    
    if (!hotel) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, hotel.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: hotel.id, 
        email: hotel.email, 
        name: hotel.name, 
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

// Get all hotels
const getAllHotels = (req, res) => {
  try {
    const hotels = db.prepare(`
      SELECT h.*, c.name as country_name, s.name as state_name, d.name as district_name, z.name as zone_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.id
      LEFT JOIN states s ON h.state_id = s.id
      LEFT JOIN districts d ON h.district_id = d.id
      LEFT JOIN zones z ON h.zone_id = z.id
      ORDER BY h.created_at DESC
    `).all();
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};

// Get hotel by ID
const getHotelById = (req, res) => {
  try {
    const { id } = req.params;
    const hotel = db.prepare(`
      SELECT h.*, c.name as country_name, s.name as state_name, d.name as district_name, z.name as zone_name
      FROM hotels h
      LEFT JOIN countries c ON h.country_id = c.id
      LEFT JOIN states s ON h.state_id = s.id
      LEFT JOIN districts d ON h.district_id = d.id
      LEFT JOIN zones z ON h.zone_id = z.id
      WHERE h.id = ?
    `).get(id);
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
};

// Create new hotel
const createHotel = async (req, res) => {
  try {
    const { email, password, name, hotel_name, phone, address, country_id, state_id, district_id, zone_id } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if email already exists
    const existingHotel = db.prepare('SELECT id FROM hotels WHERE email = ?').get(email);
    if (existingHotel) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db.prepare(`
      INSERT INTO hotels (email, password, name, hotel_name, phone, address, country_id, state_id, district_id, zone_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(email, hashedPassword, name, hotel_name, phone, address, country_id, state_id, district_id, zone_id, 1); // created_by = 1 (agent)

    const newHotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(result.lastInsertRowid);
    const { password: _, ...hotelWithoutPassword } = newHotel;
    
    res.status(201).json({
      message: 'Hotel created successfully!',
      hotel: hotelWithoutPassword
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Failed to create hotel' });
  }
};

// Update hotel
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, name, hotel_name, phone, address, country_id, state_id, district_id, zone_id, status } = req.body;
    
    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    let hashedPassword = hotel.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    db.prepare(`
      UPDATE hotels 
      SET email = ?, password = ?, name = ?, hotel_name = ?, phone = ?, address = ?, 
          country_id = ?, state_id = ?, district_id = ?, zone_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      email || hotel.email, 
      hashedPassword, 
      name || hotel.name, 
      hotel_name || hotel.hotel_name, 
      phone || hotel.phone, 
      address || hotel.address,
      country_id || hotel.country_id,
      state_id || hotel.state_id,
      district_id || hotel.district_id,
      zone_id || hotel.zone_id,
      status !== undefined ? status : hotel.status,
      id
    );

    const updatedHotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
    const { password: _, ...hotelWithoutPassword } = updatedHotel;
    
    res.json({
      message: 'Hotel updated successfully!',
      hotel: hotelWithoutPassword
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
};

// Delete hotel
const deleteHotel = (req, res) => {
  try {
    const { id } = req.params;
    
    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    db.prepare('DELETE FROM hotels WHERE id = ?').run(id);
    
    res.json({ message: 'Hotel deleted successfully!' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
};

module.exports = {
  login,
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
}; 