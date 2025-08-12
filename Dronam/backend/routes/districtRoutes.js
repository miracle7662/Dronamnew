const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtControllerUpdated');

// Get all districts with state information
router.get('/', districtController.getAllDistricts);

// Get districts by state
router.get('/state/:stateId', districtController.getDistrictsByState);

// Get single district by ID
router.get('/:id', districtController.getDistrictById);

// Create new district
router.post('/', districtController.createDistrict);

// Update district
router.put('/:id', districtController.updateDistrict);

// Delete district (soft delete)
router.delete('/:id', districtController.deleteDistrict);

// Get districts count
router.get('/count/total', districtController.getDistrictsCount);

module.exports = router;
