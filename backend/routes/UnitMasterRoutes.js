const express = require('express');
const router = express.Router();
const unitMasterController = require('../controllers/UnitMasterController');

// Get all units
router.get('/', unitMasterController.getAllUnits);

// Get single unit
router.get('/:id', unitMasterController.getUnitById);

// Create new unit
router.post('/', unitMasterController.createUnit);

// Update unit
router.put('/:id', unitMasterController.updateUnit);

// Delete unit
router.delete('/:id', unitMasterController.deleteUnit);

// Get active units only
router.get('/active/list', unitMasterController.getActiveUnits);

module.exports = router;
