import { ImplRepository } from '::/entities/app.model'
import type { ApiResponse, Token } from '::/entities/app.model'
import { AppEntity } from '::/entities/app.entity'
import { request } from '::/adapter/request'
import { storage } from '::/adapter/storage'
import { session } from '::/adapter/session'

export const TOKENKEY = 'Authorization'

export class Repository extends ImplRepository {
  protected request = request
  protected storage = storage
  protected session = session
  constructor() {
    super()
  }

  protected setToken(token: Token) {
    return this.storage.setItem(TOKENKEY, token)
  }

  getToken() {
    return this.storage.getItem(TOKENKEY)
  }

  updateAuthorization(token: Token) {
    this.request.headers.Authorization = AppEntity.composeToken(token)
  }

  updateAcceptLanguage(lang: string) {
    this.request.headers['Accept-Language'] = lang
  }
}

/******************************************************************************/

export function extractData<T>(res: ApiResponse<T>): ApiResponse<T>['data']['data'] {
  return res.data.data
}
