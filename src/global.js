// Этот файл загружается глобально и позволяет получить доступ
// к конфигурации без необходимости импорта

import config from './config';

// Делаем config доступным глобально
window.CONFIG = config;

// Для совместимости с разными вариантами доступа
window.env = window.env || {};
window.env.VITE_API_BASE_URL = config.API_URL;

// Переопределяем import.meta.env для всех файлов
try {
  if (typeof window !== 'undefined') {
    // Безопасная проверка для избежания ошибок парсинга
    if (window.import && window.import.meta) {
      window.import.meta.env = window.import.meta.env || {};
      window.import.meta.env.VITE_API_BASE_URL = config.API_URL;
    }
  }
} catch (e) {
  console.warn('Не удалось установить import.meta.env', e);
}

// Отладочные логи
console.log('🌐 global.js: Конфигурация загружена глобально');
console.log('🌐 CONFIG.API_URL:', window.CONFIG.API_URL);

export default config; 