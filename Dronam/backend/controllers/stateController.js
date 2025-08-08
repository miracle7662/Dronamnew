const { db } = require('../config/database');

// Get all states with country name (join with countrymasters)
const getAllStates = (req, res) => {
  try {
    const states = db.prepare(`
      SELECT s.*, c.country_name 
      FROM states s
      LEFT JOIN countrymasters c ON s.country_id = c.country_id
      ORDER BY s.state_name
    `).all();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch states', details: err.message });
  }
};

// Get single state by ID
const getStateById = (req, res) => {
  try {
    const state = db.prepare(`SELECT * FROM states WHERE state_id = ?`).get(req.params.id);
    if (!state) return res.status(404).json({ error: 'State not found' });
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch state', details: err.message });
  }
};

// Create new state
const createState = (req, res) => {
  const { state_name, state_code, capital, country_id, created_by_id } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO states (state_name, state_code, capital, country_id, created_by_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(state_name, state_code, capital, country_id, created_by_id);
    const newState = db.prepare(`SELECT * FROM states WHERE state_id = ?`).get(result.lastInsertRowid);
    res.status(201).json({ message: 'State created', state: newState });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create state', details: err.message });
  }
};

// Update existing state
const updateState = (req, res) => {
  const { state_name, state_code, capital, country_id, updated_by_id } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE states SET 
        state_name = ?, 
        state_code = ?, 
        capital = ?, 
        country_id = ?, 
        updated_by_id = ?, 
        updated_date = CURRENT_TIMESTAMP 
      WHERE state_id = ?
    `);
    const result = stmt.run(state_name, state_code, capital, country_id, updated_by_id, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'State not found' });
    const updatedState = db.prepare(`SELECT * FROM states WHERE state_id = ?`).get(req.params.id);
    res.json({ message: 'State updated', state: updatedState });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update state', details: err.message });
  }
};

// Soft delete (set status = 0)
const deleteState = (req, res) => {
  try {
    const stmt = db.prepare(`
      UPDATE states SET status = 0, updated_date = CURRENT_TIMESTAMP WHERE state_id = ?
    `);
    const result = stmt.run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'State not found' });
    res.json({ message: 'State deleted (soft)' });
  } catch (err) {
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
