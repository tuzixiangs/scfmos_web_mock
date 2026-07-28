export type OrderContractModificationNode = 'active' | 'records'
export type OrderContractStatus = '有效' | '失效'
export type OrderContractModificationStatus = '草稿' | '已提交'
export type OrderContractCurrency = '人民币' | '美元' | '欧元'

export interface OrderContractModificationImage {
  id: number
  name: string
  url: string
  uploadedAt: string
  uploader: string
}

export interface OrderContractModificationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

export interface OrderContractItem {
  id: number
  sequence: number
  productCode: string
  productName: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  batchNo: string
  cabinetNo: string
  specification: string
  origin: string
  warehouseName: string
  quantityOrWeight: number
  unitPrice: number
  totalAmount: number
  currency: OrderContractCurrency
  cargoStartDate: string
  cargoEndDate: string
  cargoOwner: '核心企业' | '借款人本人'
}

export interface OrderContractItemPayload {
  productName?: string
  largeCategory?: string
  middleCategory?: string
  smallCategory?: string
  batchNo?: string
  cabinetNo?: string
  specification?: string
  origin?: string
  warehouseName?: string
  quantityOrWeight?: number | string
  unitPrice?: number | string
  currency?: OrderContractCurrency
  cargoStartDate?: string
  cargoEndDate?: string
  cargoOwner?: '核心企业' | '借款人本人'
}

export interface OrderContractModificationRecord {
  id: number
  applicationFlowNo: string
  orderContractNo: string
  partyOne: string
  partyTwo: string
  partyThree: string
  contractTotalAmount: number
  remainingAvailableAmount: number
  currency: OrderContractCurrency
  contractStartDate: string
  contractEndDate: string
  applicationDate: string
  contractStatus: OrderContractStatus
  modificationStatus: OrderContractModificationStatus
  customerName: string
  coreCustomerNo: string
  projectName: string
  projectNo: string
  businessContractNo: string
  modifier?: string
  modifiedAt?: string
  submittedAt?: string
  hasUnsettledBusiness?: boolean
}

export interface OrderContractModificationDetail extends OrderContractModificationRecord {
  currentUsedAmount: number
  dataSource: string
  productScheme: string
  images: OrderContractModificationImage[]
  items: OrderContractItem[]
  opinions: OrderContractModificationOpinion[]
}

export interface OrderContractModificationCreatePayload {
  sourceContractId?: number | string
  orderContractNo?: string
  partyOne?: string
  partyTwo?: string
  partyThree?: string
  contractTotalAmount?: number | string
  currency?: OrderContractCurrency
  contractStartDate?: string
  contractEndDate?: string
}

export interface OrderContractModificationUpdatePayload {
  orderContractNo?: string
  partyOne?: string
  partyTwo?: string
  partyThree?: string
  contractTotalAmount?: number | string
  currentUsedAmount?: number | string
  currency?: OrderContractCurrency
  contractStartDate?: string
  contractEndDate?: string
  contractStatus?: OrderContractStatus
}

export interface OrderContractMutationResult {
  success: boolean
  message?: string
  record?: OrderContractModificationDetail
}

export interface OrderContractItemMutationResult {
  success: boolean
  message?: string
  item?: OrderContractItem
  record?: OrderContractModificationDetail
}

export interface OrderContractImageMutationResult {
  success: boolean
  message?: string
  image?: OrderContractModificationImage
  record?: OrderContractModificationDetail
}

const numberValue = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const amount = (value: unknown, fallback = 0) => Number(numberValue(value, fallback).toFixed(2))
const trim = (value: unknown) => String(value || '').trim()
const now = () => new Date().toLocaleString('sv-SE').replace('T', ' ')
const today = () => now().slice(0, 10)
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const item = (data: Omit<OrderContractItem, 'id' | 'sequence' | 'totalAmount'>, id: number, sequence: number) => ({
  ...data,
  id,
  sequence,
  totalAmount: amount(data.quantityOrWeight * data.unitPrice)
})

const detail = (
  data: Omit<OrderContractModificationDetail, 'images' | 'items' | 'opinions'> & {
    images?: OrderContractModificationImage[]
    items?: OrderContractItem[]
    opinions?: OrderContractModificationOpinion[]
  }
): OrderContractModificationDetail => ({
  ...data,
  images: data.images || [],
  items: data.items || [],
  opinions: data.opinions || []
})

