import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NavBar from '../components/NavBar';
import background from '../assets/Background/Bg_cart_full.png';
import giftBox from '../assets/Gift.png';
import coinIcon from '../assets/Lvl_coin.png';
import { getReferralCode, applyReferralCode, getReferralStats } from '../services/referral';
import CustomModal from '../components/CustomModal';

const FriendsPage = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ referral_code: '', referrals_count: 0, earnings: 0, referrals: [] });
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [openReferralsDialog, setOpenReferralsDialog] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  
  // Состояния для модальных окон
  const [notificationModal, setNotificationModal] = useState({
    open: false,
    title: '',
    message: '',
    icon: ''
  });

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const showNotification = (title, message, icon = '✅') => {
    setNotificationModal({
      open: true,
      title,
      message,
      icon
    });
  };

  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      // Симулируем загрузку данных
      setTimeout(() => {
        setStats({ 
          referral_code: 'DEMO123', 
          referrals_count: 0, 
          earnings: 0, 
          referrals: [] 
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Ошибка загрузки статистики рефералов:', err);
      showNotification(
        'Ошибка загрузки', 
        'Не удалось загрузить статистику рефералов. Пожалуйста, попробуйте позже.',
        '⚠️'
      );
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(stats.referral_code || 'DEMO123');
      showNotification(
        'Скопировано', 
        'Реферальный код скопирован в буфер обмена!'
      );
    } catch (err) {
      console.error('Ошибка копирования кода:', err);
      showNotification(
        'Ошибка', 
        'Не удалось скопировать код',
        '⚠️'
      );
    }
  };

  const handleApplyCode = async () => {
    if (!referralCode) {
      setError('Введите реферальный код');
      return;
    }

    try {
      setLoading(true);
      
      // Вместо отправки запроса показываем модальное окно
      setTimeout(() => {
        setLoading(false);
        setOpenApplyDialog(false);
        setReferralCode('');
        
        showNotification(
          'Функция в разработке', 
          'Применение реферальных кодов пока недоступно, но будет добавлено в ближайшее время.',
          '⏱️'
        );
      }, 1000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Не удалось применить реферальный код';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleOpenApplyDialog = () => {
    setOpenApplyDialog(true);
    setError('');
    setReferralCode('');
  };

  const handleShareWithFriends = async () => {
    showNotification(
      'Функция в разработке', 
      'Возможность поделиться с друзьями будет доступна в ближайшее время.',
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
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: 'black',
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        Друзья
      </Typography>

      <Typography
        align="center"
        sx={{
          color: 'black',
          fontSize: '18px',
          mb: 4,
        }}
      >
        Приглашайте друзей и получайте бонусы
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: 3,
            flex: 1,
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            component="img"
            src={giftBox}
            alt="подарок"
            sx={{
              width: '64px',
              height: '64px',
              display: 'block',
              mx: 'auto',
              mb: 2,
            }}
          />

          <Box
            sx={{
              mb: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#4839C3',
                fontWeight: 'bold',
                fontSize: '24px',
                mb: 1,
              }}
            >
              {loading ? <CircularProgress size={20} /> : stats.referrals_count}
            </Typography>
            <Typography
              sx={{
                color: 'black',
                fontSize: '14px',
              }}
            >
              Количество приглашений
            </Typography>
            {stats.referrals_count > 0 && (
              <Button 
                size="small" 
                sx={{ mt: 1 }}
                onClick={() => setOpenReferralsDialog(true)}
              >
                Посмотреть список
              </Button>
            )}
          </Box>

          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#4839C3',
                fontWeight: 'bold',
                fontSize: '24px',
                mb: 1,
              }}
            >
              {loading ? <CircularProgress size={20} /> : (
                <>
                  {typeof stats.earnings === 'number' ? 
                    stats.earnings.toFixed(2) : 
                    parseFloat(stats.earnings).toFixed(2)}
                  <Box
                    component="img"
                    src={coinIcon}
                    alt="монета"
                    sx={{
                      width: '20px',
                      height: '20px',
                      verticalAlign: 'middle',
                      ml: 0.5,
                    }}
                  />
                </>
              )}
            </Typography>
            <Typography
              sx={{
                color: 'black',
                fontSize: '14px',
              }}
            >
              Заработано
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Блок с кодом */}
      <Box
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: 3,
          mb: 4,
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            sx={{
              color: 'black',
              fontSize: '14px',
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            Ваш реферальный код:
          </Typography>
          <Typography
            sx={{
              color: '#4839C3',
              fontWeight: 'bold',
              fontSize: '24px',
            }}
          >
            {loading || codeLoading ? <CircularProgress size={20} /> : (stats.referral_code || 'Нет кода')}
          </Typography>
        </Box>
        <IconButton 
          color="primary" 
          onClick={handleCopyCode}
          disabled={loading || codeLoading || !stats.referral_code}
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{
          background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
          borderRadius: '32px',
          color: 'white',
          py: 1.5,
          mb: 2,
          textTransform: 'none',
          fontSize: '16px',
        }}
        onClick={handleShareWithFriends}
        disabled={loading || codeLoading || !stats.referral_code}
      >
        Пригласить друзей
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          borderRadius: '32px',
          py: 1.5,
          mb: 4,
          textTransform: 'none',
          fontSize: '16px',
          borderColor: '#4839C3',
          color: '#4839C3',
          '&:hover': {
            borderColor: '#7B57D6',
          },
        }}
        onClick={handleOpenApplyDialog}
        disabled={loading || codeLoading}
      >
        Ввести реферальный код
      </Button>

      {/* Диалоги */}
      <Dialog
        open={openApplyDialog}
        onClose={() => setOpenApplyDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: 2,
            maxWidth: '350px',
            width: '100%',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Введите реферальный код
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Реферальный код"
            fullWidth
            variant="outlined"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            onClick={() => setOpenApplyDialog(false)}
            color="primary"
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleApplyCode}
            color="primary"
            variant="contained"
            disabled={loading || !referralCode}
            sx={{
              background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
              borderRadius: '8px',
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(180deg, #3F31AD 0%, #6C4BBC 100%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Применить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно для уведомлений */}
      <CustomModal
        open={notificationModal.open}
        onClose={() => setNotificationModal({ ...notificationModal, open: false })}
        title={notificationModal.title}
        message={notificationModal.message}
        confirmText="Понятно"
        icon={notificationModal.icon}
      />

      <NavBar activeTab="friends" />
    </Box>
  );
};

export default FriendsPage; 