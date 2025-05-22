import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    build: {
        target: 'es2022',
        rollupOptions: {
            input: {
                index: 'index.html', // 기본 index.html
                serverLogin: 'src/pages/server-page.html',
                room: 'src/pages/chatlist-page.html',
                gamePage: 'src/pages/chat.html',
                gameOver: 'src/pages/result-page.html',
            },
        },
    },
    appType: 'mpa', // fallback 사용안함
    plugins: [tailwindcss()],
});
