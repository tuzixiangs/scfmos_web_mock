import request from '@/config/axios'

export type AssetLedgerStatus = 'inStock' | 'pendingInbound' | 'outbound' | 'invalid'

export interface AssetLedgerProject {
  id: number
  projectNo: string
  projectName: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productPlan: string
}

export interface AssetLedgerRecord {
  id: number
  projectId: number
  status: AssetLedgerStatus
  productCode: string
  productName: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  orderContractNo: string
  orderContractFlowNo: string
  customerName: string
  coreCustomerNo: string
  relatedBusinessContractNo: string
  batchNo: string
  cabinetNo: string
  origin: string
  warehouseName: string
  specification: string
  inStockLatestPrice: number
  benchmarkPrice: number
  initialPricing: number
  latestMarketPrice: number
  initialQuantityOrWeight: number
  inStockQuantityOrWeight: number
  inStockLatestValue: number
  benchmarkValue: number
  initialPricingValue: number
  latestMarketValue: number
  priceTrigger: string
  dropRate: number
  unitPriceUpdatedAt: string
  priceCompensationAmount: number
  currency: string
  goodsOwnership: string
  goodsStartDate: string
  goodsEndDate: string
  latestPickupDate: string
  inStockDuration: string
  goodsStatus: string
  remark1: string
  remark2: string
  loanStartDate: string
  loanEndDate: string
  generatedAt: string
  inboundDate?: string
  outboundDate?: string
  invalidDate?: string
}

export interface AssetLedgerQuery {
  projectId?: number
  productPlan?: string
  status?: AssetLedgerStatus
  customerName?: string
  coreCustomerNo?: string
  relatedBusinessContractNo?: string
  productCode?: string
  productName?: string
  orderContractNo?: string
  orderContractFlowNo?: string
}

export interface AssetLedgerPageResult {
  total: number
  list: AssetLedgerRecord[]
  records: AssetLedgerRecord[]
  pageNo: number
  pageSize: number
}

export const getAssetLedgerProjects = (params?: Partial<AssetLedgerProject>) =>
  request.get<AssetLedgerProject[]>({
    url: '/system/indebt/asset-ledgers/projects',
    params
  })

export const getAssetLedgerPage = (params: AssetLedgerQuery) =>
  request.get<AssetLedgerPageResult>({
    url: '/system/indebt/asset-ledgers/page',
    params
  })

