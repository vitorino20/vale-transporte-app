const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/auth');

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;
