const express = require('express');
const router = express.Router();
const addonsController = require('../controllers/AddonsController');

// Addon Routes
router.post('/', addonsController.createAddon);
router.get('/', addonsController.getAllAddons);
router.get('/:id', addonsController.getAddonById);
router.put('/:id', addonsController.updateAddon);
router.delete('/:id', addonsController.deleteAddon);

module.exports = router;
