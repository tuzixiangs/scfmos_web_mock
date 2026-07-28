import request from '@/config/axios'

/** 供页面左侧节点和接口筛选使用的稳定状态标识。 */
export type OfflineLedgerApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'

/** 线下台账更新申请在页面中的中文状态文案。 */
export type OfflineLedgerApplicationStatus = '待提交' | '审查审批中' | '被否决' | '审批通过'

export interface OfflineLedgerApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

export interface OfflineLedgerApplicationQuery {
  pageNo?: number
  pageSize?: number
  phase?: OfflineLedgerApplicationPhase
  status?: OfflineLedgerApplicationStatus
  applicationNo?: string
  customerName?: string
  projectName?: string
  coreEnterpriseName?: string
  coreCustomerNo?: string
  productPlan?: string
}

/** 与需求原型中的列表字段一一对应；审查、通过节点会额外显示当前阶段及完成时间。 */
export interface OfflineLedgerApplicationRecord {
  id: number
  applicationNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productPlan: string
  projectName: string
  projectNo: string
  regulatorEnterpriseName: string
  offlineLedgerName: string
  offlineLedgerCode: string
  offlineLedgerType: string
  insuranceExpiryDate: string
  applicationDate: string
  phase: OfflineLedgerApplicationPhase
  status: OfflineLedgerApplicationStatus
  currentStage?: string
  completedAt?: string
  opinions?: OfflineLedgerApplicationOpinion[]
}

export interface OfflineLedgerApplicationPageResult {
  total: number
  list: OfflineLedgerApplicationRecord[]
  records: OfflineLedgerApplicationRecord[]
  pageNo: number
  pageSize: number
}

/**
 * 新增弹窗至少可传入项目及核心客户信息；台账信息尚未维护时，Mock 会用“待完善”占位，
 * 便于页面后续进入详情页继续补充。
 */
export interface OfflineLedgerApplicationCreateForm {
  coreEnterpriseName: string
  coreCustomerNo: string
  productPlan?: string
  projectName: string
  projectNo: string
  regulatorEnterpriseName?: string
  offlineLedgerName?: string
  offlineLedgerCode?: string
  offlineLedgerType?: string
  insuranceExpiryDate?: string
}

/** 兼容先前的 payload 命名，页面推荐使用 OfflineLedgerApplicationCreateForm。 */
export type OfflineLedgerApplicationCreatePayload = OfflineLedgerApplicationCreateForm

export interface OfflineLedgerApplicationSubmitResult {
  success: boolean
  message?: string
  record?: OfflineLedgerApplicationRecord
  opinion?: OfflineLedgerApplicationOpinion
}

export const getOfflineLedgerApplicationPage = (params: OfflineLedgerApplicationQuery) =>
  request.get<OfflineLedgerApplicationPageResult>({ url: '/system/indebt/offline-ledger-updates/page', params })

export const createOfflineLedgerApplication = (data: OfflineLedgerApplicationCreatePayload) =>
  request.post<OfflineLedgerApplicationRecord>({ url: '/system/indebt/offline-ledger-updates/create', data })

/** 提交后，申请从“待提交”进入“审查审批中”。 */
export const submitOfflineLedgerApplication = (id: number) =>
  request.post<OfflineLedgerApplicationSubmitResult>({
    url: '/system/indebt/offline-ledger-updates/submit',
    data: { id }
  })

/** 审查审批中的申请可收回至待提交节点。 */
export const withdrawOfflineLedgerApplication = (id: number) =>
  request.post<OfflineLedgerApplicationSubmitResult>({
    url: '/system/indebt/offline-ledger-updates/withdraw',
    data: { id }
  })

export const getOfflineLedgerApplicationDetail = (id: number) =>
  request.get<OfflineLedgerApplicationRecord>({ url: '/system/indebt/offline-ledger-updates/detail', params: { id } })

/** 保存“签署意见”按钮录入的意见，Mock 会同步写入申请详情的 opinions。 */
export const signOfflineLedgerApplicationOpinion = (id: number, opinion: string) =>
  request.post<OfflineLedgerApplicationSubmitResult>({
    url: '/system/indebt/offline-ledger-updates/sign-opinion',
    data: { id, opinion }
  })
