const { db } = require('../config/database');

// Country table structure:
// country_id (INTEGER, PRIMARY KEY AUTOINCREMENT)
// country_name (TEXT, NOT NULL)
// country_code (TEXT, NOT NULL, UNIQUE)
// capital (TEXT)
// status (INTEGER, DEFAULT 1)
// created_by_id (INTEGER)
// created_date (DATETIME, DEFAULT CURRENT_TIMESTAMP)
// updated_by_id (INTEGER)
// updated_date (DATETIME, DEFAULT CURRENT_TIMESTAMP)

// Get all countries
const getAllCountries = (req, res) => {
  try {
    const countries = db.prepare(`
      SELECT 
        country_id,
        country_name,
        country_code,
        capital,
        status,
        created_by_id,
        created_date,
        updated_by_id,
        updated_date
      FROM countries 
      WHERE status = 1 
      ORDER BY country_name
    `).all();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries', details: error.message });
  }
};

// Get single country by ID
const getCountryById = (req, res) => {
  try {
    const country = db.prepare(`
      SELECT * FROM countries 
      WHERE country_id = ? AND status = 1
    `).get(req.params.id);
    
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
  const { country_name, country_code, capital, created_by_id } = req.body;
  
  if (!country_name || !country_code) {
    return res.status(400).json({ error: 'Country name and code are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO countries 
      (country_name, country_code, capital, created_by_id) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(country_name, country_code, capital, created_by_id);
    
    // Get the newly created country
    const newCountry = db.prepare(`
      SELECT * FROM countries 
      WHERE country_id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({
      message: 'Country created successfully!',
      country: newCountry
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Country code must be unique' });
    } else {
      res.status(500).json({ error: 'Failed to create country', details: error.message });
    }
  }
};

// Update country
const updateCountry = (req, res) => {
  const { country_name, country_code, capital, updated_by_id } = req.body;
  const { id } = req.params;

  if (!country_name || !country_code) {
    return res.status(400).json({ error: 'Country name and code are required' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE countries 
      SET country_name = ?, country_code = ?, capital = ?, 
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP 
      WHERE country_id = ?
    `);
    const result = stmt.run(country_name, country_code, capital, updated_by_id, id);
    
    if (result.changes > 0) {
      res.json({ message: 'Country updated successfully!' });
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Country code must be unique' });
    } else {
      res.status(500).json({ error: 'Failed to update country', details: error.message });
    }
  }
};

// Delete country (soft delete)
const deleteCountry = (req, res) => {
  try {
    const stmt = db.prepare(`
      UPDATE countries 
      SET status = 0, updated_date = CURRENT_TIMESTAMP 
      WHERE country_id = ?
    `);
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