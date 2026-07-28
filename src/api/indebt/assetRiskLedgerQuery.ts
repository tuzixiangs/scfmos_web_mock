import request from '@/config/axios'

export interface AssetRiskLedgerProject {
  id: number
  projectNo: string
  projectName: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productPlan: string
}

export interface AssetRiskCustomerLedger {
  id: number
  projectId: number
  customerName: string
  coreCustomerNo: string
  singleCustomerExposureAmount: number
  cumulativeCompensationAmount: number
  cumulativeCompensationCount: number
  cumulativePriceDropCompensationAmount: number
  cumulativePriceDropCompensationCount: number
  priceDropWarningCount: number
  pendingWarningCount: number
}

export interface AssetRiskContractLedger extends AssetRiskCustomerLedger {
  businessContractNo: string
  outgoingFlowNo: string
  loanStartDate: string
  loanEndDate: string
}

export const getAssetRiskLedgerProjects = (params?: Partial<AssetRiskLedgerProject>) =>
  request.get<AssetRiskLedgerProject[]>({ url: '/system/indebt/asset-risk-ledgers/projects', params })

export const getAssetRiskCustomerLedgers = (params: { projectId: number }) =>
  request.get<AssetRiskCustomerLedger[]>({ url: '/system/indebt/asset-risk-ledgers/customer-page', params })

export const getAssetRiskContractLedgers = (params: { projectId: number }) =>
  request.get<AssetRiskContractLedger[]>({ url: '/system/indebt/asset-risk-ledgers/contract-page', params })
