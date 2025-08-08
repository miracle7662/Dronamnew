const express = require('express');
const router = express.Router();
const {
  getAllStates,
  getStatesByCountry,
  getStateById,
  createState,
  updateState,
  deleteState
} = require('../controllers/stateController');

// GET all states
router.get('/', getAllStates);

// GET states by country
router.get('/country/:countryId', getStatesByCountry);

// GET single state by ID
router.get('/:id', getStateById);

// POST create new state
router.post('/', createState);

// PUT update state
router.put('/:id', updateState);

// DELETE state
router.delete('/:id', deleteState);

module.exports = router;