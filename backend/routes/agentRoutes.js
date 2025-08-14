const express = require('express');
const router = express.Router();
const {
  login,
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  toggleAgentStatus,
  deleteAgent
} = require('../controllers/agentController');

// Public routes
router.post('/login', login);

// Protected routes (you can add middleware here later)
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.post('/', createAgent);
router.put('/:id', updateAgent);
router.patch('/:id/status', toggleAgentStatus);
router.delete('/:id', deleteAgent);

module.exports = router; 