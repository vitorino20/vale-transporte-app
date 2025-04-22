const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe o email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, informe um email válido'
    ]
  },
  senha: {
    type: String,
    required: [true, 'Por favor, informe a senha'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  ultimoAcesso: {
    type: Date
  }
});

// Criptografar senha usando bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para gerar JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Método para verificar senha
UserSchema.methods.matchPassword = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

module.exports = mongoose.model('User', UserSchema);
