import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useTree } from '../context/TreeContext';

const TreeInfo = () => {
  const { tree, loading, error, fetchTree } = useTree();

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Загрузка данных о дереве...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 2, color: 'error.main' }}>
        <Typography variant="body2">
          Ошибка: {error}
        </Typography>
        <Button onClick={fetchTree} variant="outlined" size="small" sx={{ mt: 1 }}>
          Повторить
        </Button>
      </Box>
    );
  }

  if (!tree) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="body2">
          Дерево не найдено
        </Typography>
        <Button onClick={fetchTree} variant="outlined" size="small" sx={{ mt: 1 }}>
          Создать дерево
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: 'rgba(0, 0, 0, 0.7)', 
      p: 2, 
      borderRadius: 2,
      color: 'white',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxHeight: '300px',
      overflowY: 'auto'
    }}>
      <Typography variant="h6" sx={{ mb: 1, fontSize: '14px', fontWeight: 'bold' }}>
        Данные дерева:
      </Typography>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(tree, null, 2)}
      </pre>
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Button 
          onClick={fetchTree} 
          variant="outlined" 
          size="small" 
          sx={{ fontSize: '10px', color: 'white', borderColor: 'white' }}
        >
          Обновить
        </Button>
      </Box>
    </Box>
  );
};

export default TreeInfo; 