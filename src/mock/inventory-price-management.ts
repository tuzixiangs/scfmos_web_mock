export type InventoryPriceApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'
export type InventoryPriceApplicationStatus = '待提交' | '审查审批中' | '被否决' | '审批通过'

export interface InventoryPriceProject {
  id: number
  projectName: string
  projectNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productScheme: string
}

export interface InventoryPriceApplicationImage {
  id: number
  name: string
  url: string
  uploadedAt: string
  uploader: string
}

export interface InventoryPriceApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

export interface InventoryPriceItem {
  id: number
  largeCategory: string
  middleCategory: string
  smallCategory: string
  origin: string
  inboundUnitPrice: number
  latestUnitPrice: number
  monitoringUnitPrice: number
  warningRate: number
  warningLine: number
  warningRule: string
  monitoringSource: string
}

export interface InventoryPriceApplicationRecord {
  id: number
  applicationNo: string
  projectId: number
  projectNo: string
  projectName: string
  coreEnterpriseName: string
  coreCustomerNo: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  origin: string
  inboundUnitPrice: number
  latestUnitPrice: number
  monitoringUnitPrice: number
  monitoringSource: string
  applicationDate: string
  phase: InventoryPriceApplicationPhase
  status: InventoryPriceApplicationStatus
  currentStage?: string
  completedAt?: string
  ledgerUpdated?: boolean
  ledgerUpdatedAt?: string
  images: InventoryPriceApplicationImage[]
  opinions: InventoryPriceApplicationOpinion[]
  items: InventoryPriceItem[]
}

export interface InventoryPriceItemPayload {
  id?: number | string
  monitoringUnitPrice?: number | string
  monitoringSource?: string
}

export interface InventoryPriceApplicationUpdatePayload {
  items?: InventoryPriceItemPayload[]
}

export interface InventoryPriceApplicationCreatePayload {
  projectId?: number | string
}

export interface InventoryPriceMutationResult {
  success: boolean
  message?: string
  record?: InventoryPriceApplicationRecord
  updated?: number
  ledgerEntries?: InventoryPriceLedgerEntry[]
}

export interface InventoryPriceLedgerEntry {
  applicationId: number
  applicationNo: string
  itemId: number
  smallCategory: string
  origin: string
  monitoringUnitPrice: number
  updatedAt: string
  updatedBy: string
}

export interface InventoryPriceTrendPoint {
  date: string
  value: number
  label?: string
}

export interface InventoryPriceTrendResult {
  applicationId: number
  itemId: number
  itemName: string
  warningLine: number
  points: InventoryPriceTrendPoint[]
}

export interface InventoryPriceTemplateResult {
  fileName: string
  columns: string[]
  message: string
}

const trim = (value: unknown) => String(value || '').trim()
const numberValue = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const amount = (value: unknown, fallback = 0) => Number(numberValue(value, fallback).toFixed(2))
const now = () => new Date().toLocaleString('sv-SE').replace('T', ' ')
const today = () => now().slice(0, 10)
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const warningRule = (rate: number) => `价格下跌达到${Math.round(rate * 100)}%时触发跌价补偿平衡公式`
const calculateWarningLine = (item: Pick<InventoryPriceItem, 'latestUnitPrice' | 'monitoringUnitPrice' | 'warningRate'>) => {
  const basePrice = item.monitoringUnitPrice > 0 ? item.monitoringUnitPrice : item.latestUnitPrice
  return amount(basePrice * (1 - item.warningRate))
}

const priceItem = (
  data: Omit<InventoryPriceItem, 'warningLine' | 'warningRule'>
): InventoryPriceItem => ({
  ...data,
  warningLine: calculateWarningLine(data),
  warningRule: warningRule(data.warningRate)
})

const refreshSummary = (record: InventoryPriceApplicationRecord) => {
  const primary = record.items[0]
  if (!primary) return
  record.largeCategory = primary.largeCategory
  record.middleCategory = primary.middleCategory
  record.smallCategory = primary.smallCategory
  record.origin = primary.origin
  record.inboundUnitPrice = primary.inboundUnitPrice
  record.latestUnitPrice = primary.latestUnitPrice
  record.monitoringUnitPrice = primary.monitoringUnitPrice
  record.monitoringSource = primary.monitoringSource
}

