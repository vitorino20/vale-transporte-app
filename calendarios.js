const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getCalendario,
  createCalendario,
  adicionarFeriado,
  removerFeriado,
  gerarCalendarioProximoMes
} = require('../controllers/calendarios');

// Rotas protegidas
router.get('/:ano/:mes', protect, getCalendario);
router.post('/', protect, createCalendario);
router.post('/:ano/:mes/feriados', protect, adicionarFeriado);
router.delete('/:ano/:mes/feriados/:feriadoId', protect, removerFeriado);
router.get('/proximo-mes', protect, gerarCalendarioProximoMes);

module.exports = router;
