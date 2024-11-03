import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import OverlayBadge from 'primevue/overlaybadge';
import ToastService from 'primevue/toastservice';


import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const SinvPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#C2C7D9',   // tono claro
            100: '#A6AABD',
            200: '#8A8DA1',
            300: '#6E7085',
            400: '#515369',
            500: '#081136',   // color principal (donde se define `primary.color`)
            600: '#060D2A',
            700: '#05091E',
            800: '#030512',
            900: '#020206'
        },
        secondary: {
            50: '#D5F5FC',    // tono claro
            100: '#A9E8F8',
            200: '#7CDBF3',
            300: '#50CEEF',
            400: '#23C1EA',
            500: '#00BCE1',   // color secundario
            600: '#00A8CB',
            700: '#0094B5',
            800: '#007F9F',
            900: '#006A89'
        },
        surface: {
            0: '#FFFFFF',      // Fondo base claro
            50: '#F0F1F2',
            100: '#E1E2E4',
            200: '#D2D3D6',
            300: '#C3C5C8',
            400: '#B4B6BA',
            500: '#888B8D',    // gris para fondos y bordes
            600: '#777A7C',
            700: '#66686B',
            800: '#55565A',
            900: '#444548'
        },
        text: {
            primary: '#000000',   // Texto principal en negro
            secondary: '#081136'   // Texto secundario en azul oscuro
        }
    },
    pt: {
        dialog: {
            header: {
                class: 'custom-dialog-header',  // Aquí puedes definir clases personalizadas si quieres combinarlas con tokens
                style: {
                    backgroundColor: '#8484a2',  // Cambia este color según lo que necesitas
                    color: 'e50f0f',
                    padding: '10px',
                    borderRadius: '5px 5px 0 0'
                }
            }
        }
    }
});

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: SinvPreset,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
});

app.use(ToastService);
app.use(ConfirmationService);
app.component('OverlayBadge', OverlayBadge);

app.mount('#app');

//PINIA
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(pinia);


//USUARIO
import { useUserStore } from "@/store/user";
const user = useUserStore();
router.beforeEach(function(to, from, next) {    
    if (to.meta.authRequired === 'true') {
        if ( user.permissions.includes(to.name)) {
            return next();
        } else {
            if (user.token === null){
                router.push({ name: 'login'});
            } else {
                router.push({ name: 'access'});
            }
        }        
    } else {
        return next();
    }
          
});



//AXIOS
import axios from 'axios';
axios.interceptors.response.use(
    response => response, 
    error => {
      if (error.response && error.response.status === 401) {
        user.$reset();        
        window.location.href= "/login"
        console.log("SIN TOKEN");        
      }
    }
);

//PUSHER
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_APP_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_APP_PUSHER_APP_CLUSTER,
    forceTLS: true,  // Cambia a 'true' si usas HTTPS
    encrypted: true,
    disableStats: true,
    logToConsole: true,  // Habilitar mensajes de depuración
});

window.Echo.connector.pusher.connection.bind('error', function(err) {
    console.error('Error de conexión con Pusher:', err);
});

window.Echo.connector.pusher.connection.bind('state_change', function(states) {
    console.log('Cambio de estado de conexión Pusher:', states);
});