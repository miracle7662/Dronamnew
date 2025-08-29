const express = require('express');
const router = express.Router();
const menumasterController = require('../controllers/MenumasterController');

// Menu Master Routes
router.post('/menu', menumasterController.createMenu);
router.get('/menus', menumasterController.getAllMenus);
router.get('/menu/:id', menumasterController.getMenuById);
router.put('/menu/:id', menumasterController.updateMenu);
router.delete('/menu/:id', menumasterController.deleteMenu);

// Menu Details Routes
router.post('/menu-detail', menumasterController.createMenuDetail);
router.get('/menu-details/:menuId', menumasterController.getMenuDetails);
router.put('/menu-detail/:id', menumasterController.updateMenuDetail);
router.delete('/menu-detail/:id', menumasterController.deleteMenuDetail);

// Menu Addon Routes
router.post('/menu-addon', menumasterController.createMenuAddon);
router.get('/menu-addons/:menuId', menumasterController.getMenuAddons);
router.put('/menu-addon/:id', menumasterController.updateMenuAddon);
router.delete('/menu-addon/:id', menumasterController.deleteMenuAddon);

module.exports = router;