const record = (
  data: Omit<InventoryPriceApplicationRecord, | 'images' | 'opinions' | 'items' | 'largeCategory' | 'middleCategory' | 'smallCategory' | 'origin' | 'inboundUnitPrice' | 'latestUnitPrice' | 'monitoringUnitPrice' | 'monitoringSource'> & {
    images?: InventoryPriceApplicationImage[]
    opinions?: InventoryPriceApplicationOpinion[]
    items: InventoryPriceItem[]
  }
): InventoryPriceApplicationRecord => {
  const primary = data.items[0]
  const result: InventoryPriceApplicationRecord = {
    ...data,
    largeCategory: primary?.largeCategory || '',
    middleCategory: primary?.middleCategory || '',
    smallCategory: primary?.smallCategory || '',
    origin: primary?.origin || '',
    inboundUnitPrice: primary?.inboundUnitPrice || 0,
    latestUnitPrice: primary?.latestUnitPrice || 0,
    monitoringUnitPrice: primary?.monitoringUnitPrice || 0,
    monitoringSource: primary?.monitoringSource || '',
    images: data.images || [],
    opinions: data.opinions || [],
    items: data.items
  }
  return result
}

/** 新增弹框可选择的有效项目。每个项目都带有一组可维护的商品价格信息。 */
export const inventoryPriceAvailableProjects: InventoryPriceProject[] = [
  {
    id: 1,
    projectName: '钢贸供应链融资项目',
    projectNo: 'PJ202607010001',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    productScheme: '钢材库存质押融资方案'
  },
  {
    id: 2,
    projectName: '金属库存融资项目',
    projectNo: 'PJ202606180006',
    coreEnterpriseName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    productScheme: '有色金属仓单融资方案'
  },
  {
    id: 3,
    projectName: '化工原料仓单融资项目',
    projectNo: 'PJ202605220009',
    coreEnterpriseName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    productScheme: '化工原料质押融资方案'
  },
  {
    id: 4,
    projectName: '粮食收储融资项目',
    projectNo: 'PJ202604280012',
    coreEnterpriseName: '丰禾农业发展有限公司',
    coreCustomerNo: 'C2025041800000027',
    productScheme: '粮食仓单融资方案'
  },
  {
    id: 5,
    projectName: '煤炭库存融资项目',
    projectNo: 'PJ202605080007',
    coreEnterpriseName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    productScheme: '能源库存质押融资方案'
  },
  {
    id: 6,
    projectName: '家电经销商融资项目',
    projectNo: 'PJ202604120015',
    coreEnterpriseName: '臻品家电有限公司',
    coreCustomerNo: 'C2025021100000068',
    productScheme: '家电库存融资方案'
  }
]

const projectItems: Record<number, InventoryPriceItem[]> = {
  1: [
    priceItem({
      id: 101,
      largeCategory: '金属及矿产品',
      middleCategory: '黑色金属',
      smallCategory: '热轧卷板',
      origin: '中国·南京',
      inboundUnitPrice: 4200,
      latestUnitPrice: 4140,
      monitoringUnitPrice: 4100,
      warningRate: 0.1,
      monitoringSource: '上海钢联 Mysteel'
    }),
    priceItem({
      id: 102,
      largeCategory: '金属及矿产品',
      middleCategory: '黑色金属',
      smallCategory: '螺纹钢',
      origin: '中国·南京',
      inboundUnitPrice: 3960,
      latestUnitPrice: 3880,
      monitoringUnitPrice: 3850,
      warningRate: 0.1,
      monitoringSource: '上海钢联 Mysteel'
    })
  ],
  2: [
    priceItem({
      id: 201,
      largeCategory: '金属及矿产品',
      middleCategory: '有色金属',
      smallCategory: '电解铜',
      origin: '中国·上海',
      inboundUnitPrice: 71500,
      latestUnitPrice: 72200,
      monitoringUnitPrice: 72000,
      warningRate: 0.08,
      monitoringSource: '上海有色网 SMM'
    })
  ],
  3: [
    priceItem({
      id: 301,
      largeCategory: '化工产品',
      middleCategory: '基础化工',
      smallCategory: '聚丙烯',
      origin: '中国·常州',
      inboundUnitPrice: 7600,
      latestUnitPrice: 7480,
      monitoringUnitPrice: 7450,
      warningRate: 0.12,
      monitoringSource: '卓创资讯'
    })
  ],
  4: [
    priceItem({
      id: 401,
      largeCategory: '农产品',
      middleCategory: '粮食',
      smallCategory: '稻谷',
      origin: '中国·松原',
      inboundUnitPrice: 1480,
      latestUnitPrice: 1510,
      monitoringUnitPrice: 1500,
      warningRate: 0.08,
      monitoringSource: '国家粮油信息中心'
    })
  ],
  5: [
    priceItem({
      id: 501,
      largeCategory: '能源产品',
      middleCategory: '煤炭',
      smallCategory: '动力煤',
      origin: '中国·唐山',
      inboundUnitPrice: 870,
      latestUnitPrice: 842,
      monitoringUnitPrice: 840,
      warningRate: 0.1,
      monitoringSource: '秦皇岛煤炭网'
    })
  ],
  6: [
    priceItem({
      id: 601,
      largeCategory: '家用电器',
      middleCategory: '生活电器',
      smallCategory: '变频空调',
      origin: '中国·广州',
      inboundUnitPrice: 2850,
      latestUnitPrice: 2780,
      monitoringUnitPrice: 2760,
      warningRate: 0.1,
      monitoringSource: '监管方现场报价'
    })
  ]
}

