import axios from 'axios';
import config from '../config';
import ENDPOINTS from './endpoints';

// Создаем экземпляр axios с глобальными настройками
const API_URL = config.API_URL;

console.log('📡 Инициализация API клиента с URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: config.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  }
});

// Интерцептор для обработки запросов
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔵 Запрос ${config.method?.toUpperCase() || 'GET'} к ${config.url}`);
    
    // Добавляем токены авторизации, если они есть
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Ошибка в запросе:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Успешный ответ от ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ Ошибка ответа (${error.response?.status || 'Нет соединения'}):`, 
      error.response?.data || error.message);
    
    // Обработка 401 (неавторизован) - перенаправление на страницу входа
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      
      // Перенаправление, если не на странице входа
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

// Экспортируем методы для работы с API
export const api = {
  // Аутентификация
  auth: {
    loginWithTelegram: (initData) => apiClient.post(ENDPOINTS.AUTH.TELEGRAM, {
      telegram_init_data: initData,
      debug_mode: config.DEBUG_MODE,
      user_id: 12345
    }),
    refreshToken: (refreshToken) => apiClient.post(ENDPOINTS.AUTH.REFRESH, { refresh: refreshToken })
  },
  
  // Операции с деревом
  tree: {
    getInfo: () => apiClient.get(ENDPOINTS.TREES.LIST),
    waterTree: (treeId) => apiClient.post(ENDPOINTS.TREES.WATER(treeId)),
    harvestTree: (treeId) => apiClient.post(ENDPOINTS.TREES.HARVEST(treeId))
  },
  
  // Другие методы API
  shop: {
    getItems: () => apiClient.get(ENDPOINTS.SHOP.ITEMS),
    buyItem: (itemId) => apiClient.post(ENDPOINTS.SHOP.BUY(itemId))
  },
  
  // Утилиты
  utils: {
    healthCheck: () => apiClient.get(ENDPOINTS.UTILS.HEALTH_CHECK),
    getVersion: () => apiClient.get(ENDPOINTS.UTILS.VERSION)
  },
  
  // Получить исходный экземпляр axios для нестандартных запросов
  client: apiClient,
  
  // URL для внешних ссылок
  getFullUrl: (path) => `${API_URL}${path}`
};

export default api;

export const getOpenOrders = () => api.client.get('/orders/?status=open');
export const buyOrder = (id) => api.client.post(`/orders/${id}/`);