/**
 * 债项管理 - 订单/合同信息修改的唯一 Mock 数据源。
 * active 对应可继续编辑的订单/合同；records 保存提交后的修改记录，二者均保留在内存中以展示完整操作流。
 */
export const orderContractModificationRecords: OrderContractModificationDetail[] = [
  detail({
    id: 1,
    applicationFlowNo: 'OCM202607210001',
    orderContractNo: 'HT-NJ-202607-001',
    partyOne: '阿姆特拉斯供应链有限公司',
    partyTwo: '南京钢铁贸易有限公司',
    partyThree: '中储南京物流有限公司',
    contractTotalAmount: 1200000,
    remainingAvailableAmount: 880000,
    currency: '人民币',
    contractStartDate: '2026-07-01',
    contractEndDate: '2027-06-30',
    applicationDate: '2026-07-21',
    contractStatus: '有效',
    modificationStatus: '草稿',
    customerName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    projectName: '钢贸供应链融资项目',
    projectNo: 'PJ202607010001',
    businessContractNo: 'BUS-HT-202607-001',
    currentUsedAmount: 320000,
    dataSource: '供应链金融平台',
    productScheme: '钢材库存质押融资方案',
    images: [
      {
        id: 1,
        name: '钢材采购合同.pdf',
        url: '/mock-files/order-contract/HT-NJ-202607-001.pdf',
        uploadedAt: '2026-07-21 09:10:00',
        uploader: '张晨'
      }
    ],
    items: [
      item(
        {
          productCode: '010101',
          productName: '热轧卷板',
          largeCategory: '金属及矿产品',
          middleCategory: '黑色金属',
          smallCategory: '热轧卷板',
          batchNo: 'PC-NJ-202607-001',
          cabinetNo: 'GJ-NJ-01',
          specification: 'Q235B 3.0*1250*C',
          origin: '中国·南京',
          warehouseName: '南京滨江钢材仓',
          quantityOrWeight: 200,
          unitPrice: 4200,
          currency: '人民币',
          cargoStartDate: '2026-07-01',
          cargoEndDate: '2027-06-30',
          cargoOwner: '核心企业'
        },
        101,
        1
      )
    ],
    opinions: []
  }),
  detail({
    id: 2,
    applicationFlowNo: 'OCM202607190002',
    orderContractNo: 'HT-SH-202607-008',
    partyOne: '华东金属贸易有限公司',
    partyTwo: '上海有色供应链有限公司',
    partyThree: '上海物流监管服务有限公司',
    contractTotalAmount: 860000,
    remainingAvailableAmount: 560000,
    currency: '人民币',
    contractStartDate: '2026-07-05',
    contractEndDate: '2027-01-05',
    applicationDate: '2026-07-19',
    contractStatus: '有效',
    modificationStatus: '草稿',
    customerName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    projectName: '金属库存融资项目',
    projectNo: 'PJ202606180006',
    businessContractNo: 'BUS-HT-202607-008',
    currentUsedAmount: 300000,
    dataSource: '客户经理录入',
    productScheme: '有色金属仓单融资方案',
    hasUnsettledBusiness: true,
    images: [
      {
        id: 2,
        name: '铜材购销合同.pdf',
        url: '/mock-files/order-contract/HT-SH-202607-008.pdf',
        uploadedAt: '2026-07-19 15:20:00',
        uploader: '李敏'
      }
    ],
    items: [
      item(
        {
          productCode: '010201',
          productName: '电解铜',
          largeCategory: '金属及矿产品',
          middleCategory: '有色金属',
          smallCategory: '电解铜',
          batchNo: 'PC-SH-202607-008',
          cabinetNo: 'GJ-SH-02',
          specification: '1# 铜 99.95%',
          origin: '中国·上海',
          warehouseName: '上海临港有色仓',
          quantityOrWeight: 50,
          unitPrice: 12000,
          currency: '人民币',
          cargoStartDate: '2026-07-05',
          cargoEndDate: '2027-01-05',
          cargoOwner: '借款人本人'
        },
        201,
        1
      )
    ],
    opinions: [
      {
        id: 1,
        content: '请核验最新到货批次及监管仓入库单。',
        signer: '李敏',
        signedAt: '2026-07-19 16:10:00'
      }
    ]
  }),
  detail({
    id: 3,
    applicationFlowNo: 'OCM202607160003',
    orderContractNo: 'HT-JS-202607-015',
    partyOne: '恒源化工有限公司',
    partyTwo: '江苏新材料有限公司',
    partyThree: '江苏恒信监管有限公司',
    contractTotalAmount: 700000,
    remainingAvailableAmount: 700000,
    currency: '人民币',
    contractStartDate: '2026-07-10',
    contractEndDate: '2026-12-31',
    applicationDate: '2026-07-16',
    contractStatus: '有效',
    modificationStatus: '草稿',
    customerName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    projectName: '化工原料仓单融资项目',
    projectNo: 'PJ202605220009',
    businessContractNo: 'BUS-HT-202607-015',
    currentUsedAmount: 0,
    dataSource: '供应链金融平台',
    productScheme: '化工原料仓单融资方案',
    images: [],
    items: [
      item(
        {
          productCode: '020101',
          productName: '聚乙烯',
          largeCategory: '化工原料',
          middleCategory: '基础化工',
          smallCategory: '聚乙烯',
          batchNo: 'PC-CZ-202607-015',
          cabinetNo: 'GJ-CZ-03',
          specification: 'HDPE 5000S',
          origin: '中国·常州',
          warehouseName: '常州化工专用仓',
          quantityOrWeight: 100,
          unitPrice: 5800,
          currency: '人民币',
          cargoStartDate: '2026-07-10',
          cargoEndDate: '2026-12-31',
          cargoOwner: '核心企业'
        },
        301,
        1
      )
    ],
    opinions: []
  })
]

