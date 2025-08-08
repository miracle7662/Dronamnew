const express = require('express');
const router = express.Router();
const {
  getAllDistricts,
  getDistrictsByState,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
} = require('../controllers/districtController');

// GET all districts
router.get('/', getAllDistricts);

// GET districts by state
router.get('/by-state/:stateId', getDistrictsByState);

// GET single district by ID
router.get('/:id', getDistrictById);

// POST create new district
router.post('/', createDistrict);

// PUT update district
router.put('/:id', updateDistrict);

// DELETE district
router.delete('/:id', deleteDistrict);

module.exports = router;