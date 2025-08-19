const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
  getMenuItemsByFoodType
} = require('../controllers/MenumasterController');

// GET /api/menumaster - Get all menu items
router.get('/', getAllMenuItems);

// GET /api/menumaster/:id - Get single menu item by ID
router.get('/:id', getMenuItemById);

// POST /api/menumaster - Create new menu item
router.post('/', createMenuItem);

// PUT /api/menumaster/:id - Update menu item
router.put('/:id', updateMenuItem);

// DELETE /api/menumaster/:id - Delete menu item
router.delete('/:id', deleteMenuItem);

// GET /api/menumaster/category/:categoryId - Get menu items by category
router.get('/category/:categoryId', getMenuItemsByCategory);

// GET /api/menumaster/foodtype/:foodType - Get menu items by food type
router.get('/foodtype/:foodType', getMenuItemsByFoodType);

module.exports = router;
