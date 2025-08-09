const { db } = require('../config/database');

// Get all hotels
const getAllHotels = (req, res) => {
  try {
    const hotels = db.prepare(`
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
      ORDER BY h.hotel_name
    `).all();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Get single hotel by ID
const getHotelById = (req, res) => {
  try {
    const hotel = db.prepare(`
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
    `).get(req.params.id);
    
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotel', details: error.message });
  }
};

// Create new hotel
const createHotel = (req, res) => {
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
    Owner_mobile,
    hotel_timeMorning,
    hotel_timeEvening,
    status,
    created_by_id,
    masteruserid
  } = req.body;

  if (!hotel_name || !email || !phone) {
    return res.status(400).json({ error: 'Hotel name, email, and phone are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO hotels 
      (email, password, hotel_name, hotel_type, address, phone, country_id, state_id, 
       district_id, zone_id, gst_no, pan_no, aadhar_no, owner_name, Owner_mobile, 
       hotel_timeMorning, hotel_timeEvening, status, created_by_id, masteruserid) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
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
      Owner_mobile,
      hotel_timeMorning,
      hotel_timeEvening,
      status || 1,
      created_by_id,
      masteruserid
    );
    
    // Get the newly created hotel with all fields
    const newHotel = db.prepare(`
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
    `).get(result.lastInsertRowid);
    
    res.status(201).json({
      message: 'Hotel created successfully!',
      hotel: newHotel
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create hotel', details: error.message });
  }
};

// Update hotel
const updateHotel = (req, res) => {
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
    Owner_mobile,
    hotel_timeMorning,
    hotel_timeEvening,
    status,
    updated_by_id,
    masteruserid
  } = req.body;
  const { id } = req.params;

  if (!hotel_name || !email || !phone) {
    return res.status(400).json({ error: 'Hotel name, email, and phone are required' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE hotels 
      SET email = ?, password = ?, hotel_name = ?, hotel_type = ?, address = ?, 
          phone = ?, country_id = ?, state_id = ?, district_id = ?, zone_id = ?, 
          gst_no = ?, pan_no = ?, aadhar_no = ?, owner_name = ?, Owner_mobile = ?, 
          hotel_timeMorning = ?, hotel_timeEvening = ?, status = ?, 
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP, masteruserid = ?
      WHERE hotelid = ?
    `);
    
    const result = stmt.run(
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
      Owner_mobile,
      hotel_timeMorning,
      hotel_timeEvening,
      status || 1,
      updated_by_id,
      masteruserid,
      id
    );
    
    if (result.changes > 0) {
      res.json({ message: 'Hotel updated successfully!' });
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hotel', details: error.message });
  }
};

// Delete hotel (soft delete)
const deleteHotel = (req, res) => {
  try {
    const stmt = db.prepare(`
      UPDATE hotels 
      SET status = 0, updated_date = CURRENT_TIMESTAMP 
      WHERE hotelid = ?
    `);
    const result = stmt.run(req.params.id);
    
    if (result.changes > 0) {
      res.json({ message: 'Hotel deleted successfully!' });
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
  }
};

// Get hotels by country
const getHotelsByCountry = (req, res) => {
  try {
    const hotels = db.prepare(`
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
      WHERE h.country_id = ?
      ORDER BY h.hotel_name
    `).all(req.params.countryId);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Get hotels by state
const getHotelsByState = (req, res) => {
  try {
    const hotels = db.prepare(`
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
      WHERE h.state_id = ?
      ORDER BY h.hotel_name
    `).all(req.params.stateId);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Get hotels by district
const getHotelsByDistrict = (req, res) => {
  try {
    const hotels = db.prepare(`
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
      WHERE h.district_id = ?
      ORDER BY h.hotel_name
    `).all(req.params.districtId);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

// Get hotels by zone
const getHotelsByZone = (req, res) => {
  try {
    const hotels = db.prepare(`
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
      WHERE h.zone_id = ?
      ORDER BY h.hotel_name
    `).all(req.params.zoneId);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
};

module.exports = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsByCountry,
  getHotelsByState,
  getHotelsByDistrict,
  getHotelsByZone
};
