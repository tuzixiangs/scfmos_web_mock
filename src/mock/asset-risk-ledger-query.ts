import type { AssetRiskContractLedger, AssetRiskCustomerLedger, AssetRiskLedgerProject } from '@/api/indebt/assetRiskLedgerQuery'
import { orderContractLedgerProjects, orderContractLedgerRecords } from './order-contract-ledger-query'

export const assetRiskLedgerProjects: AssetRiskLedgerProject[] = orderContractLedgerProjects

export const assetRiskCustomerLedgers: AssetRiskCustomerLedger[] = orderContractLedgerRecords.map((record, index) => ({
  id: record.id,
  projectId: record.projectId,
  customerName: record.customerName,
  coreCustomerNo: record.coreCustomerNo,
  singleCustomerExposureAmount: record.currentUsedAmount,
  cumulativeCompensationAmount: 18000 + index * 5600,
  cumulativeCompensationCount: index % 3 + 1,
  cumulativePriceDropCompensationAmount: 9600 + index * 3200,
  cumulativePriceDropCompensationCount: index % 2 + 1,
  priceDropWarningCount: index % 4,
  pendingWarningCount: index % 3
}))

export const assetRiskContractLedgers: AssetRiskContractLedger[] = orderContractLedgerRecords.map((record, index) => ({
  ...assetRiskCustomerLedgers[index],
  businessContractNo: record.relatedBusinessContractNo,
  outgoingFlowNo: `OUT${record.orderContractFlowNo.slice(3)}`,
  loanStartDate: record.contractStartDate,
  loanEndDate: record.contractEndDate
}))
