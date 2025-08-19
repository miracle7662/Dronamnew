const { pool } = require('../config/database');

// Get all menu items with category details
const getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.*,
        c.categories_name as category_name
      FROM menumaster m
      LEFT JOIN categories c ON m.category_id = c.categories_id
      WHERE m.status = 1
      ORDER BY m.menu_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to fetch menu items', details: err.message });
  }
};

// Get single menu item by ID with category details
const getMenuItemById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.*,
        c.categories_name as category_name
      FROM menumaster m
      LEFT JOIN categories c ON m.category_id = c.categories_id
      WHERE m.menu_id = ? AND m.status = 1
    `, [req.params.id]);

    rows.length > 0
      ? res.json(rows[0])
      : res.status(404).json({ error: 'Menu item not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu item', details: err.message });
  }
};

// Create new menu item
const createMenuItem = async (req, res) => {
  const { 
    menu_name, 
    description, 
    food_type, 
    category_id, 
    preparation_time, 
    status = 1, 
    created_by_id 
  } = req.body;

  if (!menu_name || !category_id || !food_type) {
    return res.status(400).json({ 
      error: 'Menu name, category_id, and food_type are required' 
    });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO menumaster (
        menu_name, description, food_type, category_id, 
        preparation_time, status, created_by_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      menu_name, 
      description, 
      food_type, 
      category_id, 
      preparation_time, 
      status, 
      created_by_id
    ]);
    
    const [newMenuItem] = await pool.query(`
      SELECT 
        m.*,
        c.categories_name as category_name
      FROM menumaster m
      LEFT JOIN categories c ON m.category_id = c.categories_id
      WHERE m.menu_id = ?
    `, [result.insertId]);

    if (newMenuItem.length === 0) {
      return res.status(404).json({ error: 'Menu item not found after creation' });
    }

    res.status(201).json({ 
      message: 'Menu item created successfully!', 
      menuItem: newMenuItem[0] 
    });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    const isForeignKeyError = err.code === 'ER_NO_REFERENCED_ROW_2';
    
    res.status(isUniqueError || isForeignKeyError ? 400 : 500).json({ 
      error: isUniqueError 
        ? 'Menu name must be unique' 
        : isForeignKeyError 
          ? 'Invalid category_id provided' 
          : 'Failed to create menu item', 
      details: err.message 
    });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  const { 
    menu_name, 
    description, 
    food_type, 
    category_id, 
    preparation_time, 
    status = 1, 
    updated_by_id 
  } = req.body;
  
  const { id } = req.params;

  if (!menu_name || !category_id || !food_type) {
    return res.status(400).json({ 
      error: 'Menu name, category_id, and food_type are required' 
    });
  }

  try {
    const [result] = await pool.query(`
      UPDATE menumaster 
      SET 
        menu_name = ?, 
        description = ?, 
        food_type = ?, 
        category_id = ?, 
        preparation_time = ?, 
        status = ?, 
        updated_by_id = ?, 
        updated_by_date = CURRENT_TIMESTAMP 
      WHERE menu_id = ?
    `, [
      menu_name, 
      description, 
      food_type, 
      category_id, 
      preparation_time, 
      status, 
      updated_by_id, 
      id
    ]);

    result.affectedRows > 0
      ? res.json({ message: 'Menu item updated successfully!' })
      : res.status(404).json({ error: 'Menu item not found' });
  } catch (err) {
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    const isForeignKeyError = err.code === 'ER_NO_REFERENCED_ROW_2';
    
    res.status(isUniqueError || isForeignKeyError ? 400 : 500).json({ 
      error: isUniqueError 
        ? 'Menu name must be unique' 
        : isForeignKeyError 
          ? 'Invalid category_id provided' 
          : 'Failed to update menu item', 
      details: err.message 
    });
  }
};

// Delete menu item (soft delete by setting status to 0)
const deleteMenuItem = async (req, res) => {
  try {
    const { updated_by_id } = req.body; // Extract updated_by_id from request body
    if (!updated_by_id) {
      return res.status(400).json({ error: 'updated_by_id is required for deletion' });
    }

    const [result] = await pool.query(`
      UPDATE menumaster 
      SET status = 0, 
          updated_by_id = ?, 
          updated_by_date = CURRENT_TIMESTAMP 
      WHERE menu_id = ?
    `, [updated_by_id, req.params.id]);

    result.affectedRows > 0
      ? res.json({ message: 'Menu item deleted successfully!' })
      : res.status(404).json({ error: 'Menu item not found' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to delete menu item', 
      details: err.message 
    });
  }
};

// Get menu items by category
const getMenuItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        m.*,
        c.categories_name as category_name
      FROM menumaster m
      LEFT JOIN categories c ON m.category_id = c.categories_id
      WHERE m.category_id = ? AND m.status = 1
      ORDER BY m.menu_name ASC
    `, [categoryId]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch menu items by category', 
      details: err.message 
    });
  }
};

// Get menu items by food type
const getMenuItemsByFoodType = async (req, res) => {
  try {
    const { foodType } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        m.*,
        c.categories_name as category_name
      FROM menumaster m
      LEFT JOIN categories c ON m.category_id = c.categories_id
      WHERE m.food_type = ? AND m.status = 1
      ORDER BY m.menu_name ASC
    `, [foodType]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch menu items by food type', 
      details: err.message 
    });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
  getMenuItemsByFoodType
};