import type { App } from 'vue'
import Root from './App.vue'
import { setupI18n } from './locales'
import { setupDirective } from './directive'
import router from '::/router'
import 'ant-design-vue/dist/reset.css'
import '::/assets/styles/reset.css'

async function bootstrap() {
  const pinia = createPinia()
  const app: App = createApp(Root)
  app.use(pinia)
  await setupI18n(app)
  setupDirective(app)
  app.use(router)
  app.mount('#app')
  app.config.performance = true
}

bootstrap()
