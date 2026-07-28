import request from '@/config/axios'

/** 供页面左侧节点和接口筛选使用的稳定状态标识。 */
export type WarehouseApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'

/** 仓库建立申请在页面中的中文状态文案。 */
export type WarehouseApplicationStatus = '待提交' | '审查审批中' | '被否决' | '审批通过'

export interface WarehouseApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

export interface WarehouseApplicationQuery {
  pageNo?: number
  pageSize?: number
  phase?: WarehouseApplicationPhase
  status?: WarehouseApplicationStatus
  applicationNo?: string
  customerName?: string
  projectName?: string
  regulatorEnterpriseName?: string
  warehouseName?: string
}

/** 与需求原型中的列表字段一一对应；审查、通过节点会额外显示当前阶段及完成时间。 */
export interface WarehouseApplicationRecord {
  id: number
  applicationNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
  projectName: string
  projectNo: string
  regulatorEnterpriseName: string
  warehouseName: string
  warehouseCode: string
  warehouseType: string
  insuranceExpiryDate: string
  applicationDate: string
  phase: WarehouseApplicationPhase
  status: WarehouseApplicationStatus
  currentStage?: string
  completedAt?: string
  opinions?: WarehouseApplicationOpinion[]
}

export interface WarehouseApplicationPageResult {
  total: number
  list: WarehouseApplicationRecord[]
  records: WarehouseApplicationRecord[]
  pageNo: number
  pageSize: number
}

/**
 * 新增弹窗至少可传入项目及核心客户信息；仓库信息尚未维护时，Mock 会用“待完善”占位，
 * 便于页面后续进入详情页继续补充。
 */
export interface WarehouseApplicationCreateForm {
  coreEnterpriseName: string
  coreCustomerNo: string
  projectName: string
  projectNo: string
  regulatorEnterpriseName?: string
  warehouseName?: string
  warehouseCode?: string
  warehouseType?: string
  insuranceExpiryDate?: string
}

/** 兼容先前的 payload 命名，页面推荐使用 WarehouseApplicationCreateForm。 */
export type WarehouseApplicationCreatePayload = WarehouseApplicationCreateForm

export interface WarehouseApplicationSubmitResult {
  success: boolean
  message?: string
  record?: WarehouseApplicationRecord
  opinion?: WarehouseApplicationOpinion
}

export const getWarehouseApplicationPage = (params: WarehouseApplicationQuery) =>
  request.get<WarehouseApplicationPageResult>({ url: '/system/indebt/warehouse-applications/page', params })

export const createWarehouseApplication = (data: WarehouseApplicationCreatePayload) =>
  request.post<WarehouseApplicationRecord>({ url: '/system/indebt/warehouse-applications/create', data })

/** 提交后，申请从“待提交”进入“审查审批中”。 */
export const submitWarehouseApplication = (id: number) =>
  request.post<WarehouseApplicationSubmitResult>({
    url: '/system/indebt/warehouse-applications/submit',
    data: { id }
  })

/** 审查审批中的申请可收回至待提交节点。 */
export const withdrawWarehouseApplication = (id: number) =>
  request.post<WarehouseApplicationSubmitResult>({
    url: '/system/indebt/warehouse-applications/withdraw',
    data: { id }
  })

export const getWarehouseApplicationDetail = (id: number) =>
  request.get<WarehouseApplicationRecord>({ url: '/system/indebt/warehouse-applications/detail', params: { id } })

/** 保存“签署意见”按钮录入的意见，Mock 会同步写入申请详情的 opinions。 */
export const signWarehouseApplicationOpinion = (id: number, opinion: string) =>
  request.post<WarehouseApplicationSubmitResult>({
    url: '/system/indebt/warehouse-applications/sign-opinion',
    data: { id, opinion }
  })
