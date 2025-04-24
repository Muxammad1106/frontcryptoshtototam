// Константы для API-эндпоинтов

import config from '../config';

const API_URL = config.API_URL;

export const ENDPOINTS = {
  // Авторизация
  AUTH: {
    TELEGRAM: '/api/auth/telegram/',
    REFRESH: '/api/auth/refresh/',
    LOGOUT: '/api/auth/logout/',
  },
  
  // Деревья
  TREES: {
    LIST: '/api/trees/',
    DETAIL: (id) => `/api/trees/${id}/`,
    WATER: (id) => `/api/trees/${id}/water/`,
    HARVEST: (id) => `/api/trees/${id}/harvest/`,
  },
  
  // Магазин
  SHOP: {
    ITEMS: '/api/shop/',
    BUY: (id) => `/api/shop/${id}/buy/`,
  },
  
  // P2P
  P2P: {
    LIST: '/api/p2p/',
    CREATE: '/api/p2p/create/',
  },
  
  // Пользователи
  USERS: {
    PROFILE: '/api/users/profile/',
    FRIENDS: '/api/users/friends/',
  },
  
  // Утилиты
  UTILS: {
    HEALTH_CHECK: '/api/health-check/',
    VERSION: '/api/version/',
  }
};

// Вспомогательная функция для получения полного URL
export const getFullUrl = (endpoint) => `${API_URL}${endpoint}`;

export default ENDPOINTS; 