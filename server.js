const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Importar rotas
const authRoutes = require('./routes/auth');
const unidadesRoutes = require('./routes/unidades');
const cargosRoutes = require('./routes/cargos');
const colaboradoresRoutes = require('./routes/colaboradores');
const calendariosRoutes = require('./routes/calendarios');
const escalasRoutes = require('./routes/escalas');

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Conectado'))
.catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Montar rotas
app.use('/api/auth', authRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/cargos', cargosRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/calendarios', calendariosRoutes);
app.use('/api/escalas', escalasRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.send('API do Vale-Transporte está funcionando!');
});

// Definir porta
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV}`);
});
