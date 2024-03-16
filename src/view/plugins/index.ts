import type { App } from 'vue'
import store from './pinia'
import { setupI18n } from './i18n'

export async function setupPlugins(app: App) {
  app.use(store)
  await setupI18n(app)
}
