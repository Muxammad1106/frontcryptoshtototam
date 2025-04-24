import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import NavBar from '../components/NavBar';
import GlobalStats from '../components/GlobalStats';
import { useTree } from '../context/TreeContext';
import CustomModal from '../components/CustomModal';

// Импорт изображений
import background from '../assets/Background/bg_cart.png';
import wateringCan from '../assets/watering_can.png';
import fertilizer from '../assets/Seed.png';
import branches from '../assets/Stick.png';

const ShopPage = () => {
  const { tree } = useTree();
  const [modalOpen, setModalOpen] = useState(false);

  const handleBuyClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
      <GlobalStats tree={tree} />

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
        Магазин
      </Typography>

      {/* Автополив */}
      <Box sx={cardStyle}>
        <Box sx={cardContentStyle}>
          <Box
            component="img"
            src={wateringCan}
            alt="Автополив"
            sx={imageStyle}
          />
          <Box sx={infoStyle}>
            <Typography variant="h6" color="white" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Автополив
            </Typography>
            <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
              Срок: 24ч
            </Typography>
            <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
              Срок: 48ч
            </Typography>
          </Box>
          <Box sx={buttonsStyle}>
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={handleBuyClick}
            >
              Купить 1 TON
            </Button>
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={handleBuyClick}
            >
              Купить 2 TON
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Удобрение */}
      <Box sx={cardStyle}>
        <Box sx={cardContentStyle}>
          <Box
            component="img"
            src={fertilizer}
            alt="Удобрение"
            sx={imageStyle}
          />
          <Box sx={infoStyle}>
            <Typography variant="h6" color="white" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Увеличивает
            </Typography>
            <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
              Доход: X2
            </Typography>
            <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
              Срок: 24ч
            </Typography>
          </Box>
          <Box sx={buttonsStyle}>
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={handleBuyClick}
            >
              Купить 1 TON
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Ветки */}
      <Box sx={cardStyle}>
        <Box sx={cardContentStyle}>
          <Box
            component="img"
            src={branches}
            alt="Ветки"
            sx={imageStyle}
          />
          <Box sx={infoStyle}>
            <Typography variant="h6" color="white" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Ветки
            </Typography>
            <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
              Улучшение
            </Typography>
            <Typography color="white" fontSize="14px" sx={{ opacity: 0.9 }}>
              Дерева
            </Typography>
          </Box>
          <Box sx={buttonsStyle}>
            <TextField
              variant="outlined"
              placeholder="Напишите количество"
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                width: '100%',
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={handleBuyClick}
            >
              1шт 1 TON
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Модальное окно для покупок за TON */}
      <CustomModal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Покупка за TON"
        message="Покупка товаров за TON временно недоступна. Функция находится в разработке и будет доступна в ближайшее время."
        confirmText="Понятно"
        icon="⏱️"
      />

      <NavBar />
    </Box>
  );
};

// Стили
const cardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  mb: 2,
  p: 2,
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
};

const cardContentStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 2,
};

const imageStyle = {
  width: '60px',
  height: '60px',
  objectFit: 'contain',
  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))',
};

const infoStyle = {
  flex: 1,
};

const buttonsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  minWidth: '120px',
};

const buttonStyle = {
  background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
  color: 'white',
  textTransform: 'none',
  fontSize: '14px',
  whiteSpace: 'nowrap',
  padding: '8px 16px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
    opacity: 0.9,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
};

export default ShopPage; 