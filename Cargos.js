import React, { useState, useEffect } from 'react';
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
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

const Cargos = () => {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCargo, setCurrentCargo] = useState({
    nome: '',
    descricao: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cargos');
        setCargos(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar cargos:', err);
        setError('Erro ao carregar cargos. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchCargos();
  }, []);

  const handleOpenDialog = (cargo = null) => {
    if (cargo) {
      setCurrentCargo(cargo);
      setIsEditing(true);
    } else {
      setCurrentCargo({
        nome: '',
        descricao: ''
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
    setCurrentCargo({
      ...currentCargo,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/cargos/${currentCargo._id}`, currentCargo);
      } else {
        await axios.post('http://localhost:5000/api/cargos', currentCargo);
      }
      
      // Recarregar dados
      const response = await axios.get('http://localhost:5000/api/cargos');
      setCargos(response.data.data);
      
      setLoading(false);
      handleCloseDialog();
    } catch (err) {
      console.error('Erro ao salvar cargo:', err);
      setError('Erro ao salvar cargo. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cargo?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/cargos/${id}`);
        
        // Recarregar dados
        const response = await axios.get('http://localhost:5000/api/cargos');
        setCargos(response.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao excluir cargo:', err);
        setError('Erro ao excluir cargo. Por favor, tente novamente.');
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        Cargos
      </Typography>

      {error && (
        <Alert severity="error" className="alert-message">
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Cargo
        </Button>
      </Box>

      {loading && cargos.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cargos.map((cargo) => (
                <TableRow key={cargo._id}>
                  <TableCell>{cargo.nome}</TableCell>
                  <TableCell>{cargo.descricao}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(cargo)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(cargo._id)}
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {isEditing ? 'Editar Cargo' : 'Novo Cargo'}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="nome"
            label="Nome"
            fullWidth
            margin="normal"
            value={currentCargo.nome}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="descricao"
            label="Descrição"
            fullWidth
            margin="normal"
            value={currentCargo.descricao}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
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

export default Cargos;
