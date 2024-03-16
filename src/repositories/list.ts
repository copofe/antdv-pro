import { Repository, extractData } from './_shared'
import type { STATUS } from '::/entities/app.model'

export interface ListResultModel {
  id: number
  title: string
  username: string
  password: string
}

export type ListResultParams = Partial<Omit<ListResultModel, 'id' | 'password'>>

export interface ConsultTableModel {
  id: number
  /**
   * 服务名称
   */
  name: string
  /**
   * 服务调用次数
   */
  callNo: 805
  /**
   * 描述
   */
  desc: string
  /**
   * 状态
   */
  status: STATUS
  /**
   * 上次调用时间
   */
  updatedAt: string

  // 分页
  current?: number
  // size
  pageSize?: number
}

export type ConsultTableParams = Partial<Omit<ConsultTableModel, 'id'>>

export interface CrudTableModel {
  id?: number
  /**
   * 名称
   */
  name: string
  /**
   * 值
   */
  value: string
  /**
   * 描述
   */
  remark?: string
}

type CrudTableParams = Partial<Omit<CrudTableModel, 'id'>>

class ListRepo extends Repository {
  constructor() {
    super()
  }

  getBasicList(params?: ListResultParams) {
    return this.request.post<ListResultModel[]>('/list/basic-list', params).then(extractData)
  }

  getTableList(params?: ConsultTableParams) {
    return this.request.post<ConsultTableModel[]>('/list/consult-list', params).then(extractData)
  }

  delTableItem(id: number) {
    return this.request.delete(`/list/${id}`)
  }

  getCurdTableList(params?: CrudTableParams) {
    return this.request.post<{ records: CrudTableModel[], total: number }>('/list/crud-table', params).then(extractData)
  }

  delCurdTableItem(id: number) {
    return this.request.delete(`/list/${id}`)
  }
}

export const listRepo = new ListRepo()
