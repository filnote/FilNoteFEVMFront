import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'home',
    children: [
      { path: 'home', component: () => import('pages/IndexPage.vue'), name: 'home' },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue'), name: 'dashboard' },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