/**
 * 债项管理 - 存货类价格管理的唯一 Mock 数据源。
 * 每个工作节点均有样例，以便页面切换和按钮流转演示。
 */
export const inventoryPriceApplicationRecords: InventoryPriceApplicationRecord[] = [
  record({
    id: 1,
    applicationNo: 'PMA202607210001',
    projectId: 1,
    projectNo: 'PJ202607010001',
    projectName: '钢贸供应链融资项目',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    applicationDate: '2026-07-21',
    phase: 'pending',
    status: '待提交',
    images: [
      {
        id: 1,
        name: '钢材盯市报价单.pdf',
        url: '/mock-files/inventory-price/steel-price-20260721.pdf',
        uploadedAt: '2026-07-21 09:10:00',
        uploader: '张晨'
      }
    ],
    opinions: [],
    items: clone(projectItems[1])
  }),
  record({
    id: 2,
    applicationNo: 'PMA202607200002',
    projectId: 3,
    projectNo: 'PJ202605220009',
    projectName: '化工原料仓单融资项目',
    coreEnterpriseName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    applicationDate: '2026-07-20',
    phase: 'pending',
    status: '待提交',
    opinions: [
      {
        id: 2,
        content: '已按监管仓最新入库批次完成单价核验。',
        signer: '李敏',
        signedAt: '2026-07-20 14:25:00'
      }
    ],
    items: clone(projectItems[3])
  }),
  record({
    id: 3,
    applicationNo: 'PMA202607180003',
    projectId: 2,
    projectNo: 'PJ202606180006',
    projectName: '金属库存融资项目',
    coreEnterpriseName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    applicationDate: '2026-07-18',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '运营管理部审查',
    opinions: [
      {
        id: 3,
        content: '请持续关注铜价波动，并保留报价来源截图。',
        signer: '王磊',
        signedAt: '2026-07-19 10:40:00'
      }
    ],
    items: clone(projectItems[2])
  }),
  record({
    id: 4,
    applicationNo: 'PMA202607160004',
    projectId: 4,
    projectNo: 'PJ202604280012',
    projectName: '粮食收储融资项目',
    coreEnterpriseName: '丰禾农业发展有限公司',
    coreCustomerNo: 'C2025041800000027',
    applicationDate: '2026-07-16',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '授信审批委员会审批',
    opinions: [],
    items: clone(projectItems[4])
  }),
  record({
    id: 5,
    applicationNo: 'PMA202607120005',
    projectId: 3,
    projectNo: 'PJ202605220009',
    projectName: '化工原料仓单融资项目',
    coreEnterpriseName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    applicationDate: '2026-07-12',
    phase: 'rejected',
    status: '被否决',
    currentStage: '审批结束',
    completedAt: '2026-07-15 16:20:00',
    opinions: [
      {
        id: 5,
        content: '报价来源未能覆盖连续交易日，请补充后重新提交。',
        signer: '陈立',
        signedAt: '2026-07-15 16:20:00'
      }
    ],
    items: clone(projectItems[3])
  }),
  record({
    id: 6,
    applicationNo: 'PMA202607080006',
    projectId: 5,
    projectNo: 'PJ202605080007',
    projectName: '煤炭库存融资项目',
    coreEnterpriseName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    applicationDate: '2026-07-08',
    phase: 'approved',
    status: '审批通过',
    currentStage: '审批完成',
    completedAt: '2026-07-14 10:45:00',
    opinions: [
      {
        id: 6,
        content: '同意按本次盯市价格更新资产价格台账。',
        signer: '赵宁',
        signedAt: '2026-07-14 10:45:00'
      }
    ],
    items: clone(projectItems[5])
  }),
  record({
    id: 7,
    applicationNo: 'PMA202607050007',
    projectId: 1,
    projectNo: 'PJ202607010001',
    projectName: '钢贸供应链融资项目',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    applicationDate: '2026-07-05',
    phase: 'approved',
    status: '审批通过',
    currentStage: '审批完成',
    completedAt: '2026-07-11 14:30:00',
    items: clone(projectItems[1])
  })
]

