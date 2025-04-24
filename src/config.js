// Конфигурация API и других параметров приложения
const config = {
  // API URL - используется во всех запросах к серверу
  API_URL: 'https://admin1213123.pythonanywhere.com',
  
  // Режим отладки - включает дополнительные логи и использует тестовые данные
  DEBUG_MODE: true,
  
  // Таймаут запросов (в миллисекундах)
  REQUEST_TIMEOUT: 10000,
  
  // Версия API (если нужно указывать в запросах)
  API_VERSION: 'v1',
  
  // Задержка для автоматического обновления данных (в миллисекундах)
  REFRESH_INTERVAL: 30000,
};

// Для доступа из webpack/vite в process.env
if (typeof window !== 'undefined') {
  window.env = window.env || {};
  window.env.VITE_API_BASE_URL = config.API_URL;
}

export default config; 