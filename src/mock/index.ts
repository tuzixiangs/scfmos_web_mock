import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { dashboardTabs, dashboardTasks, dictData, optionData, pageRecords, permissionInfo } from './data'
import {
  createInventoryGoodsRecord,
  inventoryGoodsRecords,
  markInventoryGoodsHistory
} from './inventory-goods'
import { projectCreditApplyRecords, projectCreditDetail } from './project-credit-detail'
import {
  createWarehouseApplicationRecord,
  getWarehouseApplicationRecord,
  signWarehouseApplicationOpinionRecord,
  submitWarehouseApplicationRecord,
  withdrawWarehouseApplicationRecord,
  warehouseApplicationRecords
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
import { assetRiskContractLedgers, assetRiskCustomerLedgers, assetRiskLedgerProjects } from './asset-risk-ledger-query'
import { debtRuleApprovalRecords, debtRuleLibraryRecords, debtRuleMaintenanceRecords, debtRuleSupplementRecords } from './debt-rule-management'

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))
const urlPath = (url = '') => url.split('?')[0].replace(/^https?:\/\/[^/]+/, '')
const urlQuery = (url = '') => Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''))
const isPage = (url: string) => /(?:^|\/)(?:page|.*Page)$|\/page\//i.test(url)
const isOptionList = (url: string) => /simple-list|\/all$|select|query.*list|menu|tree|codeLibrary|dictionary|dict-data/i.test(url)
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
    window.sessionStorage.setItem(projectCreditDetailCacheKey, JSON.stringify(projectCreditDetailCache))
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

const pageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Number(query.pageNo || query.pageNum || 1)
  const pageSize = Number(query.pageSize || 10)
  const list = pageRecords.map((item, index) => ({ ...item, id: item.id + (pageNo - 1) * pageSize + index }))
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

