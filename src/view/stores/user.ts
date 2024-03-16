import type { MenuData } from '::/view/layouts/basic-layout/typing'
import type { User } from '::/entities/user.model'

export const useUserStore = defineStore('user', () => {
  const routerData = shallowRef()
  const menuData = shallowRef<MenuData>([])
  const userInfo = shallowRef<User>()
  const avatar = computed(() => userInfo.value?.avatar)
  const nickname = computed(() => userInfo.value?.nickname ?? userInfo.value?.username)
  const roles = computed(() => userInfo.value?.roles)

  return {
    userInfo,
    roles,
    routerData,
    menuData,
    avatar,
    nickname,
  }
})
