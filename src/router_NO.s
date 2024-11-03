import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';

const routes = [
    {
        path: '/',
        name: 'app',
        component: App,
        children: [            
            {
                path: '/home',
                name: 'home',
                //component: () => import('./pages/LandingDemo.vue'),
                component: () => import('./view/Dashboard.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('./view/Dashboard.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/dashboardvue',
                name: 'dashboardvue',
                component: () => import('./view/DashboardVue.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/users',
                name: 'users.index',
                component: () => import('./view/user/list.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/roles',
                name: 'roles.index',
                component: () => import('./view/role/list.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/permissions',
                name: 'permissions.index',
                component: () => import('./view/permission/list.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/tableros',
                name: 'tableros.index',
                component: () => import('./view/tableros/list.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/tablero/:id',
                name: 'tablero',
                component: () => import('./view/tableros/kanban.vue')
            },
            {
                path: '/categorias',
                name: 'categorias.index',
                component: () => import('./view/categoria/list.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/prospectos',
                name: 'prospectos.index',
                component: () => import('./view/prospecto/list.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/checklists',
                name: 'checklists.index',
                component: () => import('./view/checklists/list.vue'),
                meta: {
                    authRequired: 'true',
                },                
            },
            {
                path: '/columnas',
                name: 'reglas.columnas.index',
                component: () => import('./view/reglas/columnas.vue'),
                meta: {
                    authRequired: 'true',
                },
            },
            {
                path: '/tablerogeneral',
                name: 'tableros.general',
                component: () => import('./view/tableros/KanbanGeneral.vue'),
                meta: {
                    authRequired: 'true',
                },
            },
        ]
    },
    {
        path: '',
        name: 'login',
        component: () => import('./pages/Login.vue'),
        meta: {
            authRequired: 'false',
        },        
    },
    {
        path: '/access',
        name: 'access',
        component: () => import('./pages/Login.vue'),
        meta: {
            authRequired: 'false',
        },        
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
