const { db } = require('../config/database');

// Get all states
const getAllStates = (req, res) => {
  try {
    const states = db.prepare(`
      SELECT s.*, c.name as country_name 
      FROM states s 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE s.status = 1 
      ORDER BY s.name
    `).all();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch states', details: error.message });
  }
};

// Get states by country
const getStatesByCountry = (req, res) => {
  try {
    const states = db.prepare(`
      SELECT * FROM states 
      WHERE country_id = ? AND status = 1 
      ORDER BY name
    `).all(req.params.countryId);
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch states', details: error.message });
  }
};

// Get single state by ID
const getStateById = (req, res) => {
  try {
    const state = db.prepare(`
      SELECT s.*, c.name as country_name 
      FROM states s 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE s.id = ? AND s.status = 1
    `).get(req.params.id);
    
    if (state) {
      res.json(state);
    } else {
      res.status(404).json({ error: 'State not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch state', details: error.message });
  }
};

// Create new state
const createState = (req, res) => {
  const { name, code, capital, country_id } = req.body;
  
  if (!name || !code || !country_id) {
    return res.status(400).json({ error: 'Name, code, and country_id are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO states (name, code, capital, country_id) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, code, capital, country_id);
    
    // Get the newly created state with all fields
    const newState = db.prepare(`
      SELECT s.*, c.name as country_name 
      FROM states s 
      LEFT JOIN countries c ON s.country_id = c.id 
      WHERE s.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({
      message: 'State created successfully!',
      state: newState
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create state', details: error.message });
  }
};

// Update state
const updateState = (req, res) => {
  const { name, code, capital, country_id } = req.body;
  const { id } = req.params;

  if (!name || !code || !country_id) {
    return res.status(400).json({ error: 'Name, code, and country_id are required' });
  }

  try {
    const stmt = db.prepare('UPDATE states SET name = ?, code = ?, capital = ?, country_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(name, code, capital, country_id, id);
    
    if (result.changes > 0) {
      res.json({ message: 'State updated successfully!' });
    } else {
      res.status(404).json({ error: 'State not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update state', details: error.message });
  }
};

// Delete state (soft delete)
const deleteState = (req, res) => {
  try {
    const stmt = db.prepare('UPDATE states SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes > 0) {
      res.json({ message: 'State deleted successfully!' });
    } else {
      res.status(404).json({ error: 'State not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete state', details: error.message });
  }
};

module.exports = {
  getAllStates,
  getStatesByCountry,
  getStateById,
  createState,
  updateState,
  deleteState
};