/** 供新增弹窗选择的“当前有效合同”清单，与待修改申请分开维护，避免一份草稿被重复创建。 */
export const availableOrderContractRecords: OrderContractModificationDetail[] = [
  detail({
    id: 101,
    applicationFlowNo: 'HTFLOW202607010021',
    orderContractNo: 'HT-TJ-202607-021',
    partyOne: '新城贸易有限公司',
    partyTwo: '天津钢材配送有限公司',
    partyThree: '华北仓储监管有限公司',
    contractTotalAmount: 980000,
    remainingAvailableAmount: 680000,
    currency: '人民币',
    contractStartDate: '2026-07-01',
    contractEndDate: '2027-06-30',
    applicationDate: '2026-07-01',
    contractStatus: '有效',
    modificationStatus: '草稿',
    customerName: '新城贸易有限公司',
    coreCustomerNo: 'C2025060800000036',
    projectName: '经销商融资项目',
    projectNo: 'PJ202606050003',
    businessContractNo: 'BUS-HT-202607-021',
    currentUsedAmount: 300000,
    dataSource: '供应链金融平台',
    productScheme: '钢材库存质押融资方案',
    images: [],
    items: [
      item(
        {
          productCode: '010101',
          productName: '热轧卷板',
          largeCategory: '金属及矿产品',
          middleCategory: '黑色金属',
          smallCategory: '热轧卷板',
          batchNo: 'PC-TJ-202607-021',
          cabinetNo: 'GJ-TJ-01',
          specification: 'Q235B 4.0*1500*C',
          origin: '中国·天津',
          warehouseName: '天津东丽综合仓',
          quantityOrWeight: 180,
          unitPrice: 4300,
          currency: '人民币',
          cargoStartDate: '2026-07-01',
          cargoEndDate: '2027-06-30',
          cargoOwner: '核心企业'
        },
        10101,
        1
      )
    ],
    opinions: []
  }),
  detail({
    id: 102,
    applicationFlowNo: 'HTFLOW202606280035',
    orderContractNo: 'HT-GZ-202606-035',
    partyOne: '臻品家电有限公司',
    partyTwo: '广州家电经销有限公司',
    partyThree: '粤港仓储监管有限公司',
    contractTotalAmount: 1500000,
    remainingAvailableAmount: 1200000,
    currency: '人民币',
    contractStartDate: '2026-06-28',
    contractEndDate: '2027-05-31',
    applicationDate: '2026-06-28',
    contractStatus: '有效',
    modificationStatus: '草稿',
    customerName: '臻品家电有限公司',
    coreCustomerNo: 'C2025021100000068',
    projectName: '家电经销商融资项目',
    projectNo: 'PJ202604120015',
    businessContractNo: 'BUS-HT-202606-035',
    currentUsedAmount: 300000,
    dataSource: '客户经理录入',
    productScheme: '家电经销商融资方案',
    images: [],
    items: [
      item(
        {
          productCode: '060101',
          productName: '冰箱',
          largeCategory: '消费品',
          middleCategory: '家用电器',
          smallCategory: '冰箱',
          batchNo: 'PC-GZ-202606-035',
          cabinetNo: 'GJ-GZ-02',
          specification: '500L 对开门',
          origin: '中国·广州',
          warehouseName: '广州南沙家电仓',
          quantityOrWeight: 100,
          unitPrice: 9800,
          currency: '人民币',
          cargoStartDate: '2026-06-28',
          cargoEndDate: '2027-05-31',
          cargoOwner: '借款人本人'
        },
        10201,
        1
      )
    ],
    opinions: []
  })
]

