const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateControllerEnhanced');

// Enhanced state management routes
router.get('/', stateController.getAllStates);
router.get('/count', stateController.getStatesCount);
router.get('/:id', stateController.getStateById);
router.post('/', stateController.createState);
router.put('/:id', stateController.updateState);
router.patch('/:id/restore', stateController.restoreState);
router.patch('/bulk-status', stateController.bulkUpdateStatus);
router.delete('/:id', stateController.deleteState);

module.exports = router;
