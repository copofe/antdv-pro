import type { App } from 'vue'
import { setupLoadingDirective } from './loading'
import { setupAccessDirective } from './access'

export function setupDirective(app: App) {
  // 注册loading自定义指令
  setupLoadingDirective(app)
  setupAccessDirective(app)
}
