import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import NavBar from '../components/NavBar';
import background from '../assets/Background/bg_cart.png';
import api from '../services/api';
import GlobalStats from '../components/GlobalStats';
import { useTree } from '../context/TreeContext';
import CustomModal from '../components/CustomModal';

const MarketPage = () => {
  const [orders, setOrders] = useState([]);
  const { tree } = useTree();
  const [amountFlora, setAmountFlora] = useState('');
  const [priceTON, setPriceTON] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Состояния для модальных окон
  const [errorModal, setErrorModal] = useState({
    open: false,
    title: '',
    message: '',
    icon: ''
  });
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: '',
    message: '',
    icon: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const showErrorModal = (title, message, icon = '⚠️') => {
    setErrorModal({
      open: true,
      title,
      message,
      icon
    });
  };

  const showSuccessModal = (title, message, icon = '✅') => {
    setSuccessModal({
      open: true,
      title,
      message,
      icon
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/orders/?status=open');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Ошибка получения ордеров', err);
      showErrorModal(
        'Ошибка загрузки', 
        'Не удалось загрузить список ордеров. Пожалуйста, попробуйте позже.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!amountFlora || !priceTON) {
      showErrorModal(
        'Ошибка', 
        'Пожалуйста, заполните все поля'
      );
      return;
    }

    try {
      setLoading(true);
      await api.post('/orders/', {
        amount_cf: parseFloat(amountFlora),
        price_ton: parseFloat(priceTON),
      });
      
      showSuccessModal(
        'Успешно', 
        'Ордер успешно создан! 📝'
      );
      
      setAmountFlora('');
      setPriceTON('');
      fetchOrders();
    } catch (err) {
      console.error('Ошибка создания ордера', err);
      if (err.response?.data?.error_type === 'insufficient_funds') {
        showErrorModal(
          'Недостаточно средств', 
          err.response.data.detail || 'У вас недостаточно средств для создания ордера'
        );
      } else {
        showErrorModal(
          'Ошибка', 
          'Не удалось создать ордер. Пожалуйста, попробуйте позже.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyOrder = async (orderId) => {
    try {
      setLoading(true);
      await api.post(`/orders/${orderId}/`);
      
      showSuccessModal(
        'Успешно', 
        'Ордер успешно куплен! 🎉'
      );
      
      fetchOrders();
    } catch (err) {
      console.error('Ошибка покупки', err);
      if (err.response?.data?.error_type === 'insufficient_funds') {
        showErrorModal(
          'Недостаточно средств', 
          err.response.data.detail || 'У вас недостаточно средств для покупки'
        );
      } else {
        showErrorModal(
          'Ошибка покупки', 
          'Не удалось купить ордер. Пожалуйста, попробуйте позже.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orders.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#1a1a1a',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#1a1a1a',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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

      {/* Заглушка графика */}
      <Box
        sx={{
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.2)',
          height: '100px',
          mb: 2,
        }}
      >
        <Typography textAlign="center" pt={4} color="white">
          [График продажи FLORA]
        </Typography>
      </Box>

      {/* Список ордеров */}
      <Box sx={{ mb: 2 }}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Box
              key={order.id}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Box>
                <Typography color="white">Игрок #{order.seller}</Typography>
                <Typography color="white" fontSize="13px">
                  {order.amount_cf} FLORA
                </Typography>
              </Box>
              <Box>
                <Typography color="white" fontSize="13px">
                  Цена: {order.price_ton} TON
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    fontSize: '12px',
                    mt: 0.5,
                    textTransform: 'none',
                    background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
                  }}
                  onClick={() => handleBuyOrder(order.id)}
                >
                  Купить
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography color="white" align="center">
            Нет доступных ордеров
          </Typography>
        )}
      </Box>

      {/* Форма */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 3, p: 2 }}>
        <Typography fontWeight="bold" mb={1}>
          Создать ордер
        </Typography>
        <TextField
          fullWidth
          label="FLORA"
          value={amountFlora}
          onChange={(e) => setAmountFlora(e.target.value)}
          size="small"
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label="Цена (TON)"
          value={priceTON}
          onChange={(e) => setPriceTON(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleCreateOrder}
          variant="contained"
          fullWidth
          sx={{
            textTransform: 'none',
            background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
          }}
        >
          Разместить
        </Button>
      </Box>

      {/* Модальные окна */}
      <CustomModal
        open={errorModal.open}
        onClose={() => setErrorModal({ ...errorModal, open: false })}
        title={errorModal.title}
        message={errorModal.message}
        confirmText="Понятно"
        icon={errorModal.icon}
      />

      <CustomModal
        open={successModal.open}
        onClose={() => setSuccessModal({ ...successModal, open: false })}
        title={successModal.title}
        message={successModal.message}
        confirmText="Отлично!"
        icon={successModal.icon}
      />

      <NavBar />
    </Box>
  );
};

export default MarketPage;
