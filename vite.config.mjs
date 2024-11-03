import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import momentTimezonePlugin from 'vite-plugin-moment-timezone';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        origin: 'http://localhost:5173',
    },
    optimizeDeps: {
        noDiscovery: true,
        include: ['pusher-js']
    },
    plugins: [
        vue(),
        momentTimezonePlugin({ zones: ['America/Mexico_City'], startYear: 2000, endYear: 2027 }),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        commonjsOptions: {
          requireReturnsDefault: 'auto'
        }
    }
});
