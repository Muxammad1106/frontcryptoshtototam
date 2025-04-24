import { useEffect, useState } from 'react';

const isDev = import.meta.env.DEV;

export const useTelegram = () => {
  const [tg, setTg] = useState(window.Telegram?.WebApp);

  useEffect(() => {
    if (isDev) {
      // В режиме разработки используем тестовые данные
      console.log('🔵 Development mode - using mock data');
      setTg({
        initData: 'mock_init_data',
        initDataUnsafe: {
          user: {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          }
        }
      });
      return;
    }

    if (window.Telegram?.WebApp) {
      console.log('🔵 Telegram WebApp found:', window.Telegram.WebApp);
      setTg(window.Telegram.WebApp);
    } else {
      console.log('❌ Telegram WebApp not found');
    }

    // Слушаем событие готовности Telegram WebApp
    const handleTelegramLoad = () => {
      console.log('🔵 Telegram WebApp loaded');
      if (window.Telegram?.WebApp) {
        setTg(window.Telegram.WebApp);
      }
    };

    window.addEventListener('telegram-ready', handleTelegramLoad);
    return () => window.removeEventListener('telegram-ready', handleTelegramLoad);
  }, []);

  return tg;
};