/** 已提交的订单/合同信息修改记录。提交操作会从 active 复制一份到本数组。 */
export const orderContractModificationHistoryRecords: OrderContractModificationDetail[] = [
  detail({
    id: 91,
    applicationFlowNo: 'OCM202607100091',
    orderContractNo: 'HT-TS-202606-011',
    partyOne: '华南能源有限公司',
    partyTwo: '唐山煤炭贸易有限公司',
    partyThree: '中储能源监管有限公司',
    contractTotalAmount: 2300000,
    remainingAvailableAmount: 1700000,
    currency: '人民币',
    contractStartDate: '2026-06-15',
    contractEndDate: '2027-06-14',
    applicationDate: '2026-07-10',
    contractStatus: '有效',
    modificationStatus: '已提交',
    customerName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    projectName: '煤炭库存融资项目',
    projectNo: 'PJ202605080007',
    businessContractNo: 'BUS-HT-202606-011',
    modifier: '王磊',
    modifiedAt: '2026-07-10 16:20:00',
    submittedAt: '2026-07-10 16:30:00',
    currentUsedAmount: 600000,
    dataSource: '供应链金融平台',
    productScheme: '煤炭库存质押融资方案',
    images: [
      {
        id: 91,
        name: '煤炭购销合同-修订版.pdf',
        url: '/mock-files/order-contract/HT-TS-202606-011.pdf',
        uploadedAt: '2026-07-10 15:56:00',
        uploader: '王磊'
      }
    ],
    items: [
      item(
        {
          productCode: '040101',
          productName: '动力煤',
          largeCategory: '能源产品',
          middleCategory: '煤炭',
          smallCategory: '动力煤',
          batchNo: 'PC-TS-202606-011',
          cabinetNo: 'GJ-TS-01',
          specification: 'Q5500',
          origin: '中国·唐山',
          warehouseName: '唐山港煤炭监管仓',
          quantityOrWeight: 500,
          unitPrice: 3200,
          currency: '人民币',
          cargoStartDate: '2026-06-15',
          cargoEndDate: '2027-06-14',
          cargoOwner: '核心企业'
        },
        9101,
        1
      )
    ],
    opinions: [
      {
        id: 91,
        content: '合同期限及货物监管信息已核对无误，同意提交。',
        signer: '王磊',
        signedAt: '2026-07-10 16:15:00'
      }
    ]
  }),
  detail({
    id: 92,
    applicationFlowNo: 'OCM202607080092',
    orderContractNo: 'HT-JL-202606-008',
    partyOne: '丰禾农业发展有限公司',
    partyTwo: '吉林粮食收储有限公司',
    partyThree: '中粮仓储监管服务有限公司',
    contractTotalAmount: 600000,
    remainingAvailableAmount: 0,
    currency: '人民币',
    contractStartDate: '2026-06-01',
    contractEndDate: '2026-12-31',
    applicationDate: '2026-07-08',
    contractStatus: '失效',
    modificationStatus: '已提交',
    customerName: '丰禾农业发展有限公司',
    coreCustomerNo: 'C2025041800000027',
    projectName: '粮食收储融资项目',
    projectNo: 'PJ202604280012',
    businessContractNo: 'BUS-HT-202606-008',
    modifier: '赵宁',
    modifiedAt: '2026-07-08 11:40:00',
    submittedAt: '2026-07-08 11:48:00',
    currentUsedAmount: 600000,
    dataSource: '供应链金融平台',
    productScheme: '粮食仓单融资方案',
    images: [],
    items: [
      item(
        {
          productCode: '030101',
          productName: '稻谷',
          largeCategory: '农产品',
          middleCategory: '粮食',
          smallCategory: '稻谷',
          batchNo: 'PC-JL-202606-008',
          cabinetNo: 'GJ-JL-01',
          specification: '国标三等',
          origin: '中国·松原',
          warehouseName: '吉林松原粮食仓',
          quantityOrWeight: 400,
          unitPrice: 1500,
          currency: '人民币',
          cargoStartDate: '2026-06-01',
          cargoEndDate: '2026-12-31',
          cargoOwner: '借款人本人'
        },
        9201,
        1
      )
    ],
    opinions: []
  })
]

