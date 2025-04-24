import api from './api';

export const waterTree = async (treeId) => {
  console.log(`Запрос на полив дерева ${treeId}`);
  try {
    const res = await api.post(`/trees/${treeId}/water/`);
    console.log(`Успешный полив дерева ${treeId}:`, res.data);
  return res.data;
  } catch (error) {
    console.error(`Ошибка полива дерева ${treeId}:`, error);
    throw error;
  }
};

export const autoWaterTree = async (treeId, hours) => {
  console.log(`Запрос на автополив дерева ${treeId} на ${hours} часов`);
  try {
    const res = await api.post(`/trees/${treeId}/auto-water/`, { hours });
    console.log(`Успешная настройка автополива дерева ${treeId}:`, res.data);
  return res.data;
  } catch (error) {
    console.error(`Ошибка настройки автополива дерева ${treeId}:`, error);
    throw error;
  }
};

export const fertilizeTree = async (treeId, level) => {
  console.log(`Запрос на удобрение дерева ${treeId}, уровень: ${level}`);
  try {
    const res = await api.post(`/trees/${treeId}/fertilize/`, { level });
    console.log(`Успешное удобрение дерева ${treeId}:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`Ошибка удобрения дерева ${treeId}:`, error);
    throw error;
  }
  };

export const upgradeTree = async (treeId) => {
  console.log(`Запрос на улучшение дерева ${treeId}`);
  try {
    const res = await api.post(`/trees/${treeId}/upgrade/`);
    console.log(`Успешное улучшение дерева ${treeId}:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`Ошибка улучшения дерева ${treeId}:`, error);
    throw error;
  }
  };
    