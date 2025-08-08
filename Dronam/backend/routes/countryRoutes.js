const express = require('express');
const router = express.Router();
const {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry
} = require('../controllers/countryController');

// GET all countries
router.get('/', getAllCountries);

// GET single country by ID
router.get('/:id', getCountryById);

// POST create new country
router.post('/', createCountry);

// PUT update country
router.put('/:id', updateCountry);

// DELETE country
router.delete('/:id', deleteCountry);

module.exports = router;