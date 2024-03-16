const routerModules = import.meta.glob([
  '::/view/pages/**/*.vue',
  '!::/view/pages/**/*copy.vue',
  '!::/view/pages/**/component',
  '!::/view/pages/**/components',
  '!::/view/pages/**/composables',
  '!::/view/pages/**/hooks',
  '!::/view/pages/**/locales',
  '!::/view/pages/**/modules',
  '!::/view/pages/**/plugins',
  '!::/view/pages/**/tests',
  '!::/view/pages/**/test',
  '!::/view/pages/common',
])
export const basicRouteMap = {
  // iframe模式下使用
  Iframe: () => import('::/view/pages/common/iframe.vue'),
  // 一般用于存在子集的页面
  RouteView: () => import('::/view/pages/common/route-view.vue'),
  // 空页面
  ComponentError: () => import('::/view/pages/exception/component-error.vue'),
}

function checkEager(module: any) {
  if (typeof module === 'object' && 'default' in module)
    return module.default

  return module
}
export function getRouterModule(path?: string): any {
  if (!path)
    return basicRouteMap.ComponentError
  // 判断是否在basicRouteMap中存在
  if (path in basicRouteMap)
    return (basicRouteMap as any)[path]

  // 判断开头是不是/
  if (path.startsWith('/'))
    path = path.slice(1)
  // 组装数据格式
  const fullPath = `/src/view/pages/${path}.vue`
  const fullPathIndex = `/src/view/pages/${path}/index.vue`
  if (fullPathIndex in routerModules)
    return checkEager(routerModules[fullPathIndex])

  // 返回插件信息
  return checkEager(routerModules[fullPath])
}

export default routerModules
