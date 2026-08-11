import request from '@/config/axios'

export type OfflineLedgerQueryStatus = 'valid' | 'invalid'

export interface OfflineLedgerQueryProject {
  id: number
  projectNo: string
  projectName: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productPlan: string
}

export interface OfflineLedgerQueryRecord {
  id: number
  projectId: number
  status: OfflineLedgerQueryStatus
  effectiveDate: string
  offlineManagementDescription: string
  debtManagerOpinion: string
  postLoanManagerOpinion: string
  imageName: string
}

export interface OfflineLedgerQueryPageResult {
  total: number
  list: OfflineLedgerQueryRecord[]
  records: OfflineLedgerQueryRecord[]
}

export const getOfflineLedgerQueryProjects = (params?: Partial<OfflineLedgerQueryProject>) =>
  request.get<OfflineLedgerQueryProject[]>({
    url: '/system/indebt/offline-ledgers/projects',
    params
  })

export const getOfflineLedgerQueryPage = (params: {
  projectId: number
  status?: OfflineLedgerQueryStatus
}) =>
  request.get<OfflineLedgerQueryPageResult>({
    url: '/system/indebt/offline-ledgers/page',
    params
  })