/** 审批通过后同步的资产/价格台账演示记录。 */
export const inventoryPriceAssetLedgerRecords: InventoryPriceLedgerEntry[] = []

const getRecord = (id: number | string) =>
  inventoryPriceApplicationRecords.find((entry) => entry.id === Number(id))

const nextId = () => Math.max(0, ...inventoryPriceApplicationRecords.map((entry) => entry.id)) + 1
const nextImageId = () =>
  Math.max(0, ...inventoryPriceApplicationRecords.flatMap((entry) => entry.images.map((image) => image.id))) + 1
const nextOpinionId = () =>
  Math.max(0, ...inventoryPriceApplicationRecords.flatMap((entry) => entry.opinions.map((opinion) => opinion.id))) + 1
const nextItemId = () =>
  Math.max(0, ...inventoryPriceApplicationRecords.flatMap((entry) => entry.items.map((item) => item.id))) + 1

const isEditable = (record: InventoryPriceApplicationRecord | undefined): string | undefined => {
  if (!record) return '价格盯市申请不存在'
  if (record.phase !== 'pending') return '仅待提交的价格盯市申请可继续维护'
  return undefined
}

const addOpinion = (record: InventoryPriceApplicationRecord, content: string) => {
  record.opinions.push({
    id: nextOpinionId(),
    content,
    signer: '本地演示用户',
    signedAt: now()
  })
}

const syncAssetLedger = (record: InventoryPriceApplicationRecord): InventoryPriceLedgerEntry[] => {
  const syncedAt = now()
  const nextEntries = record.items.map((entry) => ({
    applicationId: record.id,
    applicationNo: record.applicationNo,
    itemId: entry.id,
    smallCategory: entry.smallCategory,
    origin: entry.origin,
    monitoringUnitPrice: entry.monitoringUnitPrice,
    updatedAt: syncedAt,
    updatedBy: '价格盯市审批流程'
  }))

  nextEntries.forEach((entry) => {
    const index = inventoryPriceAssetLedgerRecords.findIndex(
      (ledger) => ledger.applicationId === entry.applicationId && ledger.itemId === entry.itemId
    )
    if (index >= 0) inventoryPriceAssetLedgerRecords.splice(index, 1, entry)
    else inventoryPriceAssetLedgerRecords.unshift(entry)
  })
  record.ledgerUpdated = true
  record.ledgerUpdatedAt = syncedAt
  return nextEntries
}

/** 使初始“审批通过”样例也带有台账同步标记。 */
inventoryPriceApplicationRecords
  .filter((entry) => entry.phase === 'approved')
  .forEach((entry) => syncAssetLedger(entry))

export const getInventoryPriceApplicationRecord = (id: number | string) => getRecord(id)

export const createInventoryPriceApplicationRecord = (
  payload: InventoryPriceApplicationCreatePayload
): InventoryPriceMutationResult => {
  const projectId = Number(payload.projectId)
  const project = inventoryPriceAvailableProjects.find((entry) => entry.id === projectId)
  if (!project) return { success: false, message: '请选择一个当前有效项目后再新增盯市申请' }

  const duplicated = inventoryPriceApplicationRecords.some(
    (entry) => entry.projectId === project.id && (entry.phase === 'pending' || entry.phase === 'reviewing')
  )
  if (duplicated) return { success: false, message: '该项目已有在途的价格盯市申请，请先完成或收回原申请' }

  const id = nextId()
  const sequence = String(id).padStart(4, '0')
  const templateItems = clone(projectItems[project.id] || [])
  const newItems = templateItems.map((entry, index) => ({ ...entry, id: nextItemId() + index }))
  const created = record({
    id,
    applicationNo: `PMA${today().replaceAll('-', '')}${sequence}`,
    projectId: project.id,
    projectNo: project.projectNo,
    projectName: project.projectName,
    coreEnterpriseName: project.coreEnterpriseName,
    coreCustomerNo: project.coreCustomerNo,
    applicationDate: today(),
    phase: 'pending',
    status: '待提交',
    opinions: [],
    images: [],
    items: newItems
  })
  inventoryPriceApplicationRecords.unshift(created)
  return { success: true, message: '价格盯市申请已新增，请维护商品单价后提交', record: created }
}

