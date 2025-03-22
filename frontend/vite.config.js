import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/colors/api': {
                target: 'https://colorcolor.onrender.com', // ✅ 백엔드 주소
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
