const { pool } = require('../config/database');

// Get all states with country information
const getAllStates = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, c.country_name as country_name, c.country_code as country_code
      FROM states s
      LEFT JOIN countries c ON s.country_id = c.country_id
      ORDER BY s.state_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error in getAllStates:', err);
    res.status(500).json({ error: 'Failed to fetch states', details: err.message });
  }
};

// Get states by country
const getStatesByCountry = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM states 
      WHERE country_id = ? 
      ORDER BY state_name ASC
    `, [req.params.countryId]);
    res.json(rows);
  } catch (err) {
    console.error('Error in getStatesByCountry:', err);
    res.status(500).json({ error: 'Failed to fetch states', details: err.message });
  }
};

// Get single state by ID
const getStateById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, c.country_name as country_name, c.country_code as country_code
      FROM states s
      LEFT JOIN countries c ON s.country_id = c.country_id
      WHERE s.state_id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'State not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in getStateById:', err);
    res.status(500).json({ error: 'Failed to fetch state', details: err.message });
  }
};

// Create new state
const createState = async (req, res) => {
  const { state_name, state_code, capital, country_id, description, status = 1, created_by_id } = req.body;
  
  if (!state_name || !state_code || !country_id) {
    return res.status(400).json({ error: 'State name, code and country ID are required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO states (state_name, state_code, capital, country_id, description, status, created_by_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [state_name, state_code, capital, country_id, description || '', status, created_by_id]);

    const [newState] = await pool.query(`
      SELECT s.*, c.country_name as country_name, c.country_code as country_code
      FROM states s
      LEFT JOIN countries c ON s.country_id = c.country_id
      WHERE s.state_id = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'State created successfully!',
      state: newState[0]
    });
  } catch (err) {
    console.error('Error in createState:', err);
    res.status(500).json({ error: 'Failed to create state', details: err.message });
  }
};

// Update state
const updateState = async (req, res) => {
  const { state_name, state_code, capital, country_id, description, status = 1, updated_by_id } = req.body;
  const { id } = req.params;

  if (!state_name || !state_code || !country_id) {
    return res.status(400).json({ error: 'State name, code and country ID are required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE states
      SET state_name = ?, state_code = ?, capital = ?, country_id = ?, description = ?, status = ?,
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP
      WHERE state_id = ?
    `, [state_name, state_code, capital, country_id, description || '', status, updated_by_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'State not found' });
    }

    const [updatedState] = await pool.query(`
      SELECT s.*, c.country_name as country_name, c.country_code as country_code
      FROM states s
      LEFT JOIN countries c ON s.country_id = c.country_id
      WHERE s.state_id = ?
    `, [id]);

    res.json({
      message: 'State updated successfully!',
      state: updatedState[0]
    });
  } catch (err) {
    console.error('Error in updateState:', err);
    res.status(500).json({ error: 'Failed to update state', details: err.message });
  }
};

// Delete state (soft delete)
const deleteState = async (req, res) => {
  try {
    const [result] = await pool.query(`
      UPDATE states 
      SET status = 0, updated_date = CURRENT_TIMESTAMP 
      WHERE state_id = ?
    `, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'State not found' });
    }

    res.json({ message: 'State deleted successfully!' });
  } catch (err) {
    console.error('Error in deleteState:', err);
    res.status(500).json({ error: 'Failed to delete state', details: err.message });
  }
};

// Get states count
const getStatesCount = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM states WHERE status = 1');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in getStatesCount:', err);
    res.status(500).json({ error: 'Failed to fetch states count', details: err.message });
  }
};

module.exports = {
  getAllStates,
  getStatesByCountry,
  getStateById,
  createState,
  updateState,
  deleteState,
  getStatesCount
};
