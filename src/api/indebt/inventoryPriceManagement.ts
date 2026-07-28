import request from '@/config/axios'

/** 左侧工作台节点使用的稳定状态标识。 */
export type InventoryPriceApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'

export type InventoryPriceApplicationStatus = '待提交' | '审查审批中' | '被否决' | '审批通过'

export interface InventoryPriceProject {
  id: number
  projectName: string
  projectNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productScheme?: string
}

/** “选择有效项目”弹窗的查询条件。 */
export interface InventoryPriceProjectQuery {
  projectNo?: string
  projectName?: string
  coreEnterpriseName?: string
}

export interface InventoryPriceApplicationImage {
  id: number
  name: string
  url: string
  uploadedAt: string
  uploader: string
}

export interface InventoryPriceApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

/**
 * 详情中的商品单价维护行。
 * 分类、产地、入库单价、最新单价由项目商品信息带入；盯市单价和来源由用户维护。
 */
export interface InventoryPriceItem {
  id: number
  largeCategory: string
  middleCategory: string
  smallCategory: string
  origin: string
  inboundUnitPrice: number
  latestUnitPrice: number
  monitoringUnitPrice: number
  warningRate: number
  warningLine: number
  warningRule: string
  monitoringSource: string
}

/** 列表使用第一条商品维护行的摘要字段，详情页可通过 items 展示完整商品集合。 */
export interface InventoryPriceApplicationRecord {
  id: number
  applicationNo: string
  projectId: number
  projectNo: string
  projectName: string
  coreEnterpriseName: string
  coreCustomerNo: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  origin: string
  inboundUnitPrice: number
  latestUnitPrice: number
  monitoringUnitPrice: number
  monitoringSource: string
  applicationDate: string
  phase: InventoryPriceApplicationPhase
  status: InventoryPriceApplicationStatus
  currentStage?: string
  completedAt?: string
  ledgerUpdated?: boolean
  ledgerUpdatedAt?: string
  images?: InventoryPriceApplicationImage[]
  opinions?: InventoryPriceApplicationOpinion[]
  items?: InventoryPriceItem[]
}

export interface InventoryPriceApplicationDetail extends InventoryPriceApplicationRecord {
  images: InventoryPriceApplicationImage[]
  opinions: InventoryPriceApplicationOpinion[]
  items: InventoryPriceItem[]
}

export interface InventoryPriceApplicationQuery {
  pageNo?: number
  pageSize?: number
  phase?: InventoryPriceApplicationPhase
  status?: InventoryPriceApplicationStatus
  applicationNo?: string
  projectNo?: string
  projectName?: string
  smallCategory?: string
  origin?: string
}

export interface InventoryPriceApplicationPageResult {
  total: number
  list: InventoryPriceApplicationRecord[]
  records: InventoryPriceApplicationRecord[]
  pageNo: number
  pageSize: number
}

export interface InventoryPriceApplicationCreateForm {
  projectId: number
}

export interface InventoryPriceItemForm {
  id: number
  /** 本次盯市单价，保存时会重新计算预警线。 */
  monitoringUnitPrice: number
  /** 盯市来源为必填项，例如“上海有色网”或“监管方现场报价”。 */
  monitoringSource: string
}

export interface InventoryPriceApplicationUpdateForm {
  items: InventoryPriceItemForm[]
}

export interface InventoryPriceTrendPoint {
  date: string
  value: number
  label?: string
}

export interface InventoryPriceTrendResult {
  applicationId: number
  itemId: number
  itemName: string
  warningLine: number
  points: InventoryPriceTrendPoint[]
}

export interface InventoryPriceLedgerEntry {
  applicationId: number
  applicationNo: string
  itemId: number
  smallCategory: string
  origin: string
  monitoringUnitPrice: number
  updatedAt: string
  updatedBy: string
}

export interface InventoryPriceMutationResult {
  success: boolean
  message?: string
  record?: InventoryPriceApplicationDetail
  updated?: number
  ledgerEntries?: InventoryPriceLedgerEntry[]
}

export interface InventoryPriceBatchSubmitResult {
  success: boolean
  submitted: number
  failedIds: number[]
  message?: string
}

export interface InventoryPriceTemplateResult {
  fileName: string
  columns: string[]
  message: string
}

export const getInventoryPriceApplicationPage = (params: InventoryPriceApplicationQuery) =>
  request.get<InventoryPriceApplicationPageResult>({
    url: '/system/indebt/inventory-price-applications/page',
    params
  })

