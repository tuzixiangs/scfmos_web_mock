import request from '@/config/axios'

export type OrderContractLedgerStatus = 'valid' | 'invalid'
export type OrderContractLedgerCurrency = '人民币' | '美元' | '欧元'

export interface OrderContractLedgerProject {
  id: number
  projectNo: string
  projectName: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productPlan: string
}

export interface OrderContractLedgerRecord {
  id: number
  status: OrderContractLedgerStatus
  orderContractFlowNo: string
  orderContractNo: string
  customerName: string
  coreCustomerNo: string
  partyOne: string
  partyTwo: string
  partyThree: string
  contractTotalAmount: number
  currentUsedAmount: number
  remainingAvailableAmount: number
  currency: OrderContractLedgerCurrency
  contractStartDate: string
  contractEndDate: string
  relatedBusinessContractNo: string
  dataSource: string
  applicationDate: string
  effectiveDate: string
  invalidDate?: string
  projectId: number
  projectNo: string
  projectName: string
  coreEnterpriseName: string
  productPlan: string
}

export interface OrderContractLedgerAssetItem {
  id: number
  productCode: string
  productName: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  origin: string
  warehouseName: string
  quantityOrWeight: number
  latestUnitPrice: number
  latestInventoryValue: number
  currency: OrderContractLedgerCurrency
}

export interface OrderContractLedgerQuery {
  pageNo?: number
  pageSize?: number
  status?: OrderContractLedgerStatus
  projectId?: number
  customerName?: string
  coreCustomerNo?: string
  relatedBusinessContractNo?: string
}

export interface OrderContractLedgerPageResult {
  total: number
  list: OrderContractLedgerRecord[]
  records: OrderContractLedgerRecord[]
  pageNo: number
  pageSize: number
}

export const getOrderContractLedgerProjects = (params?: Partial<OrderContractLedgerProject>) =>
  request.get<OrderContractLedgerProject[]>({
    url: '/system/indebt/order-contract-ledgers/projects',
    params
  })

export const getOrderContractLedgerPage = (params: OrderContractLedgerQuery) =>
  request.get<OrderContractLedgerPageResult>({
    url: '/system/indebt/order-contract-ledgers/page',
    params
  })

export const getOrderContractLedgerDetail = (id: number) =>
  request.get<OrderContractLedgerRecord>({
    url: '/system/indebt/order-contract-ledgers/detail',
    params: { id }
  })

export const getOrderContractLedgerAssetItems = (id: number) =>
  request.get<OrderContractLedgerAssetItem[]>({
    url: '/system/indebt/order-contract-ledgers/asset-items',
    params: { id }
  })
