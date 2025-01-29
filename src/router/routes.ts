import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('components/login/VLogin.vue'),
  },
  {
    path: '/preinscripcion',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'preinscripcion',
        component: () => import('components/preinscripcion/VFormularioPreinscripcion.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('components/dashboard/VDashboard.vue') },
      { path: '/diplomados', component: () => import('components/diplomados/VDiplomado.vue') },
      { path: '/diplomados/crear', component: () => import('components/forms/VProgramaForm.vue'), props: { tipo: 1 } },
      { path: '/diplomados/editar/:id', component: () => import('components/forms/VProgramaForm.vue'), props: route => ({ tipo: 1, id: Number(route.params.id) }) },
      { path: '/maestrias', component: () => import('components/maestrias/VMaestria.vue') },
      { path: '/maestrias/crear', component: () => import('components/forms/VProgramaForm.vue'), props: { tipo: 2 } },
      { path: '/maestrias/editar/:id', component: () => import('components/forms/VProgramaForm.vue'), props: route => ({ tipo: 2, id: Number(route.params.id) }) },
      { path: '/especialidades', component: () => import('components/especialidades/VEspecialidad.vue') },
      { path: '/especialidades/crear', component: () => import('components/forms/VProgramaForm.vue'), props: { tipo: 3 } },
      { path: '/especialidades/editar/:id', component: () => import('components/forms/VProgramaForm.vue'), props: route => ({ tipo: 3, id: Number(route.params.id) }) },
      { path: '/doctorados', component: () => import('components/doctorados/VDoctorado.vue') },
      { path: '/doctorados/crear', component: () => import('components/forms/VProgramaForm.vue'), props: { tipo: 4 } },
      { path: '/doctorados/editar/:id', component: () => import('components/forms/VProgramaForm.vue'), props: route => ({ tipo: 4, id: Number(route.params.id) }) },
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: '/notificaciones', component: () => import('components/notificaciones/VNotificaciones.vue') },
      { path: '/usuarios', component: () => import('components/usuarios/VUsuarios.vue') },
      { path: '/usuarios/nuevo', component: () => import('components/usuarios/VFormularioUsuarios.vue') },
      { path: '/usuarios/editar/:id', component: () => import('components/usuarios/VFormularioUsuarios.vue') },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
];

export default routes;