/** 新增弹窗中的“选择有效项目”。支持按项目名称、编号或核心企业名称查询。 */
export const getAvailableInventoryPriceProjects = (params?: InventoryPriceProjectQuery) =>
  request.get<InventoryPriceProject[]>({
    url: '/system/indebt/inventory-price-applications/available-projects',
    params
  })

/** 语义别名，页面可按“有效项目”称谓使用。 */
export const getEffectiveInventoryPriceProjects = getAvailableInventoryPriceProjects
/** 简短业务别名，供页面按“有效项目”使用。 */
export const getEffectivePriceProjects = getEffectiveInventoryPriceProjects
export const getEffectiveProjects = getEffectivePriceProjects

export const createInventoryPriceApplication = (data: InventoryPriceApplicationCreateForm) =>
  request.post<InventoryPriceMutationResult>({
    url: '/system/indebt/inventory-price-applications/create',
    data
  })

export const getInventoryPriceApplicationDetail = (id: number) =>
  request.get<InventoryPriceApplicationDetail>({
    url: '/system/indebt/inventory-price-applications/detail',
    params: { id }
  })

/** 保存详情中可编辑的“本次盯市单价”和“盯市来源”。 */
export const updateInventoryPriceApplication = (id: number, data: InventoryPriceApplicationUpdateForm) =>
  request.put<InventoryPriceMutationResult>({
    url: '/system/indebt/inventory-price-applications/update',
    data: { id, ...data }
  })

/** 与详情页按钮的业务名称保持一致。 */
export const saveInventoryPriceItems = updateInventoryPriceApplication
/** 简短业务别名，供详情页保存按钮使用。 */
export const savePriceItems = saveInventoryPriceItems

/** Mock 下上传文件名即可模拟 Excel 批量导入。 */
export const uploadInventoryPriceExcel = (id: number, fileName: string) =>
  request.post<InventoryPriceMutationResult>({
    url: '/system/indebt/inventory-price-applications/excel/upload',
    data: { id, fileName }
  })

/** 模板内容由 Mock 返回，页面也可使用浏览器下载实现。 */
export const getInventoryPriceExcelTemplate = () =>
  request.get<InventoryPriceTemplateResult>({
    url: '/system/indebt/inventory-price-applications/excel/template'
  })

export const getInventoryPriceApplicationImages = (id: number) =>
  request.get<InventoryPriceApplicationImage[]>({
    url: '/system/indebt/inventory-price-applications/images',
    params: { id }
  })

export const uploadInventoryPriceApplicationImage = (id: number, fileName: string) =>
  request.post<InventoryPriceMutationResult>({
    url: '/system/indebt/inventory-price-applications/image/upload',
    data: { id, fileName }
  })

export const signInventoryPriceApplicationOpinion = (id: number, opinion: string) =>
  request.post<InventoryPriceMutationResult>({
    url: '/system/indebt/inventory-price-applications/sign-opinion',
    data: { id, opinion }
  })

export const submitInventoryPriceApplication = (id: number) =>
  request.post<InventoryPriceMutationResult>({
    url: '/system/indebt/inventory-price-applications/submit',
    data: { id }
  })

/** 批量提交前可先填写一条统一签署意见。 */
export const batchSubmitInventoryPriceApplications = (ids: number[], opinion?: string) =>
  request.post<InventoryPriceBatchSubmitResult>({
    url: '/system/indebt/inventory-price-applications/batch-submit',
    data: { ids, opinion }
  })

export const batchSubmitPriceApplications = batchSubmitInventoryPriceApplications
export const batchSubmit = batchSubmitPriceApplications

/** 审查审批中的盯市申请可收回到待提交节点。 */
export const withdrawInventoryPriceApplication = (id: number) =>
  request.post<InventoryPriceMutationResult>({
    url: '/system/indebt/inventory-price-applications/withdraw',
    data: { id }
  })

export const withdrawPriceApplication = withdrawInventoryPriceApplication
export const withdraw = withdrawPriceApplication

/** Mock 审批演示入口：审批通过时同步资产/价格台账更新标记。 */
export const approveInventoryPriceApplication = (id: number, opinion?: string) =>
  request.post<InventoryPriceMutationResult>({
    url: '/system/indebt/inventory-price-applications/approve',
    data: { id, opinion }
  })

export const getInventoryPriceTrend = (id: number, itemId?: number) =>
  request.get<InventoryPriceTrendResult>({
    url: '/system/indebt/inventory-price-applications/trend',
    params: { id, itemId }
  })

export const getPriceTrend = getInventoryPriceTrend
export const getTrend = getPriceTrend
