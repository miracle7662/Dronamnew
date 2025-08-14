const { pool } = require('../config/database');

// Get all districts
const getAllDistricts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM districts 
      ORDER BY district_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching districts:', err);
    res.status(500).json({ error: 'Failed to fetch districts', details: err.message });
  }
};

// Get single district by ID
const getDistrictById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM districts 
      WHERE district_id = ? AND status = 1
    `, [req.params.id]);

    rows.length > 0
      ? res.json(rows[0])
      : res.status(404).json({ error: 'District not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch district', details: err.message });
  }
};

// Create new district
const createDistrict = async (req, res) => {
  const { district_name, district_code, state_id, description, status = 1, created_by_id } = req.body;
  if (!district_name || !district_code || !state_id) {
    return res.status(400).json({ error: 'District name, code, and state_id are required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO districts (district_name, district_code, state_id, description, status, created_by_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [district_name, district_code, state_id, description, status, created_by_id]);
    
    const [newDistrict] = await pool.query(`
      SELECT * FROM districts WHERE district_id = ?
    `, [result.insertId]);

    if (newDistrict.length === 0) {
      return res.status(404).json({ error: 'District not found after creation' });
    }

    res.status(201).json({ 
      message: 'District created successfully!', 
      district: newDistrict[0] 
    });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'District code must be unique' : 'Failed to create district', 
      details: err.message 
    });
  }
};

// Update district
const updateDistrict = async (req, res) => {
  const { district_name, district_code, state_id, description, status = 1, updated_by_id } = req.body;
  const { id } = req.params;
  if (!district_name || !district_code || !state_id) {
    return res.status(400).json({ error: 'District name, code, and state_id are required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE districts 
      SET district_name = ?, district_code = ?, state_id = ?, description = ?, status = ?, 
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP 
      WHERE district_id = ?
    `, [district_name, district_code, state_id, description, status, updated_by_id, id]);

    result.affectedRows > 0
      ? res.json({ message: 'District updated successfully!' })
      : res.status(404).json({ error: 'District not found' });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'District code must be unique' : 'Failed to update district', 
      details: err.message 
    });
  }
};

// Delete district
const deleteDistrict = async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM districts 
      WHERE district_id = ?
    `, [req.params.id]);

    result.affectedRows > 0
      ? res.json({ message: 'District deleted successfully!' })
      : res.status(404).json({ error: 'District not found' });
  } catch (err) {
    const isForeignKeyError = err.code === 'ER_ROW_IS_REFERENCED';
    res.status(isForeignKeyError ? 400 : 500).json({ 
      error: isForeignKeyError ? 'Cannot delete district: it has associated zones' : 'Failed to delete district', 
      details: err.message 
    });
  }
};

module.exports = {
  getAllDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
};
