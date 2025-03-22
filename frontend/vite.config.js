import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/colors/api': {
                target: 'http://localhost:3000', // ✅ 백엔드 주소
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
