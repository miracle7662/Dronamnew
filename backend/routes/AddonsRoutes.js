const express = require('express');
const router = express.Router();
const {
  getAllAddons,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon
} = require('../controllers/AddonsController');

router.get('/', getAllAddons);
router.get('/:id', getAddonById);
router.post('/', createAddon);
router.put('/:id', updateAddon);
router.delete('/:id', deleteAddon);

module.exports = router;
