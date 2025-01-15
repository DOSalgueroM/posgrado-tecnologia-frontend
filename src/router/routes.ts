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
      { path: '/diplomados', component: () => import('components/diplomados/VDiplomado.vue') },
      { path: '/diplomados/crear', component: () => import('components/forms/VProgramaForm.vue'), props: { tipo: 1 } },
      { path: '/maestrias', component: () => import('components/maestrias/VMaestria.vue') },
      { path: '/maestrias/crear', component: () => import('components/forms/VProgramaForm.vue'), props: { tipo: 2 } },
      { path: '/especialidades', component: () => import('components/especialidades/VEspecialidad.vue') },
      { path: '/especialidades/crear', component: () => import('components/forms/VProgramaForm.vue'), props: { tipo: 3 } },
      { path: '/doctorados', component: () => import('components/doctorados/VDoctorado.vue') },
      { path: '/doctorados/crear', component: () => import('components/forms/VProgramaForm.vue'), props: { tipo: 4 } },
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
