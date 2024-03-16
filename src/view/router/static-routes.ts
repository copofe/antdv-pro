import type { RouteRecordRaw } from 'vue-router'
import { userRepo } from '::/repositories/user'

const Layout = () => import('::/view/layouts/index.vue')

export default [
  {
    path: '/login',
    component: () => import('::/view/pages/common/login.vue'),
    beforeEnter: async (_to, _from) => {
      const token = await userRepo.getToken()
      if (token) {
        return {
          path: '/',
        }
      }
    },
    meta: {
      title: '登录',
    },
  },
  {
    path: '/401',
    name: 'Error401',
    component: () => import('::/view/pages/exception/401.vue'),
    meta: {
      title: '授权已过期',
    },
  },
  {
    path: '/common',
    name: 'LayoutBasicRedirect',
    component: Layout,
    redirect: '/common/redirect',
    children: [
      {
        path: '/common/redirect',
        component: () => import('::/view/pages/common/route-view.vue'),
        name: 'CommonRedirect',
        redirect: '/redirect',
        children: [
          {
            path: '/redirect/:path(.*)',
            name: 'RedirectPath',
            component: () => import('::/view/pages/common/redirect.vue'),
          },
        ],
      },

    ],
  },
  {
    path: '/:pathMatch(.*)',
    meta: {
      title: '找不到页面',
    },
    component: () => import('::/view/pages/exception/error.vue'),
  },
] as RouteRecordRaw[]
