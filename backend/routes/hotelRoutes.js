const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const {
    login,
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    checkUserByEmail,
    searchHotels,
    getHotelsByStatus,
    getHotelsCount
} = hotelController;
/* const { authenticateToken } = require('../middleware/auth'); */

// Hotel authentication routes
router.post('/login', login);

// Hotel CRUD routes
router.get('/', getAllHotels);
router.get('/count', getHotelsCount);
router.get('/search', searchHotels);
router.get('/status/:status', getHotelsByStatus);
router.get('/:id', getHotelById);
router.post('/', createHotel);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel);
router.get('/check-email/:email', checkUserByEmail);

module.exports = router;
