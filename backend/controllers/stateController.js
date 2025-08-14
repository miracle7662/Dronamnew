const { pool } = require('../config/database');

// Get all states with country name
const getAllStates = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, c.country_name 
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

// Get single state by ID
const getStateById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM states WHERE state_id = ?
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
  const { state_name, state_code, capital, country_id, status = 1, created_by_id } = req.body;
  if (!state_name || !state_code || !country_id) {
    return res.status(400).json({ error: 'State name, code and country ID are required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO states (state_name, state_code, capital, country_id, status, created_by_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [state_name, state_code, capital, country_id, status, created_by_id]);

    const [newState] = await pool.query(`
      SELECT * FROM states WHERE state_id = ?
    `, [result.insertId]);

    if (newState.length === 0) {
      return res.status(404).json({ error: 'State not found after creation' });
    }

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
  const { state_name, state_code, capital, country_id, status = 1, updated_by_id } = req.body;
  const { id } = req.params;
  if (!state_name || !state_code || !country_id) {
    return res.status(400).json({ error: 'State name, code and country ID are required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE states
      SET state_name = ?, state_code = ?, capital = ?, country_id = ?, status = ?, 
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP
      WHERE state_id = ?
    `, [state_name, state_code, capital, country_id, status, updated_by_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'State not found' });
    }

    res.json({ message: 'State updated successfully!' });
  } catch (err) {
    console.error('Error in updateState:', err);
    res.status(500).json({ error: 'Failed to update state', details: err.message });
  }
};

// Delete state
const deleteState = async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM states WHERE state_id = ?
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

module.exports = {
  getAllStates,
  getStateById,
  createState,
  updateState,
  deleteState
};
