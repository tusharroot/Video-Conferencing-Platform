// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.ngrok-free.app'],
    host: '0.0.0.0',     // 👈 Make Vite listen on all interfaces
    port: 5173,          // 👈 Optional: set static port
    strictPort: true     // 👈 Optional: avoid switching port if busy
  }
});
