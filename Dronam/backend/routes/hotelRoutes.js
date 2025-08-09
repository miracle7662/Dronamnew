const express = require('express');
const router = express.Router();
const {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsByCountry,
  getHotelsByState,
  getHotelsByDistrict,
  getHotelsByZone
} = require('../controllers/hotelController');

// Get all hotels
router.get('/', getAllHotels);

// Get hotel by ID
router.get('/:id', getHotelById);

// Create new hotel
router.post('/', createHotel);

// Update hotel
router.put('/:id', updateHotel);

// Delete hotel (soft delete)
router.delete('/:id', deleteHotel);

// Get hotels by country
router.get('/country/:countryId', getHotelsByCountry);

// Get hotels by state
router.get('/state/:stateId', getHotelsByState);

// Get hotels by district
router.get('/district/:districtId', getHotelsByDistrict);

// Get hotels by zone
router.get('/zone/:zoneId', getHotelsByZone);

module.exports = router;