const allRecords = () => [...orderContractModificationRecords, ...orderContractModificationHistoryRecords]
const nextId = () => Math.max(0, ...allRecords().map((record) => record.id)) + 1
const nextItemId = () =>
  Math.max(
    0,
    ...[...allRecords(), ...availableOrderContractRecords].flatMap((record) => record.items.map((entry) => entry.id))
  ) + 1
const nextImageId = () =>
  Math.max(0, ...allRecords().flatMap((record) => record.images.map((entry) => entry.id))) + 1
const nextOpinionId = () =>
  Math.max(0, ...allRecords().flatMap((record) => record.opinions.map((entry) => entry.id))) + 1

const changeMeta = (record: OrderContractModificationDetail) => {
  record.modifier = '本地演示用户'
  record.modifiedAt = now()
}

const ensureDraft = (record: OrderContractModificationDetail | undefined): string | undefined => {
  if (!record) return '订单/合同信息修改申请不存在'
  if (record.modificationStatus !== '草稿') return '已提交的修改记录不可继续编辑'
  return undefined
}

const generateProductCode = (largeCategory: string, middleCategory: string, smallCategory: string, id: number) => {
  const initials = [largeCategory, middleCategory, smallCategory]
    .map((value) => trim(value).slice(0, 2).toUpperCase() || 'XX')
    .join('-')
  return `${initials}-${String(id).padStart(4, '0')}`
}

const buildItem = (payload: OrderContractItemPayload, id: number, sequence: number): OrderContractItem => {
  const quantityOrWeight = amount(payload.quantityOrWeight, 0)
  const unitPrice = amount(payload.unitPrice, 0)
  const largeCategory = trim(payload.largeCategory) || '未分类商品'
  const middleCategory = trim(payload.middleCategory) || '待选择中类'
  const smallCategory = trim(payload.smallCategory) || '待选择小类'
  return {
    id,
    sequence,
    productCode: generateProductCode(largeCategory, middleCategory, smallCategory, id),
    productName: trim(payload.productName) || '待填写商品名称',
    largeCategory,
    middleCategory,
    smallCategory,
    batchNo: trim(payload.batchNo),
    cabinetNo: trim(payload.cabinetNo),
    specification: trim(payload.specification),
    origin: trim(payload.origin),
    warehouseName: trim(payload.warehouseName) || '待选择仓库',
    quantityOrWeight,
    unitPrice,
    totalAmount: amount(quantityOrWeight * unitPrice),
    currency: payload.currency || '人民币',
    cargoStartDate: trim(payload.cargoStartDate),
    cargoEndDate: trim(payload.cargoEndDate),
    cargoOwner: payload.cargoOwner || '核心企业'
  }
}

export const getOrderContractModificationRecord = (id: number | string) =>
  orderContractModificationRecords.find((record) => record.id === Number(id))

export const getOrderContractModificationHistoryRecord = (id: number | string) =>
  orderContractModificationHistoryRecords.find((record) => record.id === Number(id))

