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
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { calendarioService } from '../services/api';

const Calendario = () => {
  const [calendario, setCalendario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFeriado, setCurrentFeriado] = useState({
    data: '',
    descricao: '',
    tipo: 'nacional'
  });
  const [anoMes, setAnoMes] = useState({
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 2 // Próximo mês
  });

  useEffect(() => {
    const fetchCalendario = async () => {
      try {
        setLoading(true);
        
        // Verificar se já existe calendário para o próximo mês
        try {
          const response = await calendarioService.getByAnoMes(anoMes.ano, anoMes.mes);
          setCalendario(response.data);
        } catch (err) {
          // Se não existir, gerar automaticamente
          if (err.response && err.response.status === 404) {
            const response = await calendarioService.createOrUpdate({
              ano: anoMes.ano,
              mes: anoMes.mes
            });
            setCalendario(response.data);
          } else {
            throw err;
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar calendário:', err);
        setError('Erro ao carregar calendário. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchCalendario();
  }, [anoMes.ano, anoMes.mes]);

  const handleOpenDialog = () => {
    setCurrentFeriado({
      data: '',
      descricao: '',
      tipo: 'nacional'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFeriado({
      ...currentFeriado,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      await calendarioService.adicionarFeriado(anoMes.ano, anoMes.mes, currentFeriado);
      
      // Recarregar dados
      const response = await calendarioService.getByAnoMes(anoMes.ano, anoMes.mes);
      setCalendario(response.data);
      
      setLoading(false);
      handleCloseDialog();
    } catch (err) {
      console.error('Erro ao adicionar feriado:', err);
      setError('Erro ao adicionar feriado. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleDeleteFeriado = async (feriadoId) => {
    if (window.confirm('Tem certeza que deseja excluir este feriado?')) {
      try {
        setLoading(true);
        await calendarioService.removerFeriado(anoMes.ano, anoMes.mes, feriadoId);
        
        // Recarregar dados
        const response = await calendarioService.getByAnoMes(anoMes.ano, anoMes.mes);
        setCalendario(response.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao excluir feriado:', err);
        setError('Erro ao excluir feriado. Por favor, tente novamente.');
        setLoading(false);
      }
    }
  };

  const getCalendarEvents = () => {
    if (!calendario) return [];
    
    const events = [];
    
    // Dias úteis
    calendario.diasUteis.forEach(data => {
      events.push({
        title: 'Dia Útil',
        start: new Date(data),
        backgroundColor: '#4caf50',
        borderColor: '#4caf50'
      });
    });
    
    // Sábados
    calendario.sabados.forEach(data => {
      events.push({
        title: 'Sábado',
        start: new Date(data),
        backgroundColor: '#ff9800',
        borderColor: '#ff9800'
      });
    });
    
    // Domingos
    calendario.domingos.forEach(data => {
      events.push({
        title: 'Domingo',
        start: new Date(data),
        backgroundColor: '#f44336',
        borderColor: '#f44336'
      });
    });
    
    // Feriados
    calendario.feriados.forEach(feriado => {
      events.push({
        title: feriado.descricao,
        start: new Date(feriado.data),
        backgroundColor: '#9c27b0',
        borderColor: '#9c27b0'
      });
    });
    
    return events;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        Calendário - {anoMes.mes}/{anoMes.ano}
      </Typography>

      {error && (
        <Alert severity="error" className="alert-message" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Paper className="calendar-container">
            {loading && !calendario ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={getCalendarEvents()}
                headerToolbar={{
                  left: 'title',
                  center: '',
                  right: 'prev,next today'
                }}
                height="100%"
                locale="pt-br"
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feriados
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  size="small"
                >
                  Adicionar Feriado
                </Button>
              </Box>
              {loading && !calendario ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {calendario && calendario.feriados.length > 0 ? (
                    calendario.feriados.map((feriado, index) => (
                      <React.Fragment key={feriado._id || index}>
                        <ListItem
                          secondaryAction={
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => handleDeleteFeriado(feriado._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={feriado.descricao}
                            secondary={`${new Date(feriado.data).toLocaleDateString()} - ${feriado.tipo}`}
                          />
                        </ListItem>
                        {index < calendario.feriados.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum feriado cadastrado.
                    </Typography>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
          
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo
              </Typography>
              {loading && !calendario ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Dias Úteis"
                      secondary={calendario ? calendario.diasUteis.length : 0}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Sábados"
                      secondary={calendario ? calendario.sabados.length : 0}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Domingos"
                      secondary={calendario ? calendario.domingos.length : 0}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Feriados"
                      secondary={calendario ? calendario.feriados.length : 0}
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calendario;
