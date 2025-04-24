// Первым делом импортируем global.js для настройки конфигурации
import './global.js';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Убедимся, что конфигурация загружена
console.log('🚀 main.jsx: Приложение запускается...');
console.log('🚀 API URL из CONFIG:', window.CONFIG?.API_URL);
console.log('🚀 API URL из env:', window.env?.VITE_API_BASE_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
