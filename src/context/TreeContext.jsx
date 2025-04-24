import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

// Создаем контекст
const TreeContext = createContext();

// Провайдер контекста
export const TreeProvider = ({ children }) => {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для загрузки данных о дереве
  const fetchTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Загрузка данных о дереве...');
      const response = await api.get('/trees/');
      console.log('Данные о дереве получены:', response);
      
      if (response.data && response.data.length > 0) {
        console.log('Найдено дерево:', response.data[0]);
        setTree(response.data[0]);
      } else {
        console.log('Деревья не найдены, создаем новое');
        try {
          const newTreeResponse = await api.post('/trees/', { level: 1 });
          console.log('Создано новое дерево:', newTreeResponse.data);
          setTree(newTreeResponse.data);
        } catch (createErr) {
          console.error('Ошибка создания дерева:', createErr);
          setError('Ошибка создания дерева');
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки дерева:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Эффект для загрузки данных о дереве при монтировании компонента
  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  // Значение контекста
  const contextValue = {
    tree,
    loading,
    error,
    fetchTree
  };

  return (
    <TreeContext.Provider value={contextValue}>
      {children}
    </TreeContext.Provider>
  );
};

// Хук для использования контекста
export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

export default TreeContext; 