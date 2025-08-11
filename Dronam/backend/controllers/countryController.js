const { pool } = require('../config/database');

// Get all countries
const getAllCountries = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM countries 
      ORDER BY country_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching countries:', err); // Added detailed error logging
    res.status(500).json({ error: 'Failed to fetch countries', details: err.message });
  }
};

// Get single country by ID
const getCountryById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM countries 
      WHERE country_id = ? AND status = 1
    `, [req.params.id]);

    rows.length > 0
      ? res.json(rows[0])
      : res.status(404).json({ error: 'Country not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch country', details: err.message });
  }
};

// Create new country
const createCountry = async (req, res) => {
  const { country_name, country_code, capital, status = 1, created_by_id } = req.body;
  if (!country_name || !country_code) {
    return res.status(400).json({ error: 'Country name and code are required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO countries (country_name, country_code, capital, status, created_by_id) 
      VALUES (?, ?, ?, ?, ?)
    `, [country_name, country_code, capital, status, created_by_id]);
    
    const [newCountry] = await pool.query(`
      SELECT * FROM countries WHERE country_id = ?
    `, [result.insertId]);

    if (newCountry.length === 0) {
      return res.status(404).json({ error: 'Country not found after creation' });
    }

    res.status(201).json({ 
      message: 'Country created successfully!', 
      country: newCountry[0] 
    });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Country code must be unique' : 'Failed to create country', 
      details: err.message 
    });
  }
};

// Update country
const updateCountry = async (req, res) => {
  const { country_name, country_code, capital, status = 1, updated_by_id } = req.body;
  const { id } = req.params;
  if (!country_name || !country_code) {
    return res.status(400).json({ error: 'Country name and code are required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE countries 
      SET country_name = ?, country_code = ?, capital = ?, status = ?, 
          updated_by_id = ?, updated_date = CURRENT_TIMESTAMP 
      WHERE country_id = ?
    `, [country_name, country_code, capital, status, updated_by_id, id]);

    result.affectedRows > 0
      ? res.json({ message: 'Country updated successfully!' })
      : res.status(404).json({ error: 'Country not found' });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Country code must be unique' : 'Failed to update country', 
      details: err.message 
    });
  }
};

// Delete country
const deleteCountry = async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM countries 
      WHERE country_id = ?
    `, [req.params.id]);

    result.affectedRows > 0
      ? res.json({ message: 'Country deleted successfully!' })
      : res.status(404).json({ error: 'Country not found' });
  } catch (err) {
    const isForeignKeyError = err.code === 'ER_ROW_IS_REFERENCED';
    res.status(isForeignKeyError ? 400 : 500).json({ 
      error: isForeignKeyError ? 'Cannot delete country: it has associated states' : 'Failed to delete country', 
      details: err.message 
    });
  }
};

module.exports = {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry
};
