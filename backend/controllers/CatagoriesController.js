const { pool } = require('../config/database');

// Get all categories (active only)
const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM categories 
      WHERE status = 1
      ORDER BY categories_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM categories 
      WHERE categories_id = ? AND status = 1
    `, [req.params.id]);

    rows.length > 0
      ? res.json(rows[0])
      : res.status(404).json({ error: 'Category not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category', details: err.message });
  }
};

// Create new category
const createCategory = async (req, res) => {
  const { categories_name, description, status = 1, created_by_id, } = req.body;
  if (!categories_name || !description) {
    return res.status(400).json({ error: 'Category name and description are required' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO categories (categories_name, description, status, created_by_id) 
      VALUES (?, ?, ?, ?)
    `, [categories_name, description, status, created_by_id]);
    
    const [newCategory] = await pool.query(`
      SELECT * FROM categories WHERE categories_id = ?
    `, [result.insertId]);

    if (newCategory.length === 0) {
      return res.status(404).json({ error: 'Category not found after creation' });
    }

    res.status(201).json({ 
      message: 'Category created successfully!', 
      category: newCategory[0] 
    });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Category name must be unique' : 'Failed to create category', 
      details: err.message 
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  const { categories_name, description, status = 1, updated_by_id } = req.body;
  const { id } = req.params;
  if (!categories_name || !description) {
    return res.status(400).json({ error: 'Category name and description are required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE categories 
      SET categories_name = ?, description = ?, status = ?, 
          updated_by_id = ?, updated_by_date = CURRENT_TIMESTAMP 
      WHERE categories_id = ?
    `, [categories_name, description, status, updated_by_id, id]);

    result.affectedRows > 0
      ? res.json({ message: 'Category updated successfully!' })
      : res.status(404).json({ error: 'Category not found' });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Category name must be unique' : 'Failed to update category', 
      details: err.message 
    });
  }
};

// Delete category - permanent deletion from database
const deleteCategory = async (req, res) => {
  try {
    // First check if category exists
    const [existing] = await pool.query(`
      SELECT * FROM categories 
      WHERE categories_id = ?
    `, [req.params.id]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Perform actual deletion from database
    const [result] = await pool.query(`
      DELETE FROM categories 
      WHERE categories_id = ?
    `, [req.params.id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Category deleted successfully!' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    const isForeignKeyError = err.code === 'ER_ROW_IS_REFERENCED' || err.errno === 1451;
    res.status(isForeignKeyError ? 400 : 500).json({ 
      error: isForeignKeyError ? 'Cannot delete category: it has associated records' : 'Failed to delete category', 
      details: err.message 
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};