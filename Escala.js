const mongoose = require('mongoose');

const EscalaSchema = new mongoose.Schema({
  colaborador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colaborador',
    required: [true, 'Por favor, informe o colaborador']
  },
  ano: {
    type: Number,
    required: [true, 'Por favor, informe o ano']
  },
  mes: {
    type: Number,
    required: [true, 'Por favor, informe o mês'],
    min: 1,
    max: 12
  },
  diasTrabalhados: [{
    type: Date
  }],
  diasFolga: [{
    type: Date
  }],
  diasFeriados: [{
    type: Date
  }],
  totalDiasUteis: {
    type: Number,
    default: 0
  },
  totalSabados: {
    type: Number,
    default: 0
  },
  totalDomingosFeriados: {
    type: Number,
    default: 0
  },
  totalDiasTrabalhados: {
    type: Number,
    default: 0
  },
  valorPassagemDiaria: {
    type: Number,
    default: 12.00
  },
  valorTotalVT: {
    type: Number,
    default: 0
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
});

// Índice composto para garantir unicidade de colaborador/ano/mês
EscalaSchema.index({ colaborador: 1, ano: 1, mes: 1 }, { unique: true });

module.exports = mongoose.model('Escala', EscalaSchema);
