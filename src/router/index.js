import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Definir las rutas
const routes = [
    {
      path: '/',
      name: 'app',
      component: AppLayout,  // Utilizamos el layout principal
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/view/Dashboard.vue'), // Asegúrate de tener el path correcto
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/view/Dashboard.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'multicotizador',
          name: 'Multicotizador',
          component: () => import('@/view/multicotizador/Multi.vue'),
          meta: {
            authRequired: false,
          },
        },
        {
          path: 'dashboardvue',
          name: 'dashboardvue',
          component: () => import('@/view/DashboardVue.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'users',
          name: 'users.index',
          component: () => import('@/view/user/list.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'roles',
          name: 'roles.index',
          component: () => import('@/view/role/list.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'permissions',
          name: 'permissions.index',
          component: () => import('@/view/permission/list.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'tableros',
          name: 'tableros.index',
          component: () => import('@/view/tableros/list.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'tablero/:id',
          name: 'tablero',
          component: () => import('@/view/tableros/kanban.vue'),
        },
        {
          path: 'categorias',
          name: 'categorias.index',
          component: () => import('@/view/categoria/list.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'prospectos',
          name: 'prospectos.index',
          component: () => import('@/view/prospecto/list.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'checklists',
          name: 'checklists.index',
          component: () => import('@/view/checklists/list.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'columnas',
          name: 'reglas.columnas.index',
          component: () => import('@/view/reglas/columnas.vue'),
          meta: {
            authRequired: true,
          },
        },
        {
          path: 'tablerogeneral',
          name: 'tableros.general',
          component: () => import('@/view/tableros/KanbanGeneral.vue'),
          meta: {
            authRequired: true,
          },
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/view/pages/auth/Login.vue'),
      meta: {
        authRequired: false,
      },
    },
    {
      path: '/access',
      name: 'access',
      component: () => import('@/view/pages/auth/Access.vue'),
      meta: {
        authRequired: false,
      },
    },
    {
      path: '/logout',
      name: 'access',
      component: () => import('@/view/pages/auth/Login.vue'),
      meta: {
        authRequired: false,
      },
    }
  ];
  
  // Crear el enrutador
  const router = createRouter({
    history: createWebHistory(),
    routes
  });

export default router;
