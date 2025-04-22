import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },
  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Serviços de unidades
export const unidadeService = {
  getAll: async () => {
    const response = await api.get('/unidades');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/unidades/${id}`);
    return response.data;
  },
  create: async (unidade) => {
    const response = await api.post('/unidades', unidade);
    return response.data;
  },
  update: async (id, unidade) => {
    const response = await api.put(`/unidades/${id}`, unidade);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/unidades/${id}`);
    return response.data;
  }
};

// Serviços de cargos
export const cargoService = {
  getAll: async () => {
    const response = await api.get('/cargos');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/cargos/${id}`);
    return response.data;
  },
  create: async (cargo) => {
    const response = await api.post('/cargos', cargo);
    return response.data;
  },
  update: async (id, cargo) => {
    const response = await api.put(`/cargos/${id}`, cargo);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/cargos/${id}`);
    return response.data;
  }
};

// Serviços de colaboradores
export const colaboradorService = {
  getAll: async () => {
    const response = await api.get('/colaboradores');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/colaboradores/${id}`);
    return response.data;
  },
  getByUnidade: async (unidadeId) => {
    const response = await api.get(`/colaboradores/unidade/${unidadeId}`);
    return response.data;
  },
  getByCargo: async (cargoId) => {
    const response = await api.get(`/colaboradores/cargo/${cargoId}`);
    return response.data;
  },
  create: async (colaborador) => {
    const response = await api.post('/colaboradores', colaborador);
    return response.data;
  },
  update: async (id, colaborador) => {
    const response = await api.put(`/colaboradores/${id}`, colaborador);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/colaboradores/${id}`);
    return response.data;
  }
};

// Serviços de calendários
export const calendarioService = {
  getByAnoMes: async (ano, mes) => {
    const response = await api.get(`/calendarios/${ano}/${mes}`);
    return response.data;
  },
  createOrUpdate: async (calendario) => {
    const response = await api.post('/calendarios', calendario);
    return response.data;
  },
  adicionarFeriado: async (ano, mes, feriado) => {
    const response = await api.post(`/calendarios/${ano}/${mes}/feriados`, feriado);
    return response.data;
  },
  removerFeriado: async (ano, mes, feriadoId) => {
    const response = await api.delete(`/calendarios/${ano}/${mes}/feriados/${feriadoId}`);
    return response.data;
  },
  gerarProximoMes: async () => {
    const response = await api.get('/calendarios/proximo-mes');
    return response.data;
  }
};

// Serviços de escalas
export const escalaService = {
  getByAnoMes: async (ano, mes) => {
    const response = await api.get(`/escalas/${ano}/${mes}`);
    return response.data;
  },
  getByColaborador: async (colaboradorId, ano, mes) => {
    const response = await api.get(`/escalas/colaborador/${colaboradorId}/${ano}/${mes}`);
    return response.data;
  },
  gerar: async (ano, mes) => {
    const response = await api.post(`/escalas/gerar/${ano}/${mes}`);
    return response.data;
  },
  update: async (id, escala) => {
    const response = await api.put(`/escalas/${id}`, escala);
    return response.data;
  },
  exportar: async (ano, mes) => {
    const response = await api.get(`/escalas/export/${ano}/${mes}`);
    return response.data;
  }
};

// Serviço de cálculo de vale-transporte
export const vtService = {
  calcular: async (ano, mes) => {
    // Primeiro gera as escalas
    await escalaService.gerar(ano, mes);
    
    // Depois obtém as escalas geradas
    const response = await escalaService.getByAnoMes(ano, mes);
    
    // Calcula o total geral
    const totalGeral = response.data.reduce((acc, escala) => acc + escala.valorTotalVT, 0);
    
    return {
      escalas: response.data,
      totalGeral
    };
  },
  
  calcularPorUnidade: async (ano, mes, unidadeId) => {
    // Primeiro gera as escalas
    await escalaService.gerar(ano, mes);
    
    // Depois obtém as escalas geradas
    const response = await escalaService.getByAnoMes(ano, mes);
    
    // Filtra por unidade
    const escalasFiltradas = response.data.filter(
      escala => escala.colaborador.unidade._id === unidadeId
    );
    
    // Calcula o total da unidade
    const totalUnidade = escalasFiltradas.reduce((acc, escala) => acc + escala.valorTotalVT, 0);
    
    return {
      escalas: escalasFiltradas,
      totalUnidade
    };
  },
  
  exportarCSV: async (ano, mes, unidadeId = null) => {
    // Obtém as escalas
    const response = await escalaService.getByAnoMes(ano, mes);
    
    // Filtra por unidade se necessário
    const escalas = unidadeId 
      ? response.data.filter(escala => escala.colaborador.unidade._id === unidadeId)
      : response.data;
    
    // Formata para CSV
    const csvData = escalas.map(escala => ({
      Nome: escala.colaborador.nome,
      Cargo: escala.colaborador.cargo.nome,
      Unidade: escala.colaborador.unidade.nome,
      DiasUteisTrabalhados: escala.totalDiasUteis,
      SabadosTrabalhados: escala.totalSabados,
      DomingosFeriadosTrabalhados: escala.totalDomingosFeriados,
      TotalDiasTrabalhados: escala.totalDiasTrabalhados,
      ValorPassagemDiaria: `R$ ${escala.valorPassagemDiaria.toFixed(2)}`,
      ValorTotalVT: `R$ ${escala.valorTotalVT.toFixed(2)}`
    }));
    
    return csvData;
  }
};

export default api;
