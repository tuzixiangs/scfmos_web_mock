import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import {
  dashboardTabs,
  dashboardTasks,
  dictData,
  optionData,
  pageRecords,
  permissionInfo
} from './data'
import {
  createInventoryGoodsRecord,
  inventoryGoodsRecords,
  markInventoryGoodsHistory
} from './inventory-goods'
import { projectCreditApplyRecords, projectCreditDetail } from './project-credit-detail'
import {
  approveWarehouseInspectionRecord,
  createWarehouseApplicationRecord,
  createWarehouseInspectionRecord,
  effectiveSupplyChainProjects,
  getProjectWarehousesRecord,
  getWarehouseApplicationRecord,
  signWarehouseApplicationOpinionRecord,
  signWarehouseInspectionOpinionRecord,
  submitWarehouseApplicationRecord,
  updateWarehouseApplicationRecord,
  submitWarehouseInspectionRecord,
  warehouseApplicationRecords,
  warehouseInspectionRecords,
  withdrawWarehouseApplicationRecord,
  withdrawWarehouseInspectionRecord
} from './warehouse-management'
import {
  approveInventoryPriceApplicationRecord,
  batchSubmitInventoryPriceApplicationRecords,
  createInventoryPriceApplicationRecord,
  getInventoryPriceApplicationRecord,
  getInventoryPriceExcelTemplate,
  getInventoryPriceTrendData,
  inventoryPriceApplicationRecords,
  inventoryPriceAvailableProjects,
  signInventoryPriceApplicationOpinion,
  submitInventoryPriceApplicationRecord,
  updateInventoryPriceApplicationRecord,
  uploadInventoryPriceApplicationImage,
  uploadInventoryPriceExcelRecord,
  withdrawInventoryPriceApplicationRecord
} from './inventory-price-management'
import {
  approveAssetArrivalApplicationRecord,
  assetArrivalApplicationRecords,
  assetArrivalAvailableProjects,
  batchSubmitAssetArrivalApplicationRecords,
  createAssetArrivalApplicationRecord,
  getAssetArrivalApplicationFlowRecords,
  getAssetArrivalApplicationImages,
  getAssetArrivalApplicationOpinions,
  getAssetArrivalApplicationRecord,
  signAssetArrivalApplicationOpinionRecord,
  submitAssetArrivalApplicationRecord,
  updateAssetArrivalConfirmationRecord,
  uploadAssetArrivalApplicationImage,
  withAssetArrivalProjectAliases,
  withdrawAssetArrivalApplicationRecord
} from './asset-arrival-management'
import {
  approveAssetManagementApplicationRecord,
  assetManagementApplicationRecords,
  assetManagementAvailableProjects,
  batchSubmitAssetManagementApplicationRecords,
  createAssetManagementApplicationRecord,
  getAssetManagementApplicationFlowRecords,
  getAssetManagementApplicationImages,
  getAssetManagementApplicationOpinions,
  getAssetManagementApplicationRecord,
  signAssetManagementApplicationOpinionRecord,
  submitAssetManagementApplicationRecord,
  updateAssetManagementAssetDetailRecord,
  updateAssetManagementConfirmationRecord,
  uploadAssetManagementApplicationImage,
  withAssetManagementProjectAliases,
  withdrawAssetManagementApplicationRecord
} from './asset-management'
import {
  approveAssetOutboundManagementApplicationRecord,
  assetOutboundManagementApplicationRecords,
  assetOutboundManagementAvailableProjects,
  batchSubmitAssetOutboundManagementApplicationRecords,
  createAssetOutboundManagementApplicationRecord,
  getAssetOutboundManagementApplicationFlowRecords,
  getAssetOutboundManagementApplicationImages,
  getAssetOutboundManagementApplicationOpinions,
  getAssetOutboundManagementApplicationRecord,
  signAssetOutboundManagementApplicationOpinionRecord,
  submitAssetOutboundManagementApplicationRecord,
  updateAssetOutboundManagementConfirmationRecord,
  uploadAssetOutboundManagementApplicationImage,
  withAssetOutboundManagementProjectAliases,
  withdrawAssetOutboundManagementApplicationRecord
} from './asset-outbound-management'
import {
  batchSubmitOrderContractModificationRecords,
  createOrderContractModificationItem,
  createOrderContractModificationRecord,
  deleteOrderContractModificationItem,
  deleteOrderContractModificationRecord,
  getOrderContractModificationByNode,
  getOrderContractModificationImages,
  getOrderContractModificationRecord,
  invalidateOrderContractModificationRecord,
  orderContractModificationHistoryRecords,
  orderContractModificationRecords,
  signOrderContractModificationOpinion,
  submitOrderContractModificationRecord,
  updateOrderContractModificationItem,
  updateOrderContractModificationItems,
  updateOrderContractModificationRecord,
  uploadOrderContractModificationImage,
  availableOrderContractRecords
} from './order-contract-modification'
import {
  createOfflineLedgerApplicationRecord,
  getOfflineLedgerApplicationRecord,
  offlineLedgerApplicationRecords,
  signOfflineLedgerApplicationOpinionRecord,
  submitOfflineLedgerApplicationRecord,
  updateOfflineLedgerApplicationRecord,
  withdrawOfflineLedgerApplicationRecord
} from './offline-ledger-update'
import {
  getOrderContractLedgerAssetItems,
  getOrderContractLedgerRecord,
  orderContractLedgerProjects,
  orderContractLedgerRecords
} from './order-contract-ledger-query'
import { assetLedgerProjects, assetLedgerRecords } from './asset-ledger-query'
import { offlineLedgerQueryProjects, offlineLedgerQueryRecords } from './offline-ledger-query'
import {
  assetRiskContractLedgers,
  assetRiskCustomerLedgers,
  assetRiskLedgerProjects
} from './asset-risk-ledger-query'
import {
  debtRuleApprovalRecords,
  debtRuleLibraryRecords,
  debtRuleMaintenanceRecords,
  debtRuleSupplementRecords
} from './debt-rule-management'
import {
  chainCompanyCustomerRecords,
  chainPersonCustomerRecords,
  coreCustomerRecords
} from './chain-customer'
import {
  financingApplicationMenu,
  financingApplicationRecords,
  financingClearingRecords,
  financingTicketRecords
} from './financing-application-management'
import { contractRegistrationMenu, contractRegistrationPage } from './contract-registration'
import { loanApplicationMenu, loanApplicationPage } from './loan-application'
import { loanApprovalMenus, loanApprovalPage } from './loan-approval'
import {
  approvalChangeApplicationMenu,
  approvalChangeApplicationPage
} from './approval-change-application'
import {
  linkedBusinessApprovalMenus,
  linkedContractApprovalPage,
  linkedQuotaApprovalMenus
} from './linked-contract-approval'
import {
  supplyChainDecisionApplicationMenu,
  supplyChainDecisionCheckMenu,
  supplyChainDecisionPage
} from './supply-chain-decision-data'
import {
  cancelProjectParamAdjustmentRecord,
  createProjectParamAdjustmentRecord,
  projectParamAdjustmentMenu,
  projectParamAdjustmentPage,
  projectParamAdjustmentProjects
} from './project-param-adjustment'
import { projectCreditApprovalMenus, projectCreditApprovalPage } from './project-credit-approval'
import {
  createProjectCoreviewRecord,
  deleteProjectCoreviewRecord,
  getProjectCoreviewDetail,
  getProjectCoreviewFlowRecords,
  getProjectCoreviewOpinion,
  projectCoreviewOldDicts,
  projectCoreviewRecords,
  removeProjectCoreviewOpinion,
  saveProjectCoreviewOpinion,
  submitProjectCoreviewRecord,
  withdrawProjectCoreviewRecord,
  updateProjectCoreviewDetail
} from './project-collaboration-review'
import {
  createCustomerRiskCheckTask,
  getCustomerRiskCheckResults
} from './customer-risk-detection'
import {
  companyCustomerDetail,
  companyCustomerList,
  companyCustomerPageVO,
  companyCustomerViewMenu,
  customerCountryTree,
  customerCreditTemplateTree,
  customerEnterpriseOptions,
  customerHoldingTypeTree,
  customerIndustryTree,
  customerRegionTree,
  selfEmployedCustomerDetail,
  selfEmployedCustomerList,
  selfEmployedCustomerPageVO,
  selfEmployedCustomerViewMenu,
  salaryEarnerCustomerViewMenu,
  workflowDetail,
  workflowDetailMenu,
  workflowDetailPageVO
} from './customer-company-detail'

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))
const urlPath = (url = '') => url.split('?')[0].replace(/^https?:\/\/[^/]+/, '')
const urlQuery = (url = '') => Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''))
const isPage = (url: string) => /(?:^|\/)(?:page|.*Page)$|\/page\//i.test(url)
const isOptionList = (url: string) =>
  /simple-list|\/all$|select|query.*list|menu|tree|codeLibrary|dictionary|dict-data/i.test(url)
const isDetail = (url: string) => /\/get$|\/detail$|info|template|profile|customer/i.test(url)
const cloneMockData = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const projectCreditDetailCacheKey = 'scfmos.mock.project-credit-detail-cache'
const loadProjectCreditDetailCache = (): Record<string, Recordable> => {
  if (typeof window === 'undefined') return {}

  try {
    const cached = window.sessionStorage.getItem(projectCreditDetailCacheKey)
    const parsed = cached ? JSON.parse(cached) : {}
    return typeof parsed === 'object' && parsed ? (parsed as Record<string, Recordable>) : {}
  } catch {
    return {}
  }
}
const projectCreditDetailCache = loadProjectCreditDetailCache()
const persistProjectCreditDetailCache = () => {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(
      projectCreditDetailCacheKey,
      JSON.stringify(projectCreditDetailCache)
    )
  } catch {
    // 本地演示缓存失败时仍保留本页内存数据，不影响详情页操作。
  }
}
const parseMockPayload = (data: unknown): Recordable => {
  if (typeof data === 'object' && data) return data as Recordable
  if (typeof data !== 'string') return {}

  try {
    const parsed = JSON.parse(data)
    return typeof parsed === 'object' && parsed ? (parsed as Recordable) : {}
  } catch {
    return Object.fromEntries(new URLSearchParams(data))
  }
}

const customerOwnershipPageData = (
  config: AxiosRequestConfig,
  mode: 'transfer' | 'receive'
) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const customerName = String(query.customerName || '').trim()
  const certId = String(query.certId || '').trim()
  const customerType = String(query.customerType || '0110')
  const isCompanyCustomer = customerType === '0110'
  const targetManagers = ['李敏', '张晨', '王璐']
  const sourceRecords = (isCompanyCustomer
    ? companyCustomerList
    : selfEmployedCustomerList) as Array<Record<string, any>>
  const records = sourceRecords
    .map((item, index) => ({
      customerName: item.customerName,
      customerId: item.customerID || item.customerId,
      certType: isCompanyCustomer ? 'Ent02' : 'Ind01',
      certTypeName: item.certTypeName,
      certId: item.certID || item.certId,
      customerTypeName: isCompanyCustomer
        ? '公司客户'
        : customerType === '0310'
          ? '受薪人士'
          : '自雇人士',
      managerUserName: item.managerUserName || targetManagers[index % targetManagers.length],
      mfCustomerId: item.mfcustomerID || item.mfCustomerID,
      changeStatus: mode === 'receive' ? '01' : '00',
      changeStatusName: mode === 'receive' ? '待接收' : '可移交',
      targetUserId: mode === 'transfer' ? `U20260${index + 1}` : '',
      targetUserName: mode === 'transfer' ? targetManagers[index] : ''
    }))
    .filter(
      (item) =>
        (!customerName || item.customerName.includes(customerName)) &&
        (!certId || item.certId.includes(certId))
    )
  const list = cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize))
  return { total: records.length, list, records: list, pageNo, pageSize }
}

const pageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Number(query.pageNo || query.pageNum || 1)
  const pageSize = Number(query.pageSize || 10)
  const list = pageRecords.map((item, index) => ({
    ...item,
    id: item.id + (pageNo - 1) * pageSize + index
  }))
  return { total: 26, list, records: list, pageNo, pageSize }
}

const detailData = (config: AxiosRequestConfig) => ({
  ...pageRecords[0],
  ...(config.params || {}),
  ...(typeof config.data === 'object' && config.data ? config.data : {}),
  customerType: '企业客户',
  certType: '统一社会信用代码',
  certNo: '91310000MA1H000001',
  address: '上海市浦东新区金融街88号',
  contactName: '王磊',
  contactMobile: '13800000000'
})

const projectCoreviewPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const serialNo = String(query.serialNo || '').trim()
  const projectName = String(query.projectName || '').trim()
  const customerName = String(query.customerName || '').trim()
  const customerId = String(query.customerId || '').trim()
  const phaseType = String(query.phaseType || '').trim()
  const filtered = projectCoreviewRecords.filter(
    (record) =>
      (!phaseType || record.phaseType === phaseType) &&
      (!serialNo || record.serialNo.includes(serialNo)) &&
      (!projectName || record.projectName.includes(projectName)) &&
      (!customerName || record.customerName.includes(customerName)) &&
      (!customerId || record.customerId.includes(customerId))
  )
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize).map(({ detail, ...record }) => record))

  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const inventoryGoodsPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const largeCategoryCode = String(query.largeCategoryCode || '').trim()
  const largeCategoryName = String(query.largeCategoryName || '').trim()
  const status = String(query.status || '').trim()
  const filtered = inventoryGoodsRecords.filter((record) => {
    const matchesCode = !largeCategoryCode || record.largeCategoryCode.includes(largeCategoryCode)
    const matchesName = !largeCategoryName || record.largeCategoryName.includes(largeCategoryName)
    const matchesStatus = !status || record.status === status
    return matchesCode && matchesName && matchesStatus
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))

  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const warehouseApplicationPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const phase = String(query.phase || '').trim()
  const status = String(query.status || query.applicationStatus || '').trim()
  const applicationNo = String(query.applicationNo || query.applyNo || query.serialNo || '').trim()
  const customerName = String(query.customerName || query.coreEnterpriseName || '').trim()
  const projectName = String(query.projectName || '').trim()
  const regulatorEnterpriseName = String(query.regulatorEnterpriseName || '').trim()
  const warehouseName = String(query.warehouseName || '').trim()
  const filtered = warehouseApplicationRecords.filter((record) => {
    const matchesPhase = !phase || record.phase === phase
    const matchesStatus = !status || record.status === status
    const matchesApplicationNo = !applicationNo || record.applicationNo.includes(applicationNo)
    const matchesCustomerName = !customerName || record.coreEnterpriseName.includes(customerName)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    const matchesRegulator =
      !regulatorEnterpriseName || record.regulatorEnterpriseName.includes(regulatorEnterpriseName)
    const matchesWarehouseName = !warehouseName || record.warehouseName.includes(warehouseName)
    return (
      matchesPhase &&
      matchesStatus &&
      matchesApplicationNo &&
      matchesCustomerName &&
      matchesProjectName &&
      matchesRegulator &&
      matchesWarehouseName
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))

  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const warehouseInspectionPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const phase = String(query.phase || '').trim()
  const status = String(query.status || query.applicationStatus || '').trim()
  const applicationNo = String(query.applicationNo || query.applyNo || query.serialNo || '').trim()
  const customerName = String(query.customerName || query.coreEnterpriseName || '').trim()
  const projectName = String(query.projectName || '').trim()

  const filtered = warehouseInspectionRecords.filter((record) => {
    const matchesPhase = !phase || record.phase === phase
    const matchesStatus = !status || record.status === status
    const matchesApplicationNo = !applicationNo || record.applicationNo.includes(applicationNo)
    const matchesCustomerName = !customerName || record.coreEnterpriseName.includes(customerName)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    return (
      matchesPhase &&
      matchesStatus &&
      matchesApplicationNo &&
      matchesCustomerName &&
      matchesProjectName
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))

  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const inventoryPriceApplicationPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const phase = String(query.phase || '').trim()
  const status = String(query.status || query.applicationStatus || '').trim()
  const applicationNo = String(query.applicationNo || query.applyNo || query.serialNo || '').trim()
  const projectNo = String(query.projectNo || '').trim()
  const projectName = String(query.projectName || '').trim()
  const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
  const coreCustomerNo = String(query.coreCustomerNo || '').trim()
  const smallCategory = String(query.smallCategory || '').trim()
  const origin = String(query.origin || '').trim()
  const filtered = inventoryPriceApplicationRecords.filter((record) => {
    const matchesPhase = !phase || record.phase === phase
    const matchesStatus = !status || record.status === status
    const matchesApplicationNo = !applicationNo || record.applicationNo.includes(applicationNo)
    const matchesProjectNo = !projectNo || record.projectNo.includes(projectNo)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    const matchesCoreEnterpriseName =
      !coreEnterpriseName || record.coreEnterpriseName.includes(coreEnterpriseName)
    const matchesCoreCustomerNo = !coreCustomerNo || record.coreCustomerNo.includes(coreCustomerNo)
    const matchesSmallCategory = !smallCategory || record.smallCategory.includes(smallCategory)
    const matchesOrigin = !origin || record.origin.includes(origin)
    return (
      matchesPhase &&
      matchesStatus &&
      matchesApplicationNo &&
      matchesProjectNo &&
      matchesProjectName &&
      matchesCoreEnterpriseName &&
      matchesCoreCustomerNo &&
      matchesSmallCategory &&
      matchesOrigin
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))
  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const assetArrivalApplicationPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const phase = String(query.phase || '').trim()
  const status = String(query.status || query.applicationStatus || '').trim()
  const applicationNo = String(query.applicationNo || query.applyNo || query.serialNo || '').trim()
  const customerName = String(query.customerName || query.linkedCustomerName || '').trim()
  const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
  const projectName = String(query.projectName || '').trim()
  const projectNo = String(query.projectNo || '').trim()
  const disbursementFlowNo = String(query.disbursementFlowNo || query.loanFlowNo || '').trim()
  const inboundType = String(query.inboundType || '').trim()
  const relatedBusinessContractNo = String(
    query.relatedBusinessContractNo || query.businessContractNo || query.contractNo || ''
  ).trim()
  const filtered = assetArrivalApplicationRecords.filter((record) => {
    const matchesPhase = !phase || record.phase === phase
    const matchesStatus = !status || record.status === status
    const matchesApplicationNo = !applicationNo || record.applicationNo.includes(applicationNo)
    const matchesCustomerName = !customerName || record.customerName.includes(customerName)
    const matchesCoreCustomerNo = !coreCustomerNo || record.coreCustomerNo.includes(coreCustomerNo)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    const matchesProjectNo = !projectNo || record.projectNo.includes(projectNo)
    const matchesDisbursementFlowNo =
      !disbursementFlowNo || record.disbursementFlowNo.includes(disbursementFlowNo)
    const matchesInboundType = !inboundType || record.inboundType === inboundType
    const matchesBusinessContract =
      !relatedBusinessContractNo ||
      record.relatedBusinessContractNo.includes(relatedBusinessContractNo)
    return (
      matchesPhase &&
      matchesStatus &&
      matchesApplicationNo &&
      matchesCustomerName &&
      matchesCoreCustomerNo &&
      matchesProjectName &&
      matchesProjectNo &&
      matchesDisbursementFlowNo &&
      matchesInboundType &&
      matchesBusinessContract
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))
  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const assetManagementApplicationPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const phase = String(query.phase || '').trim()
  const status = String(query.status || query.applicationStatus || '').trim()
  const applicationNo = String(query.applicationNo || query.applyNo || query.serialNo || '').trim()
  const customerName = String(query.customerName || query.linkedCustomerName || '').trim()
  const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
  const projectName = String(query.projectName || '').trim()
  const projectNo = String(query.projectNo || '').trim()
  const disbursementFlowNo = String(query.disbursementFlowNo || query.loanFlowNo || '').trim()
  const inboundType = String(query.inboundType || '').trim()
  const relatedBusinessContractNo = String(
    query.relatedBusinessContractNo || query.businessContractNo || query.contractNo || ''
  ).trim()
  const filtered = assetManagementApplicationRecords.filter((record) => {
    const matchesPhase = !phase || record.phase === phase
    const matchesStatus = !status || record.status === status
    const matchesApplicationNo = !applicationNo || record.applicationNo.includes(applicationNo)
    const matchesCustomerName = !customerName || record.customerName.includes(customerName)
    const matchesCoreCustomerNo = !coreCustomerNo || record.coreCustomerNo.includes(coreCustomerNo)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    const matchesProjectNo = !projectNo || record.projectNo.includes(projectNo)
    const matchesDisbursementFlowNo =
      !disbursementFlowNo || record.disbursementFlowNo.includes(disbursementFlowNo)
    const matchesInboundType = !inboundType || record.inboundType === inboundType
    const matchesBusinessContract =
      !relatedBusinessContractNo ||
      record.relatedBusinessContractNo.includes(relatedBusinessContractNo)
    return (
      matchesPhase &&
      matchesStatus &&
      matchesApplicationNo &&
      matchesCustomerName &&
      matchesCoreCustomerNo &&
      matchesProjectName &&
      matchesProjectNo &&
      matchesDisbursementFlowNo &&
      matchesInboundType &&
      matchesBusinessContract
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))
  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const assetOutboundManagementApplicationPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const phase = String(query.phase || '').trim()
  const status = String(query.status || query.applicationStatus || '').trim()
  const applicationNo = String(query.applicationNo || query.applyNo || query.serialNo || '').trim()
  const customerName = String(query.customerName || query.linkedCustomerName || '').trim()
  const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
  const projectName = String(query.projectName || '').trim()
  const projectNo = String(query.projectNo || '').trim()
  const relatedBusinessContractNo = String(
    query.relatedBusinessContractNo || query.businessContractNo || query.contractNo || ''
  ).trim()
  const filtered = assetOutboundManagementApplicationRecords.filter((record) => {
    const matchesPhase = !phase || record.phase === phase
    const matchesStatus = !status || record.status === status
    const matchesApplicationNo = !applicationNo || record.applicationNo.includes(applicationNo)
    const matchesCustomerName = !customerName || record.customerName.includes(customerName)
    const matchesCoreCustomerNo = !coreCustomerNo || record.coreCustomerNo.includes(coreCustomerNo)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    const matchesProjectNo = !projectNo || record.projectNo.includes(projectNo)
    const matchesBusinessContract =
      !relatedBusinessContractNo ||
      record.relatedBusinessContractNo.includes(relatedBusinessContractNo)
    return (
      matchesPhase &&
      matchesStatus &&
      matchesApplicationNo &&
      matchesCustomerName &&
      matchesCoreCustomerNo &&
      matchesProjectName &&
      matchesProjectNo &&
      matchesBusinessContract
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))
  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const offlineLedgerUpdatePageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const phase = String(query.phase || '').trim()
  const applicationNo = String(query.applicationNo || query.applyNo || '').trim()
  const projectNo = String(query.projectNo || '').trim()
  const projectName = String(query.projectName || '').trim()
  const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
  const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
  const productPlan = String(query.productPlan || '').trim()
  const filtered = offlineLedgerApplicationRecords.filter((record) => {
    const matchesPhase = !phase || record.phase === phase
    const matchesApplicationNo = !applicationNo || record.applicationNo.includes(applicationNo)
    const matchesProjectNo = !projectNo || record.projectNo.includes(projectNo)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    const matchesCoreEnterprise =
      !coreEnterpriseName || record.coreEnterpriseName.includes(coreEnterpriseName)
    const matchesCoreCustomerNo = !coreCustomerNo || record.coreCustomerNo.includes(coreCustomerNo)
    const matchesProductPlan = !productPlan || record.productPlan === productPlan
    return (
      matchesPhase &&
      matchesApplicationNo &&
      matchesProjectNo &&
      matchesProjectName &&
      matchesCoreEnterprise &&
      matchesCoreCustomerNo &&
      matchesProductPlan
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))
  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const orderContractLedgerPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const status = String(query.status || 'valid').trim()
  const projectId = Number(query.projectId || 0)
  const customerName = String(query.customerName || '').trim()
  const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
  const relatedBusinessContractNo = String(
    query.relatedBusinessContractNo || query.businessContractNo || query.contractNo || ''
  ).trim()
  const filtered = orderContractLedgerRecords.filter((record) => {
    const matchesStatus = !status || record.status === status
    const matchesProject = !projectId || record.projectId === projectId
    const matchesCustomerName = !customerName || record.customerName.includes(customerName)
    const matchesCoreCustomerNo = !coreCustomerNo || record.coreCustomerNo.includes(coreCustomerNo)
    const matchesBusinessContract =
      !relatedBusinessContractNo ||
      record.relatedBusinessContractNo.includes(relatedBusinessContractNo)
    return (
      matchesStatus &&
      matchesProject &&
      matchesCustomerName &&
      matchesCoreCustomerNo &&
      matchesBusinessContract
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))
  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

const orderContractModificationPageData = (
  config: AxiosRequestConfig,
  node: 'active' | 'records'
) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const applicationFlowNo = String(
    query.applicationFlowNo || query.orderContractFlowNo || query.flowNo || ''
  ).trim()
  const orderContractNo = String(query.orderContractNo || query.contractNo || '').trim()
  const customerName = String(query.customerName || '').trim()
  const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
  const projectName = String(query.projectName || '').trim()
  const projectNo = String(query.projectNo || '').trim()
  const creditNo = String(query.creditNo || '').trim()
  const businessContractNo = String(query.businessContractNo || '').trim()
  const disbursementFlowNo = String(query.disbursementFlowNo || query.loanFlowNo || '').trim()
  const contractStatus = String(query.contractStatus || '').trim()
  const modificationStatus = String(query.modificationStatus || '').trim()
  const source =
    node === 'records' ? orderContractModificationHistoryRecords : orderContractModificationRecords
  const filtered = source.filter((record) => {
    const matchesFlowNo = !applicationFlowNo || record.applicationFlowNo.includes(applicationFlowNo)
    const matchesContractNo = !orderContractNo || record.orderContractNo.includes(orderContractNo)
    const matchesCustomerName = !customerName || record.customerName.includes(customerName)
    const matchesCoreCustomerNo = !coreCustomerNo || record.coreCustomerNo.includes(coreCustomerNo)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    const matchesProjectNo = !projectNo || record.projectNo.includes(projectNo)
    const matchesCreditNo = !creditNo || String(record.creditNo || '').includes(creditNo)
    const matchesBusinessContractNo =
      !businessContractNo || record.businessContractNo.includes(businessContractNo)
    const matchesDisbursementFlowNo =
      !disbursementFlowNo || String(record.disbursementFlowNo || '').includes(disbursementFlowNo)
    const matchesContractStatus = !contractStatus || record.contractStatus === contractStatus
    const matchesModificationStatus =
      !modificationStatus || record.modificationStatus === modificationStatus
    return (
      matchesFlowNo &&
      matchesContractNo &&
      matchesCustomerName &&
      matchesCoreCustomerNo &&
      matchesProjectName &&
      matchesProjectNo &&
      matchesCreditNo &&
      matchesBusinessContractNo &&
      matchesDisbursementFlowNo &&
      matchesContractStatus &&
      matchesModificationStatus
    )
  })
  const start = (pageNo - 1) * pageSize
  const list = cloneMockData(filtered.slice(start, start + pageSize))

  return { total: filtered.length, list, records: list, pageNo, pageSize }
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await sleep(120)
  const url = urlPath(config.url)

  if (config.responseType === 'blob') {
    return {
      data: new Blob(['供应链原型平台 Mock 导出数据\n'], { type: 'text/plain;charset=utf-8' }),
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      config,
      request: { responseType: 'blob' }
    }
  }

  let data: unknown
  if (/\/system\/auth\/login$|\/sms-login$/.test(url)) {
    data = {
      id: 1,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      userId: 1,
      userType: 1,
      clientId: 'mock-web-client',
      expiresTime: Date.now() + 24 * 60 * 60 * 1000
    }
  } else if (/\/system\/auth\/get-permission-info$/.test(url)) {
    data = permissionInfo
  } else if (/\/system\/dict-data\/simple-list$/.test(url)) {
    data = dictData
  } else if (/\/system\/risk-detection\/start$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const params = typeof payload.params === 'object' && payload.params ? payload.params : {}
    data = cloneMockData(
      createCustomerRiskCheckTask(String((params as Recordable).ObjectNo || ''))
    )
  } else if (/\/system\/risk-detection\/result$/.test(url)) {
    data = cloneMockData(getCustomerRiskCheckResults())
  } else if (/\/system\/business\/approveMenu\/Menu$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data =
      query.codeNo === 'TSELCreditApplyMain'
        ? cloneMockData(financingApplicationMenu)
        : query.codeNo === 'BookInContractMain'
          ? cloneMockData(contractRegistrationMenu)
          : query.codeNo === 'ParamAdjustApplyMain'
            ? cloneMockData(projectParamAdjustmentMenu)
            : optionData
  } else if (/\/system\/putout-info\/getMenuList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = query.codeNo === 'PutOutApplyMain' ? cloneMockData(loanApplicationMenu) : optionData
  } else if (/\/system\/putout-info\/getApprovePutOutApplyMenu$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const type = String(payload.type || '') as 'N' | 'Y'
    data = cloneMockData(loanApprovalMenus[type] || [])
  } else if (/\/system\/putout-info\/reviewLendingApplicationsRecheckPage$/.test(url)) {
    data = cloneMockData(loanApprovalPage(parseMockPayload(config.data)))
  } else if (/\/system\/putout-info\/pendPutOutApplyList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(loanApplicationPage(query))
  } else if (/\/system\/approveChangeApply\/getMenuList$/.test(url)) {
    data = cloneMockData(approvalChangeApplicationMenu)
  } else if (/\/system\/approveChangeApply\/getApproveChangeApplyList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(approvalChangeApplicationPage(query))
  } else if (/\/system\/ProjectWhiteList\/getMenu$/.test(url)) {
    data = cloneMockData(supplyChainDecisionApplicationMenu)
  } else if (/\/system\/ProjectWhiteList\/getApproveMenu$/.test(url)) {
    data = cloneMockData(supplyChainDecisionCheckMenu)
  } else if (/\/system\/ProjectWhiteList\/getProjectWhiteList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(supplyChainDecisionPage(query))
  } else if (/\/system\/paramAdjust\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(projectParamAdjustmentPage(query))
  } else if (/\/system\/paramAdjust\/qryProjectNameListPage$/.test(url)) {
    data = {
      total: projectParamAdjustmentProjects.length,
      list: cloneMockData(projectParamAdjustmentProjects),
      records: cloneMockData(projectParamAdjustmentProjects)
    }
  } else if (/\/system\/paramAdjust\/addApply$/.test(url)) {
    data = cloneMockData(createProjectParamAdjustmentRecord(parseMockPayload(config.data)))
  } else if (/\/system\/paramAdjust\/cancelApply$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = {
      success: Boolean(cancelProjectParamAdjustmentRecord(payload.serialNo || payload.serialno))
    }
  } else if (/\/system\/creditReviewapproval\/creditReviewAprrovalTreeList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const type = String(query.type || 'N') === 'Y' ? 'Y' : 'N'
    data = cloneMockData(projectCreditApprovalMenus[type])
  } else if (/\/system\/creditReviewapproval\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(projectCreditApprovalPage(query))
  } else if (/\/system\/ContractTask\/ContractTaskList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(linkedQuotaApprovalMenus[String(query.flag || 'N') as 'N' | 'Y'] || [])
  } else if (/\/system\/ContractTask\/ywContractTaskList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(linkedBusinessApprovalMenus[String(query.flag || 'N') as 'N' | 'Y'] || [])
  } else if (/\/system\/ContractTask\/(?:ContractList|ywContractList)$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(linkedContractApprovalPage(query))
  } else if (/\/system\/business-approve\/getBusinessApprovePage$/.test(url)) {
    data = cloneMockData(contractRegistrationPage(parseMockPayload(config.data)))
  } else if (/\/system\/sxctCreditApply\/page$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const phaseType = String(payload.phaseType || '')
    const customerName = String(payload.customername || '').trim()
    const billNo = String(payload.subbillnum || '').trim()
    const rootBillNo = String(payload.rootbillnum || '').trim()
    const certId = String(payload.certid || '').trim()
    const records = financingApplicationRecords.filter(
      (record) =>
        (!phaseType || record.phaseType === phaseType) &&
        (!customerName || record.customername.includes(customerName)) &&
        (!billNo || record.subbillnum.includes(billNo)) &&
        (!rootBillNo || record.rootbillnum.includes(rootBillNo)) &&
        (!certId || record.certid.includes(certId))
    )
    data = { total: records.length, list: cloneMockData(records), records: cloneMockData(records) }
  } else if (/\/system\/sxctCreditApply\/pagePutOutList$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const phaseType = String(payload.phaseType || '')
    const customerName = String(payload.customername || '').trim()
    const records = financingTicketRecords.filter(
      (record) =>
        (!phaseType || record.phaseType === phaseType) &&
        (!customerName || record.customername.includes(customerName))
    )
    data = { total: records.length, list: cloneMockData(records), records: cloneMockData(records) }
  } else if (/\/system\/sxctCreditApply\/pageQFDFList$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const phaseType = String(payload.phaseType || '')
    const rootBillNo = String(payload.rootbillnum || '').trim()
    const records = financingClearingRecords.filter(
      (record) =>
        (!phaseType || record.phaseType === phaseType) &&
        (!rootBillNo || record.rootbillnum.includes(rootBillNo))
    )
    data = { total: records.length, list: cloneMockData(records), records: cloneMockData(records) }
  } else if (/\/system\/index\/allCount$/.test(url)) {
    data = 0
  } else if (/\/system\/index\/getWaitDealQueryListGroup$/.test(url)) {
    data = dashboardTabs
  } else if (/\/system\/index\/getWaitDealQueryListGroupWithCount$/.test(url)) {
    const attribute6 = String(urlQuery(config.url).attribute6 || config.params?.attribute6 || '')
    data = { count: attribute6 === 'credit' || attribute6 === 'contract' ? 1 : 2 }
  } else if (/\/system\/index\/getWaitDealQueryListByAttribute$/.test(url)) {
    const attribute6 = String(urlQuery(config.url).attribute6 || config.params?.attribute6 || '')
    const list = attribute6
      ? dashboardTasks.filter((item) => item.attribute6 === attribute6)
      : dashboardTasks
    data = { total: list.length, list }
  } else if (/\/system\/index\/mock-credit-pending$/.test(url)) {
    data = [{ name: '华东供应链有限公司 授信申请 SCF202607200001', serialNo: 'SCF202607200001' }]
  } else if (/\/system\/index\/mock-contract-pending$/.test(url)) {
    data = [{ name: '新城贸易有限公司 合同审批 HT202607190002', serialNo: 'HT202607190002' }]
  } else if (/\/system\/index\/getWorkMessage$/.test(url)) {
    data = [
      {
        businessRemindGroup: '项目即将到期',
        businessRemindGroupNum: 1,
        attribute5: '请及时处理项目续期'
      }
    ]
  } else if (/\/system\/index\/getNoticeMessage$/.test(url)) {
    data = [{ title: 'Mock 演示数据已启用', businessRemindGroup: '系统提示', itemno: 'NOTICE001' }]
  } else if (/\/system\/credit-apply\/todolist$/.test(url)) {
    data = {
      total: 2,
      list: [
        {
          serialNo: 'SCF202607200001',
          customerID: 'C202607200001',
          customerName: '华东供应链有限公司',
          mrchFlg: '直营网银',
          businessTypeName: '供应链流动资金贷款',
          virtualOccurTypeName: '新增',
          applyModelTypeName: '授信审批',
          currencyName: '人民币',
          businessSum: 1200000,
          sourceFrom: '供应链金融平台',
          operateUserName: '张晨',
          operateOrgName: '总行供应链金融部',
          flowName: '授信申请流程',
          phaseName: '待审批',
          endTime: '',
          projectName: '核心企业供应链金融项目',
          objectType: 'CreditApply',
          phaseNo: '1020'
        },
        {
          serialNo: 'SCF202607190002',
          customerID: 'C202607190002',
          customerName: '新城贸易有限公司',
          mrchFlg: '线下录入',
          businessTypeName: '经销商融资',
          virtualOccurTypeName: '续作',
          applyModelTypeName: '授信审批',
          currencyName: '人民币',
          businessSum: 800000,
          sourceFrom: '客户经理录入',
          operateUserName: '李敏',
          operateOrgName: '上海分行',
          flowName: '授信申请流程',
          phaseName: '待审批',
          endTime: '',
          projectName: '经销商融资项目',
          objectType: 'CreditApply',
          phaseNo: '1020'
        }
      ]
    }
  } else if (/\/system\/projectCoreviewApply\/getProjectCoreviewPage$/.test(url)) {
    data = projectCoreviewPageData(config)
  } else if (/\/system\/projectCoreviewApply\/qryCompletedPage$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const keyword = String(query.serialNo || '').trim()
    const completed = projectCoreviewRecords.filter((record) =>
      ['1040', '1050'].includes(String(record.phaseType)) &&
      (!keyword || record.serialNo.includes(keyword))
    )
    const start = (pageNo - 1) * pageSize
    const list = cloneMockData(completed.slice(start, start + pageSize).map(({ detail, ...record }) => ({
      ...record,
      userName: record.inputUserID,
      phaseNo: record.phaseType === '1040' ? '审批通过' : '审批否决'
    })))
    data = { total: completed.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/projectCoreviewApply\/(?:aprrovalPage|aprrovalOptionPage)$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const approval = projectCoreviewRecords.filter((record) => record.phaseType === '1020')
    const start = (pageNo - 1) * pageSize
    const list = cloneMockData(approval.slice(start, start + pageSize).map(({ detail, ...record }) => ({
      ...record,
      userName: record.inputUserID,
      taskId: `TASK-${record.serialNo}`,
      flowNo: record.ftSerialNo,
      checked: false
    })))
    data = { total: approval.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/projectCoreviewApply\/add$/.test(url)) {
    data = cloneMockData(createProjectCoreviewRecord(parseMockPayload(config.data)))
  } else if (/\/system\/projectCoreviewApply\/deleteApply$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = { success: deleteProjectCoreviewRecord(payload.serialNo || payload.serialno) }
  } else if (/\/system\/projectCoreviewApply\/get$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getProjectCoreviewDetail(query.serialNo || query.serialno))
  } else if (/\/system\/projectCoreviewApply\/tempSaveRecord$/.test(url)) {
    data = cloneMockData(updateProjectCoreviewDetail(parseMockPayload(config.data), '1'))
  } else if (/\/system\/projectCoreviewApply\/saveRecord$/.test(url)) {
    data = cloneMockData(updateProjectCoreviewDetail(parseMockPayload(config.data), '2'))
  } else if (/\/system\/projectCoreviewApply\/getCoreviewApplyOpinion$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const opinion = getProjectCoreviewOpinion(query.serialNo || query.serialno)
    data = opinion.approvalComment
      ? [{
          phaseNo: '1010', phaseName: '项目协审申请', userName: opinion.nickName,
          orgName: opinion.orgName, attribute: '供应链金融平台',
          beginTime: '2026-09-04 09:30:00', endTime: opinion.oprDate,
          phaseOpinion: opinion.approvalComment
        }]
      : []
  } else if (/(?:^|\/)system\/modelManage\/apply\/checkComment$/.test(url)) {
    data = { phaseOpinion: true }
  } else if (/\/system\/bpmComment\/getCheckOpinionTab$/.test(url)) {
    data = ['项目协审意见']
  } else if (/\/system\/bpmComment\/getRelativeObjNo$/.test(url)) {
    data = {}
  } else if (/\/system\/bpmComment\/get$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getProjectCoreviewOpinion(query.businessId))
  } else if (/\/system\/bpmComment\/save$/.test(url)) {
    data = cloneMockData(saveProjectCoreviewOpinion(parseMockPayload(config.data)))
  } else if (/\/system\/bpmComment\/remove$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = { success: removeProjectCoreviewOpinion(payload.id || payload.businessId) }
  } else if (/\/system\/credit-flow\/getFlowTaskByObjNoAndTypeAndPhaseNo$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = { serialNo: `FT-${String(query.objectNo || '')}`, phaseNo: query.phaseNo || '1010' }
  } else if (/\/system\/credit-flow\/next-select-users$/.test(url)) {
    data = {
      stgInfArray: [
        {
          opnnChosInf: '同意提交',
          hiddenAprverInfArray: false,
          aprverInfArray: [
            { aprverInf: '供应链金融审查岗（张晨）' },
            { aprverInf: '公司业务审批岗（李敏）' }
          ]
        }
      ]
    }
  } else if (/\/system\/credit-flow\/getFlowRecordPage$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const records = getProjectCoreviewFlowRecords(query.serialNo)
    data = { total: records.length, list: cloneMockData(records), records: cloneMockData(records) }
  } else if (/\/system\/credit-flow\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = { success: submitProjectCoreviewRecord(payload.serialNo) }
  } else if (/\/system\/credit-flow\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = { success: withdrawProjectCoreviewRecord(payload.serialNo) }
  } else if (/\/system\/codeLibrary\/getCreditStageFlow$/.test(url)) {
    data = [{ attribute1: '', attribute2: '', attribute3: '' }]
  } else if (/\/system\/creditLimitApply\/qryApplyListPage$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Number(query.pageNo || query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    const objectNo = String(query.objectNo || query.serialNo || '').trim()
    const customerName = String(query.customerName || '').trim()
    const records = projectCreditApplyRecords.filter(
      (record) =>
        (!objectNo || record.objectNo.includes(objectNo)) &&
        (!customerName || record.customerName.includes(customerName))
    )
    data = {
      total: records.length,
      list: cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize)),
      records: cloneMockData(records),
      pageNo,
      pageSize
    }
  } else if (/\/system\/singleCreditApply\/qryOccurrenceTypeList$/.test(url)) {
    data = [
      { itemno: '080', itemname: '新增' },
      { itemno: '084', itemname: '续作' },
      { itemno: '088', itemname: '复议' },
      { itemno: '095', itemname: '展期' },
      { itemno: '098', itemname: '提额' }
    ]
  } else if (
    /\/system\/(?:singleCreditApply\/qryCompangyCustomerPage|creditLimitApply\/qryPeerCustomerPage)$/.test(
      url
    )
  ) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const customerName = String(query.customerName || '').trim()
    const customerID = String(query.customerID || '').trim()
    const customers = [
      {
        customerID: 'C2025040300000003',
        customerName: '阿姆特拉斯供应链有限公司',
        customerTypeName: '公司客户',
        certID: '91310115MA1K4C8M8P',
        certTypeName: '统一社会信用代码'
      },
      {
        customerID: 'C2025040300000004',
        customerName: '新城贸易有限公司',
        customerTypeName: '公司客户',
        certID: '91310115MA1K4D5N7Q',
        certTypeName: '统一社会信用代码'
      }
    ].filter(
      (customer) =>
        (!customerName || customer.customerName.includes(customerName)) &&
        (!customerID || customer.customerID.includes(customerID))
    )
    data = { total: customers.length, list: customers, records: customers }
  } else if (/\/system\/creditLimitApply\/qryBusinessVarietyTree$/.test(url)) {
    data = [
      {
        typeNo: 'SCF',
        typeName: '供应链融资',
        children: [
          { typeNo: 'SCF_WORKING_CAPITAL', typeName: '单一客户综合授信', leaf: true },
          { typeNo: 'SCF_DEALER_FINANCE', typeName: '经销商融资', leaf: true }
        ]
      }
    ]
  } else if (/\/system\/creditLimitApply\/qryCooperativeProjectPage$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectName = String(query.projectName || '').trim()
    const customerID = String(query.customerID || '').trim()
    const projects = [
      {
        projectID: 'PJ202607010001',
        projectName: '钢贸供应链融资项目',
        customerID: 'C2025040300000003'
      },
      {
        projectID: 'PJ202607020002',
        projectName: '经销商融资项目',
        customerID: 'C2025040300000004'
      }
    ].filter(
      (project) =>
        (!projectName || project.projectName.includes(projectName)) &&
        (!customerID || project.customerID === customerID)
    )
    data = { total: projects.length, list: projects, records: projects }
  } else if (/\/system\/creditLimitApply\/getProjectcoreviewApplyCount$/.test(url)) {
    data = 1
  } else if (/\/system\/creditLimitApply\/saveCreditLimitApply$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const serialNo = `BA20260803${String(projectCreditApplyRecords.length + 1).padStart(8, '0')}`
    const customerName =
      payload.customerID === 'C2025040300000004' ? '新城贸易有限公司' : '阿姆特拉斯供应链有限公司'
    const businessTypeName =
      payload.businessType === 'SCF_DEALER_FINANCE' ? '经销商融资' : '单一客户综合授信'
    const projectName =
      payload.relaTeamWork === 'PJ202607020002' ? '经销商融资项目' : '钢贸供应链融资项目'
    const record = {
      id: Date.now(),
      objectNo: serialNo,
      serialNo,
      customerID: String(payload.customerID || 'C2025040300000003'),
      customerName,
      projectName,
      mrchFlg: '供应链金融平台',
      businessType: String(payload.businessType || 'SCF_WORKING_CAPITAL'),
      businessTypeName,
      virtualOccurTypeName:
        String(payload.occurType || '080') === '084'
          ? '续作'
          : String(payload.occurType || '080') === '088'
            ? '复议'
            : '新增',
      applyModelTypeName: '授信审批',
      currencyName: '人民币',
      businessSum: 10000000,
      exposureSum: 8000000,
      sourceFrom: '供应链金融平台',
      operateUserName: '本地演示用户',
      operateOrgName: '供应链金融部',
      flowName: '授信申请流程',
      endTime: '',
      applyType: 'CreditLineApply',
      objectType: 'CreditApply',
      phaseNo: '0010',
      phaseName: '待提交',
      createTime: '2026-08-03 10:00:00',
      operatorName: '本地演示用户',
      operatorOrgName: '供应链金融部'
    }
    projectCreditApplyRecords.unshift(record)
    data = cloneMockData(record)
  } else if (/\/system\/creditLimitApply\/saveProjectDetail$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const serialNo = String(payload.serialNo || projectCreditDetail.applicationNo)
    const savedDetail = cloneMockData(
      projectCreditDetailCache[serialNo] || (projectCreditDetail as unknown as Recordable)
    )
    const basicFields = Array.isArray(payload.basicFields)
      ? cloneMockData(payload.basicFields)
      : undefined

    if (basicFields) {
      const sections = savedDetail.sections as Recordable
      const basic = sections.basic as Recordable
      basic.fields = basicFields

      const coreEnterpriseName = basicFields.find(
        (field: Recordable) => field.key === 'coreEnterpriseName'
      )?.value
      if (typeof coreEnterpriseName === 'string' && coreEnterpriseName) {
        savedDetail.customerName = coreEnterpriseName
        const customer = savedDetail.customer as Recordable
        const customerNameField = (customer.fields as Recordable[]).find(
          (field) => field.label === '客户名称'
        )
        if (customerNameField) customerNameField.value = coreEnterpriseName
      }
    }

    projectCreditDetailCache[serialNo] = savedDetail
    persistProjectCreditDetailCache()
    data = cloneMockData(savedDetail)
  } else if (/\/system\/creditLimitApply\/getProjectDetail$/.test(url)) {
    const serialNo = String(urlQuery(config.url).serialNo || config.params?.serialNo || '')
    const detailKey = serialNo || projectCreditDetail.applicationNo
    const projectDetail =
      projectCreditDetailCache[detailKey] || (projectCreditDetail as unknown as Recordable)
    data = {
      ...cloneMockData(projectDetail),
      applicationNo: detailKey
    }
  } else if (/\/system\/customerinfo\/ent\/customerInfoEntPage$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const customerName = String(query.customerName || '').trim()
    const certID = String(query.certID || '').trim()
    const coreCustomerNo = String(query.mfCustomerId || '').trim()
    const records = companyCustomerList.filter(
      (item) =>
        (!customerName || item.customerName.includes(customerName)) &&
        (!certID || item.certID.includes(certID)) &&
        (!coreCustomerNo || item.mfcustomerID.includes(coreCustomerNo))
    )
    const list = cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize))
    data = { total: records.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/customerinfo\/ent\/selectTeamWork$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const projectId = String(query.projectid || query.projectId || '').trim()
    const projectName = String(query.projectname || query.projectName || '').trim()
    const records = projectParamAdjustmentProjects
      .map((item) => ({
        ...item,
        projectid: item.projectId,
        projectname: item.projectName
      }))
      .filter(
        (item) =>
          (!projectId || item.projectid.includes(projectId)) &&
          (!projectName || item.projectname.includes(projectName))
      )
    const list = cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize))
    data = { total: records.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/teamwork\/relative\/create$/.test(url)) {
    data = { '3': { msg: '客户可直接加入该供应链群' } }
  } else if (/\/system\/teamwork\/relative\/add$/.test(url)) {
    data = '加入供应链群成功'
  } else if (/\/system\/customerinfo\/sendCustomerList$/.test(url)) {
    data = customerOwnershipPageData(config, 'transfer')
  } else if (/\/system\/customerinfo\/receiveCustomerList$/.test(url)) {
    data = customerOwnershipPageData(config, 'receive')
  } else if (/\/system\/customerinfo\/getCustomerRight$/.test(url)) {
    data = { GetHost: 'Y' }
  } else if (/\/system\/customerinfo\/synchronizeCustomer$/.test(url)) {
    data = true
  } else if (/\/system\/customerinfo\/(?:hostingRight|receiveRight)$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = {
      success: true,
      customerIds: Array.isArray(payload.customerIds) ? payload.customerIds : []
    }
  } else if (/\/system\/customerinfo\/applyRole$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const permissionCount = Array.isArray(payload.requestedPermissions)
      ? payload.requestedPermissions.length
      : 1
    data = `权限申请已提交，共申请 ${permissionCount} 项权限`
  } else if (/\/system\/customerinfo\/getTeamWorkProjectIntList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const customerName = String(query.customerName || '').trim()
    const certId = String(query.certId || '').trim()
    const projectName = String(query.projectName || '').trim()
    const projectId = String(query.projectId || '').trim()
    const mfCustomerId = String(query.mfCustomerId || '').trim()
    const records = chainPersonCustomerRecords.filter(
      (item) =>
        (!customerName || item.customerName.includes(customerName)) &&
        (!certId || item.certId.includes(certId)) &&
        (!projectName || item.projectName.includes(projectName)) &&
        (!projectId || item.projectId.includes(projectId)) &&
        (!mfCustomerId || item.mfCustomerId.includes(mfCustomerId))
    )
    const list = cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize))
    data = { total: records.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/customerinfo\/getTeamWorkProjectEntList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const customerName = String(query.customerName || '').trim()
    const certId = String(query.certID || query.certId || '').trim()
    const projectName = String(query.projectName || '').trim()
    const projectId = String(query.projectId || '').trim()
    const mfCustomerId = String(query.mfCustomerId || '').trim()
    const records = chainCompanyCustomerRecords.filter(
      (item) =>
        (!customerName || item.customerName.includes(customerName)) &&
        (!certId || item.certId.includes(certId)) &&
        (!projectName || item.projectName.includes(projectName)) &&
        (!projectId || item.projectId.includes(projectId)) &&
        (!mfCustomerId || item.mfCustomerId.includes(mfCustomerId))
    )
    const list = cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize))
    data = { total: records.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/customerinfo\/getTeamWorkProjectCustomerList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const customerName = String(query.customerName || '').trim()
    const certId = String(query.certID || query.certId || '').trim()
    const projectName = String(query.projectName || '').trim()
    const projectId = String(query.projectId || '').trim()
    const mfCustomerId = String(query.mfCustomerId || '').trim()
    const records = coreCustomerRecords.filter(
      (item) =>
        (!customerName || item.customerName.includes(customerName)) &&
        (!certId || item.certId.includes(certId)) &&
        (!projectName || item.projectName.includes(projectName)) &&
        (!projectId || item.projectId.includes(projectId)) &&
        (!mfCustomerId || item.mfCustomerId.includes(mfCustomerId))
    )
    const list = cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize))
    data = { total: records.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/custom-self-employed\/getCustomerView$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const codeNo = String(query.codeNo || '').toLowerCase()
    data = cloneMockData(
      codeNo.includes('enterprise')
        ? companyCustomerViewMenu
        : codeNo === 'indview'
          ? salaryEarnerCustomerViewMenu
          : selfEmployedCustomerViewMenu
    )
  } else if (/\/system\/custom-self-employed\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const customerName = String(query.customerName || '').trim()
    const certId = String(query.certId || '').trim()
    const mfCustomerId = String(query.mfCustomerId || '').trim()
    const records = selfEmployedCustomerList.filter(
      (item) =>
        (!customerName || item.customerName.includes(customerName)) &&
        (!certId || item.certId.includes(certId)) &&
        (!mfCustomerId || item.mfCustomerID.includes(mfCustomerId))
    )
    const list = cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize))
    data = { total: records.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/custom-salary-earner\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
    const pageSize = Math.max(1, Number(query.pageSize || 20))
    const customerName = String(query.customerName || '').trim()
    const certId = String(query.certId || '').trim()
    const mfCustomerId = String(query.mfCustomerId || '').trim()
    const managers = ['李敏', '张晨']
    const records = selfEmployedCustomerList
      .map((item, index) => ({
        ...item,
        customerType: '0310',
        certId1: item.certId,
        userName: managers[index % managers.length],
        orgName: index % 2 === 0 ? '上海分行普惠金融部' : '南京分行供应链金融部'
      }))
      .filter(
        (item) =>
          (!customerName || item.customerName.includes(customerName)) &&
          (!certId || item.certId.includes(certId)) &&
          (!mfCustomerId || item.mfCustomerID.includes(mfCustomerId))
      )
    const list = cloneMockData(records.slice((pageNo - 1) * pageSize, pageNo * pageSize))
    data = { total: records.length, list, records: list, pageNo, pageSize }
  } else if (/\/system\/custom-self-employed\/get$/.test(url)) {
    const customerId = String(urlQuery(config.url).customerid || config.params?.customerid || '')
    const listItem = selfEmployedCustomerList.find((item) => item.customerId === customerId)
    data = {
      ...cloneMockData(selfEmployedCustomerDetail),
      customerid: customerId || selfEmployedCustomerDetail.customerid,
      customername: listItem?.customerName || selfEmployedCustomerDetail.customername,
      mfcustomerid: listItem?.mfCustomerID || selfEmployedCustomerDetail.mfcustomerid
    }
  } else if (/\/system\/custom-self-employed\/getDock$/.test(url)) {
    data = cloneMockData(selfEmployedCustomerPageVO)
  } else if (/\/system\/customerinfo\/getCustomerPageVO$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data =
      ['0310', '0320'].includes(String(query.customerType || ''))
        ? cloneMockData(selfEmployedCustomerPageVO)
        : cloneMockData(companyCustomerPageVO)
  } else if (/\/system\/codeLibrary\/list$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const codeNos = String(query.codeNos || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    data = Object.fromEntries(
      codeNos.map((codeNo) => [codeNo, cloneMockData(projectCoreviewOldDicts[codeNo] || [])])
    )
  } else if (/\/system\/codeLibrary\/cityTreeList$/.test(url)) {
    data = cloneMockData(customerRegionTree)
  } else if (/\/system\/codeLibrary\/industryTreeList$/.test(url)) {
    data = cloneMockData(customerIndustryTree)
  } else if (/\/system\/codeLibrary\/creditBelongTree$/.test(url)) {
    data = cloneMockData(customerCreditTemplateTree)
  } else if (/\/system\/codeLibrary\/codeLibraryTreeList$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      String(query.codeNo || '').toLowerCase().includes('entorg')
        ? customerHoldingTypeTree
        : customerCountryTree
    )
  } else if (/\/system\/custom-self-employed\/selectEntOrg$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const customerId = String(query.customerid || '').trim()
    const customerName = String(query.customername || '').trim()
    const records = customerEnterpriseOptions.filter(
      (item) =>
        (!customerId || item.customerid.includes(customerId)) &&
        (!customerName || item.customername.includes(customerName))
    )
    data = { list: cloneMockData(records), total: records.length }
  } else if (/\/system\/customerinfo\/ent\/customerInfoEntDetail$/.test(url)) {
    const customerId = String(urlQuery(config.url).customerId || config.params?.customerId || '')
    const listItem = companyCustomerList.find((item) => item.customerID === customerId)
    data = {
      ...cloneMockData(companyCustomerDetail),
      customerid: customerId || companyCustomerDetail.customerid,
      enterprisename: listItem?.customerName || companyCustomerDetail.enterprisename,
      mfcustomerid: listItem?.mfcustomerID || companyCustomerDetail.mfcustomerid
    }
  } else if (/\/system\/customerinfo\/ent\/getCustomerTemplateNo$/.test(url)) {
    data = 'EnterpriseInfo1010NC'
  } else if (/\/system\/customerinfo\/ent\/entTempSaveFlag$/.test(url)) {
    data = '1'
  } else if (/\/system\/customerinfo\/entImportFlag$/.test(url)) {
    data = true
  } else if (
    /\/system\/(?:singleCreditApply\/getMenuList|business-approve\/approveLineMenu|business-contract\/getMenuList|putout-info\/getPutOutDetailTree)$/.test(
      url
    )
  ) {
    data = cloneMockData(workflowDetailMenu)
  } else if (
    /\/system\/(?:singleCreditApply\/getCreditTempFiled|business-approve\/getApproveTempFiled|customerinfo\/ent\/creditLineTemplateFiled|putout-info\/getPutOutTemplate)$|\/system\/+business-contract\/getCreditTempFiled$/.test(
      url
    )
  ) {
    data = cloneMockData(workflowDetailPageVO)
  } else if (
    /\/system\/(?:singleCreditApply\/getDetailInfo|business-approve\/getDetailInfo|customerinfo\/ent\/creditLineDetail|business-contract\/getDetailInfo|putout-info\/getPutOutDetailValue)$/.test(
      url
    )
  ) {
    data = cloneMockData(workflowDetail)
  } else if (/\/system\/indebt\/inventory-goods\/page$/.test(url)) {
    data = inventoryGoodsPageData(config)
  } else if (/\/system\/indebt\/inventory-goods\/active-list$/.test(url)) {
    data = cloneMockData(inventoryGoodsRecords.filter((record) => record.status === '有效'))
  } else if (/\/system\/indebt\/inventory-goods\/create$/.test(url)) {
    data = cloneMockData(createInventoryGoodsRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/inventory-goods\/history$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = { updated: markInventoryGoodsHistory(ids) }
  } else if (/\/system\/indebt\/warehouse-applications\/page$/.test(url)) {
    data = warehouseApplicationPageData(config)
  } else if (/\/system\/indebt\/warehouse-applications\/create$/.test(url)) {
    data = cloneMockData(createWarehouseApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/warehouse-applications\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = updateWarehouseApplicationRecord(payload.id || payload.applicationId, payload)
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅待提交的仓库建立申请可以修改' }
  } else if (/\/system\/indebt\/warehouse-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = submitWarehouseApplicationRecord(payload.id || payload.applicationId)
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅待提交的仓库建立申请可提交，或该申请不存在' }
  } else if (/\/system\/indebt\/warehouse-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = withdrawWarehouseApplicationRecord(payload.id || payload.applicationId)
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅审查审批中的仓库建立申请可收回，或该申请不存在' }
  } else if (/\/system\/indebt\/warehouse-applications\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getWarehouseApplicationRecord(query.id || query.applicationId)
    data = record ? cloneMockData(record) : { success: false, message: '仓库建立申请不存在' }
  } else if (/\/system\/indebt\/warehouse-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const result = signWarehouseApplicationOpinionRecord(
      payload.id || payload.applicationId,
      payload.opinion || payload.content
    )
    data = result
      ? {
          success: true,
          record: cloneMockData(result.record),
          opinion: cloneMockData(result.opinion)
        }
      : { success: false, message: '请填写签署意见，并确认仓库建立申请存在' }
  } else if (/\/system\/indebt\/warehouse-inspections\/page$/.test(url)) {
    data = warehouseInspectionPageData(config)
  } else if (/\/system\/indebt\/warehouse-inspections\/create$/.test(url)) {
    data = cloneMockData(createWarehouseInspectionRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/warehouse-inspections\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = submitWarehouseInspectionRecord(payload.id || payload.applicationId)
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅待提交的巡库申请可提交，或该申请不存在' }
  } else if (/\/system\/indebt\/warehouse-inspections\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = withdrawWarehouseInspectionRecord(payload.id || payload.applicationId)
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅审查审批中的巡库申请可收回，或该申请不存在' }
  } else if (/\/system\/indebt\/warehouse-inspections\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = approveWarehouseInspectionRecord(
      payload.id || payload.applicationId,
      payload.opinion || payload.content
    )
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅审查审批中的巡库申请可审批通过，或该申请不存在' }
  } else if (/\/system\/indebt\/warehouse-inspections\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const result = signWarehouseInspectionOpinionRecord(
      payload.id || payload.applicationId,
      payload.opinion || payload.content
    )
    data = result
      ? {
          success: true,
          record: cloneMockData(result.record),
          opinion: cloneMockData(result.opinion)
        }
      : { success: false, message: '请填写签署意见，并确认巡库申请存在' }
  } else if (/\/system\/indebt\/warehouse-inspections\/project-warehouses$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getProjectWarehousesRecord(String(query.projectNo || '')))
  } else if (/\/system\/indebt\/warehouse-inspections\/effective-projects$/.test(url)) {
    data = cloneMockData(effectiveSupplyChainProjects)
  } else if (/\/system\/indebt\/inventory-price-applications\/page$/.test(url)) {
    data = inventoryPriceApplicationPageData(config)
  } else if (/\/system\/indebt\/inventory-price-applications\/available-projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectNo = String(query.projectNo || '').trim()
    const projectName = String(query.projectName || '').trim()
    const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
    data = cloneMockData(
      inventoryPriceAvailableProjects.filter((project) => {
        const matchesProjectNo = !projectNo || project.projectNo.includes(projectNo)
        const matchesProjectName = !projectName || project.projectName.includes(projectName)
        const matchesCoreEnterprise =
          !coreEnterpriseName || project.coreEnterpriseName.includes(coreEnterpriseName)
        const hasPendingApplication = inventoryPriceApplicationRecords.some(
          (record) =>
            record.projectId === project.id &&
            (record.phase === 'pending' || record.phase === 'reviewing')
        )
        return (
          matchesProjectNo && matchesProjectName && matchesCoreEnterprise && !hasPendingApplication
        )
      })
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/create$/.test(url)) {
    data = cloneMockData(createInventoryPriceApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/inventory-price-applications\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateInventoryPriceApplicationRecord(payload.id || payload.applicationId, payload)
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/excel\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadInventoryPriceExcelRecord(
        payload.id || payload.applicationId,
        payload.fileName || payload.name
      )
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/excel\/template$/.test(url)) {
    data = cloneMockData(getInventoryPriceExcelTemplate())
  } else if (/\/system\/indebt\/inventory-price-applications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getInventoryPriceApplicationRecord(query.id || query.applicationId)
    data = cloneMockData(record?.images || [])
  } else if (/\/system\/indebt\/inventory-price-applications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadInventoryPriceApplicationImage(
        payload.id || payload.applicationId,
        payload.fileName || payload.name
      )
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signInventoryPriceApplicationOpinion(
        payload.id || payload.applicationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(
      batchSubmitInventoryPriceApplicationRecords(ids, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(submitInventoryPriceApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/inventory-price-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      withdrawInventoryPriceApplicationRecord(payload.id || payload.applicationId)
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      approveInventoryPriceApplicationRecord(
        payload.id || payload.applicationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/trend$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const trend = getInventoryPriceTrendData(query.id || query.applicationId, query.itemId)
    data = trend
      ? cloneMockData(trend)
      : { success: false, message: '价格盯市申请或商品维护行不存在' }
  } else if (/\/system\/indebt\/inventory-price-applications\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getInventoryPriceApplicationRecord(query.id || query.applicationId)
    data = record ? cloneMockData(record) : { success: false, message: '价格盯市申请不存在' }
  } else if (/\/system\/indebt\/asset-arrival-applications\/page$/.test(url)) {
    data = assetArrivalApplicationPageData(config)
  } else if (/\/system\/indebt\/asset-arrival-applications\/available-projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectName = String(query.projectName || '').trim()
    const projectNo = String(query.projectNo || '').trim()
    const customerName = String(query.customerName || query.linkedCustomerName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
    const businessContractNo = String(
      query.businessContractNo || query.relatedBusinessContractNo || ''
    ).trim()
    const disbursementFlowNo = String(query.disbursementFlowNo || query.loanFlowNo || '').trim()
    const inboundType = String(query.inboundType || '').trim()
    data = cloneMockData(
      assetArrivalAvailableProjects
        .filter((project) => {
          const matchesProjectName = !projectName || project.projectName.includes(projectName)
          const matchesProjectNo = !projectNo || project.projectNo.includes(projectNo)
          const matchesCustomerName = !customerName || project.customerName.includes(customerName)
          const matchesCoreCustomerNo =
            !coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo)
          const matchesBusinessContract =
            !businessContractNo || project.businessContractNo.includes(businessContractNo)
          const projectFlowNo = withAssetManagementProjectAliases(project).disbursementFlowNo || ''
          const matchesDisbursementFlow =
            !disbursementFlowNo || projectFlowNo.includes(disbursementFlowNo)
          const matchesInboundScope =
            inboundType === '动态补货'
              ? Boolean(project.allInboundCompleted && project.dynamicControlEnabled)
              : !project.allInboundCompleted
          const hasInProgressApplication = assetArrivalApplicationRecords.some(
            (record) =>
              record.projectId === project.id &&
              (record.phase === 'pending' || record.phase === 'reviewing')
          )
          return (
            project.isEffective &&
            matchesProjectName &&
            matchesProjectNo &&
            matchesCustomerName &&
            matchesCoreCustomerNo &&
            matchesBusinessContract &&
            matchesDisbursementFlow &&
            matchesInboundScope &&
            !hasInProgressApplication
          )
        })
        .map(withAssetArrivalProjectAliases)
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/create$/.test(url)) {
    data = cloneMockData(createAssetArrivalApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/asset-arrival-applications\/update-confirmation$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateAssetArrivalConfirmationRecord(payload.id || payload.applicationId, payload)
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetArrivalApplicationImages(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-arrival-applications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadAssetArrivalApplicationImage(
        payload.id || payload.applicationId,
        payload.fileName || payload.name
      )
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/opinions$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetArrivalApplicationOpinions(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-arrival-applications\/flow-records$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      getAssetArrivalApplicationFlowRecords(query.id || query.applicationId) || []
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signAssetArrivalApplicationOpinionRecord(
        payload.id || payload.applicationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(
      batchSubmitAssetArrivalApplicationRecords(ids, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(submitAssetArrivalApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/asset-arrival-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(withdrawAssetArrivalApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/asset-arrival-applications\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      approveAssetArrivalApplicationRecord(
        payload.id || payload.applicationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getAssetArrivalApplicationRecord(query.id || query.applicationId)
    data = record ? cloneMockData(record) : { success: false, message: '债项资产到港申请不存在' }
  } else if (/\/system\/indebt\/asset-management-applications\/page$/.test(url)) {
    data = assetManagementApplicationPageData(config)
  } else if (/\/system\/indebt\/asset-management-applications\/available-projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectName = String(query.projectName || '').trim()
    const projectNo = String(query.projectNo || '').trim()
    const customerName = String(query.customerName || query.linkedCustomerName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
    const businessContractNo = String(
      query.businessContractNo || query.relatedBusinessContractNo || ''
    ).trim()
    data = cloneMockData(
      assetManagementAvailableProjects
        .filter((project) => {
          const matchesProjectName = !projectName || project.projectName.includes(projectName)
          const matchesProjectNo = !projectNo || project.projectNo.includes(projectNo)
          const matchesCustomerName = !customerName || project.customerName.includes(customerName)
          const matchesCoreCustomerNo =
            !coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo)
          const matchesBusinessContract =
            !businessContractNo || project.businessContractNo.includes(businessContractNo)
          const hasInProgressApplication = assetManagementApplicationRecords.some(
            (record) =>
              record.projectId === project.id &&
              (record.phase === 'pending' || record.phase === 'reviewing')
          )
          return (
            project.isEffective &&
            matchesProjectName &&
            matchesProjectNo &&
            matchesCustomerName &&
            matchesCoreCustomerNo &&
            matchesBusinessContract &&
            !hasInProgressApplication
          )
        })
        .map(withAssetManagementProjectAliases)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/create$/.test(url)) {
    data = cloneMockData(createAssetManagementApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/asset-management-applications\/update-confirmation$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateAssetManagementConfirmationRecord(payload.id || payload.applicationId, payload)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/asset-detail\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateAssetManagementAssetDetailRecord(
        payload.applicationId || payload.id,
        payload.assetId || payload.itemId,
        payload
      )
    )
  } else if (/\/system\/indebt\/asset-management-applications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetManagementApplicationImages(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-management-applications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadAssetManagementApplicationImage(
        payload.id || payload.applicationId,
        payload.fileName || payload.name
      )
    )
  } else if (/\/system\/indebt\/asset-management-applications\/opinions$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      getAssetManagementApplicationOpinions(query.id || query.applicationId) || []
    )
  } else if (/\/system\/indebt\/asset-management-applications\/flow-records$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      getAssetManagementApplicationFlowRecords(query.id || query.applicationId) || []
    )
  } else if (/\/system\/indebt\/asset-management-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signAssetManagementApplicationOpinionRecord(
        payload.id || payload.applicationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/asset-management-applications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(
      batchSubmitAssetManagementApplicationRecords(ids, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      submitAssetManagementApplicationRecord(payload.id || payload.applicationId)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      withdrawAssetManagementApplicationRecord(payload.id || payload.applicationId)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      approveAssetManagementApplicationRecord(
        payload.id || payload.applicationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/asset-management-applications\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getAssetManagementApplicationRecord(query.id || query.applicationId)
    data = record ? cloneMockData(record) : { success: false, message: '债项资产入库申请不存在' }
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/page$/.test(url)) {
    data = assetOutboundManagementApplicationPageData(config)
  } else if (
    /\/system\/indebt\/asset-outbound-management-applications\/available-projects$/.test(url)
  ) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectName = String(query.projectName || '').trim()
    const projectNo = String(query.projectNo || '').trim()
    const customerName = String(query.customerName || query.linkedCustomerName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
    const businessContractNo = String(
      query.businessContractNo || query.relatedBusinessContractNo || ''
    ).trim()
    data = cloneMockData(
      assetOutboundManagementAvailableProjects
        .filter((project) => {
          const matchesProjectName = !projectName || project.projectName.includes(projectName)
          const matchesProjectNo = !projectNo || project.projectNo.includes(projectNo)
          const matchesCustomerName = !customerName || project.customerName.includes(customerName)
          const matchesCoreCustomerNo =
            !coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo)
          const matchesBusinessContract =
            !businessContractNo || project.businessContractNo.includes(businessContractNo)
          const hasInProgressApplication = assetOutboundManagementApplicationRecords.some(
            (record) =>
              record.projectId === project.id &&
              (record.phase === 'pending' || record.phase === 'reviewing')
          )
          return (
            project.isEffective &&
            matchesProjectName &&
            matchesProjectNo &&
            matchesCustomerName &&
            matchesCoreCustomerNo &&
            matchesBusinessContract &&
            !hasInProgressApplication
          )
        })
        .map(withAssetOutboundManagementProjectAliases)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/create$/.test(url)) {
    data = cloneMockData(
      createAssetOutboundManagementApplicationRecord(parseMockPayload(config.data))
    )
  } else if (
    /\/system\/indebt\/asset-outbound-management-applications\/update-confirmation$/.test(url)
  ) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateAssetOutboundManagementConfirmationRecord(payload.id || payload.applicationId, payload)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      getAssetOutboundManagementApplicationImages(query.id || query.applicationId) || []
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadAssetOutboundManagementApplicationImage(
        payload.id || payload.applicationId,
        payload.fileName || payload.name
      )
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/opinions$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      getAssetOutboundManagementApplicationOpinions(query.id || query.applicationId) || []
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/flow-records$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      getAssetOutboundManagementApplicationFlowRecords(query.id || query.applicationId) || []
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signAssetOutboundManagementApplicationOpinionRecord(
        payload.id || payload.applicationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(
      batchSubmitAssetOutboundManagementApplicationRecords(ids, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      submitAssetOutboundManagementApplicationRecord(payload.id || payload.applicationId)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      withdrawAssetOutboundManagementApplicationRecord(payload.id || payload.applicationId)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      approveAssetOutboundManagementApplicationRecord(
        payload.id || payload.applicationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getAssetOutboundManagementApplicationRecord(query.id || query.applicationId)
    data = record ? cloneMockData(record) : { success: false, message: '债项资产出库申请不存在' }
  } else if (/\/system\/indebt\/offline-ledger-updates\/page$/.test(url)) {
    data = offlineLedgerUpdatePageData(config)
  } else if (/\/system\/indebt\/offline-ledger-updates\/create$/.test(url)) {
    data = cloneMockData(createOfflineLedgerApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/offline-ledger-updates\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = updateOfflineLedgerApplicationRecord(
      payload.id || payload.applicationId,
      payload
    )
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅待提交的线下台账更新申请可以修改' }
  } else if (/\/system\/indebt\/offline-ledger-updates\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = submitOfflineLedgerApplicationRecord(payload.id || payload.applicationId)
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅待提交的线下台账更新申请可提交，或该申请不存在' }
  } else if (/\/system\/indebt\/offline-ledger-updates\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const record = withdrawOfflineLedgerApplicationRecord(payload.id || payload.applicationId)
    data = record
      ? { success: true, record: cloneMockData(record) }
      : { success: false, message: '仅审查审批中的线下台账更新申请可收回，或该申请不存在' }
  } else if (/\/system\/indebt\/offline-ledger-updates\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getOfflineLedgerApplicationRecord(query.id || query.applicationId)
    data = record ? cloneMockData(record) : { success: false, message: '线下台账更新申请不存在' }
  } else if (/\/system\/indebt\/offline-ledger-updates\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const result = signOfflineLedgerApplicationOpinionRecord(
      payload.id || payload.applicationId,
      payload.opinion || payload.content
    )
    data = result
      ? {
          success: true,
          record: cloneMockData(result.record),
          opinion: cloneMockData(result.opinion)
        }
      : { success: false, message: '请填写签署意见，并确认线下台账更新申请存在' }
  } else if (/\/system\/indebt\/order-contract-ledgers\/projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectNo = String(query.projectNo || '').trim()
    const projectName = String(query.projectName || '').trim()
    const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
    const productPlan = String(query.productPlan || '').trim()
    data = cloneMockData(
      orderContractLedgerProjects.filter((project) => {
        const matchesProjectNo = !projectNo || project.projectNo.includes(projectNo)
        const matchesProjectName = !projectName || project.projectName.includes(projectName)
        const matchesCoreEnterprise =
          !coreEnterpriseName || project.coreEnterpriseName.includes(coreEnterpriseName)
        const matchesCoreCustomer =
          !coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo)
        const matchesProductPlan = !productPlan || project.productPlan === productPlan
        return (
          matchesProjectNo &&
          matchesProjectName &&
          matchesCoreEnterprise &&
          matchesCoreCustomer &&
          matchesProductPlan
        )
      })
    )
  } else if (/\/system\/indebt\/order-contract-ledgers\/page$/.test(url)) {
    data = orderContractLedgerPageData(config)
  } else if (/\/system\/indebt\/order-contract-ledgers\/asset-items$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getOrderContractLedgerAssetItems(query.id || query.ledgerId))
  } else if (/\/system\/indebt\/order-contract-ledgers\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getOrderContractLedgerRecord(query.id || query.ledgerId)
    data = record ? cloneMockData(record) : { success: false, message: '订单/合同台账不存在' }
  } else if (/\/system\/indebt\/asset-ledgers\/projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const productPlan = String(query.productPlan || '').trim()
    const projectNo = String(query.projectNo || '').trim()
    const projectName = String(query.projectName || '').trim()
    const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || '').trim()
    data = cloneMockData(
      assetLedgerProjects.filter(
        (project) =>
          (!productPlan || project.productPlan === productPlan) &&
          (!projectNo || project.projectNo.includes(projectNo)) &&
          (!projectName || project.projectName.includes(projectName)) &&
          (!coreEnterpriseName || project.coreEnterpriseName.includes(coreEnterpriseName)) &&
          (!coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo))
      )
    )
  } else if (/\/system\/indebt\/asset-ledgers\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const keyword = (field: keyof typeof query) => String(query[field] || '').trim()
    const list = assetLedgerRecords.filter(
      (record) =>
        (!query.projectId || Number(query.projectId) === record.projectId) &&
        (!query.status || query.status === record.status) &&
        (!query.productPlan ||
          assetLedgerProjects.find((p) => p.id === record.projectId)?.productPlan ===
            query.productPlan) &&
        (!keyword('customerName') || record.customerName.includes(keyword('customerName'))) &&
        (!keyword('coreCustomerNo') || record.coreCustomerNo.includes(keyword('coreCustomerNo'))) &&
        (!keyword('relatedBusinessContractNo') ||
          record.relatedBusinessContractNo.includes(keyword('relatedBusinessContractNo'))) &&
        (!keyword('productCode') || record.productCode.includes(keyword('productCode'))) &&
        (!keyword('productName') || record.productName.includes(keyword('productName'))) &&
        (!keyword('orderContractNo') ||
          record.orderContractNo.includes(keyword('orderContractNo'))) &&
        (!keyword('orderContractFlowNo') ||
          record.orderContractFlowNo.includes(keyword('orderContractFlowNo')))
    )
    data = cloneMockData({
      total: list.length,
      list,
      records: list,
      pageNo: 1,
      pageSize: list.length || 10
    })
  } else if (/\/system\/indebt\/offline-ledgers\/projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const productPlan = String(query.productPlan || '').trim()
    const projectNo = String(query.projectNo || '').trim()
    const projectName = String(query.projectName || '').trim()
    const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || '').trim()
    data = cloneMockData(
      offlineLedgerQueryProjects.filter(
        (project) =>
          (!productPlan || project.productPlan === productPlan) &&
          (!projectNo || project.projectNo.includes(projectNo)) &&
          (!projectName || project.projectName.includes(projectName)) &&
          (!coreEnterpriseName || project.coreEnterpriseName.includes(coreEnterpriseName)) &&
          (!coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo))
      )
    )
  } else if (/\/system\/indebt\/offline-ledgers\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const list = offlineLedgerQueryRecords.filter(
      (record) =>
        (!query.projectId || record.projectId === Number(query.projectId)) &&
        (!query.status || record.status === query.status)
    )
    data = cloneMockData({ total: list.length, list, records: list })
  } else if (/\/system\/indebt\/asset-risk-ledgers\/projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectNo = String(query.projectNo || '').trim()
    const projectName = String(query.projectName || '').trim()
    const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || '').trim()
    data = cloneMockData(
      assetRiskLedgerProjects.filter(
        (project) =>
          (!projectNo || project.projectNo.includes(projectNo)) &&
          (!projectName || project.projectName.includes(projectName)) &&
          (!coreEnterpriseName || project.coreEnterpriseName.includes(coreEnterpriseName)) &&
          (!coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo))
      )
    )
  } else if (/\/system\/indebt\/asset-risk-ledgers\/customer-page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      assetRiskCustomerLedgers.filter(
        (record) => !query.projectId || record.projectId === Number(query.projectId)
      )
    )
  } else if (/\/system\/indebt\/asset-risk-ledgers\/contract-page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(
      assetRiskContractLedgers.filter(
        (record) => !query.projectId || record.projectId === Number(query.projectId)
      )
    )
  } else if (/\/system\/indebt\/debt-rules\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const source =
      query.type === 'supplementApproval'
        ? debtRuleApprovalRecords
        : query.type === 'ruleMaintenance'
          ? debtRuleMaintenanceRecords
          : query.type === 'ruleLibrary'
            ? debtRuleLibraryRecords
            : debtRuleSupplementRecords
    data = cloneMockData(
      source.filter(
        (record) =>
          (!query.status || record.status === query.status) &&
          (!query.productPlan || record.productPlan === query.productPlan)
      )
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/records\/page$/.test(url)) {
    data = orderContractModificationPageData(config, 'records')
  } else if (/\/system\/indebt\/order-contract-modifications\/page$/.test(url)) {
    data = orderContractModificationPageData(config, 'active')
  } else if (/\/system\/indebt\/order-contract-modifications\/available-contracts$/.test(url)) {
    data = cloneMockData(
      availableOrderContractRecords.filter((record) => record.contractStatus === '有效')
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/create$/.test(url)) {
    data = cloneMockData(createOrderContractModificationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/order-contract-modifications\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const node = query.node === 'records' ? 'records' : 'active'
    const record = getOrderContractModificationByNode(query.id || query.modificationId, node)
    data = record ? cloneMockData(record) : { success: false, message: '债项数据修改申请不存在' }
  } else if (/\/system\/indebt\/order-contract-modifications\/items\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateOrderContractModificationItems(payload.modificationId || payload.id, payload.items)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/item\/create$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      createOrderContractModificationItem(payload.modificationId || payload.id, payload)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/item\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateOrderContractModificationItem(
        payload.modificationId || payload.id,
        payload.itemId,
        payload
      )
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/item\/delete$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      deleteOrderContractModificationItem(payload.modificationId || payload.id, payload.itemId)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const node = query.node === 'records' ? 'records' : 'active'
    data = cloneMockData(
      getOrderContractModificationImages(query.modificationId || query.id, node) || []
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadOrderContractModificationImage(
        payload.modificationId || payload.id,
        payload.name || payload.fileName
      )
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signOrderContractModificationOpinion(
        payload.id || payload.modificationId,
        payload.opinion || payload.content
      )
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(
      batchSubmitOrderContractModificationRecords(ids, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      submitOrderContractModificationRecord(payload.id || payload.modificationId)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/invalidate$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      invalidateOrderContractModificationRecord(payload.id || payload.modificationId)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/delete$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      deleteOrderContractModificationRecord(payload.id || payload.modificationId)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateOrderContractModificationRecord(payload.id || payload.modificationId, payload)
    )
  } else if (/\/system\/big-supply\/electron\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = {
      serialNo: query.serialNo || 'SCF202607200001',
      certID: '91330201MA2J5K8X6Q',
      customerName: '华东供应链有限公司',
      mfCustomerID: 'C202607200001',
      applySum: '1,200,000.00',
      termMonth: '12个月',
      occurTypeName: '新增',
      contractNo: 'HT202607200001',
      channelSource: '手机银行',
      isRelWhiteListName: '是',
      inputDate: '2026-09-04 09:30:00',
      passTime: '2026-09-04 10:15:00',
      applyStatus: '待审批',
      baSerial: 'BA202609040001',
      bcSerial: 'BC202609040001',
      invalidTime: '2026-10-04 23:59:59'
    }
  } else if (/\/system\/big-supply\/application\/(?:credit-apply-pending|credit-apply-processed|credit-apply-failure|put-out-apply-effective|put-out-apply-failure|put-out-apply-cancel)$/.test(url)) {
    const isPutOut = /put-out-apply/.test(url)
    const rows = [
      {
        serialNo: isPutOut ? 'BP202609040001' : 'CA202609040001', borrowerType: '企业法人',
        certId: '91330200MA2J8X6M3Q', borrowerName: '宁波华联供应链有限公司',
        customerName: '宁波华联供应链有限公司', mfCustomerID: 'C202609040001',
        inputDate: '2026-09-04 09:20:00', passTime: '2026-09-04 10:05:00',
        invalidDate: '2026-10-04 23:59:59', applyStatus: /processed/.test(url) ? '已进件' : '待进件',
        baNo: 'BA202609040001', bcNo: 'BC202609040001', loanChannelNo: 'QD-BP-202609040001',
        bcSerialNo: 'BCT202609040001', businessSum: 3200000, termMonth: 6, termDay: 0,
        bpApplyDate: '2026-09-04', applyEffectDate: '2026-09-30', accountNo: '6217000012345678',
        openCustomerName: '宁波华联供应链有限公司', openBankNo: '313332000001',
        openBankName: '宁波通商银行营业部', bpSerialNo: 'CZ202609040001', status: '有效',
        haidaTransSumOfYear: 26800000, haidaRecommendSum: 5000000, haidaRecommendRate: '3.65%',
        haidaDealerType: '核心经销商'
      },
      {
        serialNo: isPutOut ? 'BP202609040002' : 'CA202609040002', borrowerType: '企业法人',
        certId: '91330100MA2B0P9R7W', borrowerName: '杭州恒通贸易有限公司',
        customerName: '杭州恒通贸易有限公司', mfCustomerID: 'C202609040002',
        inputDate: '2026-09-04 08:40:00', passTime: '2026-09-04 09:35:00',
        invalidDate: '2026-10-04 23:59:59', applyStatus: /processed/.test(url) ? '已进件' : '待进件',
        baNo: 'BA202609040002', bcNo: 'BC202609040002', loanChannelNo: 'QD-BP-202609040002',
        bcSerialNo: 'BCT202609040002', businessSum: 1800000, termMonth: 3, termDay: 0,
        bpApplyDate: '2026-09-04', applyEffectDate: '2026-09-25', accountNo: '6217000098765432',
        openCustomerName: '杭州恒通贸易有限公司', openBankNo: '313331000002',
        openBankName: '宁波通商银行杭州分行', bpSerialNo: 'CZ202609040002', status: '有效',
        haidaTransSumOfYear: 15600000, haidaRecommendSum: 2800000, haidaRecommendRate: '3.75%',
        haidaDealerType: '重点经销商'
      }
    ]
    data = { total: rows.length, list: rows, records: rows }
  } else if (/\/system\/big-supply\/not-passed\/(?:notice|can-add-credit|can-add-bp)$/.test(url)) {
    const rows = [
      { serialNo: 'NP202609040001', customerName: '华东供应链有限公司', customerId: 'C202607200001', businessSum: 1200000, projectName: '核心企业供应链融资项目', unPassResult: '影像资料缺少最新购销合同', updateDate: '2026-09-04 10:20:00' },
      { serialNo: 'NP202609040002', customerName: '新城贸易有限公司', customerId: 'C202607190002', businessSum: 860000, projectName: '经销商融资项目', unPassResult: '申请金额与合同金额不一致', updateDate: '2026-09-04 09:45:00' }
    ]
    data = { total: rows.length, list: rows, records: rows }
  } else if (/\/system\/crRule\/query\/varAndConst$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ruleId = String(payload.ruleId || 'R001')
    const rows = [
      { id: 'RV001', ruleId, variablesId: 'V001', variablesGroupId: 'VG001', variablesName: '合同剩余可用金额', variablesKey: 'contractAvailableAmount', argType: 'V' },
      { id: 'RV002', ruleId, variablesId: 'V002', variablesGroupId: 'VG002', variablesName: '当前库存数量', variablesKey: 'inventoryQuantity', argType: 'V' },
      { id: 'RV003', ruleId, variablesId: 'V003', variablesGroupId: 'VG003', variablesName: '最新市场单价', variablesKey: 'latestMarketPrice', argType: 'V' }
    ]
    data = { total: rows.length, list: rows, records: rows, crRuleVarConsts: rows, crDtRelaReqList: [] }
  } else if (/\/system\/crRule\/list$/.test(url)) {
    const rows = [
      { id: 'R001', ruleType: 'A', ruleGroup: '0', ruleName: '合同有效性校验', ruleExpression: '合同状态=有效 AND 剩余可用金额>0', ruleStatus: '1' },
      { id: 'R002', ruleType: 'B', ruleGroup: '0', ruleName: '存货资产准入校验', ruleExpression: '商品分类已配置 AND 仓库状态=有效', ruleStatus: '1' },
      { id: 'R003', ruleType: 'C', ruleGroup: '0', ruleName: '价格跌幅预警', ruleExpression: '最新单价/入库单价<0.9', ruleStatus: '1' }
    ]
    data = { total: rows.length, list: rows, records: rows }
  } else if (/\/(?:system|indebt)\/crVariablesGroup\/list$/.test(url)) {
    const rows = [
      { id: 'VG001', variablesGroupName: 'CONTRACT', variablesGroupCode: '合同基础因子', variablesOrigin: '1', ruleType: 'A' },
      { id: 'VG002', variablesGroupName: 'INVENTORY', variablesGroupCode: '存货资产因子', variablesOrigin: '2', ruleType: 'B' },
      { id: 'VG003', variablesGroupName: 'PRICE', variablesGroupCode: '价格监测因子', variablesOrigin: '3', ruleType: 'C' }
    ]
    data = { total: rows.length, list: rows, records: rows }
  } else if (/\/(?:system|indebt)\/crVariables\/list$/.test(url)) {
    const rows = [
      { id: 'V001', variablesName: '合同剩余可用金额', variablesKey: 'contractAvailableAmount', variablesGroupId: 'VG001', variablesType: 'N', variablesOrigin: '1' },
      { id: 'V002', variablesName: '当前库存数量', variablesKey: 'inventoryQuantity', variablesGroupId: 'VG002', variablesType: 'N', variablesOrigin: '2' },
      { id: 'V003', variablesName: '最新市场单价', variablesKey: 'latestMarketPrice', variablesGroupId: 'VG003', variablesType: 'N', variablesOrigin: '3' }
    ]
    data = { total: rows.length, list: rows, records: rows }
  } else if (/\/bpm\/category\/simple-list$/.test(url)) {
    data = [
      { id: 1, name: '项目管理', code: 'project', status: 0, sort: 1 },
      { id: 2, name: '债项管理', code: 'indebt', status: 0, sort: 2 },
      { id: 3, name: '客户管理', code: 'customer', status: 0, sort: 3 }
    ]
  } else if (/\/bpm\/model\/list$/.test(url)) {
    data = [
      { id: 1, key: 'project_coreview', name: '项目协审流程', categoryName: '项目管理', status: 0 },
      { id: 2, key: 'indebt_inbound', name: '债项资产入库流程', categoryName: '债项管理', status: 0 },
      { id: 3, key: 'customer_change', name: '客户信息变更流程', categoryName: '客户管理', status: 0 }
    ]
  } else if (/\/bpm\/process-definition\/simple-list$/.test(url)) {
    data = [
      { id: 'PD-001', key: 'project_coreview', name: '项目协审流程' },
      { id: 'PD-002', key: 'indebt_inbound', name: '债项资产入库流程' },
      { id: 'PD-003', key: 'customer_change', name: '客户信息变更流程' }
    ]
  } else if (/\/bpm\/task\/(?:todo-page|done-page)$/.test(url)) {
    const done = /done-page$/.test(url)
    const now = Date.now()
    const rows = [0, 1, 2].map((index) => ({
      id: `${done ? 'DONE' : 'TODO'}-20260904-00${index + 1}`,
      name: done ? '审批完成' : ['资料审查', '业务复核', '合规审批'][index],
      status: done ? 2 : 1,
      reason: done ? '资料完整，同意办理' : '',
      createTime: now - (index + 1) * 3600000,
      endTime: done ? now - index * 1800000 : undefined,
      durationInMillis: (index + 1) * 1800000,
      processInstanceId: `PI-20260904-00${index + 1}`,
      processDefinition: { id: `PD-00${index + 1}`, name: ['项目协审流程', '债项资产入库流程', '客户信息变更流程'][index] },
      processInstance: {
        id: `PI-20260904-00${index + 1}`,
        name: ['项目协审申请', '债项资产入库申请', '客户信息变更申请'][index],
        summary: [
          { key: '业务编号', value: ['SC202609040001', 'AMA202609040001', 'CC202609040001'][index] },
          { key: '客户名称', value: ['华东供应链有限公司', '宁波钢贸有限公司', '上海智造科技有限公司'][index] }
        ],
        startUser: { nickname: ['张晨', '李敏', '王磊'][index] },
        createTime: now - (index + 2) * 3600000
      }
    }))
    data = { total: rows.length, list: rows }
  } else if (/\/bpm\/process-instance\/my-page$/.test(url)) {
    const now = Date.now()
    const rows = [
      { id: 'PI-20260904-001', name: '项目协审申请', categoryName: '项目管理', status: 1, summary: [{ key: '协审编号', value: 'SC202609040001' }], startUser: { nickname: '本地演示用户' }, createTime: now - 7200000, tasks: [{ name: '资料审查', assigneeUser: { nickname: '张晨' } }] },
      { id: 'PI-20260903-002', name: '债项资产入库申请', categoryName: '债项管理', status: 2, summary: [{ key: '申请编号', value: 'AMA202609030002' }], startUser: { nickname: '本地演示用户' }, createTime: now - 86400000, endTime: now - 3600000, tasks: [] }
    ]
    data = { total: rows.length, list: rows }
  } else if (/captcha\/(get|check)$/.test(url)) {
    data = { repCode: '0000', repMsg: '校验成功', uuid: 'mock-captcha', captchaType: 'blockPuzzle' }
  } else if (
    /auth\/logout|\/create$|\/update$|\/delete$|\/save|\/submit|\/cancel|\/approve|\/reject|\/withdraw|\/add$|\/edit$|\/upload/i.test(
      url
    )
  ) {
    data =
      typeof config.data === 'object' && config.data
        ? { id: (config.data as { id?: number }).id || Date.now(), ...(config.data as object) }
        : true
  } else if (isPage(url)) {
    data = pageData(config)
  } else if (isOptionList(url)) {
    data = optionData
  } else if (isDetail(url)) {
    data = detailData(config)
  } else {
    data = { success: true, ...detailData(config) }
  }

  const response: AxiosResponse = {
    data: { code: 200, msg: 'mock success', data },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: { responseType: config.responseType }
  }
  return response
}
