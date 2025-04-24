import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import NavBar from '../components/NavBar';
import api from '../services/api';
import GlobalStats from '../components/GlobalStats';
import { useTree } from '../context/TreeContext';
import CustomModal from '../components/CustomModal';

// Импорт фонового изображения
import background from '../assets/Background/bg_cart.png';

const ListPage = () => {
  const [transactions, setTransactions] = useState([]);
  const { tree } = useTree();
  const [loading, setLoading] = useState(false);
  
  // Состояние для модального окна
  const [errorModal, setErrorModal] = useState({
    open: false,
    title: '',
    message: '',
    icon: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const showErrorModal = (title, message, icon = '⚠️') => {
    setErrorModal({
      open: true,
      title,
      message,
      icon
    });
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions/');
      
      // Проверяем, является ли response.data массивом
      if (Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        console.warn('API вернул не массив:', response.data);
        // Если ответ - объект с полем results, используем его
        if (response.data && Array.isArray(response.data.results)) {
          setTransactions(response.data.results);
        } else {
          // Иначе устанавливаем пустой массив
          setTransactions([]);
          showErrorModal(
            'Неверный формат данных', 
            'API вернул данные в неожиданном формате.'
          );
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке транзакций:', error);
      showErrorModal(
        'Ошибка загрузки', 
        'Не удалось загрузить список транзакций. Пожалуйста, попробуйте позже.'
      );
      setTransactions([]); // Сбрасываем к пустому массиву при ошибке
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Ошибка форматирования даты:', error);
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'white';
    
    switch (status.toString().toLowerCase()) {
      case 'completed':
      case 'завершено':
        return '#4CAF50';
      case 'pending':
      case 'в процессе':
        return '#FFC107';
      case 'failed':
      case 'ошибка':
        return '#F44336';
      default:
        return 'white';
    }
  };

  // Убедимся, что transactions - это массив
  const transactionsArray = Array.isArray(transactions) ? transactions : [];

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
        Список операций
      </Typography>

      {/* Список транзакций */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      ) : transactionsArray.length === 0 ? (
        <Typography
          color="white"
          align="center"
          sx={{ mt: 4, opacity: 0.7 }}
        >
          Нет операций
        </Typography>
      ) : (
        transactionsArray.map((transaction, index) => (
          <Box
            key={transaction.id || index}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              mb: 2,
              p: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="white" fontWeight="500">
                {transaction.type || 'Операция'}
              </Typography>
              <Typography color="white" fontWeight="500">
                {transaction.amount || '0'} {transaction.currency || 'FLORA'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
                {formatDate(transaction.created_at)}
              </Typography>
              <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
                {transaction.price && `${transaction.price} TON`}
              </Typography>
            </Box>
            <Typography 
              fontSize="14px" 
              sx={{ 
                mt: 1,
                textAlign: 'right',
                color: getStatusColor(transaction.status)
              }}
            >
              {transaction.status || 'Неизвестно'}
            </Typography>
          </Box>
        ))
      )}

      {/* Модальное окно для ошибок */}
      <CustomModal
        open={errorModal.open}
        onClose={() => setErrorModal({ ...errorModal, open: false })}
        title={errorModal.title}
        message={errorModal.message}
        confirmText="Понятно"
        icon={errorModal.icon}
      />

      <NavBar />
    </Box>
  );
};

export default ListPage; 