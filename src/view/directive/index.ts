import type { App } from 'vue'
import { setupAccessDirective } from './access'

export function setupDirective(app: App) {
  setupAccessDirective(app)
}