const inventoryPriceApplicationPageData = (config: AxiosRequestConfig) => {
  const query = { ...urlQuery(config.url), ...(config.params || {}) }
  const pageNo = Math.max(1, Number(query.pageNo || query.pageNum || 1))
  const pageSize = Math.max(1, Number(query.pageSize || 20))
  const phase = String(query.phase || '').trim()
  const status = String(query.status || query.applicationStatus || '').trim()
  const applicationNo = String(query.applicationNo || query.applyNo || query.serialNo || '').trim()
  const projectNo = String(query.projectNo || '').trim()
  const projectName = String(query.projectName || '').trim()
  const smallCategory = String(query.smallCategory || '').trim()
  const origin = String(query.origin || '').trim()
  const filtered = inventoryPriceApplicationRecords.filter((record) => {
    const matchesPhase = !phase || record.phase === phase
    const matchesStatus = !status || record.status === status
    const matchesApplicationNo = !applicationNo || record.applicationNo.includes(applicationNo)
    const matchesProjectNo = !projectNo || record.projectNo.includes(projectNo)
    const matchesProjectName = !projectName || record.projectName.includes(projectName)
    const matchesSmallCategory = !smallCategory || record.smallCategory.includes(smallCategory)
    const matchesOrigin = !origin || record.origin.includes(origin)
    return (
      matchesPhase &&
      matchesStatus &&
      matchesApplicationNo &&
      matchesProjectNo &&
      matchesProjectName &&
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
    const matchesBusinessContract =
      !relatedBusinessContractNo || record.relatedBusinessContractNo.includes(relatedBusinessContractNo)
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
    const matchesBusinessContract =
      !relatedBusinessContractNo || record.relatedBusinessContractNo.includes(relatedBusinessContractNo)
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
      !relatedBusinessContractNo || record.relatedBusinessContractNo.includes(relatedBusinessContractNo)
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
      !relatedBusinessContractNo || record.relatedBusinessContractNo.includes(relatedBusinessContractNo)
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
  const businessContractNo = String(query.businessContractNo || '').trim()
  const contractStatus = String(query.contractStatus || '').trim()
  const modificationStatus = String(query.modificationStatus || '').trim()
  const source = node === 'records' ? orderContractModificationHistoryRecords : orderContractModificationRecords
  const filtered = source.filter((record) => {
    const matchesFlowNo = !applicationFlowNo || record.applicationFlowNo.includes(applicationFlowNo)
    const matchesContractNo = !orderContractNo || record.orderContractNo.includes(orderContractNo)
    const matchesCustomerName = !customerName || record.customerName.includes(customerName)
    const matchesCoreCustomerNo = !coreCustomerNo || record.coreCustomerNo.includes(coreCustomerNo)
    const matchesBusinessContractNo = !businessContractNo || record.businessContractNo.includes(businessContractNo)
    const matchesContractStatus = !contractStatus || record.contractStatus === contractStatus
    const matchesModificationStatus = !modificationStatus || record.modificationStatus === modificationStatus
    return (
      matchesFlowNo &&
      matchesContractNo &&
      matchesCustomerName &&
      matchesCoreCustomerNo &&
      matchesBusinessContractNo &&
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
      data: new Blob(['供应链金融管理作业平台 Mock 导出数据\n'], { type: 'text/plain;charset=utf-8' }),
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      config,
      request: { responseType: 'blob' }
    }
  }

  let data: unknown
  if (/\/system\/auth\/login$|\/sms-login$/.test(url)) {
    data = { id: 1, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', userId: 1, userType: 1, clientId: 'mock-web-client', expiresTime: Date.now() + 24 * 60 * 60 * 1000 }
  } else if (/\/system\/auth\/get-permission-info$/.test(url)) {
    data = permissionInfo
  } else if (/\/system\/dict-data\/simple-list$/.test(url)) {
    data = dictData
  } else if (/\/system\/index\/allCount$/.test(url)) {
    data = 0
  } else if (/\/system\/index\/getWaitDealQueryListGroup$/.test(url)) {
    data = dashboardTabs
  } else if (/\/system\/index\/getWaitDealQueryListGroupWithCount$/.test(url)) {
    const attribute6 = String(urlQuery(config.url).attribute6 || config.params?.attribute6 || '')
    data = { count: attribute6 === 'credit' || attribute6 === 'contract' ? 1 : 2 }
  } else if (/\/system\/index\/getWaitDealQueryListByAttribute$/.test(url)) {
    const attribute6 = String(urlQuery(config.url).attribute6 || config.params?.attribute6 || '')
    const list = attribute6 ? dashboardTasks.filter((item) => item.attribute6 === attribute6) : dashboardTasks
    data = { total: list.length, list }
  } else if (/\/system\/index\/mock-credit-pending$/.test(url)) {
    data = [{ name: '华东供应链有限公司 授信申请 SCF202607200001', serialNo: 'SCF202607200001' }]
  } else if (/\/system\/index\/mock-contract-pending$/.test(url)) {
    data = [{ name: '新城贸易有限公司 合同审批 HT202607190002', serialNo: 'HT202607190002' }]
  } else if (/\/system\/index\/getWorkMessage$/.test(url)) {
    data = [{ businessRemindGroup: '项目即将到期', businessRemindGroupNum: 1, attribute5: '请及时处理项目续期' }]
  } else if (/\/system\/index\/getNoticeMessage$/.test(url)) {
    data = [{ title: 'Mock 演示数据已启用', businessRemindGroup: '系统提示', itemno: 'NOTICE001' }]
  } else if (/\/system\/credit-apply\/todolist$/.test(url)) {
    data = {
      total: 2,
      list: [
        { serialNo: 'SCF202607200001', customerID: 'C202607200001', customerName: '华东供应链有限公司', mrchFlg: '直营网银', businessTypeName: '供应链流动资金贷款', virtualOccurTypeName: '新增', applyModelTypeName: '授信审批', currencyName: '人民币', businessSum: 1200000, sourceFrom: '供应链金融平台', operateUserName: '张晨', operateOrgName: '总行供应链金融部', flowName: '授信申请流程', phaseName: '待审批', endTime: '', projectName: '核心企业供应链金融项目', objectType: 'CreditApply', phaseNo: '1020' },
        { serialNo: 'SCF202607190002', customerID: 'C202607190002', customerName: '新城贸易有限公司', mrchFlg: '线下录入', businessTypeName: '经销商融资', virtualOccurTypeName: '续作', applyModelTypeName: '授信审批', currencyName: '人民币', businessSum: 800000, sourceFrom: '客户经理录入', operateUserName: '李敏', operateOrgName: '上海分行', flowName: '授信申请流程', phaseName: '待审批', endTime: '', projectName: '经销商融资项目', objectType: 'CreditApply', phaseNo: '1020' }
      ]
    }
  } else if (/\/system\/creditLimitApply\/qryApplyListPage$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const pageNo = Number(query.pageNo || query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    data = {
      total: projectCreditApplyRecords.length,
      list: projectCreditApplyRecords,
      records: projectCreditApplyRecords,
      pageNo,
      pageSize
    }
  } else if (/\/system\/creditLimitApply\/saveProjectDetail$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const serialNo = String(payload.serialNo || projectCreditDetail.applicationNo)
    const savedDetail = cloneMockData(
      projectCreditDetailCache[serialNo] || (projectCreditDetail as unknown as Recordable)
    )
    const basicFields = Array.isArray(payload.basicFields) ? cloneMockData(payload.basicFields) : undefined

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
    const projectDetail = projectCreditDetailCache[detailKey] || (projectCreditDetail as unknown as Recordable)
    data = {
      ...cloneMockData(projectDetail),
      applicationNo: detailKey
    }
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
    data = record
      ? cloneMockData(record)
      : { success: false, message: '仓库建立申请不存在' }
  } else if (/\/system\/indebt\/warehouse-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const result = signWarehouseApplicationOpinionRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
    data = result
      ? { success: true, record: cloneMockData(result.record), opinion: cloneMockData(result.opinion) }
      : { success: false, message: '请填写签署意见，并确认仓库建立申请存在' }
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
          (record) => record.projectId === project.id && (record.phase === 'pending' || record.phase === 'reviewing')
        )
        return matchesProjectNo && matchesProjectName && matchesCoreEnterprise && !hasPendingApplication
      })
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/create$/.test(url)) {
    data = cloneMockData(createInventoryPriceApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/inventory-price-applications\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(updateInventoryPriceApplicationRecord(payload.id || payload.applicationId, payload))
  } else if (/\/system\/indebt\/inventory-price-applications\/excel\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadInventoryPriceExcelRecord(payload.id || payload.applicationId, payload.fileName || payload.name)
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
      uploadInventoryPriceApplicationImage(payload.id || payload.applicationId, payload.fileName || payload.name)
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signInventoryPriceApplicationOpinion(payload.id || payload.applicationId, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(batchSubmitInventoryPriceApplicationRecords(ids, payload.opinion || payload.content))
  } else if (/\/system\/indebt\/inventory-price-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(submitInventoryPriceApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/inventory-price-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(withdrawInventoryPriceApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/inventory-price-applications\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      approveInventoryPriceApplicationRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/inventory-price-applications\/trend$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const trend = getInventoryPriceTrendData(query.id || query.applicationId, query.itemId)
    data = trend ? cloneMockData(trend) : { success: false, message: '价格盯市申请或商品维护行不存在' }
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
    const businessContractNo = String(query.businessContractNo || query.relatedBusinessContractNo || '').trim()
    data = cloneMockData(
      assetArrivalAvailableProjects.filter((project) => {
        const matchesProjectName = !projectName || project.projectName.includes(projectName)
        const matchesProjectNo = !projectNo || project.projectNo.includes(projectNo)
        const matchesCustomerName = !customerName || project.customerName.includes(customerName)
        const matchesCoreCustomerNo = !coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo)
        const matchesBusinessContract = !businessContractNo || project.businessContractNo.includes(businessContractNo)
        const hasInProgressApplication = assetArrivalApplicationRecords.some(
          (record) => record.projectId === project.id && (record.phase === 'pending' || record.phase === 'reviewing')
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
      }).map(withAssetArrivalProjectAliases)
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/create$/.test(url)) {
    data = cloneMockData(createAssetArrivalApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/asset-arrival-applications\/update-confirmation$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(updateAssetArrivalConfirmationRecord(payload.id || payload.applicationId, payload))
  } else if (/\/system\/indebt\/asset-arrival-applications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetArrivalApplicationImages(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-arrival-applications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadAssetArrivalApplicationImage(payload.id || payload.applicationId, payload.fileName || payload.name)
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/opinions$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetArrivalApplicationOpinions(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-arrival-applications\/flow-records$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetArrivalApplicationFlowRecords(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-arrival-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signAssetArrivalApplicationOpinionRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/asset-arrival-applications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(batchSubmitAssetArrivalApplicationRecords(ids, payload.opinion || payload.content))
  } else if (/\/system\/indebt\/asset-arrival-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(submitAssetArrivalApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/asset-arrival-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(withdrawAssetArrivalApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/asset-arrival-applications\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      approveAssetArrivalApplicationRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
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
    const businessContractNo = String(query.businessContractNo || query.relatedBusinessContractNo || '').trim()
    data = cloneMockData(
      assetManagementAvailableProjects.filter((project) => {
        const matchesProjectName = !projectName || project.projectName.includes(projectName)
        const matchesProjectNo = !projectNo || project.projectNo.includes(projectNo)
        const matchesCustomerName = !customerName || project.customerName.includes(customerName)
        const matchesCoreCustomerNo = !coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo)
        const matchesBusinessContract = !businessContractNo || project.businessContractNo.includes(businessContractNo)
        const hasInProgressApplication = assetManagementApplicationRecords.some(
          (record) => record.projectId === project.id && (record.phase === 'pending' || record.phase === 'reviewing')
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
      }).map(withAssetManagementProjectAliases)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/create$/.test(url)) {
    data = cloneMockData(createAssetManagementApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/asset-management-applications\/update-confirmation$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(updateAssetManagementConfirmationRecord(payload.id || payload.applicationId, payload))
  } else if (/\/system\/indebt\/asset-management-applications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetManagementApplicationImages(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-management-applications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadAssetManagementApplicationImage(payload.id || payload.applicationId, payload.fileName || payload.name)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/opinions$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetManagementApplicationOpinions(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-management-applications\/flow-records$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetManagementApplicationFlowRecords(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-management-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signAssetManagementApplicationOpinionRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(batchSubmitAssetManagementApplicationRecords(ids, payload.opinion || payload.content))
  } else if (/\/system\/indebt\/asset-management-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(submitAssetManagementApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/asset-management-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(withdrawAssetManagementApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/asset-management-applications\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      approveAssetManagementApplicationRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/asset-management-applications\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getAssetManagementApplicationRecord(query.id || query.applicationId)
    data = record ? cloneMockData(record) : { success: false, message: '债项资产入库申请不存在' }
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/page$/.test(url)) {
    data = assetOutboundManagementApplicationPageData(config)
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/available-projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectName = String(query.projectName || '').trim()
    const projectNo = String(query.projectNo || '').trim()
    const customerName = String(query.customerName || query.linkedCustomerName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || query.customerNo || '').trim()
    const businessContractNo = String(query.businessContractNo || query.relatedBusinessContractNo || '').trim()
    data = cloneMockData(
      assetOutboundManagementAvailableProjects.filter((project) => {
        const matchesProjectName = !projectName || project.projectName.includes(projectName)
        const matchesProjectNo = !projectNo || project.projectNo.includes(projectNo)
        const matchesCustomerName = !customerName || project.customerName.includes(customerName)
        const matchesCoreCustomerNo = !coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo)
        const matchesBusinessContract = !businessContractNo || project.businessContractNo.includes(businessContractNo)
        const hasInProgressApplication = assetOutboundManagementApplicationRecords.some(
          (record) => record.projectId === project.id && (record.phase === 'pending' || record.phase === 'reviewing')
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
      }).map(withAssetOutboundManagementProjectAliases)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/create$/.test(url)) {
    data = cloneMockData(createAssetOutboundManagementApplicationRecord(parseMockPayload(config.data)))
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/update-confirmation$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(updateAssetOutboundManagementConfirmationRecord(payload.id || payload.applicationId, payload))
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetOutboundManagementApplicationImages(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadAssetOutboundManagementApplicationImage(payload.id || payload.applicationId, payload.fileName || payload.name)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/opinions$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetOutboundManagementApplicationOpinions(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/flow-records$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(getAssetOutboundManagementApplicationFlowRecords(query.id || query.applicationId) || [])
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signAssetOutboundManagementApplicationOpinionRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(batchSubmitAssetOutboundManagementApplicationRecords(ids, payload.opinion || payload.content))
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(submitAssetOutboundManagementApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/withdraw$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(withdrawAssetOutboundManagementApplicationRecord(payload.id || payload.applicationId))
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/approve$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      approveAssetOutboundManagementApplicationRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/asset-outbound-management-applications\/detail$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const record = getAssetOutboundManagementApplicationRecord(query.id || query.applicationId)
    data = record ? cloneMockData(record) : { success: false, message: '债项资产出库申请不存在' }
  } else if (/\/system\/indebt\/offline-ledger-updates\/page$/.test(url)) {
    data = offlineLedgerUpdatePageData(config)
  } else if (/\/system\/indebt\/offline-ledger-updates\/create$/.test(url)) {
    data = cloneMockData(createOfflineLedgerApplicationRecord(parseMockPayload(config.data)))
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
    const result = signOfflineLedgerApplicationOpinionRecord(payload.id || payload.applicationId, payload.opinion || payload.content)
    data = result
      ? { success: true, record: cloneMockData(result.record), opinion: cloneMockData(result.opinion) }
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
        const matchesCoreCustomer = !coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo)
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
      assetLedgerProjects.filter((project) =>
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
    const list = assetLedgerRecords.filter((record) =>
      (!query.projectId || Number(query.projectId) === record.projectId) &&
      (!query.status || query.status === record.status) &&
      (!query.productPlan || assetLedgerProjects.find((p) => p.id === record.projectId)?.productPlan === query.productPlan) &&
      (!keyword('customerName') || record.customerName.includes(keyword('customerName'))) &&
      (!keyword('coreCustomerNo') || record.coreCustomerNo.includes(keyword('coreCustomerNo'))) &&
      (!keyword('relatedBusinessContractNo') || record.relatedBusinessContractNo.includes(keyword('relatedBusinessContractNo'))) &&
      (!keyword('productCode') || record.productCode.includes(keyword('productCode'))) &&
      (!keyword('productName') || record.productName.includes(keyword('productName'))) &&
      (!keyword('orderContractNo') || record.orderContractNo.includes(keyword('orderContractNo'))) &&
      (!keyword('orderContractFlowNo') || record.orderContractFlowNo.includes(keyword('orderContractFlowNo')))
    )
    data = cloneMockData({ total: list.length, list, records: list, pageNo: 1, pageSize: list.length || 10 })
  } else if (/\/system\/indebt\/offline-ledgers\/projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const productPlan = String(query.productPlan || '').trim()
    const projectNo = String(query.projectNo || '').trim()
    const projectName = String(query.projectName || '').trim()
    const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || '').trim()
    data = cloneMockData(offlineLedgerQueryProjects.filter((project) =>
      (!productPlan || project.productPlan === productPlan) &&
      (!projectNo || project.projectNo.includes(projectNo)) &&
      (!projectName || project.projectName.includes(projectName)) &&
      (!coreEnterpriseName || project.coreEnterpriseName.includes(coreEnterpriseName)) &&
      (!coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo))
    ))
  } else if (/\/system\/indebt\/offline-ledgers\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const list = offlineLedgerQueryRecords.filter((record) => !query.projectId || record.projectId === Number(query.projectId))
    data = cloneMockData({ total: list.length, list, records: list })
  } else if (/\/system\/indebt\/asset-risk-ledgers\/projects$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const projectNo = String(query.projectNo || '').trim()
    const projectName = String(query.projectName || '').trim()
    const coreEnterpriseName = String(query.coreEnterpriseName || '').trim()
    const coreCustomerNo = String(query.coreCustomerNo || '').trim()
    data = cloneMockData(assetRiskLedgerProjects.filter((project) =>
      (!projectNo || project.projectNo.includes(projectNo)) &&
      (!projectName || project.projectName.includes(projectName)) &&
      (!coreEnterpriseName || project.coreEnterpriseName.includes(coreEnterpriseName)) &&
      (!coreCustomerNo || project.coreCustomerNo.includes(coreCustomerNo))
    ))
  } else if (/\/system\/indebt\/asset-risk-ledgers\/customer-page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(assetRiskCustomerLedgers.filter((record) => !query.projectId || record.projectId === Number(query.projectId)))
  } else if (/\/system\/indebt\/asset-risk-ledgers\/contract-page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    data = cloneMockData(assetRiskContractLedgers.filter((record) => !query.projectId || record.projectId === Number(query.projectId)))
  } else if (/\/system\/indebt\/debt-rules\/page$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const source = query.type === 'supplementApproval' ? debtRuleApprovalRecords : query.type === 'ruleMaintenance' ? debtRuleMaintenanceRecords : query.type === 'ruleLibrary' ? debtRuleLibraryRecords : debtRuleSupplementRecords
    data = cloneMockData(source.filter((record) =>
      (!query.status || record.status === query.status) &&
      (!query.productPlan || record.productPlan === query.productPlan)
    ))
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
    data = record ? cloneMockData(record) : { success: false, message: '订单/合同信息修改申请不存在' }
  } else if (/\/system\/indebt\/order-contract-modifications\/items\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateOrderContractModificationItems(payload.modificationId || payload.id, payload.items)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/item\/create$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(createOrderContractModificationItem(payload.modificationId || payload.id, payload))
  } else if (/\/system\/indebt\/order-contract-modifications\/item\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      updateOrderContractModificationItem(payload.modificationId || payload.id, payload.itemId, payload)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/item\/delete$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      deleteOrderContractModificationItem(payload.modificationId || payload.id, payload.itemId)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/images$/.test(url)) {
    const query = { ...urlQuery(config.url), ...(config.params || {}) }
    const node = query.node === 'records' ? 'records' : 'active'
    data = cloneMockData(getOrderContractModificationImages(query.modificationId || query.id, node) || [])
  } else if (/\/system\/indebt\/order-contract-modifications\/image\/upload$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      uploadOrderContractModificationImage(payload.modificationId || payload.id, payload.name || payload.fileName)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/sign-opinion$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(
      signOrderContractModificationOpinion(payload.id || payload.modificationId, payload.opinion || payload.content)
    )
  } else if (/\/system\/indebt\/order-contract-modifications\/batch-submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    const ids = Array.isArray(payload.ids) ? payload.ids : []
    data = cloneMockData(batchSubmitOrderContractModificationRecords(ids, payload.opinion || payload.content))
  } else if (/\/system\/indebt\/order-contract-modifications\/submit$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(submitOrderContractModificationRecord(payload.id || payload.modificationId))
  } else if (/\/system\/indebt\/order-contract-modifications\/invalidate$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(invalidateOrderContractModificationRecord(payload.id || payload.modificationId))
  } else if (/\/system\/indebt\/order-contract-modifications\/delete$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(deleteOrderContractModificationRecord(payload.id || payload.modificationId))
  } else if (/\/system\/indebt\/order-contract-modifications\/update$/.test(url)) {
    const payload = parseMockPayload(config.data)
    data = cloneMockData(updateOrderContractModificationRecord(payload.id || payload.modificationId, payload))
  } else if (/captcha\/(get|check)$/.test(url)) {
    data = { repCode: '0000', repMsg: '校验成功', uuid: 'mock-captcha', captchaType: 'blockPuzzle' }
  } else if (/auth\/logout|\/create$|\/update$|\/delete$|\/save|\/submit|\/cancel|\/approve|\/reject|\/withdraw|\/add$|\/edit$|\/upload/i.test(url)) {
    data = typeof config.data === 'object' && config.data ? { id: (config.data as { id?: number }).id || Date.now(), ...(config.data as object) } : true
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
