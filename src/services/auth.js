import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://admin1213123.pythonanywhere.com';

export const authenticateWithTelegram = async (initData) => {
  try {
    console.log('🔵 Attempting authentication with initData:', initData);
    
    const res = await axios.post(`${API_BASE}/api/auth/telegram/`, {
    telegram_init_data: initData,
      debug_mode: true,
      user_id: 12345
    }, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      withCredentials: true
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
