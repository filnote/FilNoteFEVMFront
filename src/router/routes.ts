import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'home',
    children: [
      { path: 'home', component: () => import('pages/IndexPage.vue'), name: 'home' },
      {
        path: 'terms-service',
        component: () => import('pages/TermsService.vue'),
        name: 'terms-service',
      },
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
