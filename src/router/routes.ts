import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('components/login/VLogin.vue'), 
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('components/dashboard/VDashboard.vue') },
      { path: '/Dashboard3', component: () => import('components/dashboard/VDashboardRegistrados.vue') },
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
    ],
    meta: { requiresAuth: true, requiresAdmin: true }, 
  },
  {
    path: '/formulario',
    component: () => import('components/VFormulario.vue'), 
    meta: { requiresAuth: true, role: 'user' }, 
  },
  { path: '/usuarios', component: () => import('components/usuarios/VUsuarios.vue') },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'), 
  },
];

export default routes;
