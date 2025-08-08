const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// Get all countries
router.get('/', countryController.getAllCountries);

// Get single country
router.get('/:id', countryController.getCountryById);

// Create new country
router.post('/', countryController.createCountry);

// Update country
router.put('/:id', countryController.updateCountry);

// Delete country
router.delete('/:id', countryController.deleteCountry);

module.exports = router;