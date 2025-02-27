import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isAuthenticated) {
          next({ name: 'sites' })
        } else {
          next()
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/editor/:id?',
      name: 'editor',
      component: () => import('../views/EditorView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/sites',
      name: 'sites',
      component: () => import('../views/SitesView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
