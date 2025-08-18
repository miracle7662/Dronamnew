const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/CatagoriesController');

// Get all categories
router.get('/', categoriesController.getAllCategories);

// Get single category
router.get('/:id', categoriesController.getCategoryById);

// Create new category
router.post('/', categoriesController.createCategory);

// Update category
router.put('/:id', categoriesController.updateCategory);

// Delete category
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;
