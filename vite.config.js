import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env, // добавь это, если хочешь поддержку `process.env`
    
  },

  server: {
    allowedHosts: ['.ngrok-free.app', '.loca.lt'], // разрешить любые ngrok/loca.lt адреса
  },
});
