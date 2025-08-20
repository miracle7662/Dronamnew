const express = require('express');
const MenuaddonController = require('../controllers/MenuaddonController');
const router = express.Router();

// GET /api/menuaddons - Get all menu addons
router.get('/', MenuaddonController.getAllMenuAddons);

// GET /api/menuaddons/menu/:menuId - Get menu addons by menu ID
router.get('/menu/:menuId', MenuaddonController.getMenuAddonsByMenuId);

// POST /api/menuaddons - Create new menu addon with multiple addons
router.post('/', MenuaddonController.createMenuAddon);

// PUT /api/menuaddons/:menuaddon_id - Update menu addon (will replace all addons for the menu)
router.put('/:menuaddon_id', MenuaddonController.updateMenuAddon);

// DELETE /api/menuaddons/:menuaddon_id - Delete specific menu addon
router.delete('/:menuaddon_id', MenuaddonController.deleteMenuAddon);

// DELETE /api/menuaddons/menu/:menu_id - Delete all addons for a specific menu
router.delete('/menu/:menu_id', MenuaddonController.deleteMenuAddonsByMenuId);

module.exports = router;
