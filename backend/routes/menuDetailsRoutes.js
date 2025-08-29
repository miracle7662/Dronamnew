const express = require('express');
const router = express.Router();
const menumasterController = require('../controllers/MenumasterController');

// Menu Details Routes
router.post('/', menumasterController.createMenuDetail);
router.get('/:menuId', menumasterController.getMenuDetails);
router.put('/:id', menumasterController.updateMenuDetail);
router.delete('/:id', menumasterController.deleteMenuDetail);

module.exports = router;
