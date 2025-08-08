const { db } = require('../config/database');

// Get all states with filtering and search capabilities
const getAllStates = (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT s.*, c.country_name 
      FROM states s
      LEFT JOIN countries c ON s.country_id = c.country_id
    `;
    
    const params = [];
    
    if (status !== undefined) {
      query += ` WHERE s.status = ?`;
      params.push(parseInt(status));
    }
    
    if (search) {
      query += status !== undefined ? ` AND` : ` WHERE`;
      query += ` (s.state_name LIKE ? OR s.state_code LIKE ? OR s.capital LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY s.state_name`;
    
    const states = db.prepare(query).all(...params);
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
  const { state_name, state_code, capital, country_id, status = 1, created_by_id } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO states (state_name, state_code, capital, country_id, status, created_by_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(state_name, state_code, capital, country_id, status, created_by_id);
    const newState = db.prepare(`SELECT * FROM states WHERE state_id = ?`).get(result.lastInsertRowid);
    res.status(201).json({ message: 'State created', state: newState });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create state', details: err.message });
  }
};

// Update existing state
const updateState = (req, res) => {
  const { state_name, state_code, capital, country_id, status, updated_by_id } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE states SET 
        state_name = ?, 
        state_code = ?, 
        capital = ?, 
        country_id = ?, 
        status = ?,
        updated_by_id = ?, 
        updated_date = CURRENT_TIMESTAMP 
      WHERE state_id = ?
    `);
    const result = stmt.run(state_name, state_code, capital, country_id, status, updated_by_id, req.params.id);
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

// Bulk update status for multiple states
const bulkUpdateStatus = (req, res) => {
  try {
    const { stateIds, status, updated_by_id } = req.body;
    
    if (!Array.isArray(stateIds) || stateIds.length === 0) {
      return res.status(400).json({ error: 'State IDs array is required' });
    }
    
    const placeholders = stateIds.map(() => '?').join(',');
    const stmt = db.prepare(`
      UPDATE states SET 
        status = ?, 
        updated_by_id = ?, 
        updated_date = CURRENT_TIMESTAMP 
      WHERE state_id IN (${placeholders})
    `);
    
    const result = stmt.run(status, updated_by_id, ...stateIds);
    res.json({ 
      message: `${result.changes} states updated successfully`, 
      updatedCount: result.changes 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bulk update states', details: err.message });
  }
};

// Restore inactive state (set status = 1)
const restoreState = (req, res) => {
  try {
    const { updated_by_id } = req.body;
    const stmt = db.prepare(`
      UPDATE states SET 
        status = 1, 
        updated_by_id = ?, 
        updated_date = CURRENT_TIMESTAMP 
      WHERE state_id = ?
    `);
    const result = stmt.run(updated_by_id, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'State not found' });
    res.json({ message: 'State restored successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore state', details: err.message });
  }
};

// Get states count by status
const getStatesCount = (req, res) => {
  try {
    const counts = db.prepare(`
      SELECT 
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as inactive_count,
        COUNT(*) as total_count
      FROM states
    `).get();
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch states count', details: err.message });
  }
};

module.exports = {
  getAllStates,
  getStateById,
  createState,
  updateState,
  deleteState,
  bulkUpdateStatus,
  restoreState,
  getStatesCount
};