export const updateInventoryPriceApplicationRecord = (
  id: number | string,
  payload: InventoryPriceApplicationUpdatePayload
): InventoryPriceMutationResult => {
  const application = getRecord(id)
  const editableError = isEditable(application)
  if (editableError || !application) return { success: false, message: editableError }
  if (!Array.isArray(payload.items) || !payload.items.length) {
    return { success: false, message: '请至少维护一条商品盯市价格' }
  }

  const submittedIds = new Set<number>()
  for (const change of payload.items) {
    const itemId = Number(change.id)
    const item = application.items.find((entry) => entry.id === itemId)
    if (!item) return { success: false, message: '商品价格维护行不存在，请刷新后重试' }
    if (submittedIds.has(itemId)) return { success: false, message: '同一商品价格维护行不能重复提交' }
    submittedIds.add(itemId)

    const monitoringUnitPrice = numberValue(change.monitoringUnitPrice, Number.NaN)
    if (!Number.isFinite(monitoringUnitPrice) || monitoringUnitPrice <= 0) {
      return { success: false, message: `请填写“${item.smallCategory}”的有效本次盯市单价` }
    }
    const monitoringSource = trim(change.monitoringSource)
    if (!monitoringSource) return { success: false, message: `请填写“${item.smallCategory}”的盯市来源` }

    item.monitoringUnitPrice = amount(monitoringUnitPrice)
    item.monitoringSource = monitoringSource
    item.warningLine = calculateWarningLine(item)
    item.warningRule = warningRule(item.warningRate)
  }
  refreshSummary(application)
  return { success: true, message: '商品盯市单价已保存，预警线已按价格波动规则重新计算', record: application }
}

export const uploadInventoryPriceExcelRecord = (
  id: number | string,
  fileName: unknown
): InventoryPriceMutationResult => {
  const application = getRecord(id)
  const editableError = isEditable(application)
  if (editableError || !application) return { success: false, message: editableError }
  const uploadedName = trim(fileName)
  if (!uploadedName) return { success: false, message: '请先选择需要上传的 Excel 文件' }

  // Mock 按项目商品的最新单价预填导入结果，保留来源字段以便用户立即提交演示。
  application.items.forEach((item) => {
    item.monitoringUnitPrice = amount(item.latestUnitPrice)
    item.monitoringSource = `Excel导入：${uploadedName}`
    item.warningLine = calculateWarningLine(item)
  })
  refreshSummary(application)
  return { success: true, message: `${uploadedName} 已模拟导入 ${application.items.length} 条商品单价`, record: application }
}

export const getInventoryPriceExcelTemplate = (): InventoryPriceTemplateResult => ({
  fileName: '存货类价格盯市导入模板.xlsx',
  columns: ['商品大类', '商品中类', '商品小类', '产地', '本次盯市单价', '盯市来源'],
  message: 'Mock 模板已就绪，可按商品小类和产地填写盯市单价及来源'
})

export const uploadInventoryPriceApplicationImage = (
  id: number | string,
  fileName: unknown
): InventoryPriceMutationResult => {
  const application = getRecord(id)
  const editableError = isEditable(application)
  if (editableError || !application) return { success: false, message: editableError }
  const name = trim(fileName)
  if (!name) return { success: false, message: '请先选择需要上传的影像文件' }
  application.images.push({
    id: nextImageId(),
    name,
    url: `/mock-files/inventory-price/${encodeURIComponent(name)}`,
    uploadedAt: now(),
    uploader: '本地演示用户'
  })
  return { success: true, message: '影像已上传', record: application }
}

export const signInventoryPriceApplicationOpinion = (
  id: number | string,
  opinion: unknown
): InventoryPriceMutationResult => {
  const application = getRecord(id)
  if (!application) return { success: false, message: '价格盯市申请不存在' }
  const content = trim(opinion)
  if (!content) return { success: false, message: '请填写签署意见' }
  addOpinion(application, content)
  return { success: true, message: '意见已签署', record: application }
}

