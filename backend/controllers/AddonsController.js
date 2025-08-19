const { pool } = require('../config/database');

// Get all addons
const getAllAddons = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM addonsMaster 
      ORDER BY addon_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching addons:', err);
    res.status(500).json({ error: 'Failed to fetch addons', details: err.message });
  }
};

// Get single addon by ID
const getAddonById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM addonsMaster 
      WHERE addon_id = ? AND status = 1
    `, [req.params.id]);

    rows.length > 0
      ? res.json(rows[0])
      : res.status(404).json({ error: 'Addon not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addon', details: err.message });
  }
};

// Create new addon
const createAddon = async (req, res) => {
console.log('Incoming request body:', req.body);
const { addon_name, description, rate, unit_id, unit_conversion, created_by_id } = req.body;
  if (!addon_name || !description || !rate || !unit_id || !unit_conversion) {
    return res.status(400).json({ error: 'Addon name, description, rate, unit_id, and unit_conversion are required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO addonsMaster (addon_name, description, rate, unit_id, unit_conversion, created_by_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [addon_name, description, rate, unit_id, unit_conversion, created_by_id]);
    
    const [newAddon] = await pool.query(`
      SELECT * FROM addonsMaster WHERE addon_id = ?
    `, [result.insertId]);

    if (newAddon.length === 0) {
      return res.status(404).json({ error: 'Addon not found after creation' });
    }

    res.status(201).json({ 
      message: 'Addon created successfully!', 
      addon: newAddon[0] 
    });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Addon name must be unique' : 'Failed to create addon', 
      details: err.message 
    });
  }
};

// Update addon
const updateAddon = async (req, res) => {
  const { addon_name, description, rate, unit_id, unit_conversion, updated_by_id } = req.body;
  const { id } = req.params;
  if (!addon_name || !description || !rate || !unit_id || !unit_conversion) {
    return res.status(400).json({ error: 'Addon name, description, rate, unit_id, and unit_conversion are required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE addonsMaster 
      SET addon_name = ?, description = ?, rate = ?, unit_id = ?, unit_conversion = ?, 
          updated_by_id = ?, updated_by_date = CURRENT_TIMESTAMP 
      WHERE addon_id = ?
    `, [addon_name, description, rate, unit_id, unit_conversion, updated_by_id, id]);

    result.affectedRows > 0
      ? res.json({ message: 'Addon updated successfully!' })
      : res.status(404).json({ error: 'Addon not found' });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Addon name must be unique' : 'Failed to update addon', 
      details: err.message 
    });
  }
};

// Delete addon
const deleteAddon = async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM addonsMaster 
      WHERE addon_id = ?
    `, [req.params.id]);

    result.affectedRows > 0
      ? res.json({ message: 'Addon deleted successfully!' })
      : res.status(404).json({ error: 'Addon not found' });
  } catch (err) {
    const isForeignKeyError = err.code === 'ER_ROW_IS_REFERENCED';
    res.status(isForeignKeyError ? 400 : 500).json({ 
      error: isForeignKeyError ? 'Cannot delete addon: it has associated records' : 'Failed to delete addon', 
      details: err.message 
    });
  }
};

module.exports = {
  getAllAddons,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon
};
