const { db } = require('../config/database');

// Get all districts
const getAllDistricts = (req, res) => {
  try {
    const districts = db.prepare(`
      SELECT d.*, s.state_name as state_name 
      FROM districts d 
      LEFT JOIN states s ON d.state_id = s.state_id 
      WHERE d.status = 1 
      ORDER BY d.district_name
    `).all();
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch districts', details: error.message });
  }
};

// Get districts by state
const getDistrictsByState = (req, res) => {
  try {
    const districts = db.prepare(`
      SELECT * FROM districts 
      WHERE state_id = ? AND status = 1 
      ORDER BY district_name
    `).all(req.params.stateId);
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch districts', details: error.message });
  }
};

// Get single district by ID
const getDistrictById = (req, res) => {
  try {
    const district = db.prepare(`
      SELECT d.*, s.state_name as state_name 
      FROM districts d 
      LEFT JOIN states s ON d.state_id = s.state_id 
      WHERE d.district_id = ? AND d.status = 1
    `).get(req.params.id);
    
    if (district) {
      res.json(district);
    } else {
      res.status(404).json({ error: 'District not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch district', details: error.message });
  }
};

// Create new district
const createDistrict = (req, res) => {
  const { district_name, district_code, state_id, description, created_by_id } = req.body;
  
  if (!district_name || !district_code || !state_id) {
    return res.status(400).json({ error: 'District name, code, and state_id are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO districts 
      (district_name, district_code, state_id, description, created_by_id) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(district_name, district_code, state_id, description, created_by_id);
    
    // Get the newly created district with all fields
    const newDistrict = db.prepare(`
      SELECT d.*, s.state_name as state_name 
      FROM districts d 
      LEFT JOIN states s ON d.state_id = s.state_id 
      WHERE d.district_id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({
      message: 'District created successfully!',
      district: newDistrict
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create district', details: error.message });
  }
};

// Update district
const updateDistrict = (req, res) => {
  const { district_name, district_code, state_id, description, updated_by_id } = req.body;
  const { id } = req.params;

  if (!district_name || !district_code || !state_id) {
    return res.status(400).json({ error: 'District name, code, and state_id are required' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE districts 
      SET district_name = ?, district_code = ?, state_id = ?, description = ?, 
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP 
      WHERE district_id = ?
    `);
    const result = stmt.run(district_name, district_code, state_id, description, updated_by_id, id);
    
    if (result.changes > 0) {
      res.json({ message: 'District updated successfully!' });
    } else {
      res.status(404).json({ error: 'District not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update district', details: error.message });
  }
};

// Delete district (soft delete)
const deleteDistrict = (req, res) => {
  try {
    const stmt = db.prepare(`
      UPDATE districts 
      SET status = 0, updated_date = CURRENT_TIMESTAMP 
      WHERE district_id = ?
    `);
    const result = stmt.run(req.params.id);
    
    if (result.changes > 0) {
      res.json({ message: 'District deleted successfully!' });
    } else {
      res.status(404).json({ error: 'District not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete district', details: error.message });
  }
};

module.exports = {
  getAllDistricts,
  getDistrictsByState,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
};