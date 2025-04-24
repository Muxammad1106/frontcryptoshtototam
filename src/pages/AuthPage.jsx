import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTelegram } from '../hooks/useTelegram';
import { authenticateWithTelegram } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import background from '../assets/Background/bg_cart.png';
import { toast } from 'react-toastify';

const AuthPage = () => {
  const navigate = useNavigate();
  const tg = useTelegram();

  const handleAuth = async () => {
    try {
      console.log('Начинаем авторизацию...');
      
      // В отладочном режиме не требуется объект Telegram
      const isDebug = true;
      
      if (!tg && !isDebug) {
        toast.error('Пожалуйста, откройте приложение через Telegram');
        return;
      }

      // Используем тестовые данные в отладочном режиме
      const initData = isDebug ? 'debug_data' : (tg?.initData || window.Telegram?.WebApp?.initData);
      
      console.log('Отправка данных для авторизации:', initData);
      const response = await authenticateWithTelegram(initData);
      console.log('Получен ответ:', response);
      
      if (response && response.data && response.data.access) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        navigate('/');
        toast.success('Успешная авторизация!');
      } else {
        toast.error('Ошибка авторизации: нет токена в ответе');
        console.error('Ответ без токена:', response);
      }
    } catch (error) {
      console.error('Auth error:', error);
      let errorMessage = 'Неизвестная ошибка авторизации';
      
      if (error.response) {
        errorMessage = `Ошибка (${error.response.status}): ${error.response.data?.detail || 'нет подробностей'}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`Ошибка авторизации: ${errorMessage}`);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(45, 113, 235, 0.9)',
          borderRadius: '15px',
          padding: 3,
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            marginBottom: 2,
            fontWeight: 'bold',
          }}
        >
          CryptoFarm
        </Typography>
        <Typography
          sx={{
            color: 'white',
            marginBottom: 3,
            opacity: 0.9,
          }}
        >
          Для продолжения необходимо авторизоваться через Telegram
        </Typography>
        <Button
          variant="contained"
          onClick={handleAuth}
          sx={{
            background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '16px',
            '&:hover': {
              background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
              opacity: 0.9,
            },
          }}
        >
          Войти через Telegram
        </Button>
      </Box>
    </Box>
  );
};

export default AuthPage; 