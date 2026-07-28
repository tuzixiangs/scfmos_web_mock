import request from '@/config/axios'

/** 页面左侧的两个业务节点：待修改合同与已提交的修改记录。 */
export type OrderContractModificationNode = 'active' | 'records'

export type OrderContractStatus = '有效' | '失效'
export type OrderContractModificationStatus = '草稿' | '已提交'
export type OrderContractCurrency = '人民币' | '美元' | '欧元'

export interface OrderContractModificationImage {
  id: number
  name: string
  url: string
  uploadedAt: string
  uploader: string
}

export interface OrderContractModificationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

/**
 * 订单/合同下的货物明细。序号、订单/合同流水号、商品编码由系统维护；其余字段对应需求原型中的可编辑项。
 */
export interface OrderContractItem {
  id: number
  sequence: number
  productCode: string
  productName: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  batchNo: string
  cabinetNo: string
  specification: string
  origin: string
  warehouseName: string
  quantityOrWeight: number
  unitPrice: number
  totalAmount: number
  currency: OrderContractCurrency
  cargoStartDate: string
  cargoEndDate: string
  cargoOwner: '核心企业' | '借款人本人'
}

export interface OrderContractItemForm {
  productName: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  batchNo?: string
  cabinetNo?: string
  specification?: string
  origin?: string
  warehouseName: string
  quantityOrWeight: number
  unitPrice: number
  currency?: OrderContractCurrency
  cargoStartDate: string
  cargoEndDate: string
  cargoOwner: '核心企业' | '借款人本人'
}

/** 列表与详情共用的订单/合同基础信息。 */
export interface OrderContractModificationRecord {
  id: number
  applicationFlowNo: string
  orderContractNo: string
  partyOne: string
  partyTwo: string
  partyThree: string
  contractTotalAmount: number
  remainingAvailableAmount: number
  currency: OrderContractCurrency
  contractStartDate: string
  contractEndDate: string
  applicationDate: string
  contractStatus: OrderContractStatus
  modificationStatus: OrderContractModificationStatus
  customerName: string
  coreCustomerNo: string
  projectName: string
  projectNo: string
  businessContractNo: string
  modifier?: string
  modifiedAt?: string
  submittedAt?: string
  hasUnsettledBusiness?: boolean
}

export interface OrderContractModificationDetail extends OrderContractModificationRecord {
  currentUsedAmount: number
  dataSource: string
  productScheme: string
  images: OrderContractModificationImage[]
  items: OrderContractItem[]
  opinions: OrderContractModificationOpinion[]
}

export interface OrderContractModificationQuery {
  pageNo?: number
  pageSize?: number
  node?: OrderContractModificationNode
  applicationFlowNo?: string
  orderContractNo?: string
  customerName?: string
  coreCustomerNo?: string
  businessContractNo?: string
  contractStatus?: OrderContractStatus
  modificationStatus?: OrderContractModificationStatus
}

export interface OrderContractModificationPageResult {
  total: number
  list: OrderContractModificationRecord[]
  records: OrderContractModificationRecord[]
  pageNo: number
  pageSize: number
}

/**
 * “新增”时优先传入 sourceContractId，从当前有效合同复制基础数据；其余字段可作为预填后的覆盖值。
 */
export interface OrderContractModificationCreateForm {
  sourceContractId?: number
  orderContractNo?: string
  partyOne?: string
  partyTwo?: string
  partyThree?: string
  contractTotalAmount?: number
  currency?: OrderContractCurrency
  contractStartDate?: string
  contractEndDate?: string
}

/** 详情页中允许修改的订单/合同基础字段。 */
export interface OrderContractModificationUpdateForm {
  orderContractNo?: string
  partyOne?: string
  partyTwo?: string
  partyThree?: string
  contractTotalAmount?: number
  /** 本次使用金额可手工维护，但不得超过订单/合同总金额。 */
  currentUsedAmount?: number
  currency?: OrderContractCurrency
  contractStartDate?: string
  contractEndDate?: string
  contractStatus?: OrderContractStatus
}

export interface OrderContractModificationMutationResult {
  success: boolean
  message?: string
  record?: OrderContractModificationDetail
}

export interface OrderContractItemMutationResult {
  success: boolean
  message?: string
  item?: OrderContractItem
  record?: OrderContractModificationDetail
}

export interface OrderContractImageMutationResult {
  success: boolean
  message?: string
  image?: OrderContractModificationImage
  record?: OrderContractModificationDetail
}

export interface OrderContractBatchSubmitResult {
  success: boolean
  submitted: number
  failedIds: number[]
  message?: string
}

