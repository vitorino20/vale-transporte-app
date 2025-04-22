import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import { vtService, unidadeService } from '../services/api';

const CalculoVT = () => {
  const [escalas, setEscalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anoMes, setAnoMes] = useState({
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 2 // Próximo mês
  });
  const [filtroUnidade, setFiltroUnidade] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [totalGeral, setTotalGeral] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Carregar unidades para filtros
        const unidadesRes = await unidadeService.getAll();
        setUnidades(unidadesRes.data);
        
        // Tentar carregar escalas existentes
        try {
          await fetchEscalas();
        } catch (err) {
          console.log('Nenhuma escala encontrada, será necessário calcular');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchData();
  }, [anoMes.ano, anoMes.mes]);

  const fetchEscalas = async () => {
    try {
      setLoading(true);
      
      let resultado;
      
      if (filtroUnidade) {
        // Carregar escalas filtradas por unidade
        resultado = await vtService.calcularPorUnidade(anoMes.ano, anoMes.mes, filtroUnidade);
        setEscalas(resultado.escalas);
        setTotalGeral(resultado.totalUnidade);
      } else {
        // Carregar todas as escalas
        resultado = await vtService.calcular(anoMes.ano, anoMes.mes);
        setEscalas(resultado.escalas);
        setTotalGeral(resultado.totalGeral);
      }
      
      // Preparar dados para CSV
      const csvData = await vtService.exportarCSV(anoMes.ano, anoMes.mes, filtroUnidade);
      setCsvData(csvData);
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar escalas:', err);
      setError('Erro ao carregar escalas. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleCalcularVT = async () => {
    try {
      setLoading(true);
      
      // Calcular vale-transporte
      await fetchEscalas();
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao calcular vale-transporte:', err);
      setError('Erro ao calcular vale-transporte. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleFiltroUnidadeChange = (e) => {
    setFiltroUnidade(e.target.value);
    // Recarregar escalas com o novo filtro
    if (escalas.length > 0) {
      fetchEscalas();
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        Cálculo de Vale-Transporte - {anoMes.mes}/{anoMes.ano}
      </Typography>

      {error && (
        <Alert severity="error" className="alert-message" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} className="filter-container">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Filtrar por Unidade</InputLabel>
            <Select
              value={filtroUnidade}
              onChange={handleFiltroUnidadeChange}
              label="Filtrar por Unidade"
            >
              <MenuItem value="">Todas</MenuItem>
              {unidades.map(unidade => (
                <MenuItem key={unidade._id} value={unidade._id}>
                  {unidade.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<CalculateIcon />}
            onClick={handleCalcularVT}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Calcular Vale-Transporte'}
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <CSVLink
            data={csvData}
            filename={`vale-transporte-${anoMes.mes}-${anoMes.ano}.csv`}
            className="btn btn-primary"
            style={{ textDecoration: 'none', width: '100%' }}
          >
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              disabled={loading || escalas.length === 0}
              fullWidth
            >
              Exportar CSV
            </Button>
          </CSVLink>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo do Cálculo
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Total de Colaboradores: {escalas.length}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Valor Total do Vale-Transporte: R$ {totalGeral.toFixed(2)}
                  </Typography>
                  {filtroUnidade && (
                    <Typography variant="body2" color="text.secondary">
                      * Valores filtrados por unidade
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {loading && escalas.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="table-container" sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Colaborador</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Unidade</TableCell>
                <TableCell>Dias Úteis</TableCell>
                <TableCell>Sábados</TableCell>
                <TableCell>Domingos/Feriados</TableCell>
                <TableCell>Total Dias</TableCell>
                <TableCell>Valor Diário</TableCell>
                <TableCell>Total VT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {escalas.length > 0 ? (
                escalas.map((escala) => (
                  <TableRow key={escala._id}>
                    <TableCell>{escala.colaborador.nome}</TableCell>
                    <TableCell>{escala.colaborador.cargo.nome}</TableCell>
                    <TableCell>{escala.colaborador.unidade.nome}</TableCell>
                    <TableCell>{escala.totalDiasUteis}</TableCell>
                    <TableCell>{escala.totalSabados}</TableCell>
                    <TableCell>{escala.totalDomingosFeriados}</TableCell>
                    <TableCell>{escala.totalDiasTrabalhados}</TableCell>
                    <TableCell>R$ {escala.valorPassagemDiaria.toFixed(2)}</TableCell>
                    <TableCell>R$ {escala.valorTotalVT.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Nenhum dado encontrado. Clique em "Calcular Vale-Transporte" para gerar.
                  </TableCell>
                </TableRow>
              )}
              {escalas.length > 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="right" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </TableCell>
                  <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                    R$ {totalGeral.toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CalculoVT;
