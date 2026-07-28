import request from '@/config/axios'

export interface InventoryGoodsQuery {
  pageNo?: number
  pageSize?: number
  largeCategoryCode?: string
  largeCategoryName?: string
  status?: string
}

export interface InventoryGoodsForm {
  largeCategoryName: string
  middleCategoryName: string
  smallCategoryName: string
  remark?: string
}

export type InventoryGoodsCreateMode = 'direct' | 'based'

export interface InventoryGoodsCreatePayload extends InventoryGoodsForm {
  createMode: InventoryGoodsCreateMode
  sourceId?: number
}

export interface InventoryGoodsRecord extends InventoryGoodsForm {
  id: number
  largeCategoryCode: string
  middleCategoryCode: string
  smallCategoryCode: string
  status: '有效' | '历史'
  maintainTime: string
  maintainer: string
}

export interface InventoryGoodsPageResult {
  total: number
  list: InventoryGoodsRecord[]
  records: InventoryGoodsRecord[]
  pageNo: number
  pageSize: number
}

export const getInventoryGoodsPage = (params: InventoryGoodsQuery) =>
  request.get<InventoryGoodsPageResult>({ url: '/system/indebt/inventory-goods/page', params })

/** 获取所有有效状态的商品分类，供品类思维导图使用，不受列表分页和筛选影响。 */
export const getActiveInventoryGoods = () =>
  request.get<InventoryGoodsRecord[]>({ url: '/system/indebt/inventory-goods/active-list' })

export interface InventoryGoodsCreateResult {
  success: boolean
  message?: string
  duplicateLevel?: 'large' | 'middle' | 'small'
  record?: InventoryGoodsRecord
}

export const createInventoryGoods = (data: InventoryGoodsCreatePayload) =>
  request.post<InventoryGoodsCreateResult>({ url: '/system/indebt/inventory-goods/create', data })

export const setInventoryGoodsHistory = (ids: number[]) =>
  request.put<{ updated: number }>({ url: '/system/indebt/inventory-goods/history', data: { ids } })
