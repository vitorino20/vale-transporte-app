const mongoose = require('mongoose');

const CargoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome do cargo'],
    enum: ['Professor Formado', 'Estagiário', 'Recepção', 'Limpeza'],
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cargo', CargoSchema);
