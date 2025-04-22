const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getUnidades,
  getUnidade,
  createUnidade,
  updateUnidade,
  deleteUnidade
} = require('../controllers/unidades');

// Rotas protegidas
router.get('/', protect, getUnidades);
router.get('/:id', protect, getUnidade);
router.post('/', protect, authorize('admin'), createUnidade);
router.put('/:id', protect, authorize('admin'), updateUnidade);
router.delete('/:id', protect, authorize('admin'), deleteUnidade);

module.exports = router;
