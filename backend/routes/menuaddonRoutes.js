const express = require('express');
const router = express.Router();
const menumasterController = require('../controllers/MenumasterController');

// Menu Addon Routes
router.post('/', menumasterController.createMenuAddon);
router.get('/:menuId', menumasterController.getMenuAddons);
router.put('/:id', menumasterController.updateMenuAddon);
router.delete('/:id', menumasterController.deleteMenuAddon);

module.exports = router;
