const express = require('express');
const router = express.Router();
const { login, getDashboard, logout, verifyToken } = require('../controllers/superadminController');

// Public routes (no authentication required)
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (authentication required)
router.get('/dashboard', verifyToken, getDashboard);

module.exports = router; 