
const { db } = require('../config/database');

// Get all countries
const getAllCountries = (req, res) => {
  try {
    const countries = db.prepare(`
      SELECT * FROM countries 
      ORDER BY country_name
    `).all();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch countries', details: err.message });
  }
};

// Get single country by ID
const getCountryById = (req, res) => {
  try {
    const country = db.prepare(`
      SELECT * FROM countries 
      WHERE country_id = ? AND status = 1
    `).get(req.params.id);

    country
      ? res.json(country)
      : res.status(404).json({ error: 'Country not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch country', details: err.message });
  }
};

// Create new country
const createCountry = (req, res) => {
  const { country_name, country_code, capital, status = 1, created_by_id } = req.body;
  if (!country_name || !country_code) {
    return res.status(400).json({ error: 'Country name and code are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO countries (country_name, country_code, capital, status, created_by_id) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(country_name, country_code, capital, status, created_by_id);
    const newCountry = db.prepare(`SELECT * FROM countries WHERE country_id = ?`).get(result.lastInsertRowid);

    res.status(201).json({ message: 'Country created successfully!', country: newCountry });
  } catch (err) {
    const isUniqueError = err.message.includes('UNIQUE constraint failed');
    res.status(isUniqueError ? 400 : 500).json({ error: isUniqueError ? 'Country code must be unique' : 'Failed to create country', details: err.message });
  }
};

// Update country
const updateCountry = (req, res) => {
  const { country_name, country_code, capital, status = 1, updated_by_id } = req.body;
  const { id } = req.params;
  if (!country_name || !country_code) {
    return res.status(400).json({ error: 'Country name and code are required' });
  }

  try {
    const result = db.prepare(`
      UPDATE countries 
      SET country_name = ?, country_code = ?, capital = ?, status = ?, 
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP 
      WHERE country_id = ?
    `).run(country_name, country_code, capital, status, updated_by_id, id);

    result.changes
      ? res.json({ message: 'Country updated successfully!' })
      : res.status(404).json({ error: 'Country not found' });
  } catch (err) {
    const isUniqueError = err.message.includes('UNIQUE constraint failed');
    res.status(isUniqueError ? 400 : 500).json({ error: isUniqueError ? 'Country code must be unique' : 'Failed to update country', details: err.message });
  }
};

// Soft delete country
const deleteCountry = (req, res) => {
  try {
    const result = db.prepare(`
  DELETE FROM countries 
      WHERE country_id = ?
    `).run(req.params.id);

    result.changes
      ? res.json({ message: 'Country deleted successfully!' })
      : res.status(404).json({ error: 'Country not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete country', details: err.message });
  }
};

module.exports = {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry
};
