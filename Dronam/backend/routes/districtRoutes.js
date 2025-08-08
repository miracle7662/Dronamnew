const express = require('express');
const router = express.Router();
const districtsController = require('../controllers/districtController');

// Get all districts
router.get('/', districtsController.getAllDistricts);

// Get districts by state
router.get('/state/:stateId', districtsController.getDistrictsByState);

// Get single district
router.get('/:id', districtsController.getDistrictById);

// Create new district
router.post('/', districtsController.createDistrict);

// Update district
router.put('/:id', districtsController.updateDistrict);

// Delete district
router.delete('/:id', districtsController.deleteDistrict);

module.exports = router;