export const getOrderContractModificationByNode = (id: number | string, node: OrderContractModificationNode) =>
  node === 'records'
    ? getOrderContractModificationHistoryRecord(id)
    : getOrderContractModificationRecord(id)

export const createOrderContractModificationRecord = (
  payload: OrderContractModificationCreatePayload
): OrderContractMutationResult => {
  const sourceId = Number(payload.sourceContractId)
  const source = sourceId
    ? availableOrderContractRecords.find((record) => record.id === sourceId && record.contractStatus === '有效')
    : undefined
  if (payload.sourceContractId && !source) {
    return { success: false, message: '请选择一份当前有效的订单/合同后再新增' }
  }

  const nextRecordId = nextId()
  const defaultNo = `HT-MOCK-${today().replaceAll('-', '')}-${String(nextRecordId).padStart(4, '0')}`
  const orderContractNo = trim(payload.orderContractNo) || source?.orderContractNo || defaultNo
  if (orderContractModificationRecords.some((record) => record.orderContractNo === orderContractNo)) {
    return { success: false, message: '该订单/合同已有待修改申请，请勿重复新增' }
  }

  const contractTotalAmount = amount(payload.contractTotalAmount, source?.contractTotalAmount || 0)
  const currentUsedAmount = source?.currentUsedAmount || 0
  if (contractTotalAmount < currentUsedAmount) {
    return { success: false, message: '订单/合同总金额不得小于当前已使用金额' }
  }

  const record = detail({
    id: nextRecordId,
    applicationFlowNo: `OCM${today().replaceAll('-', '')}${String(nextRecordId).padStart(4, '0')}`,
    orderContractNo,
    partyOne: trim(payload.partyOne) || source?.partyOne || '待填写签约方1',
    partyTwo: trim(payload.partyTwo) || source?.partyTwo || '待填写签约方2',
    partyThree: trim(payload.partyThree) || source?.partyThree || '待填写签约方3',
    contractTotalAmount,
    remainingAvailableAmount: amount(contractTotalAmount - currentUsedAmount),
    currency: payload.currency || source?.currency || '人民币',
    contractStartDate: trim(payload.contractStartDate) || source?.contractStartDate || today(),
    contractEndDate: trim(payload.contractEndDate) || source?.contractEndDate || '',
    applicationDate: today(),
    contractStatus: '有效',
    modificationStatus: '草稿',
    customerName: source?.customerName || trim(payload.partyOne) || '待填写客户名称',
    coreCustomerNo: source?.coreCustomerNo || '待填写核心客户编号',
    projectName: source?.projectName || '待填写项目名称',
    projectNo: source?.projectNo || '待填写项目编号',
    businessContractNo: source?.businessContractNo || `BUS-${defaultNo}`,
    currentUsedAmount,
    dataSource: source?.dataSource || '本地新增',
    productScheme: source?.productScheme || '待完善产品方案',
    images: clone(source?.images || []),
    items: clone(source?.items || []),
    opinions: []
  })

  // 克隆来源合同的商品明细时生成新的明细主键，避免后续 CRUD 与来源数据相互影响。
  record.items = record.items.map((entry, index) => ({
    ...entry,
    id: nextItemId() + index,
    sequence: index + 1
  }))
  orderContractModificationRecords.unshift(record)
  return { success: true, record }
}

