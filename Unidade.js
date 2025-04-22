const mongoose = require('mongoose');

const UnidadeSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome da unidade'],
    enum: ['Pinheirinho', 'Água Verde', 'Fazendinha'],
    unique: true,
    trim: true
  },
  endereco: {
    type: String,
    required: [true, 'Por favor, informe o endereço'],
    trim: true
  },
  telefone: {
    type: String,
    trim: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Unidade', UnidadeSchema);
