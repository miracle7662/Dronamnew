const { pool } = require('../config/database');

// Get all districts with state information
const getAllDistricts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, s.state_name as state_name, s.state_code as state_code
      FROM districts d
      LEFT JOIN states s ON d.state_id = s.state_id
      ORDER BY d.district_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error in getAllDistricts:', err);
    res.status(500).json({ error: 'Failed to fetch districts', details: err.message });
  }
};

// Get districts by state
const getDistrictsByState = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM districts 
      WHERE state_id = ? 
      ORDER BY district_name ASC
    `, [req.params.stateId]);
    res.json(rows);
  } catch (err) {
    console.error('Error in getDistrictsByState:', err);
    res.status(500).json({ error: 'Failed to fetch districts', details: err.message });
  }
};

// Get single district by ID
const getDistrictById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, s.state_name as state_name, s.state_code as state_code
      FROM districts d
      LEFT JOIN states s ON d.state_id = s.state_id
      WHERE d.district_id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'District not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in getDistrictById:', err);
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
      INSERT INTO districts 
      (district_name, district_code, state_id, description, status, created_by_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [district_name, district_code, state_id, description || '', status, created_by_id]);

    const [newDistrict] = await pool.query(`
      SELECT d.*, s.state_name as state_name, s.state_code as state_code
      FROM districts d
      LEFT JOIN states s ON d.state_id = s.state_id
      WHERE d.district_id = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'District created successfully!',
      district: newDistrict[0]
    });
  } catch (err) {
    console.error('Error in createDistrict:', err);
    res.status(500).json({ error: 'Failed to create district', details: err.message });
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
    `, [district_name, district_code, state_id, description || '', status, updated_by_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'District not found' });
    }

    const [updatedDistrict] = await pool.query(`
      SELECT d.*, s.state_name as state_name, s.state_code as state_code
      FROM districts d
      LEFT JOIN states s ON d.state_id = s.state_id
      WHERE d.district_id = ?
    `, [id]);

    res.json({
      message: 'District updated successfully!',
      district: updatedDistrict[0]
    });
  } catch (err) {
    console.error('Error in updateDistrict:', err);
    res.status(500).json({ error: 'Failed to update district', details: err.message });
  }
};

// Delete district (soft delete)
const deleteDistrict = async (req, res) => {
  try {
    const [result] = await pool.query(`
      UPDATE districts 
      SET status = 0, updated_date = CURRENT_TIMESTAMP 
      WHERE district_id = ?
    `, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'District not found' });
    }

    res.json({ message: 'District deleted successfully!' });
  } catch (err) {
    console.error('Error in deleteDistrict:', err);
    res.status(500).json({ error: 'Failed to delete district', details: err.message });
  }
};

// Get districts count
const getDistrictsCount = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM districts WHERE status = 1');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in getDistrictsCount:', err);
    res.status(500).json({ error: 'Failed to fetch districts count', details: err.message });
  }
};

module.exports = {
  getAllDistricts,
  getDistrictsByState,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getDistrictsCount
};
