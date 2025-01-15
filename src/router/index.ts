import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE || '/'),
  });

  const isAuthenticated = () => {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  };

  // rol admin y rol usuario recinto
  Router.beforeEach((to, from, next) => {
    const user = isAuthenticated();
    if (!user && to.path !== '/login') {
      return next('/login');
    }

    if (user) {
      const { rol } = user;

      if (to.path === '/login') {
        if (rol === 'ADMINISTRADOR') {
          return next('/');
        } else if (rol === 'USUARIO_RECINTO') {
          return next('/formulario');
        }
      }

      if (to.meta.requiresAdmin && rol === 'USUARIO_RECINTO') {
        return next('/formulario');
      }

      if (to.meta.requiresRecinto && rol !== 'USUARIO_RECINTO') {
        return next('/'); 
      }

      return next();
    }

    return next();
  });

  return Router;
});
