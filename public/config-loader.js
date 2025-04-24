// Глобальная конфигурация для приложения, доступная до загрузки React
window.appConfig = {
  API_URL: 'https://admin1213123.pythonanywhere.com',
  DEBUG_MODE: true,
  VERSION: '1.0.0',
  LAST_UPDATED: new Date().toISOString()
};

// Логи для отладки
console.log('[CONFIG] Загружена глобальная конфигурация');
console.log('[CONFIG] API URL:', window.appConfig.API_URL);

// Создаем env объект для совместимости с Vite
window.env = window.env || {};
window.env.VITE_API_BASE_URL = window.appConfig.API_URL;

// Функция для проверки доступности API
function checkApiAvailability() {
  console.log('[CONFIG] Проверка доступности API...');
  
  return fetch(window.appConfig.API_URL + '/api/health-check')
    .then(response => {
      if (response.ok) {
        console.log('[CONFIG] API доступен!');
        return true;
      }
      console.warn('[CONFIG] API недоступен. Статус:', response.status);
      return false;
    })
    .catch(error => {
      console.error('[CONFIG] Ошибка при проверке API:', error);
      return false;
    });
}

// Попытка проверить API (но не блокируем загрузку)
checkApiAvailability(); 