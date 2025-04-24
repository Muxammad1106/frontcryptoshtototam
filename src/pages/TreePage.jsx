import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  waterTree,
  autoWaterTree,
  fertilizeTree,
  upgradeTree,
} from '../services/tree';
import NavBar from '../components/NavBar';
import GlobalStats from '../components/GlobalStats';
import { useTree } from '../context/TreeContext';
import TreeInfo from '../components/TreeInfo';
import CustomModal from '../components/CustomModal';

import background from '../assets/Background/bg_cart.png';
import tree1 from '../assets/tree1.png';
import tree2 from '../assets/tree2.png';
import tree3 from '../assets/tree3.png';
import coinImage from '../assets/Lvl_coin.png';
import wateringCan from '../assets/watering_can.png';

const WATER_DURATION = 5 * 60 * 60; // 5 часов в секундах
const AUTO_WATER_PRICES = { 24: 50, 48: 90, 72: 120 };
const FERTILIZER_PRICES = { 1: 24, 2: 36, 3: 48, 4: 60, 5: 72 };

const levelImages = {
  1: tree1,
  2: tree2,
  3: tree3,
};

const TreePage = () => {
  const { tree, loading: treeLoading, fetchTree } = useTree();
  const [timers, setTimers] = useState({
    waterTimeLeft: 0,
    autoWaterTimeLeft: 0,
    fertilizerTimeLeft: 0
  });
  const [loading, setLoading] = useState(false);
  const [autoWaterOpen, setAutoWaterOpen] = useState(false);
  const [fertilizeOpen, setFertilizeOpen] = useState(false);
  const [isWateringAnimation, setWateringAnimation] = useState(false);
  const [showBranchAnimation, setShowBranchAnimation] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Состояния для модальных окон
  const [notificationModal, setNotificationModal] = useState({
    open: false,
    title: '',
    message: '',
    icon: ''
  });

  const updateTimers = useCallback(() => {
    if (!tree) return;

    const now = new Date().getTime();
    
    if (tree.last_watered) {
      const waterEndTime = new Date(tree.last_watered).getTime() + (WATER_DURATION * 1000);
      const waterTimeLeft = Math.max(0, Math.floor((waterEndTime - now) / 1000));
      setTimers(prev => ({ ...prev, waterTimeLeft }));
    }

    if (tree.auto_water_expires) {
      const autoWaterEndTime = new Date(tree.auto_water_expires).getTime();
      const autoWaterTimeLeft = Math.max(0, Math.floor((autoWaterEndTime - now) / 1000));
      setTimers(prev => ({ ...prev, autoWaterTimeLeft }));
    }

    if (tree.fertilizer_expires) {
      const fertilizerEndTime = new Date(tree.fertilizer_expires).getTime();
      const fertilizerTimeLeft = Math.max(0, Math.floor((fertilizerEndTime - now) / 1000));
      setTimers(prev => ({ ...prev, fertilizerTimeLeft }));
    }
  }, [tree]);

  useEffect(() => {
    const timer = setInterval(updateTimers, 1000);
    return () => clearInterval(timer);
  }, [updateTimers]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const showNotification = (title, message, icon = '✅') => {
    setNotificationModal({
      open: true,
      title,
      message,
      icon
    });
  };

  const handleWater = async () => {
    if (!tree?.id || loading) return;

    try {
      setLoading(true);
      setWateringAnimation(true);

      const result = await waterTree(tree.id);
      
      showNotification(
        'Дерево полито', 
        `+${result.gained_cf} FLORA 🌱`,
        '💧'
      );

      if (result.branch_dropped) {
        setShowBranchAnimation(true);
        setTimeout(() => setShowBranchAnimation(false), 2000);
        showNotification(
          'Поздравляем!', 
          'Вы нашли ветку!',
          '🌿'
        );
      }

      await fetchTree();
    } catch (err) {
      console.error('Ошибка полива:', err);
      showNotification(
        'Ошибка', 
        err.response?.data?.detail || 'Не удалось полить дерево',
        '⚠️'
      );
    } finally {
      setLoading(false);
      setWateringAnimation(false);
    }
  };

  const handleAutoWater = async (hours) => {
    try {
      setLoading(true);
      await autoWaterTree(tree.id, parseInt(hours));
      
      showNotification(
        'Автополив активирован', 
        `Автополив на ${hours}ч успешно активирован`,
        '✨'
      );
      
      setAutoWaterOpen(false);
      await fetchTree();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error_type === 'insufficient_funds') {
        showNotification(
          'Недостаточно средств', 
          err.response.data.detail || 'У вас недостаточно средств',
          '💸'
        );
      } else {
        showNotification(
          'Ошибка', 
          'Не удалось включить автополив',
          '⚠️'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFertilize = async (level) => {
    try {
      setLoading(true);
      await fertilizeTree(tree.id, parseInt(level));
      
      showNotification(
        'Удобрение применено', 
        `Удобрение уровня ${level} успешно применено`,
        '🌱'
      );
      
      setFertilizeOpen(false);
      await fetchTree();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error_type === 'insufficient_funds') {
        showNotification(
          'Недостаточно средств', 
          err.response.data.detail || 'У вас недостаточно средств',
          '💸'
        );
      } else {
        showNotification(
          'Ошибка', 
          'Не удалось применить удобрение',
          '⚠️'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!tree?.id) return;

    try {
      await upgradeTree(tree.id);
      
      showNotification(
        'Дерево улучшено', 
        'Уровень дерева успешно повышен!',
        '🎉'
      );
      
      await fetchTree();
    } catch (err) {
      console.error('Ошибка прокачки:', err);
      if (err.response?.data?.error_type === 'insufficient_branches') {
        showNotification(
          'Недостаточно веток', 
          'У вас недостаточно веток для улучшения дерева',
          '🌿'
        );
      } else {
        showNotification(
          'Ошибка', 
          'Не удалось улучшить дерево',
          '⚠️'
        );
      }
    }
  };

  const treeImage = levelImages[tree?.level] || tree1;

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
        overflow: 'hidden',
      }}
    >
      <GlobalStats />

      {/* Статус полива */}
      <Box 
        sx={{ 
          backgroundColor: 'rgba(45, 113, 235, 0.9)',
          borderRadius: '16px',
          py: 1.5,
          px: 3,
          mb: 2,
          width: 'fit-content',
          mx: 'auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        {timers.waterTimeLeft > 0 ? (
          <Typography 
            fontSize="18px" 
            color="white" 
            align="center"
          >
            Полив: {formatTime(timers.waterTimeLeft)}
        </Typography>
        ) : (
          <Typography 
            fontSize="18px" 
            color="#FFD700" 
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            Требуется полив!
        </Typography>
        )}
      </Box>

      {/* Активные бонусы */}
      {(timers.autoWaterTimeLeft > 0 || timers.fertilizerTimeLeft > 0) && (
        <Box 
          sx={{ 
            backgroundColor: 'rgba(45, 113, 235, 0.8)',
            borderRadius: '16px',
            py: 1.5,
            px: 3,
            mb: 2,
            width: 'fit-content',
            mx: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {timers.autoWaterTimeLeft > 0 && (
            <Typography 
              fontSize="18px" 
              color="white" 
              align="center"
              sx={{ mb: timers.fertilizerTimeLeft > 0 ? 1 : 0 }}
            >
              Автополив: {formatTime(timers.autoWaterTimeLeft)}
            </Typography>
          )}
          {timers.fertilizerTimeLeft > 0 && (
            <Typography 
              fontSize="18px" 
              color="white" 
              align="center"
            >
              Удобрение: {formatTime(timers.fertilizerTimeLeft)}
        </Typography>
          )}
      </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button 
            onClick={handleWater} 
            disabled={loading || timers.waterTimeLeft > 0} 
            variant="contained" 
            sx={btnStyle}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Полить'}
          </Button>
          
          <Button 
            onClick={() => setAutoWaterOpen(true)} 
            disabled={loading} 
            variant="contained" 
            sx={btnStyle}
          >
            Автополив
          </Button>
          
          <Button 
            onClick={() => setFertilizeOpen(true)} 
            disabled={loading || timers.fertilizerTimeLeft > 0} 
            variant="contained" 
            sx={btnStyle}
          >
            Удобрить
          </Button>
          
          <Button 
            onClick={handleUpgrade} 
            disabled={loading || !tree?.next_level_branches || tree?.total_branches < tree?.next_level_branches} 
            variant="contained" 
            sx={btnStyle}
          >
            Улучшить
          </Button>
        </Box>

        <Box sx={infoBlockStyle}>
          <Typography>Уровень: {tree?.level || 1}</Typography>
          <Typography>Доход в час: {tree?.hourly_income || '1'} FLORA</Typography>
          <Typography>
            Удобрение: {timers.fertilizerTimeLeft > 0 ? 'Активно' : 'Не активно'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 4, mb: 6, position: 'relative', textAlign: 'center' }}>
        <Box 
          component="img" 
          src={levelImages[tree?.level] || tree1} 
          sx={{ 
            width: '50%', 
            mx: 'auto',
            filter: isWateringAnimation ? 'brightness(1.2)' : 'none',
            transition: 'filter 0.3s ease-in-out'
          }} 
        />
        
        <Box sx={progressBarStyle}>
          <Box 
            sx={{
              height: '100%',
              width: `${tree?.next_level_branches ? (tree?.total_branches / tree?.next_level_branches * 100) : 100}%`,
              background: 'linear-gradient(to right, #4B3CF4, #9D60FF)',
              borderRadius: '20px',
              transition: 'width 0.3s ease-in-out'
            }}
          />
          <Box component="img" src={coinImage} alt="coin" sx={coinStyle} />
        </Box>

        {isWateringAnimation && (
          <Box 
            component="img" 
            src={wateringCan} 
            alt="Watering" 
            sx={{
              ...wateringStyle,
              animation: 'watering 1s infinite'
            }} 
          />
        )}

        {showBranchAnimation && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '2rem',
              animation: 'branchFloat 2s ease-out',
            }}
          >
            🌿
          </Box>
        )}
      </Box>

      <NavBar />

      <Dialog 
        open={autoWaterOpen} 
        onClose={() => setAutoWaterOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          Выберите длительность автополива
        </DialogTitle>
        <DialogActions sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2, pb: 2 }}>
          {Object.entries(AUTO_WATER_PRICES).map(([hours, price]) => (
            <Button
              key={hours}
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={() => handleAutoWater(hours)}
              sx={{
                ...btnStyle,
                position: 'relative',
                height: '48px'
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <>
                  {hours} часов - {price} FLORA
                  {timers.autoWaterTimeLeft > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        right: '8px',
                        fontSize: '12px',
                        color: '#FFD700'
                      }}
                    >
                      Активен
                    </Box>
                  )}
                </>
              )}
            </Button>
          ))}
        </DialogActions>
      </Dialog>

      <Dialog 
        open={fertilizeOpen} 
        onClose={() => setFertilizeOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          Выберите уровень удобрения
        </DialogTitle>
        <DialogActions sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2, pb: 2 }}>
          {Object.entries(FERTILIZER_PRICES).map(([level, price]) => (
            <Button
              key={level}
              variant="contained"
              fullWidth
              disabled={loading || parseInt(level) > (tree?.level || 1)}
              onClick={() => handleFertilize(level)}
              sx={{
                ...btnStyle,
                opacity: parseInt(level) > (tree?.level || 1) ? 0.5 : 1,
                position: 'relative',
                height: '48px'
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <>
                  Уровень {level} - {price} FLORA
                  {parseInt(level) > (tree?.level || 1) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        right: '8px',
                        fontSize: '12px',
                        color: '#FF4444'
                      }}
                    >
                      Недоступно
                    </Box>
                  )}
                </>
              )}
            </Button>
          ))}
        </DialogActions>
      </Dialog>

      {/* Кнопка для показа/скрытия отладочной информации */}
      <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => setShowDebug(!showDebug)}
          sx={{ 
            minWidth: '30px', 
            height: '30px', 
            p: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
          }}
        >
          ⚙️
        </Button>
      </Box>
      
      {/* Отладочная информация о дереве */}
      {showDebug && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 50, 
            right: 10, 
            zIndex: 100, 
            width: '80%', 
            maxWidth: '350px'
          }}
        >
          <TreeInfo />
        </Box>
      )}

      {/* Модальные окна */}
      <CustomModal
        open={notificationModal.open}
        onClose={() => setNotificationModal({ ...notificationModal, open: false })}
        title={notificationModal.title}
        message={notificationModal.message}
        confirmText="Понятно"
        icon={notificationModal.icon}
      />
    </Box>
  );
};

