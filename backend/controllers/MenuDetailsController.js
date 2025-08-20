const { pool } = require('../config/database');

// Get all menu details
const getAllMenuDetails = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT md.*, mm.menu_name 
      FROM menu_details md
      JOIN menumaster mm ON md.menu_id = mm.menu_id
      ORDER BY md.menudetails_id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching menu details:', err);
    res.status(500).json({ error: 'Failed to fetch menu details', details: err.message });
  }
};

// Get single menu detail by ID
const getMenuDetailById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT md.*, mm.menu_name 
      FROM menu_details md
      JOIN menumaster mm ON md.menu_id = mm.menu_id
      WHERE md.menudetails_id = ?
    `, [req.params.id]);

    rows.length > 0
      ? res.json(rows[0])
      : res.status(404).json({ error: 'Menu detail not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu detail', details: err.message });
  }
};

// Get menu details by menu_id
const getMenuDetailsByMenuId = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM menu_details 
      WHERE menu_id = ?
      ORDER BY menudetails_id ASC
    `, [req.params.menuId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu details by menu ID', details: err.message });
  }
};

// Create new menu detail
const createMenuDetail = async (req, res) => {
  const { menu_id, variant_type, rate } = req.body;
  
  if (!menu_id || !variant_type || rate === undefined) {
    return res.status(400).json({ 
      error: 'menu_id, variant_type, and rate are required' 
    });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO menu_details (menu_id, variant_type, rate) 
      VALUES (?, ?, ?)
    `, [menu_id, variant_type, rate]);
    
    const [newMenuDetail] = await pool.query(`
      SELECT * FROM menu_details WHERE menudetails_id = ?
    `, [result.insertId]);

    if (newMenuDetail.length === 0) {
      return res.status(404).json({ error: 'Menu detail not found after creation' });
    }

    res.status(201).json({ 
      message: 'Menu detail created successfully!', 
      menuDetail: newMenuDetail[0] 
    });
  } catch (err) {
    const isForeignKeyError = err.code === 'ER_NO_REFERENCED_ROW_2';
    res.status(isForeignKeyError ? 400 : 500).json({ 
      error: isForeignKeyError ? 'Invalid menu_id: menu does not exist' : 'Failed to create menu detail', 
      details: err.message 
    });
  }
};

// Update menu detail
const updateMenuDetail = async (req, res) => {
  const { menu_id, variant_type, rate } = req.body;
  const { id } = req.params;
  
  if (!menu_id || !variant_type || rate === undefined) {
    return res.status(400).json({ 
      error: 'menu_id, variant_type, and rate are required' 
    });
  }

  try {
    const [result] = await pool.query(`
      UPDATE menu_details 
      SET menu_id = ?, variant_type = ?, rate = ?
      WHERE menudetails_id = ?
    `, [menu_id, variant_type, rate, id]);

    result.affectedRows > 0
      ? res.json({ message: 'Menu detail updated successfully!' })
      : res.status(404).json({ error: 'Menu detail not found' });
  } catch (err) {
    const isForeignKeyError = err.code === 'ER_NO_REFERENCED_ROW_2';
    const isUniqueError = err.code === 'ER_DUP_ENTRY';
    res.status(isForeignKeyError || isUniqueError ? 400 : 500).json({ 
      error: isForeignKeyError ? 'Invalid menu_id: menu does not exist' : 
             isUniqueError ? 'Duplicate entry: this combination already exists' : 
             'Failed to update menu detail', 
      details: err.message 
    });
  }
};

// Delete menu detail
const deleteMenuDetail = async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM menu_details 
      WHERE menudetails_id = ?
    `, [req.params.id]);

    result.affectedRows > 0
      ? res.json({ message: 'Menu detail deleted successfully!' })
      : res.status(404).json({ error: 'Menu detail not found' });
  } catch (err) {
    const isForeignKeyError = err.code === 'ER_ROW_IS_REFERENCED';
    res.status(isForeignKeyError ? 400 : 500).json({ 
      error: isForeignKeyError ? 'Cannot delete menu detail: it has associated records' : 'Failed to delete menu detail', 
      details: err.message 
    });
  }
};

module.exports = {
  getAllMenuDetails,
  getMenuDetailById,
  getMenuDetailsByMenuId,
  createMenuDetail,
  updateMenuDetail,
  deleteMenuDetail
};
