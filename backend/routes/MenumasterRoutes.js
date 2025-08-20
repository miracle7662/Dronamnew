// const express = require('express');
// const router = express.Router();
// const {
//   getAllMenuItems,
//   getMenuItemById,
//   createMenuItem,
//   updateMenuItem,
//   deleteMenuItem
// } = require('../controllers/MenumasterController');

// // Get all menu items
// router.get('/', getAllMenuItems);

// // Get single menu item by ID
// router.get('/:id', getMenuItemById);

// // Create new menu item
// router.post('/', createMenuItem);

// // Update menu item
// router.put('/:id', updateMenuItem);

// // Delete menu item
// router.delete('/:id', deleteMenuItem);

// module.exports = router;



const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/MenumasterController');

// Get all menu items
router.get('/', getAllMenuItems);

// Get single menu item by ID
router.get('/:id', getMenuItemById);

// Create new menu item
router.post('/', createMenuItem);

// Update menu item
router.put('/:id', updateMenuItem);

// Delete menu item
router.delete('/:id', deleteMenuItem);

module.exports = router;
