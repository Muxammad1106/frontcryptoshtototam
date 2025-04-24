import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomToast = ({ type, message }) => {
  const getToastStyle = () => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'slideIn 0.3s ease-out',
      minWidth: '280px',
      backdropFilter: 'blur(10px)',
    };

    switch (type) {
      case 'error':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(229, 57, 53, 0.95))',
          border: '1px solid rgba(244, 67, 54, 0.3)',
        };
      case 'success':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(67, 160, 71, 0.95))',
          border: '1px solid rgba(76, 175, 80, 0.3)',
        };
      case 'warning':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95), rgba(245, 124, 0, 0.95))',
          border: '1px solid rgba(255, 152, 0, 0.3)',
        };
      default:
        return baseStyle;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <Box sx={getToastStyle()}>
      <Box sx={{ mr: 2, fontSize: '20px' }}>{getIcon()}</Box>
      <Typography
        sx={{
          color: 'white',
          fontWeight: 500,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default CustomToast; 