const { db } = require('../config/database');

// Get all districts
const getAllDistricts = (req, res) => {
  try {
    const districts = db.prepare(`
      SELECT d.*, s.name as state_name, c.name as country_name 
      FROM districts d 
      LEFT JOIN states s ON d.state_id = s.id 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE d.status = 1 
      ORDER BY d.name
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
      SELECT d.*, s.name as state_name 
      FROM districts d 
      LEFT JOIN states s ON d.state_id = s.id 
      WHERE d.state_id = ? AND d.status = 1 
      ORDER BY d.name
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
      SELECT d.*, s.name as state_name, c.name as country_name 
      FROM districts d 
      LEFT JOIN states s ON d.state_id = s.id 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE d.id = ? AND d.status = 1
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
  const { name, code, state_id, description } = req.body;
  
  if (!name || !code || !state_id) {
    return res.status(400).json({ error: 'Name, code, and state_id are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO districts (name, code, state_id, description) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, code, state_id, description);
    
    // Get the newly created district with all fields
    const newDistrict = db.prepare(`
      SELECT d.*, s.name as state_name, c.name as country_name 
      FROM districts d 
      LEFT JOIN states s ON d.state_id = s.id 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE d.id = ?
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
  const { name, code, state_id, description } = req.body;
  const { id } = req.params;

  if (!name || !code || !state_id) {
    return res.status(400).json({ error: 'Name, code, and state_id are required' });
  }

  try {
    const stmt = db.prepare('UPDATE districts SET name = ?, code = ?, state_id = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(name, code, state_id, description, id);
    
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
    const stmt = db.prepare('UPDATE districts SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
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