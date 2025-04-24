import api from './api';

// Получить реферальный код пользователя
export const getReferralCode = async () => {
  console.log('Запрос на получение реферального кода');
  try {
    const res = await api.get('referral/generate/');
    console.log('Успешно получен реферальный код:', res.data);
    return res.data;
  } catch (error) {
    console.error('Ошибка получения реферального кода:', error);
    throw error;
  }
};

// Применить реферальный код
export const applyReferralCode = async (code) => {
  console.log(`Запрос на применение реферального кода: ${code}`);
  try {
    const res = await api.post('referral/apply/', { code });
    console.log('Успешно применен реферальный код:', res.data);
    return res.data;
  } catch (error) {
    console.error('Ошибка применения реферального кода:', error);
    throw error;
  }
};

// Получить статистику по рефералам
export const getReferralStats = async () => {
  console.log('Запрос на получение статистики по рефералам');
  try {
    const res = await api.get('referral/stats/');
    console.log('Успешно получена статистика по рефералам:', res.data);
    return res.data;
  } catch (error) {
    console.error('Ошибка получения статистики по рефералам:', error);
    throw error;
  }
}; 