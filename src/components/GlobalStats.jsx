import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTree } from '../context/TreeContext';

const GlobalStats = () => {
  const { tree, loading } = useTree();

  if (loading) {
    return (
      <Box 
        sx={{ 
          backgroundColor: 'rgba(45, 113, 235, 0.9)',
          borderRadius: '15px',
          py: 1,
          px: 1,
          mb: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70px'
        }}
      >
        <CircularProgress size={24} color="inherit" sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        backgroundColor: 'rgba(45, 113, 235, 0.9)',
        borderRadius: '15px',
        py: 1,
        px: 1,
        mb: 2,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <Typography 
        align="center" 
        fontSize="15px" 
        color="white" 
        sx={{ mb: 1 }}
      >
        Доход в час: {tree?.hourly_income || '0'} FLORA
      </Typography>
      <Typography 
        align="center" 
        fontSize="15px" 
        color="white"
      >
        Собрано веток: {tree?.total_branches || '0'} / {tree?.next_level_branches || '∞'}
      </Typography>
    </Box>
  );
};

export default GlobalStats; 