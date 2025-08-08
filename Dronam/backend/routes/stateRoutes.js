const express = require('express');
const router = express.Router();
const statesController = require('../controllers/stateController'); // Fixed the import name

// Get all states
router.get('/', statesController.getAllStates);

// Get states by country
router.get('/country/:countryId', statesController.getStatesByCountry);

// Get single state
router.get('/:id', statesController.getStateById);

// Create new state
router.post('/', statesController.createState);

// Update state
router.put('/:id', statesController.updateState);

// Delete state
router.delete('/:id', statesController.deleteState);

module.exports = router;