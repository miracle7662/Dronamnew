const express = require('express');
const MenuaddonController = require('../controllers/MenuaddonController');
const router = express.Router();

// ✅ Get all menu addons
// GET /api/menuaddons
router.get('/', MenuaddonController.getAllMenuAddons);

// ✅ Get menu addons by menu ID
// GET /api/menuaddons/menu/:menu_id
router.get('/menu/:menu_id', MenuaddonController.getMenuAddonsByMenuId);

// ✅ Create new menu addons (replace existing addons for the menu)
// POST /api/menuaddons
router.post('/', MenuaddonController.createMenuAddon);

// ✅ Update menu addons (replace all addons for a given menu_id)
// PUT /api/menuaddons/menu/:menu_id
router.put('/menu/:menu_id', MenuaddonController.updateMenuAddon);

// ✅ Delete single menuaddon by ID
// DELETE /api/menuaddons/:menuaddon_id
router.delete('/:menuaddon_id', MenuaddonController.deleteMenuAddon);

// ✅ Delete all addons for a specific menu
// DELETE /api/menuaddons/menu/:menu_id
router.delete('/menu/:menu_id', MenuaddonController.deleteMenuAddonsByMenuId);

module.exports = router;
