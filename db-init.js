// Arquivo de configuração para inicialização do banco de dados
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Unidade = require('./models/Unidade');
const Cargo = require('./models/Cargo');
const Colaborador = require('./models/Colaborador');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Conectado'))
.catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Função para criar usuário admin inicial
const criarUsuarioAdmin = async () => {
  try {
    // Verificar se já existe um admin
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Usuário admin já existe');
      return;
    }
    
    // Criar usuário admin
    await User.create({
      nome: 'Administrador',
      email: 'admin@vt-app.com',
      senha: 'admin123',
      role: 'admin'
    });
    
    console.log('Usuário admin criado com sucesso');
  } catch (err) {
    console.error('Erro ao criar usuário admin:', err);
  }
};

// Função para criar unidades iniciais
const criarUnidadesIniciais = async () => {
  try {
    // Verificar se já existem unidades
    const unidadesExistem = await Unidade.countDocuments();
    
    if (unidadesExistem > 0) {
      console.log('Unidades já existem');
      return;
    }
    
    // Criar unidades
    const unidades = await Unidade.insertMany([
      {
        nome: 'Pinheirinho',
        endereco: 'Rua do Pinheirinho, 123',
        telefone: '(41) 3333-1111'
      },
      {
        nome: 'Água Verde',
        endereco: 'Rua da Água Verde, 456',
        telefone: '(41) 3333-2222'
      },
      {
        nome: 'Fazendinha',
        endereco: 'Rua da Fazendinha, 789',
        telefone: '(41) 3333-3333'
      }
    ]);
    
    console.log(`${unidades.length} unidades criadas com sucesso`);
    return unidades;
  } catch (err) {
    console.error('Erro ao criar unidades:', err);
  }
};

// Função para criar cargos iniciais
const criarCargosIniciais = async () => {
  try {
    // Verificar se já existem cargos
    const cargosExistem = await Cargo.countDocuments();
    
    if (cargosExistem > 0) {
      console.log('Cargos já existem');
      return;
    }
    
    // Criar cargos
    const cargos = await Cargo.insertMany([
      {
        nome: 'Professor Formado',
        descricao: 'Professor com formação completa'
      },
      {
        nome: 'Estagiário',
        descricao: 'Estagiário em formação'
      },
      {
        nome: 'Recepção',
        descricao: 'Atendimento e recepção'
      },
      {
        nome: 'Limpeza',
        descricao: 'Serviços de limpeza e manutenção'
      }
    ]);
    
    console.log(`${cargos.length} cargos criados com sucesso`);
    return cargos;
  } catch (err) {
    console.error('Erro ao criar cargos:', err);
  }
};

// Função para criar colaboradores iniciais
const criarColaboradoresIniciais = async () => {
  try {
    // Verificar se já existem colaboradores
    const colaboradoresExistem = await Colaborador.countDocuments();
    
    if (colaboradoresExistem > 0) {
      console.log('Colaboradores já existem');
      return;
    }
    
    // Obter unidades e cargos
    const unidades = await Unidade.find();
    const cargos = await Cargo.find();
    
    if (unidades.length === 0 || cargos.length === 0) {
      console.log('Unidades ou cargos não encontrados');
      return;
    }
    
    // Mapear unidades e cargos por nome para facilitar o acesso
    const unidadesMap = {};
    unidades.forEach(unidade => {
      unidadesMap[unidade.nome] = unidade._id;
    });
    
    const cargosMap = {};
    cargos.forEach(cargo => {
      cargosMap[cargo.nome] = cargo._id;
    });
    
    // Criar colaboradores da unidade Pinheirinho
    const colaboradoresPinheirinho = [
      // Professores Formados
      {
        nome: 'Rhonny',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      {
        nome: 'Fernanda',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      {
        nome: 'Juliana',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 2,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      
      // Estagiários
      {
        nome: 'Vitor Felipe',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Jeizon',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Karine',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Evenilson Neto',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Luiz',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      
      // Recepção
      {
        nome: 'Evelin',
        cargo: cargosMap['Recepção'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      {
        nome: 'Rieli',
        cargo: cargosMap['Recepção'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      {
        nome: 'Manu',
        cargo: cargosMap['Recepção'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 2,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      
      // Limpeza
      {
        nome: 'Vera',
        cargo: cargosMap['Limpeza'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'nenhuma',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'todos',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Elisangela',
        cargo: cargosMap['Limpeza'],
        unidade: unidadesMap['Pinheirinho'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'nenhuma',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'todos',
            domingos: 'nenhum'
          }
        }
      }
    ];
    
    // Criar colaboradores da unidade Água Verde
    const colaboradoresAguaVerde = [
      // Professores
      {
        nome: 'Fernanda',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Sulivan',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Carlos',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 2,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      
      // Estagiários
      {
        nome: 'Regis',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Caetano',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Jessica',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 2,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      
      // Recepção
      {
        nome: 'Paola',
        cargo: cargosMap['Recepção'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Eduarda',
        cargo: cargosMap['Recepção'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Suyanne',
        cargo: cargosMap['Recepção'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 2,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      
      // Limpeza
      {
        nome: 'Stefani',
        cargo: cargosMap['Limpeza'],
        unidade: unidadesMap['Água Verde'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      }
    ];
    
    // Criar colaboradores da unidade Fazendinha
    const colaboradoresFazendinha = [
      // Professores Formados
      {
        nome: 'Ana',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      {
        nome: 'Analice',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      {
        nome: 'Leonardo',
        cargo: cargosMap['Professor Formado'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 2,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      
      // Estagiários
      {
        nome: 'Otávio',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Gustavo Silva 1',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Gustavo Silva 2',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Petterson',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Luana',
        cargo: cargosMap['Estagiário'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'quinzenal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      
      // Recepção
      {
        nome: 'Francine',
        cargo: cargosMap['Recepção'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'semanal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'alternado'
          }
        }
      },
      
      // Limpeza
      {
        nome: 'Arabel',
        cargo: cargosMap['Limpeza'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      },
      {
        nome: 'Elisangela F',
        cargo: cargosMap['Limpeza'],
        unidade: unidadesMap['Fazendinha'],
        valorPassagemDiaria: 12.00,
        regrasEspeciais: {
          tipoAlternancia: 'mensal',
          grupoAlternancia: 1,
          trabalhaFimDeSemana: true,
          padraoDias: {
            sabados: 'alternado',
            domingos: 'nenhum'
          }
        }
      }
    ];
    
    // Juntar todos os colaboradores
    const todosColaboradores = [
      ...colaboradoresPinheirinho,
      ...colaboradoresAguaVerde,
      ...colaboradoresFazendinha
    ];
    
    // Criar colaboradores
    const colaboradores = await Colaborador.insertMany(todosColaboradores);
    
    console.log(`${colaboradores.length} colaboradores criados com sucesso`);
  } catch (err) {
    console.error('Erro ao criar colaboradores:', err);
  }
};

// Função principal para inicializar o banco de dados
const inicializarBancoDados = async () => {
  try {
    await criarUsuarioAdmin();
    await criarUnidadesIniciais();
    await criarCargosIniciais();
    await criarColaboradoresIniciais();
    
    console.log('Banco de dados inicializado com sucesso');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
    process.exit(1);
  }
};

// Executar inicialização
inicializarBancoDados();
