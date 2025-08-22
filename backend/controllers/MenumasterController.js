
const { pool } = require('../config/database');

// Get all menu items (active only)
const getAllMenuItems = async (req, res) => {
  console.log('GET /api/menumaster request received');
  try {
    if (!pool) throw new Error('Database pool is not initialized');
    const [rows] = await pool.query(`
      SELECT * FROM menumaster 
      WHERE status = 1
      ORDER BY menu_name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to fetch menu items', details: err.message });
  }
};

// Get single menu item by ID
const getMenuItemById = async (req, res) => {
  console.log(`GET /api/menumaster/${req.params.id} request received`);
  try {
    if (!pool) throw new Error('Database pool is not initialized');
    const [rows] = await pool.query(`
      SELECT * FROM menumaster 
      WHERE menu_id = ? AND status = 1
    `, [req.params.id]);

    rows.length > 0
      ? res.json(rows[0])
      : res.status(404).json({ error: 'Menu item not found' });
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: 'Failed to fetch menu item', details: err.message });
  }
};

// Create new menu item
const createMenuItem = async (req, res) => {
  console.log('POST /api/menumaster request received');
  const { menu_name, description, food_type, categories_id, preparation_time, created_by_id } = req.body;
  if (!menu_name || !categories_id || !created_by_id) {
    return res.status(400).json({ error: 'Menu name, category ID, and created by ID are required' });
  }

  try {
    if (!pool) throw new Error('Database pool is not initialized');
    const [result] = await pool.query(`
      INSERT INTO menumaster (menu_name, description, food_type, categories_id, preparation_time, status, created_by_id, created_by_date)
      VALUES (?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP)
    `, [menu_name, description || null, food_type || 'veg', categories_id, preparation_time || null, created_by_id]);
    
    const [newMenuItem] = await pool.query(`
      SELECT * FROM menumaster WHERE menu_id = ?
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
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Menu name must be unique' : 'Failed to create menu item', 
      details: err.message 
    });
  }
};

// Update menu item
// Update menu item
const updateMenuItem = async (req, res) => {
  console.log(`PUT /api/menumaster/${req.params.id} request received`);
  const { 
    menu_name, 
    description, 
    food_type, 
    categories_id, 
    preparation_time, 
    updated_by_id, 
    status 
  } = req.body;
  const { id } = req.params;

  // Validate required fields
  if (!menu_name || !categories_id || !updated_by_id) {
    return res.status(400).json({ error: 'Menu name, category ID, and updated by ID are required' });
  }

  // Validate food_type
  const validFoodTypes = ['veg', 'nonveg'];
  if (!validFoodTypes.includes(food_type)) {
    return res.status(400).json({ error: 'Food type must be "veg" or "nonveg"' });
  }

  // Validate and format preparation_time
  let prepTime = preparation_time || null;
  if (prepTime && !/^\d{2}:\d{2}:\d{2}$/.test(prepTime)) {
    return res.status(400).json({ error: 'Preparation time must be in HH:MM:SS format (e.g., 00:20:00)' });
  }

  // Validate status (must be 0 or 1)
  const statusValue = (status === 0 || status === 1) ? status : 1; // default to Active if not provided

  try {
    if (!pool) throw new Error('Database pool is not initialized');
    console.log('Executing UPDATE query with values:', { 
      menu_name, 
      description, 
      food_type, 
      categories_id, 
      prepTime, 
      status: statusValue, 
      updated_by_id, 
      id 
    });

    const [result] = await pool.query(`
      UPDATE menumaster 
      SET menu_name = ?, 
          description = ?, 
          food_type = ?, 
          categories_id = ?, 
          preparation_time = ?, 
          status = ?, 
          updated_by_id = ?, 
          updated_by_date = CURRENT_TIMESTAMP
      WHERE menu_id = ?
    `, [menu_name, description || null, food_type, categories_id, prepTime, statusValue, updated_by_id, id]);

    if (result.affectedRows === 0) {
      console.log('No rows affected, menu_id not found:', id);
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ 
      message: 'Menu item updated successfully!', 
      updated_at: new Date().toISOString() 
    });
  } catch (err) {
    console.error('Update error:', err);
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    const isForeignKeyError = err.code === 'ER_NO_REFERENCED_ROW_2';
    if (isForeignKeyError) {
      return res.status(400).json({ error: 'Invalid category ID', details: err.message });
    }
    res.status(isUniqueError ? 400 : 500).json({ 
      error: isUniqueError ? 'Menu name must be unique' : 'Failed to update menu item', 
      details: err.message 
    });
  }
};


// Delete menu item (permanent deletion)
const deleteMenuItem = async (req, res) => {
  console.log(`DELETE /api/menumaster/${req.params.id} request received`);
  try {
    if (!pool) throw new Error('Database pool is not initialized');
    const [result] = await pool.query(`
      DELETE FROM menumaster 
      WHERE menu_id = ?
    `, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully!', deleted_at: new Date().toISOString() });
  } catch (err) {
    console.error('Delete error:', err);
    const isForeignKeyError = err.code === 'ER_ROW_IS_REFERENCED';
    if (isForeignKeyError) {
      return res.status(400).json({ error: 'Cannot delete menu item: it has associated records', details: err.message });
    }
    res.status(500).json({ 
      error: 'Failed to delete menu item', 
      details: err.message 
    });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
