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

const Unidades = () => {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUnidade, setCurrentUnidade] = useState({
    nome: '',
    endereco: '',
    telefone: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/unidades');
        setUnidades(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar unidades:', err);
        setError('Erro ao carregar unidades. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchUnidades();
  }, []);

  const handleOpenDialog = (unidade = null) => {
    if (unidade) {
      setCurrentUnidade(unidade);
      setIsEditing(true);
    } else {
      setCurrentUnidade({
        nome: '',
        endereco: '',
        telefone: ''
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
    setCurrentUnidade({
      ...currentUnidade,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/unidades/${currentUnidade._id}`, currentUnidade);
      } else {
        await axios.post('http://localhost:5000/api/unidades', currentUnidade);
      }
      
      // Recarregar dados
      const response = await axios.get('http://localhost:5000/api/unidades');
      setUnidades(response.data.data);
      
      setLoading(false);
      handleCloseDialog();
    } catch (err) {
      console.error('Erro ao salvar unidade:', err);
      setError('Erro ao salvar unidade. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/unidades/${id}`);
        
        // Recarregar dados
        const response = await axios.get('http://localhost:5000/api/unidades');
        setUnidades(response.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao excluir unidade:', err);
        setError('Erro ao excluir unidade. Por favor, tente novamente.');
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        Unidades
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
          Nova Unidade
        </Button>
      </Box>

      {loading && unidades.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unidades.map((unidade) => (
                <TableRow key={unidade._id}>
                  <TableCell>{unidade.nome}</TableCell>
                  <TableCell>{unidade.endereco}</TableCell>
                  <TableCell>{unidade.telefone}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(unidade)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(unidade._id)}
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
          {isEditing ? 'Editar Unidade' : 'Nova Unidade'}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="nome"
            label="Nome"
            fullWidth
            margin="normal"
            value={currentUnidade.nome}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="endereco"
            label="Endereço"
            fullWidth
            margin="normal"
            value={currentUnidade.endereco}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="telefone"
            label="Telefone"
            fullWidth
            margin="normal"
            value={currentUnidade.telefone}
            onChange={handleInputChange}
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

export default Unidades;
