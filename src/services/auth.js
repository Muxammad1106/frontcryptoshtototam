import axios from 'axios';
import config from '../config';

// Используем URL из конфигурации, с запасным вариантом
const API_BASE = config.API_URL;

console.log('🔵 API URL:', API_BASE);

export const authenticateWithTelegram = async (initData) => {
  try {
    console.log('🔵 Attempting authentication with initData:', initData);
    
    const res = await axios.post(`${API_BASE}/api/auth/telegram/`, {
      telegram_init_data: initData,
      debug_mode: config.DEBUG_MODE,
      user_id: 12345
    }, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      withCredentials: true,
      timeout: config.REQUEST_TIMEOUT
    });

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
