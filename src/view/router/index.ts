import { createRouter, createWebHistory } from 'vue-router'
import staticRoutes from './static-routes'
import { afterEach, beforeEach } from './router-guard'

const router = createRouter({
  routes: [
    ...staticRoutes,
  ],
  history: createWebHistory(),
})

router.beforeEach(beforeEach)

router.afterEach(afterEach)

export default router
