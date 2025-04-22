const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getCargos,
  getCargo,
  createCargo,
  updateCargo,
  deleteCargo
} = require('../controllers/cargos');

// Rotas protegidas
router.get('/', protect, getCargos);
router.get('/:id', protect, getCargo);
router.post('/', protect, authorize('admin'), createCargo);
router.put('/:id', protect, authorize('admin'), updateCargo);
router.delete('/:id', protect, authorize('admin'), deleteCargo);

module.exports = router;
