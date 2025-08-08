const { db } = require('../config/database');

// Get all zones
const getAllZones = (req, res) => {
  try {
    const zones = db.prepare(`
      SELECT z.*, d.name as district_name, s.name as state_name, c.name as country_name 
      FROM zones z 
      LEFT JOIN districts d ON z.district_id = d.id 
      LEFT JOIN states s ON d.state_id = s.id 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE z.status = 1 
      ORDER BY z.name
    `).all();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch zones', details: error.message });
  }
};

// Get zones by district
const getZonesByDistrict = (req, res) => {
  try {
    const zones = db.prepare(`
      SELECT z.*, d.name as district_name 
      FROM zones z 
      LEFT JOIN districts d ON z.district_id = d.id 
      WHERE z.district_id = ? AND z.status = 1 
      ORDER BY z.name
    `).all(req.params.districtId);
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch zones', details: error.message });
  }
};

// Get single zone by ID
const getZoneById = (req, res) => {
  try {
    const zone = db.prepare(`
      SELECT z.*, d.name as district_name, s.name as state_name, c.name as country_name 
      FROM zones z 
      LEFT JOIN districts d ON z.district_id = d.id 
      LEFT JOIN states s ON d.state_id = s.id 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE z.id = ? AND z.status = 1
    `).get(req.params.id);
    
    if (zone) {
      res.json(zone);
    } else {
      res.status(404).json({ error: 'Zone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch zone', details: error.message });
  }
};

// Create new zone
const createZone = (req, res) => {
  const { name, code, district_id, description } = req.body;
  
  if (!name || !code || !district_id) {
    return res.status(400).json({ error: 'Name, code, and district_id are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO zones (name, code, district_id, description) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, code, district_id, description);
    
    // Get the newly created zone with all fields
    const newZone = db.prepare(`
      SELECT z.*, d.name as district_name, s.name as state_name, c.name as country_name 
      FROM zones z 
      LEFT JOIN districts d ON z.district_id = d.id 
      LEFT JOIN states s ON d.state_id = s.id 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE z.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({
      message: 'Zone created successfully!',
      zone: newZone
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create zone', details: error.message });
  }
};

// Update zone
const updateZone = (req, res) => {
  const { name, code, district_id, description } = req.body;
  const { id } = req.params;

  if (!name || !code || !district_id) {
    return res.status(400).json({ error: 'Name, code, and district_id are required' });
  }

  try {
    const stmt = db.prepare('UPDATE zones SET name = ?, code = ?, district_id = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(name, code, district_id, description, id);
    
    if (result.changes > 0) {
      res.json({ message: 'Zone updated successfully!' });
    } else {
      res.status(404).json({ error: 'Zone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update zone', details: error.message });
  }
};

// Delete zone (soft delete)
const deleteZone = (req, res) => {
  try {
    const stmt = db.prepare('UPDATE zones SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes > 0) {
      res.json({ message: 'Zone deleted successfully!' });
    } else {
      res.status(404).json({ error: 'Zone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete zone', details: error.message });
  }
};

module.exports = {
  getAllZones,
  getZonesByDistrict,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
};