export const updateOrderContractModificationRecord = (
  id: number | string,
  payload: OrderContractModificationUpdatePayload
): OrderContractMutationResult => {
  const record = getOrderContractModificationRecord(id)
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }

  const nextAmount =
    payload.contractTotalAmount === undefined
      ? record.contractTotalAmount
      : amount(payload.contractTotalAmount, record.contractTotalAmount)
  const nextUsedAmount =
    payload.currentUsedAmount === undefined
      ? record.currentUsedAmount
      : amount(payload.currentUsedAmount, record.currentUsedAmount)
  if (nextUsedAmount < 0 || nextAmount < nextUsedAmount) {
    return { success: false, message: '订单/合同总金额不得小于当前已使用金额' }
  }

  const nextOrderContractNo = trim(payload.orderContractNo)
  if (
    nextOrderContractNo &&
    orderContractModificationRecords.some(
      (itemRecord) => itemRecord.id !== record.id && itemRecord.orderContractNo === nextOrderContractNo
    )
  ) {
    return { success: false, message: '订单/合同编号已存在待修改申请，请修改后保存' }
  }

  if (nextOrderContractNo) record.orderContractNo = nextOrderContractNo
  if (payload.partyOne !== undefined) record.partyOne = trim(payload.partyOne)
  if (payload.partyTwo !== undefined) record.partyTwo = trim(payload.partyTwo)
  if (payload.partyThree !== undefined) record.partyThree = trim(payload.partyThree)
  if (payload.currency) record.currency = payload.currency
  if (payload.contractStartDate !== undefined) record.contractStartDate = trim(payload.contractStartDate)
  if (payload.contractEndDate !== undefined) record.contractEndDate = trim(payload.contractEndDate)
  if (payload.contractStatus) record.contractStatus = payload.contractStatus
  record.contractTotalAmount = nextAmount
  record.currentUsedAmount = nextUsedAmount
  record.remainingAvailableAmount = amount(nextAmount - nextUsedAmount)
  changeMeta(record)
  return { success: true, record }
}

export const invalidateOrderContractModificationRecord = (id: number | string): OrderContractMutationResult => {
  const record = getOrderContractModificationRecord(id)
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }
  if (record.hasUnsettledBusiness) {
    return { success: false, message: '该合同下关联了未结清业务，不允许置为失效' }
  }
  record.contractStatus = '失效'
  changeMeta(record)
  return { success: true, message: '订单/合同已置为失效', record }
}

export const deleteOrderContractModificationRecord = (id: number | string): OrderContractMutationResult => {
  const targetId = Number(id)
  const index = orderContractModificationRecords.findIndex((record) => record.id === targetId)
  const record = orderContractModificationRecords[index]
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }
  if (record.hasUnsettledBusiness) {
    return { success: false, message: '该合同关联的业务合同尚未结清，不允许删除' }
  }
  orderContractModificationRecords.splice(index, 1)
  return { success: true, message: '订单/合同信息修改申请已删除' }
}

export const createOrderContractModificationItem = (
  modificationId: number | string,
  payload: OrderContractItemPayload
): OrderContractItemMutationResult => {
  const record = getOrderContractModificationRecord(modificationId)
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }

  const newItem = buildItem(payload, nextItemId(), record.items.length + 1)
  record.items.push(newItem)
  changeMeta(record)
  return { success: true, item: newItem, record }
}

export const updateOrderContractModificationItem = (
  modificationId: number | string,
  itemId: number | string,
  payload: OrderContractItemPayload
): OrderContractItemMutationResult => {
  const record = getOrderContractModificationRecord(modificationId)
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }
  const itemRecord = record.items.find((entry) => entry.id === Number(itemId))
  if (!itemRecord) return { success: false, message: '订单/合同项不存在' }

  const merged = buildItem(
    {
      ...itemRecord,
      ...payload,
      productName: payload.productName ?? itemRecord.productName,
      largeCategory: payload.largeCategory ?? itemRecord.largeCategory,
      middleCategory: payload.middleCategory ?? itemRecord.middleCategory,
      smallCategory: payload.smallCategory ?? itemRecord.smallCategory,
      warehouseName: payload.warehouseName ?? itemRecord.warehouseName,
      quantityOrWeight: payload.quantityOrWeight ?? itemRecord.quantityOrWeight,
      unitPrice: payload.unitPrice ?? itemRecord.unitPrice,
      cargoStartDate: payload.cargoStartDate ?? itemRecord.cargoStartDate,
      cargoEndDate: payload.cargoEndDate ?? itemRecord.cargoEndDate,
      cargoOwner: payload.cargoOwner ?? itemRecord.cargoOwner
    },
    itemRecord.id,
    itemRecord.sequence
  )
  Object.assign(itemRecord, merged)
  changeMeta(record)
  return { success: true, item: itemRecord, record }
}

