import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import background from '../assets/Background/bg_cart.png';

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Автоматически перенаправляем на главную через 3 секунды
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        maxWidth: '414px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        color="white"
        align="center"
        sx={{ mb: 2, fontWeight: 'bold' }}
      >
        404
      </Typography>
      <Typography color="white" align="center" sx={{ mb: 3 }}>
        Страница не найдена
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{
          background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
          color: 'white',
          textTransform: 'none',
        }}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default NotFoundPage; 