const btnStyle = {
  background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
  borderRadius: '16px',
  fontSize: '14px',
  textTransform: 'none',
  minWidth: '120px',
};

const infoBlockStyle = {
  backgroundColor: 'rgba(255,255,255,0.15)',
  border: '1px solid white',
  borderRadius: '12px',
  color: 'white',
  fontSize: '13px',
  px: 2,
  py: 1,
  lineHeight: 1.5,
  minWidth: '140px',
};

const progressBarStyle = {
  mt: 2,
  width: '80%',
  mx: 'auto',
  height: '20px',
  background: 'linear-gradient(to right, #4B3CF4, #9D60FF)',
  borderRadius: '20px',
  position: 'relative',
};

const coinStyle = {
  position: 'absolute',
  top: '-14px',
  right: '-12px',
  width: '36px',
};

const wateringStyle = {
  position: 'absolute',
  right: '0',
  bottom: '20px',
  width: '60px',
};

const styles = {
  '@keyframes watering': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '50%': {
      transform: 'rotate(-20deg)',
    },
    '100%': {
      transform: 'rotate(0deg)',
    },
  },
  '@keyframes branchFloat': {
    '0%': {
      opacity: 0,
      transform: 'translate(-50%, 0)',
    },
    '50%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0,
      transform: 'translate(-50%, -100px)',
    },
  },
};

export default TreePage;
