import { get } from 'lodash-es'
import router from '::/view/router'

export function getQueryParam(param: string | string[], defaultVal = '') {
  const query = router.currentRoute.value?.query ?? {}
  const val = get(query, param) ?? defaultVal
  return decodeURIComponent(val)
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isUrl(val: string): boolean {
  const reg = /^(https?|mailto|tel|file):/
  return reg.test(val)
}
export function toArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val]
}
export function pick(obj: Record<string, any>, keys: string[] = [], rest: Record<string, any> = {}) {
  const newObj: Record<string, any> = {}
  const names = Object.getOwnPropertyNames(obj)
  names.forEach((name) => {
    if (keys.includes(name))
      newObj[name] = obj[name]
  })
  return Object.assign(newObj, rest)
}
export function omit(object: Record<string, any>, keys: string[] = [], rest: Record<string, any> = {}) {
  if (object === null || object === void 0)
    return rest || object
  const omittedObject: Record<string, any> = {}
  const originalKeys = Object.getOwnPropertyNames(object)
  originalKeys.forEach((originalKey) => {
    if (!keys.includes(originalKey))
      omittedObject[originalKey] = object[originalKey]
  })
  return Object.assign(omittedObject, rest)
}

export function runEvent<T>(event: T, ...args: any[]) {
  if (typeof event === 'function')
    return event(...args)

  else if (Array.isArray(event))
    return event.map(e => e(...args))
}
