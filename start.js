const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Script para testar e iniciar a aplicação
console.log('Iniciando testes e verificação da aplicação de cálculo de vale-transporte...');

// Verificar se o MongoDB está instalado
try {
  console.log('Verificando MongoDB...');
  execSync('mongod --version');
  console.log('MongoDB está instalado.');
} catch (error) {
  console.error('MongoDB não está instalado ou não está no PATH. Por favor, instale o MongoDB.');
  process.exit(1);
}

// Verificar se o Node.js está instalado
try {
  console.log('Verificando Node.js...');
  execSync('node --version');
  console.log('Node.js está instalado.');
} catch (error) {
  console.error('Node.js não está instalado ou não está no PATH. Por favor, instale o Node.js.');
  process.exit(1);
}

// Verificar se as dependências do backend estão instaladas
console.log('Verificando dependências do backend...');
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Instalando dependências do backend...');
  execSync('npm install', { cwd: __dirname });
}

// Verificar se as dependências do frontend estão instaladas
console.log('Verificando dependências do frontend...');
if (!fs.existsSync(path.join(__dirname, '..', 'frontend', 'node_modules'))) {
  console.log('Instalando dependências do frontend...');
  execSync('npm install', { cwd: path.join(__dirname, '..', 'frontend') });
}

// Executar testes do backend
console.log('Executando testes do backend...');
try {
  execSync('npm test', { cwd: __dirname, stdio: 'inherit' });
  console.log('Testes do backend concluídos com sucesso.');
} catch (error) {
  console.error('Falha nos testes do backend.');
  process.exit(1);
}

// Iniciar o servidor backend
console.log('Iniciando o servidor backend...');
const backendProcess = require('child_process').spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Aguardar o servidor iniciar
console.log('Aguardando o servidor iniciar...');
setTimeout(() => {
  // Iniciar o servidor frontend
  console.log('Iniciando o servidor frontend...');
  const frontendProcess = require('child_process').spawn('npm', ['start'], {
    cwd: path.join(__dirname, '..', 'frontend'),
    stdio: 'inherit'
  });

  // Lidar com o encerramento do processo
  process.on('SIGINT', () => {
    console.log('Encerrando servidores...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });

  console.log('\n===================================================');
  console.log('Aplicação de cálculo de vale-transporte iniciada!');
  console.log('Backend: http://localhost:5000');
  console.log('Frontend: http://localhost:3000');
  console.log('===================================================\n');
  console.log('Pressione Ctrl+C para encerrar os servidores.');
}, 5000);
