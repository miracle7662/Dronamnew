const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');

// Get all zones
router.get('/', zoneController.getAllZones);

// Get single zone
router.get('/:id', zoneController.getZoneById);

// Create new zone
router.post('/', zoneController.createZone);

// Update zone
router.put('/:id', zoneController.updateZone);

// Delete zone
router.delete('/:id', zoneController.deleteZone);

module.exports = router;