/** 支持详情页的明细表格一次性保存。 */
export const updateOrderContractModificationItems = (
  modificationId: number | string,
  payload: unknown
): OrderContractItemMutationResult => {
  const record = getOrderContractModificationRecord(modificationId)
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }
  if (!Array.isArray(payload)) return { success: false, message: '订单/合同项数据格式不正确' }

  const originalItems = record.items
  const nextBaseId = nextItemId()
  record.items = payload.map((entry, index) => {
    const source = originalItems[index]
    return buildItem(
      {
        ...(source || {}),
        ...((entry || {}) as OrderContractItemPayload)
      },
      source?.id || nextBaseId + index,
      index + 1
    )
  })
  changeMeta(record)
  return { success: true, record }
}

export const deleteOrderContractModificationItem = (
  modificationId: number | string,
  itemId: number | string
): OrderContractItemMutationResult => {
  const record = getOrderContractModificationRecord(modificationId)
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }
  const index = record.items.findIndex((entry) => entry.id === Number(itemId))
  if (index < 0) return { success: false, message: '订单/合同项不存在' }
  record.items.splice(index, 1)
  record.items.forEach((entry, itemIndex) => {
    entry.sequence = itemIndex + 1
  })
  changeMeta(record)
  return { success: true, record }
}

export const getOrderContractModificationImages = (
  modificationId: number | string,
  node: OrderContractModificationNode = 'active'
) => getOrderContractModificationByNode(modificationId, node)?.images

export const uploadOrderContractModificationImage = (
  modificationId: number | string,
  name: unknown
): OrderContractImageMutationResult => {
  const record = getOrderContractModificationRecord(modificationId)
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }
  const imageName = trim(name)
  if (!imageName) return { success: false, message: '请先选择需要上传的影像文件' }
  const image: OrderContractModificationImage = {
    id: nextImageId(),
    name: imageName,
    url: `/mock-files/order-contract/${encodeURIComponent(imageName)}`,
    uploadedAt: now(),
    uploader: '本地演示用户'
  }
  record.images.push(image)
  changeMeta(record)
  return { success: true, image, record }
}

export const signOrderContractModificationOpinion = (
  id: number | string,
  opinion: unknown
): OrderContractMutationResult => {
  const record = getOrderContractModificationRecord(id)
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }
  const content = trim(opinion)
  if (!content) return { success: false, message: '请填写签署意见' }
  record.opinions.push({
    id: nextOpinionId(),
    content,
    signer: '本地演示用户',
    signedAt: now()
  })
  changeMeta(record)
  return { success: true, record }
}

export const submitOrderContractModificationRecord = (id: number | string): OrderContractMutationResult => {
  const targetId = Number(id)
  const index = orderContractModificationRecords.findIndex((record) => record.id === targetId)
  const record = orderContractModificationRecords[index]
  const draftError = ensureDraft(record)
  if (draftError || !record) return { success: false, message: draftError }
  if (record.contractStatus !== '有效') {
    return { success: false, message: '失效合同不允许提交订单/合同信息修改申请' }
  }

  const archived = clone(record)
  archived.modificationStatus = '已提交'
  archived.submittedAt = now()
  archived.modifier = archived.modifier || '本地演示用户'
  archived.modifiedAt = archived.modifiedAt || archived.submittedAt
  orderContractModificationRecords.splice(index, 1)
  orderContractModificationHistoryRecords.unshift(archived)
  return { success: true, message: '订单/合同信息修改申请已提交', record: archived }
}

export const batchSubmitOrderContractModificationRecords = (ids: Array<number | string>, opinion?: unknown) => {
  const uniqueIds = [...new Set(ids.map((id) => Number(id)).filter((id) => Number.isFinite(id)))]
  const failedIds: number[] = []
  const sharedOpinion = trim(opinion)
  let submitted = 0
  uniqueIds.forEach((id) => {
    const result = submitOrderContractModificationRecord(id)
    if (!result.success || !result.record) {
      failedIds.push(id)
      return
    }

    if (sharedOpinion) {
      result.record.opinions.push({
        id: nextOpinionId(),
        content: sharedOpinion,
        signer: '本地演示用户',
        signedAt: now()
      })
    }
    submitted += 1
  })
  return {
    success: failedIds.length === 0,
    submitted,
    failedIds,
    message: failedIds.length ? '部分订单/合同信息修改申请未能提交，请检查是否已置为失效' : '批量提交成功'
  }
}