/** 待修改订单/合同信息列表。 */
export const getOrderContractModificationPage = (params: OrderContractModificationQuery) =>
  request.get<OrderContractModificationPageResult>({
    url: '/system/indebt/order-contract-modifications/page',
    params: { ...params, node: 'active' }
  })

/** 已提交后的订单/合同信息修改记录列表。 */
export const getOrderContractModificationRecordPage = (params: OrderContractModificationQuery) =>
  request.get<OrderContractModificationPageResult>({
    url: '/system/indebt/order-contract-modifications/records/page',
    params: { ...params, node: 'records' }
  })

/** 供“新增”弹窗选择当前有效订单/合同。 */
export const getAvailableOrderContracts = () =>
  request.get<OrderContractModificationRecord[]>({
    url: '/system/indebt/order-contract-modifications/available-contracts'
  })

/** 与页面“选择当前有效合同”的业务称谓保持一致。 */
export const getEffectiveOrderContracts = getAvailableOrderContracts

export const createOrderContractModification = (data: OrderContractModificationCreateForm) =>
  request.post<OrderContractModificationMutationResult>({
    url: '/system/indebt/order-contract-modifications/create',
    data
  })

export const getOrderContractModificationDetail = (id: number, node: OrderContractModificationNode = 'active') =>
  request.get<OrderContractModificationDetail>({
    url: '/system/indebt/order-contract-modifications/detail',
    params: { id, node }
  })

export const updateOrderContractModification = (id: number, data: OrderContractModificationUpdateForm) =>
  request.put<OrderContractModificationMutationResult>({
    url: '/system/indebt/order-contract-modifications/update',
    data: { id, ...data }
  })

/** 将合同置为失效；若存在未结清业务，Mock 会返回失败提示。 */
export const invalidateOrderContractModification = (id: number) =>
  request.post<OrderContractModificationMutationResult>({
    url: '/system/indebt/order-contract-modifications/invalidate',
    data: { id }
  })

/** 仅草稿状态、且不关联未结清业务的申请允许删除。 */
export const deleteOrderContractModification = (id: number) =>
  request.delete<OrderContractModificationMutationResult>({
    url: '/system/indebt/order-contract-modifications/delete',
    data: { id }
  })

export const createOrderContractItem = (modificationId: number, data: OrderContractItemForm) =>
  request.post<OrderContractItemMutationResult>({
    url: '/system/indebt/order-contract-modifications/item/create',
    data: { modificationId, ...data }
  })

export const updateOrderContractItem = (modificationId: number, itemId: number, data: Partial<OrderContractItemForm>) =>
  request.put<OrderContractItemMutationResult>({
    url: '/system/indebt/order-contract-modifications/item/update',
    data: { modificationId, itemId, ...data }
  })

/** 明细编辑表格一次性保存时使用；服务端会重新计算每条明细的总金额。 */
export const updateOrderContractModificationItems = (modificationId: number, items: OrderContractItemForm[]) =>
  request.put<OrderContractItemMutationResult>({
    url: '/system/indebt/order-contract-modifications/items/update',
    data: { modificationId, items }
  })

export const deleteOrderContractItem = (modificationId: number, itemId: number) =>
  request.delete<OrderContractItemMutationResult>({
    url: '/system/indebt/order-contract-modifications/item/delete',
    data: { modificationId, itemId }
  })

export const getOrderContractModificationImages = (modificationId: number, node: OrderContractModificationNode = 'active') =>
  request.get<OrderContractModificationImage[]>({
    url: '/system/indebt/order-contract-modifications/images',
    params: { modificationId, node }
  })

/** 本地 Mock 不依赖实际文件，传入文件名即可生成可展示的模拟影像。 */
export const uploadOrderContractModificationImage = (modificationId: number, name: string) =>
  request.post<OrderContractImageMutationResult>({
    url: '/system/indebt/order-contract-modifications/image/upload',
    data: { modificationId, name }
  })

export const signOrderContractModificationOpinion = (id: number, opinion: string) =>
  request.post<OrderContractModificationMutationResult>({
    url: '/system/indebt/order-contract-modifications/sign-opinion',
    data: { id, opinion }
  })

export const submitOrderContractModification = (id: number) =>
  request.post<OrderContractModificationMutationResult>({
    url: '/system/indebt/order-contract-modifications/submit',
    data: { id }
  })

/**
 * 多选提交时可携带一条统一签署意见；Mock 会将其写入每一笔提交后的修改记录。
 */
export const batchSubmitOrderContractModifications = (ids: number[], opinion?: string) =>
  request.post<OrderContractBatchSubmitResult>({
    url: '/system/indebt/order-contract-modifications/batch-submit',
    data: { ids, opinion }
  })
