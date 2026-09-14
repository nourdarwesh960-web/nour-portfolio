import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // اسمح للنطاق الخاص بـ DevTunnels (بيتغير كل مرة)
    allowedHosts: [
      '.devtunnels.ms', // يسمح لكل نطاقات devtunnels
      'localhost',
    ],
    // إعدادات HMR عشان يشتغل صح من خلال النفق
    hmr: {
      protocol: 'wss', // WebSocket Secure لأن الرابط https
      clientPort: 443,   // المنفذ الافتراضي لـ HTTPS
    },
  },
});