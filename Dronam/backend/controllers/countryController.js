const { db } = require('../config/database');

// Get all countries
const getAllCountries = (req, res) => {
  try {
    const countries = db.prepare('SELECT * FROM countries WHERE status = 1 ORDER BY name').all();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries', details: error.message });
  }
};

// Get single country by ID
const getCountryById = (req, res) => {
  try {
    const country = db.prepare('SELECT * FROM countries WHERE id = ? AND status = 1').get(req.params.id);
    if (country) {
      res.json(country);
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch country', details: error.message });
  }
};

// Create new country
const createCountry = (req, res) => {
  const { name, code, capital } = req.body;
  
  if (!name || !code) {
    return res.status(400).json({ error: 'Name and code are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO countries (name, code, capital) VALUES (?, ?, ?)');
    const result = stmt.run(name, code, capital);
    
    // Get the newly created country with all fields
    const newCountry = db.prepare('SELECT * FROM countries WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      message: 'Country created successfully!',
      country: newCountry
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create country', details: error.message });
  }
};

// Update country
const updateCountry = (req, res) => {
  const { name, code, capital } = req.body;
  const { id } = req.params;

  if (!name || !code) {
    return res.status(400).json({ error: 'Name and code are required' });
  }

  try {
    const stmt = db.prepare('UPDATE countries SET name = ?, code = ?, capital = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(name, code, capital, id);
    
    if (result.changes > 0) {
      res.json({ message: 'Country updated successfully!' });
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update country', details: error.message });
  }
};

// Delete country (soft delete)
const deleteCountry = (req, res) => {
  try {
    const stmt = db.prepare('UPDATE countries SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes > 0) {
      res.json({ message: 'Country deleted successfully!' });
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete country', details: error.message });
  }
};

module.exports = {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry
};