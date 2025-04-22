import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { colaboradorService, unidadeService, cargoService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentColaborador, setCurrentColaborador] = useState({
    nome: '',
    cargo: '',
    unidade: '',
    valorPassagemDiaria: 12.00,
    diasFixosFolga: [],
    regrasEspeciais: {
      tipoAlternancia: 'nenhuma',
      grupoAlternancia: 0,
      trabalhaFimDeSemana: false,
      padraoDias: {
        sabados: 'nenhum',
        domingos: 'nenhum'
      }
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colaboradoresRes, unidadesRes, cargosRes] = await Promise.all([
          colaboradorService.getAll(),
          unidadeService.getAll(),
          cargoService.getAll()
        ]);

        setColaboradores(colaboradoresRes.data);
        setUnidades(unidadesRes.data);
        setCargos(cargosRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (colaborador = null) => {
    if (colaborador) {
      setCurrentColaborador(colaborador);
      setIsEditing(true);
    } else {
      setCurrentColaborador({
        nome: '',
        cargo: '',
        unidade: '',
        valorPassagemDiaria: 12.00,
        diasFixosFolga: [],
        regrasEspeciais: {
          tipoAlternancia: 'nenhuma',
          grupoAlternancia: 0,
          trabalhaFimDeSemana: false,
          padraoDias: {
            sabados: 'nenhum',
            domingos: 'nenhum'
          }
        }
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentColaborador({
      ...currentColaborador,
      [name]: value
    });
  };

  const handleRegrasChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCurrentColaborador({
        ...currentColaborador,
        regrasEspeciais: {
          ...currentColaborador.regrasEspeciais,
          [parent]: {
            ...currentColaborador.regrasEspeciais[parent],
            [child]: value
          }
        }
      });
    } else {
      setCurrentColaborador({
        ...currentColaborador,
        regrasEspeciais: {
          ...currentColaborador.regrasEspeciais,
          [name]: value
        }
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (isEditing) {
        await colaboradorService.update(currentColaborador._id, currentColaborador);
      } else {
        await colaboradorService.create(currentColaborador);
      }
      
      // Recarregar dados
      const response = await colaboradorService.getAll();
      setColaboradores(response.data);
      
      setLoading(false);
      handleCloseDialog();
    } catch (err) {
      console.error('Erro ao salvar colaborador:', err);
      setError('Erro ao salvar colaborador. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        setLoading(true);
        await colaboradorService.delete(id);
        
        // Recarregar dados
        const response = await colaboradorService.getAll();
        setColaboradores(response.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao excluir colaborador:', err);
        setError('Erro ao excluir colaborador. Por favor, tente novamente.');
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        Colaboradores
      </Typography>

      {error && (
        <Alert severity="error" className="alert-message" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Colaborador
        </Button>
      </Box>

      {loading && colaboradores.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Unidade</TableCell>
                <TableCell>Valor Passagem</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {colaboradores.map((colaborador) => (
                <TableRow key={colaborador._id}>
                  <TableCell>{colaborador.nome}</TableCell>
                  <TableCell>{colaborador.cargo?.nome || 'N/A'}</TableCell>
                  <TableCell>{colaborador.unidade?.nome || 'N/A'}</TableCell>
                  <TableCell>R$ {colaborador.valorPassagemDiaria.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(colaborador)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(colaborador._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome"
                fullWidth
                value={currentColaborador.nome}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Cargo</InputLabel>
                <Select
                  name="cargo"
                  value={currentColaborador.cargo}
                  onChange={handleInputChange}
                  label="Cargo"
                >
                  {cargos.map((cargo) => (
                    <MenuItem key={cargo._id} value={cargo._id}>
                      {cargo.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Unidade</InputLabel>
                <Select
                  name="unidade"
                  value={currentColaborador.unidade}
                  onChange={handleInputChange}
                  label="Unidade"
                >
                  {unidades.map((unidade) => (
                    <MenuItem key={unidade._id} value={unidade._id}>
                      {unidade.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="valorPassagemDiaria"
                label="Valor da Passagem Diária"
                type="number"
                fullWidth
                value={currentColaborador.valorPassagemDiaria}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: 'R$ ',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Alternância</InputLabel>
                <Select
                  name="tipoAlternancia"
                  value={currentColaborador.regrasEspeciais.tipoAlternancia}
                  onChange={handleRegrasChange}
                  label="Tipo de Alternância"
                >
                  <MenuItem value="nenhuma">Nenhuma</MenuItem>
                  <MenuItem value="semanal">Semanal</MenuItem>
                  <MenuItem value="quinzenal">Quinzenal</MenuItem>
                  <MenuItem value="mensal">Mensal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="grupoAlternancia"
                label="Grupo de Alternância"
                type="number"
                fullWidth
                value={currentColaborador.regrasEspeciais.grupoAlternancia}
                onChange={handleRegrasChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Padrão Sábados</InputLabel>
                <Select
                  name="padraoDias.sabados"
                  value={currentColaborador.regrasEspeciais.padraoDias.sabados}
                  onChange={handleRegrasChange}
                  label="Padrão Sábados"
                >
                  <MenuItem value="nenhum">Nenhum</MenuItem>
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="alternado">Alternado</MenuItem>
                  <MenuItem value="fixo">Fixo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Padrão Domingos</InputLabel>
                <Select
                  name="padraoDias.domingos"
                  value={currentColaborador.regrasEspeciais.padraoDias.domingos}
                  onChange={handleRegrasChange}
                  label="Padrão Domingos"
                >
                  <MenuItem value="nenhum">Nenhum</MenuItem>
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="alternado">Alternado</MenuItem>
                  <MenuItem value="fixo">Fixo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Colaboradores;
