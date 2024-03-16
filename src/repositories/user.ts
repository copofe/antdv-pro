import { Repository, extractData } from './_shared'
import type { MenuDataItem, Token } from '::/entities/app.model'
import type { LoginMobileParams, LoginParams, User } from '::/entities/user.model'

class UserRepo extends Repository {
  constructor() {
    super()
  }

  async generateToken(data: LoginParams | LoginMobileParams) {
    const { token } = await this.request.post<{ token: Exclude<Token, null> }>('/auth/login', data).then(extractData)
    await this.setToken(token)
    this.updateAuthorization(token)
    return token
  }

  async clearToken() {
    await this.setToken(null)
    this.updateAuthorization(null)
  }

  async invalidateToken() {
    await this.request.post('/auth/logout')
    await this.clearToken()
  }

  async getCurrentUser() {
    return this.request.get<User>('/user/info').then(extractData)
  }

  async getUserMenus() {
    return this.request.get<MenuDataItem[]>('/user/menus').then(extractData)
  }
}

export const userRepo = new UserRepo()
