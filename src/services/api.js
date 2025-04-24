import axios from 'axios';

// Устанавливаем URL сервера напрямую, без зависимости от переменных окружения
const API_BASE = 'https://admin1213123.pythonanywhere.com';

// Выводим в консоль используемый URL API
console.log('🌐 API URL используется:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  withCredentials: true // Включаем передачу куки
});

// Добавляем перехватчик для добавления токена к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
    console.log(`🔄 API запрос: ${config.method.toUpperCase()} ${config.url}`);
  return config;
  },
  (error) => {
    console.error('❌ Ошибка в запросе API:', error);
    return Promise.reject(error);
  }
);

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API ответ: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Если есть ответ от сервера с деталями ошибки
    if (error.response) {
      console.error(`❌ API ошибка ${error.response.status}: ${error.config.url}`, error.response.data);
      error.response.data.error_type = error.response.data.error_type || 
        (error.response.data.detail?.includes('Недостаточно') ? 'insufficient_funds' : 'unknown');
    } else {
      console.error('❌ Сетевая ошибка API:', error.message);
    }
    return Promise.reject(error);
  }
);

console.log("✅ API_BASE:", API_BASE);

export default api;

export const getOpenOrders = () => api.get('/orders/?status=open');
export const buyOrder = (id) => api.post(`/orders/${id}/`);
