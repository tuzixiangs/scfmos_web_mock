import request from '@/config/axios'

export type DebtRulePageType = 'supplementApply' | 'supplementApproval' | 'ruleMaintenance' | 'ruleLibrary'

export interface DebtRuleRecord {
  id: number
  applicationNo: string
  customerName: string
  coreCustomerNo: string
  businessNo: string
  productPlan: string
  applicationType: string
  applicationDate: string
  currentStage: string
  completedAt?: string
  status: string
  ruleNo?: string
  ruleCategory?: string
  processStage?: string
  ruleName?: string
  ruleDescription?: string
  formula?: string
  supportedAssetType?: string
  debtFactor?: string
  warningColor?: string
  warningHandlingPlan?: string
  ruleRequirement?: string
  factorModificationControl?: string
  ruleStatus?: string
  updatedBy?: string
  updatedAt?: string
}

export const getDebtRuleRecords = (params: { type: DebtRulePageType; status?: string; productPlan?: string }) =>
  request.get<DebtRuleRecord[]>({ url: '/system/indebt/debt-rules/page', params })
