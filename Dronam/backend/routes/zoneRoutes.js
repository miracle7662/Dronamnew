const express = require('express');
const router = express.Router();
const zonesController = require('../controllers/zoneController');

// Get all zones
router.get('/', zonesController.getAllZones);

// Get zones by district
router.get('/district/:districtId', zonesController.getZonesByDistrict);

// Get single zone
router.get('/:id', zonesController.getZoneById);

// Create new zone
router.post('/', zonesController.createZone);

// Update zone
router.put('/:id', zonesController.updateZone);

// Delete zone
router.delete('/:id', zonesController.deleteZone);

module.exports = router;