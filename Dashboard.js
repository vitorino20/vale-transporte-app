import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    colaboradores: 0,
    unidades: 0,
    cargos: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [colaboradores, unidades, cargos] = await Promise.all([
          axios.get('http://localhost:5000/api/colaboradores'),
          axios.get('http://localhost:5000/api/unidades'),
          axios.get('http://localhost:5000/api/cargos')
        ]);

        setStats({
          colaboradores: colaboradores.data.count,
          unidades: unidades.data.count,
          cargos: cargos.data.count
        });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Colaboradores',
      icon: <PeopleIcon className="dashboard-icon" color="primary" />,
      description: `${stats.colaboradores} colaboradores cadastrados`,
      path: '/colaboradores'
    },
    {
      title: 'Unidades',
      icon: <BusinessIcon className="dashboard-icon" color="primary" />,
      description: `${stats.unidades} unidades cadastradas`,
      path: '/unidades'
    },
    {
      title: 'Cargos',
      icon: <WorkIcon className="dashboard-icon" color="primary" />,
      description: `${stats.cargos} cargos cadastrados`,
      path: '/cargos'
    },
    {
      title: 'Calendário',
      icon: <CalendarIcon className="dashboard-icon" color="primary" />,
      description: 'Gerenciar calendário e feriados',
      path: '/calendario'
    },
    {
      title: 'Escalas',
      icon: <ScheduleIcon className="dashboard-icon" color="primary" />,
      description: 'Gerenciar escalas de trabalho',
      path: '/escalas'
    },
    {
      title: 'Cálculo VT',
      icon: <CalculateIcon className="dashboard-icon" color="primary" />,
      description: 'Calcular vale-transporte',
      path: '/calculo-vt'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="dashboard-card">
                <CardContent className="dashboard-card-content">
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom align="center">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    fullWidth 
                    variant="contained"
                    onClick={() => navigate(card.path)}
                  >
                    Acessar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
