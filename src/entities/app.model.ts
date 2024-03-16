export class StandardError extends Error {
  constructor(public name: string, public message: string) {
    super(message)
  }
}

export type Token = string | null

export type Role = string | number

export type Permission = string

export interface AppInfo {
  version: string
}

export interface AppSetting {
  enabled: boolean
}

export interface MenuDataItem {
  // 唯一id
  id?: string | number
  // 标题
  title: string | (() => string)
  // 图标
  icon?: string
  // 地址
  path: string
  // 绑定的哪个组件
  component?: string
  // 子集菜单
  children?: MenuDataItem[]
  // 重定向地址
  redirect?: string
  // 哪些是固定页签
  affix?: boolean
  // 父级菜单的id
  parentId?: string | number | null
  // 同路由中的name，主要是用于保活的左右
  name?: string
  // 是否隐藏当前菜单
  hideInMenu?: boolean
  // 如果使用了隐藏，那么点击当前菜单的时候，可以使用父级的key
  parentKeys?: string[]
  // 是否套用iframe
  isIframe?: boolean
  // 如果当前是iframe的模式，需要有一个跳转的url支撑，其不能和path重复，path还是为路由
  url?: string
  // 是否存在面包屑
  hideInBreadcrumb?: boolean
  // 是否需要显示所有的子菜单
  hideChildrenInMenu?: boolean
  // 是否保活
  keepAlive?: boolean
  // 这里包含所有的父级元素
  matched?: MenuDataItem[]
  // 全连接跳转模式
  target?: '_blank' | '_self' | '_parent'
  // 多语言配置
  locale?: string
}

export enum AccessEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum DynamicLoadEnum {
  FRONTEND = 'FRONTEND', // 前端动态加载菜单，使用这种方式将从dynamic-routes.ts中加载菜单和路由信息
  BACKEND = 'BACKEND', // 后端动态加载菜单， 使用这种方式将从后端接口加载菜单和路由信息
}

export enum STATUS {
  OFF = '0',
  RUNNING = '1',
  ONLINE = '2',
  ERROR = '3',

}
// 默认情况下我们提供从后端加载的逻辑
export const DYNAMIC_LOAD_WAY = import.meta.env.VITE_APP_LOAD_ROUTE_WAY ?? DynamicLoadEnum.BACKEND

/******************************************************************************/

export interface RequestConfig {
  method?: string
  headers?: Record<string, any>
  timeout?: number
  signal?: AbortSignal
  withCredentials?: boolean
}

export enum ApiResponseCode {
  Succeeded = 200,
  UnAuthorized = 401,
}

export interface RequestResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, any>
}

export class RequestError extends StandardError {
  static errorHandler: (err: RequestError) => void
  constructor(public message: string, public code?: number) {
    super('RequestError', message)
    RequestError.errorHandler(this)
  }
}

export type ApiResponse<T> = RequestResponse<{
  code: ApiResponseCode
  msg?: string
  data: T
}>

type RequestParams = Record<string, any>
type RequestData = Record<string, any> | FormData

export interface Request {
  get: <T>(url: string, params?: RequestParams, config?: RequestConfig) => Promise<ApiResponse<T>>
  delete: <T>(url: string, params?: RequestData, config?: RequestConfig) => Promise<ApiResponse<T>>
  post: <T>(url: string, data?: RequestData, config?: RequestConfig) => Promise<ApiResponse<T>>
  put: <T>(url: string, data?: RequestData, config?: RequestConfig) => Promise<ApiResponse<T>>
  patch: <T>(url: string, data?: RequestData, config?: RequestConfig) => Promise<ApiResponse<T>>
  headers: {
    [key: string]: string | string[] | number | boolean | null
  }
}

export interface Storage<KV extends Record<string, any>> {
  getItem: <K extends keyof KV>(key: K) => Promise<KV[K] | null>
  setItem: <K extends keyof KV>(key: K, value: KV[K]) => Promise<void>
  removeItem: (key: keyof KV) => Promise<void>
  clear: () => Promise<void>
}

export interface Session<KV extends Record<string, any>> {
  getItem: <K extends keyof KV>(key: K) => Promise<KV[K] | null>
  setItem: <K extends keyof KV>(key: K, value: KV[K]) => Promise<void>
  removeItem: (key: keyof KV) => Promise<void>
  clear: () => Promise<void>
}

export interface Eventer<Events extends Record<string, any>> {
  on: <K extends keyof Events>(e: K, fn: (data: Events[K]) => void) => void
  off: (e: keyof Events) => void
  emit: {
    <K extends keyof Events>(type: K, event: Events[K]): void
    <K extends keyof Events>(type: undefined extends Events[K] ? K : never): void
  }
}

/******************************************************************************/

export abstract class ImplRepository {
  protected abstract request: Request
  protected abstract storage: Storage<any>
  protected abstract session: Session<any>
}

export abstract class ImplUsecase {
  abstract eventer: Eventer<any>
}
