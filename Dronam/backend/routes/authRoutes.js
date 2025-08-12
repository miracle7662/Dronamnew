const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const hotelLoginController = require('../controllers/hotelControllerLogin');

router.post('/login', authController.login);
router.post('/hotel-login', hotelLoginController.login);

module.exports = router;
