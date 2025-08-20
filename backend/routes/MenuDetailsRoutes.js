const express = require('express');
const router = express.Router();
const menuDetailsController = require('../controllers/MenuDetailsController');

// Get all menu details with menu information
router.get('/', menuDetailsController.getAllMenuDetails);

// Get menu details by menu_id
router.get('/menu/:menuId', menuDetailsController.getMenuDetailsByMenuId);

// Get single menu detail by ID
router.get('/:id', menuDetailsController.getMenuDetailById);

// Create new menu detail
router.post('/', menuDetailsController.createMenuDetail);

// Update menu detail
router.put('/:id', menuDetailsController.updateMenuDetail);

// Delete menu detail
router.delete('/:id', menuDetailsController.deleteMenuDetail);

module.exports = router;
