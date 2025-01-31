import { createStorage } from 'unstorage'
import localStorageDriver from 'unstorage/drivers/localstorage'
import type { Storage, Token } from '::/entities/app.model'

export interface StorageKeyValue {
  Authorization: Token
}

export const storage: Storage<StorageKeyValue> = createStorage({
  driver: localStorageDriver({}),
})
