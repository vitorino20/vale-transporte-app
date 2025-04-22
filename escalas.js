const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getEscalasPorMes,
  getEscalaColaborador,
  gerarEscalas,
  updateEscala,
  exportEscalas
} = require('../controllers/escalas');

// Rotas protegidas
router.get('/:ano/:mes', protect, getEscalasPorMes);
router.get('/colaborador/:colaboradorId/:ano/:mes', protect, getEscalaColaborador);
router.post('/gerar/:ano/:mes', protect, gerarEscalas);
router.put('/:id', protect, updateEscala);
router.get('/export/:ano/:mes', protect, exportEscalas);

module.exports = router;
