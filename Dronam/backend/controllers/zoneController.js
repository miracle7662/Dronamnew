const { db } = require('../config/database');

// Get all zones
const getAllZones = (req, res) => {
  try {
    const zones = db.prepare(`
      SELECT z.*, d.district_name as district_name, s.state_name as state_name
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      LEFT JOIN states s ON d.state_id = s.state_id
      ORDER BY z.zone_name
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
      SELECT z.*, d.district_name as district_name
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      WHERE z.district_id = ?
      ORDER BY z.zone_name
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
      SELECT z.*, d.district_name as district_name, s.state_name as state_name
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      LEFT JOIN states s ON d.state_id = s.state_id
      WHERE z.zone_id = ?
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
  const { zone_name, zone_code, district_id, description, status, created_by_id } = req.body;
  
  if (!zone_name || !zone_code || !district_id) {
    return res.status(400).json({ error: 'Zone name, code, and district_id are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO zones 
      (zone_name, zone_code, district_id, description, status, created_by_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(zone_name, zone_code, district_id, description || '', status || 1, created_by_id);
    
    // Get the newly created zone with all fields
    const newZone = db.prepare(`
      SELECT z.*, d.district_name as district_name, s.state_name as state_name
      FROM zones z
      LEFT JOIN districts d ON z.district_id = d.district_id
      LEFT JOIN states s ON d.state_id = s.state_id
      WHERE z.zone_id = ?
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
  const { zone_name, zone_code, district_id, description, status, updated_by_id } = req.body;
  const { id } = req.params;

  if (!zone_name || !zone_code || !district_id) {
    return res.status(400).json({ error: 'Zone name, code, and district_id are required' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE zones 
      SET zone_name = ?, zone_code = ?, district_id = ?, description = ?, status = ?,
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP 
      WHERE zone_id = ?
    `);
    const result = stmt.run(zone_name, zone_code, district_id, description || '', status || 1, updated_by_id, id);
    
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
    const stmt = db.prepare(`
      UPDATE zones 
      SET status = 0, updated_date = CURRENT_TIMESTAMP 
      WHERE zone_id = ?
    `);
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
