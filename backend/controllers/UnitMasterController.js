const { pool } = require('../config/database');

// Get all units
const getAllUnits = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM units 
      WHERE status = 1
      ORDER BY unit_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching units:', err);
    res.status(500).json({ error: 'Failed to fetch units', details: err.message });
  }
};

// Get single unit by ID
const getUnitById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM units 
      WHERE unit_id = ? AND status = 1
    `, [req.params.id]);

    rows.length > 0
      ? res.json(rows[0])
      : res.status(404).json({ error: 'Unit not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unit', details: err.message });
  }
};

// Create new unit
const createUnit = async (req, res) => {
  const { unit_name, status = 1, created_by_id } = req.body;
  
  if (!unit_name) {
    return res.status(400).json({ error: 'Unit name is required' });
  }
  
  if (!created_by_id) {
    return res.status(400).json({ error: 'Created by ID is required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO units (unit_name, status, created_by_id) 
      VALUES (?, ?, ?)
    `, [unit_name, status, created_by_id]);
    
    const [newUnit] = await pool.query(`
      SELECT * FROM units WHERE unit_id = ?
    `, [result.insertId]);

    if (newUnit.length === 0) {
      return res.status(404).json({ error: 'Unit not found after creation' });
    }

    res.status(201).json({ 
      message: 'Unit created successfully!', 
      unit: newUnit[0] 
    });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Unit name must be unique' : 'Failed to create unit', 
      details: err.message 
    });
  }
};

// Update unit
const updateUnit = async (req, res) => {
  const { unit_name, status = 1, updated_by_id } = req.body;
  const { id } = req.params;
  
  if (!unit_name) {
    return res.status(400).json({ error: 'Unit name is required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE units 
      SET unit_name = ?, status = ?, 
          updated_by_id = ?, updated_by_date = CURRENT_TIMESTAMP 
      WHERE unit_id = ?
    `, [unit_name, status, updated_by_id, id]);

    result.affectedRows > 0
      ? res.json({ message: 'Unit updated successfully!' })
      : res.status(404).json({ error: 'Unit not found' });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Unit name must be unique' : 'Failed to update unit', 
      details: err.message 
    });
  }
};

// Delete unit (hard delete - fully remove row)
const deleteUnit = async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM units 
      WHERE unit_id = ?
    `, [req.params.id]);

    result.affectedRows > 0
      ? res.json({ message: 'Unit deleted successfully!' })
      : res.status(404).json({ error: 'Unit not found' });
  } catch (err) {
    console.error('Error deleting unit:', err);
    res.status(500).json({ 
      error: 'Failed to delete unit', 
      details: err.message 
    });
  }
};

// Get active units only
const getActiveUnits = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT unit_id, unit_name 
      FROM units 
      WHERE status = 1
      ORDER BY unit_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching active units:', err);
    res.status(500).json({ error: 'Failed to fetch active units', details: err.message });
  }
};

module.exports = {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
  getActiveUnits
};