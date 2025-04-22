import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { escalaService, unidadeService, cargoService } from '../services/api';

const Escalas = () => {
  const [escalas, setEscalas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEscala, setCurrentEscala] = useState(null);
  const [anoMes, setAnoMes] = useState({
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 2 // Próximo mês
  });
  const [filtroUnidade, setFiltroUnidade] = useState('');
  const [filtroCargo, setFiltroCargo] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Carregar unidades e cargos para filtros
        const [unidadesRes, cargosRes] = await Promise.all([
          unidadeService.getAll(),
          cargoService.getAll()
        ]);
        
        setUnidades(unidadesRes.data);
        setCargos(cargosRes.data);
        
        // Carregar escalas
        await fetchEscalas();
        
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
      
      // Carregar escalas
      const escalasRes = await escalaService.getByAnoMes(anoMes.ano, anoMes.mes);
      setEscalas(escalasRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar escalas:', err);
      setError('Erro ao carregar escalas. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleGerarEscalas = async () => {
    try {
      setLoading(true);
      
      await escalaService.gerar(anoMes.ano, anoMes.mes);
      
      // Recarregar escalas
      await fetchEscalas();
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao gerar escalas:', err);
      setError('Erro ao gerar escalas. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleOpenDialog = (escala) => {
    setCurrentEscala(escala);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFiltroUnidadeChange = (e) => {
    setFiltroUnidade(e.target.value);
  };

  const handleFiltroCargoChange = (e) => {
    setFiltroCargo(e.target.value);
  };

  const filtrarEscalas = () => {
    if (!escalas) return [];
    
    return escalas.filter(escala => {
      const unidadeMatch = filtroUnidade ? escala.colaborador.unidade._id === filtroUnidade : true;
      const cargoMatch = filtroCargo ? escala.colaborador.cargo._id === filtroCargo : true;
      return unidadeMatch && cargoMatch;
    });
  };

  const escalasFiltradas = filtrarEscalas();

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        Escalas - {anoMes.mes}/{anoMes.ano}
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
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Filtrar por Cargo</InputLabel>
            <Select
              value={filtroCargo}
              onChange={handleFiltroCargoChange}
              label="Filtrar por Cargo"
            >
              <MenuItem value="">Todos</MenuItem>
              {cargos.map(cargo => (
                <MenuItem key={cargo._id} value={cargo._id}>
                  {cargo.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleGerarEscalas}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Gerar/Atualizar Escalas'}
          </Button>
        </Grid>
      </Grid>

      {loading && escalas.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="table-container">
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
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {escalasFiltradas.length > 0 ? (
                escalasFiltradas.map((escala) => (
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
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(escala)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Nenhuma escala encontrada. Clique em "Gerar/Atualizar Escalas" para criar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog para visualizar detalhes da escala */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalhes da Escala - {currentEscala?.colaborador?.nome}
        </DialogTitle>
        <DialogContent>
          {currentEscala && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Informações Gerais
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Colaborador"
                          secondary={currentEscala.colaborador.nome}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Cargo"
                          secondary={currentEscala.colaborador.cargo.nome}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Unidade"
                          secondary={currentEscala.colaborador.unidade.nome}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Valor Passagem Diária"
                          secondary={`R$ ${currentEscala.valorPassagemDiaria.toFixed(2)}`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Resumo da Escala
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Dias Úteis Trabalhados"
                          secondary={currentEscala.totalDiasUteis}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Sábados Trabalhados"
                          secondary={currentEscala.totalSabados}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Domingos/Feriados Trabalhados"
                          secondary={currentEscala.totalDomingosFeriados}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Total de Dias Trabalhados"
                          secondary={currentEscala.totalDiasTrabalhados}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Valor Total do Vale-Transporte"
                          secondary={`R$ ${currentEscala.valorTotalVT.toFixed(2)}`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Escalas;
