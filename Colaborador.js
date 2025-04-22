const mongoose = require('mongoose');

const ColaboradorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome do colaborador'],
    trim: true
  },
  cargo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cargo',
    required: [true, 'Por favor, informe o cargo']
  },
  unidade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unidade',
    required: [true, 'Por favor, informe a unidade']
  },
  valorPassagemDiaria: {
    type: Number,
    default: 12.00
  },
  diasFixosFolga: [{
    type: String,
    enum: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  }],
  regrasEspeciais: {
    tipoAlternancia: {
      type: String,
      enum: ['semanal', 'quinzenal', 'mensal', 'nenhuma'],
      default: 'nenhuma'
    },
    grupoAlternancia: {
      type: Number,
      default: 0
    },
    trabalhaFimDeSemana: {
      type: Boolean,
      default: false
    },
    padraoDias: {
      sabados: {
        type: String,
        enum: ['todos', 'alternado', 'fixo', 'nenhum'],
        default: 'nenhum'
      },
      domingos: {
        type: String,
        enum: ['todos', 'alternado', 'fixo', 'nenhum'],
        default: 'nenhum'
      }
    }
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Colaborador', ColaboradorSchema);
