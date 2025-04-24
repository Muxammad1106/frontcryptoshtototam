import api from './api';
import config from '../config';

console.log('🔵 Auth service initalized, API URL:', config.API_URL);

export const authenticateWithTelegram = async (initData) => {
  try {
    console.log('🔵 Attempting authentication with initData:', initData);
    
    const res = await api.auth.loginWithTelegram(initData);
    console.log('✅ Authentication response:', res.data);
    return res;
  } catch (error) {
    console.error('❌ Authentication error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const res = await api.auth.refreshToken(refreshToken);
    
    if (res.data && res.data.access) {
      localStorage.setItem('access', res.data.access);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Очищаем токены при ошибке обновления
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return false;
  }
};
