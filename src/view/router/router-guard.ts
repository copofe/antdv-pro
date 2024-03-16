import type { NavigationGuard, NavigationHookAfter } from 'vue-router'
import { useMetaTitle } from '::/view/composables/meta-title'
import { setRouteEmitter } from '::/view/utils/route-listener'

const allowList = ['/login', '/error', '/401', '/404', '/403']
const loginPath = '/login'

export const beforeEach: NavigationGuard = async (to, _) => {
  setRouteEmitter(to)
  if (allowList.includes(to.path)) {
    //
  }
  else {
    const token = useAuthorization()
    if (!token.value) {
    //  如果token不存在就跳转到登录页面
      if (!to.path.startsWith('/redirect')) {
        return {
          path: loginPath,
          query: {
            redirect: encodeURIComponent(to.fullPath),
          },
        }
      }
    }
  }
}

export const afterEach: NavigationHookAfter = (to) => {
  useMetaTitle(to)
  useLoadingCheck()
  useScrollToTop()
}
