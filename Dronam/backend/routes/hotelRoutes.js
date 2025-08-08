const express = require('express');
const router = express.Router();
const {
  login,
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');

// Public routes
router.post('/login', login);

// Protected routes (you can add middleware here later)
router.get('/', getAllHotels);
router.get('/:id', getHotelById);
router.post('/', createHotel);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel);

module.exports = router; 