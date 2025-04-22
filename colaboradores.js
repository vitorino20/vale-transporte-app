const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getColaboradores,
  getColaborador,
  getColaboradoresPorUnidade,
  getColaboradoresPorCargo,
  createColaborador,
  updateColaborador,
  deleteColaborador
} = require('../controllers/colaboradores');

// Rotas protegidas
router.get('/', protect, getColaboradores);
router.get('/:id', protect, getColaborador);
router.get('/unidade/:unidadeId', protect, getColaboradoresPorUnidade);
router.get('/cargo/:cargoId', protect, getColaboradoresPorCargo);
router.post('/', protect, createColaborador);
router.put('/:id', protect, updateColaborador);
router.delete('/:id', protect, deleteColaborador);

module.exports = router;
