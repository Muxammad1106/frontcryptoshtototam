import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import NavBar from '../components/NavBar';
import api from '../services/api';
import background from '../assets/Background/bg_cart.png';
import GlobalStats from '../components/GlobalStats';
import { useTree } from '../context/TreeContext';
import CustomModal from '../components/CustomModal';

const P2PPage = () => {
  const [orders, setOrders] = useState([]);
  const { tree } = useTree();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('buy'); // 'buy' или 'sell'
  
  // Состояния для модальных окон
  const [errorModal, setErrorModal] = useState({
    open: false,
    title: '',
    message: '',
    icon: ''
  });
  const [devModal, setDevModal] = useState(false);

  useEffect(() => {
    // Показываем сообщение о функционале в разработке
    setDevModal(true);
  }, []);

  const showErrorModal = (title, message, icon = '⚠️') => {
    setErrorModal({
      open: true,
      title,
      message,
      icon
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // В реальной реализации использовали бы:
      // const response = await api.get('/p2p/orders/');
      
      // Симуляция загрузки данных
      setTimeout(() => {
        setOrders([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Ошибка при загрузке ордеров:', error);
      showErrorModal(
        'Ошибка загрузки', 
        'Не удалось загрузить список ордеров. Пожалуйста, попробуйте позже.'
      );
      setLoading(false);
    }
  };

  const handleBuy = async (orderId) => {
    // В реальной реализации использовали бы:
    // await api.post(`/p2p/orders/${orderId}/buy/`);
    
    showErrorModal(
      'Функция в разработке', 
      'Функция P2P обмена находится в разработке и будет доступна в ближайшее время.',
      '⏱️'
    );
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        maxWidth: '414px',
        mx: 'auto',
        px: 2,
        pt: 3,
        pb: 12,
        position: 'relative',
      }}
    >
      <GlobalStats />

      <Typography
        variant="h5"
        align="center"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          mb: 3,
          textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        P2P Обмен
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => setMode('buy')}
          sx={{
            ...buttonStyle,
            backgroundColor: mode === 'buy' ? 'rgba(72, 57, 195, 0.8)' : 'rgba(255, 255, 255, 0.2)',
          }}
        >
          Купить
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => setMode('sell')}
          sx={{
            ...buttonStyle,
            backgroundColor: mode === 'sell' ? 'rgba(72, 57, 195, 0.8)' : 'rgba(255, 255, 255, 0.2)',
          }}
        >
          Продать
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      ) : (
        <>
          {orders.length === 0 && (
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: '16px',
                p: 3,
                textAlign: 'center'
              }}
            >
              <Typography 
                color="white" 
                sx={{ mb: 2, fontSize: '18px', fontWeight: 'bold' }}
              >
                Функция в разработке
              </Typography>
              <Typography color="white" sx={{ mb: 2 }}>
                P2P обмен будет доступен в ближайшее время
              </Typography>
              <Typography fontSize="40px">
                ⏱️
              </Typography>
            </Box>
          )}
          {orders.map((order) => (
            <Box
              key={order.id}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                mb: 2,
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography color="white" fontWeight="500">
                  {order.user_name || 'Пользователь'}
                </Typography>
                <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
                  {order.amount} FLORA
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography color="white" fontWeight="500">
                  {order.price} TON
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleBuy(order.id)}
                  disabled={loading || mode === 'sell'}
                  sx={buttonStyle}
                >
                  Купить
                </Button>
              </Box>
            </Box>
          ))}
        </>
      )}

      {/* Модальные окна */}
      <CustomModal
        open={errorModal.open}
        onClose={() => setErrorModal({ ...errorModal, open: false })}
        title={errorModal.title}
        message={errorModal.message}
        confirmText="Понятно"
        icon={errorModal.icon}
      />

      {/* Модальное окно для функционала в разработке */}
      <CustomModal
        open={devModal}
        onClose={() => setDevModal(false)}
        title="Функция в разработке"
        message="P2P обмен находится в разработке и будет доступен в ближайшее время."
        confirmText="Понятно"
        icon="⏱️"
      />

      <NavBar />
    </Box>
  );
};

const buttonStyle = {
  background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
  color: 'white',
  textTransform: 'none',
  fontSize: '14px',
  borderRadius: '8px',
  '&:hover': {
    background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
    opacity: 0.9,
  },
  '&:disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
};

export default P2PPage; 