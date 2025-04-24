import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTelegram } from './hooks/useTelegram';
import { authenticateWithTelegram } from './services/auth';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TreeProvider } from './context/TreeContext';

import TreePage from './pages/TreePage';
import MarketPage from './pages/MarketPage';
import FriendsPage from './pages/FriendsPage';
import ShopPage from './pages/ShopPage';
import P2PPage from './pages/P2PPage';
import ListPage from './pages/ListPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('access');
  
  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

const isDev = import.meta.env.DEV;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tg = useTelegram();

  useEffect(() => {
    const authenticate = async () => {
      console.log('🔵 Starting authentication...');
      
      // Проверяем существующий токен
      const existingToken = localStorage.getItem('access');
      if (existingToken) {
        console.log('✅ Found existing token');
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      if (!tg) {
        console.log('❌ No Telegram WebApp object found');
        if (isDev) {
          console.log('🔵 Development mode - skipping authentication');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        return;
      }

      try {
        // В режиме разработки используем тестовые данные
        const initData = 'debug_data'; // Всегда используем отладочные данные
        console.log('🔵 Init data:', initData);

        const response = await authenticateWithTelegram(initData);
        console.log('✅ Auth successful:', response);
        
        if (response && response.data && response.data.access) {
          localStorage.setItem('access', response.data.access);
          localStorage.setItem('refresh', response.data.refresh);
          setIsAuthenticated(true);
        } else {
          console.error('❌ No tokens in response');
          toast.error('Ошибка авторизации: нет токенов');
        }
      } catch (error) {
        console.error('❌ Authentication error:', error);
        if (isDev) {
          console.log('🔵 Development mode - proceeding without authentication');
          setIsAuthenticated(true);
        }
        toast.error('Ошибка авторизации');
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, [tg]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}>
        Загрузка...
      </div>
    );
  }

  if (!isAuthenticated && !isDev) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>Пожалуйста, откройте приложение через Telegram</div>
        <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.7 }}>
          {isDev ? '(Режим разработки)' : ''}
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <TreeProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <TreePage />
            </ProtectedRoute>
          } />
          
          <Route path="/market" element={
            <ProtectedRoute>
              <MarketPage />
            </ProtectedRoute>
          } />
          
          <Route path="/friends" element={
            <ProtectedRoute>
              <FriendsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/shop" element={
            <ProtectedRoute>
              <ShopPage />
            </ProtectedRoute>
          } />
          
          <Route path="/p2p" element={
            <ProtectedRoute>
              <P2PPage />
            </ProtectedRoute>
          } />
          
          <Route path="/list" element={
            <ProtectedRoute>
              <ListPage />
            </ProtectedRoute>
          } />
          
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </TreeProvider>
    </>
  );
}

export default App;