const validateForSubmit = (application: InventoryPriceApplicationRecord): string | undefined => {
  if (!application.items.length) return '当前项目没有可维护的商品价格信息，不能提交'
  const invalidItem = application.items.find(
    (item) => item.monitoringUnitPrice <= 0 || !trim(item.monitoringSource)
  )
  return invalidItem ? `请完善“${invalidItem.smallCategory}”的本次盯市单价和盯市来源` : undefined
}

export const submitInventoryPriceApplicationRecord = (id: number | string): InventoryPriceMutationResult => {
  const application = getRecord(id)
  const editableError = isEditable(application)
  if (editableError || !application) return { success: false, message: editableError }
  const validationError = validateForSubmit(application)
  if (validationError) return { success: false, message: validationError }

  application.phase = 'reviewing'
  application.status = '审查审批中'
  application.currentStage = '运营管理部审查'
  application.completedAt = undefined
  return { success: true, message: '价格盯市申请已提交至审查审批流程', record: application }
}

export const batchSubmitInventoryPriceApplicationRecords = (
  ids: Array<number | string>,
  opinion?: unknown
) => {
  const validIds = [...new Set(ids.map((id) => Number(id)).filter((id) => Number.isFinite(id)))]
  const sharedOpinion = trim(opinion)
  const failedIds: number[] = []
  let submitted = 0
  validIds.forEach((id) => {
    const result = submitInventoryPriceApplicationRecord(id)
    if (!result.success || !result.record) {
      failedIds.push(id)
      return
    }
    if (sharedOpinion) addOpinion(result.record, sharedOpinion)
    submitted += 1
  })
  return {
    success: failedIds.length === 0,
    submitted,
    failedIds,
    message: failedIds.length ? '部分价格盯市申请未能提交，请检查申请状态和必填项' : '批量提交成功'
  }
}

export const withdrawInventoryPriceApplicationRecord = (id: number | string): InventoryPriceMutationResult => {
  const application = getRecord(id)
  if (!application || application.phase !== 'reviewing') {
    return { success: false, message: '仅审查审批中的价格盯市申请可收回，或该申请不存在' }
  }
  application.phase = 'pending'
  application.status = '待提交'
  application.currentStage = undefined
  application.completedAt = undefined
  return { success: true, message: '价格盯市申请已收回至待提交节点', record: application }
}

/** Mock 审批通过入口：更新状态，并把盯市单价同步到资产/价格台账演示数据。 */
export const approveInventoryPriceApplicationRecord = (
  id: number | string,
  opinion?: unknown
): InventoryPriceMutationResult => {
  const application = getRecord(id)
  if (!application || application.phase !== 'reviewing') {
    return { success: false, message: '仅审查审批中的价格盯市申请可审批通过，或该申请不存在' }
  }
  const content = trim(opinion)
  if (content) addOpinion(application, content)
  application.phase = 'approved'
  application.status = '审批通过'
  application.currentStage = '审批完成'
  application.completedAt = now()
  const ledgerEntries = syncAssetLedger(application)
  return { success: true, message: '申请审批通过，已同步资产/价格台账', record: application, ledgerEntries }
}

export const getInventoryPriceTrendData = (
  id: number | string,
  itemId?: number | string
): InventoryPriceTrendResult | undefined => {
  const application = getRecord(id)
  if (!application) return undefined
  const item = application.items.find((entry) => entry.id === Number(itemId)) || application.items[0]
  if (!item) return undefined
  const day = (offset: number) => {
    const date = new Date(`${application.applicationDate}T00:00:00`)
    date.setDate(date.getDate() + offset)
    return date.toISOString().slice(0, 10)
  }
  const values = [
    amount(item.inboundUnitPrice * 1.02),
    amount(item.inboundUnitPrice),
    amount((item.inboundUnitPrice + item.latestUnitPrice) / 2),
    item.latestUnitPrice,
    item.monitoringUnitPrice
  ]
  return {
    applicationId: application.id,
    itemId: item.id,
    itemName: `${item.smallCategory}（${item.origin}）`,
    warningLine: item.warningLine,
    points: values.map((value, index) => ({
      date: day(index - values.length + 1),
      value,
      label: index === values.length - 1 ? '本次盯市单价' : undefined
    }))
  }
}
