import type { Role } from './app.model'

export interface User {
  id: number | string
  username: string
  nickname: string
  avatar: string
  roles?: Role[]
}

export interface LoginParams {
  username: string
  password: string
  type?: 'account'
}

export interface LoginMobileParams {
  mobile: string
  code: string
  type: 'mobile'
}
