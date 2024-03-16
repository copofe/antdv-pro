import type { App } from 'vue'
import Root from '::/view/App.vue'
import { setupPlugins } from '::/view/plugins'
import { setupDirective } from '::/view/directive'
import { generateDynamicRoutes } from '::/view/router/generate-route'
import router from '::/view/router'
import { ApiResponseCode, RequestError } from '::/entities/app.model'
import { userRepo } from '::/repositories/user'
import { userAuthUsecase } from '::/usecases/user'
import 'ant-design-vue/dist/reset.css'
import '::/view/assets/styles/reset.css'

function prepare() {
  RequestError.errorHandler = (err) => {
    if (err.message) {
      // if you use RESTful API, you only need to check if the error code returned equals 401.
      if (err.code === ApiResponseCode.UnAuthorized || err.code === 401)
        userRepo.clearToken().then(() => router.push({ name: 'login' }))
    }
  }
}

async function bootstrap() {
  prepare()
  const app: App = createApp(Root)
  await setupPlugins(app)
  setupDirective(app)

  const token = await userRepo.getToken()
  userRepo.updateAuthorization(token)
  const userStore = useUserStore()
  if (token) {
    const { user } = await userAuthUsecase.initialize()
    userStore.userInfo = user
    const { menuData, routerData } = await generateDynamicRoutes()
    userStore.menuData = menuData
    userStore.routerData = routerData
  }
  else {
    router.replace({
      path: '/login',
    })
  }

  app.use(router)
  app.mount('#app')

  app.config.performance = true
}

bootstrap()
