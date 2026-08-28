export type AssetManagementApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'
export type AssetManagementApplicationStatus =
  | '待提交'
  | '待处理'
  | '审查审批中'
  | '被否决'
  | '审批通过'
export type AssetManagementInboundType = '部分入库' | '全部入库' | '动态补货'
export type AssetManagementCurrency = '人民币' | '美元' | '欧元'

export interface AssetManagementApplicationImage {
  id: number
  name: string
  url: string
  uploadedAt: string
  uploader: string
}

export interface AssetManagementApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

export interface AssetManagementFlowRecord {
  id: number
  node: string
  action: string
  operator: string
  operatedAt: string
  comment?: string
}

export interface AssetManagementOrderContract {
  id: number
  orderContractFlowNo: string
  orderContractNo: string
  partyOne: string
  partyTwo: string
  partyThree: string
  contractTotalAmount: number
  currentUsedAmount: number
  remainingAvailableAmount: number
  currency: AssetManagementCurrency
  contractStartDate: string
  contractEndDate: string
  dataSource: string
}

export type AssetManagementAssetStatus = '待入库' | '已到港'

export interface AssetManagementAssetDetail {
  id: number
  orderContractId: number
  productCode: string
  productName: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  batchNo: string
  containerNo: string
  origin: string
  specification: string
  warehouseName: string
  inboundQuantity: number
  quantityUnit: string
  initialRecognitionPrice: number
  initialRecognitionValue: number
  currency: AssetManagementCurrency
  goodsStartDate: string
  goodsEndDate: string
  goodsOwnership: string
  remark1: string
  remark2: string
  assetStatus: AssetManagementAssetStatus
}

export interface AssetManagementProject {
  id: number
  projectName: string
  projectNo: string
  customerName: string
  linkedCustomerName?: string
  coreCustomerNo: string
  productScheme: string
  productPlan?: string
  creditNo: string
  disbursementFlowNo?: string
  businessContractNo: string
  businessContractName: string
  contractAmount: number
  businessContractAmount?: number
  currency: AssetManagementCurrency
  contractStartDate: string
  contractEndDate: string
  disbursementAmount: number
  outboundAmount?: number
  disbursementDate: string
  billingDate?: string
  arrivalDeadline: string
  arrivalPort?: string
  arrivalDate?: string
  inboundDate?: string
  isEffective: boolean
  allInboundCompleted?: boolean
  dynamicControlEnabled?: boolean
}

export interface AssetManagementApplicationRecord {
  id: number
  applicationNo: string
  projectId: number
  projectName: string
  projectNo: string
  customerName: string
  linkedCustomerName: string
  coreCustomerNo: string
  productScheme: string
  productPlan: string
  creditNo: string
  disbursementFlowNo: string
  relatedBusinessContractNo: string
  businessContractNo: string
  businessContractName: string
  contractAmount: number
  businessContractAmount: number
  currency: AssetManagementCurrency
  contractStartDate: string
  contractEndDate: string
  disbursementAmount: number
  outboundAmount: number
  disbursementDate: string
  billingDate: string
  arrivalDeadline: string
  arrivalPort: string
  arrivalDate?: string
  inboundDate?: string
  inboundGoodsValue: number
  inboundValue: number
  confirmationRemark?: string
  applicationDate: string
  inboundType: AssetManagementInboundType
  phase: AssetManagementApplicationPhase
  status: AssetManagementApplicationStatus
  currentStage?: string
  completedAt?: string
  images: AssetManagementApplicationImage[]
  opinions: AssetManagementApplicationOpinion[]
  flowRecords: AssetManagementFlowRecord[]
  orderContracts: AssetManagementOrderContract[]
  assetDetails: AssetManagementAssetDetail[]
}

export interface AssetManagementApplicationCreatePayload {
  projectId?: number | string
  inboundType?: AssetManagementInboundType
  disbursementFlowNo?: string
  businessContractNo?: string
}

export interface AssetManagementConfirmationPayload {
  inboundGoodsValue?: number | string
  inboundValue?: number | string
  inboundType?: AssetManagementInboundType
  arrivalDeadline?: string
  confirmationRemark?: string
}

export interface AssetManagementAssetUpdatePayload {
  productName?: unknown
  largeCategory?: unknown
  middleCategory?: unknown
  smallCategory?: unknown
  batchNo?: unknown
  containerNo?: unknown
  origin?: unknown
  specification?: unknown
  warehouseName?: unknown
  goodsStartDate?: unknown
  goodsEndDate?: unknown
  inboundQuantity?: unknown
  initialRecognitionPrice?: unknown
  goodsOwnership?: unknown
  remark1?: unknown
  remark2?: unknown
}

export interface AssetManagementApplicationMutationResult {
  success: boolean
  message?: string
  record?: AssetManagementApplicationRecord
  image?: AssetManagementApplicationImage
  opinion?: AssetManagementApplicationOpinion
}

export interface AssetManagementBatchSubmitResult {
  success: boolean
  submitted: number
  failedIds: number[]
  message?: string
}

const trim = (value: unknown) => String(value ?? '').trim()
const numberValue = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const amount = (value: unknown, fallback = 0) => Number(numberValue(value, fallback).toFixed(2))
const projectDisbursementFlowNo = (
  project: Pick<AssetManagementProject, 'id' | 'disbursementDate' | 'disbursementFlowNo'>
) =>
  project.disbursementFlowNo ||
  `FK${project.disbursementDate.replaceAll('-', '')}${String(project.id).padStart(4, '0')}`
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const now = () => new Date().toLocaleString('sv-SE').replace('T', ' ')
const today = () => now().slice(0, 10)

const flow = (
  id: number,
  node: string,
  action: string,
  operator: string,
  operatedAt: string,
  comment?: string
): AssetManagementFlowRecord => ({ id, node, action, operator, operatedAt, comment })

interface AssetCatalogItem {
  name: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  origin: string
  specification: string
  unit: string
}

const commonCatalog = (
  names: string[],
  largeCategory: string,
  middleCategory: string,
  origin: string,
  specification: string,
  unit: string
): AssetCatalogItem[] =>
  names.map((name, index) => ({
    name,
    largeCategory,
    middleCategory,
    smallCategory: index % 2 === 0 ? '标准品' : '优等品',
    origin,
    specification,
    unit
  }))

const assetCatalogs: Record<number, AssetCatalogItem[]> = {
  1: commonCatalog(
    ['热轧卷板', '冷轧卷板', '镀锌钢卷', '中厚钢板'],
    '金属材料',
    '钢材',
    '河北唐山',
    'Q235B',
    '吨'
  ),
  2: commonCatalog(
    ['A级电解铜', '无氧铜杆', '紫铜板', '黄铜棒'],
    '金属材料',
    '有色金属',
    '江西鹰潭',
    'CU-CATH-1',
    '吨'
  ),
  3: commonCatalog(
    ['聚丙烯', '高密度聚乙烯', '线性低密度聚乙烯', '聚氯乙烯'],
    '化工原料',
    '合成树脂',
    '浙江宁波',
    '工业一级',
    '吨'
  ),
  4: commonCatalog(
    ['晚籼稻谷', '粳稻', '优质小麦', '玉米'],
    '农产品',
    '粮食',
    '黑龙江绥化',
    '国标三等',
    '吨'
  ),
  5: commonCatalog(
    ['动力煤', '无烟煤', '焦煤', '喷吹煤'],
    '能源矿产',
    '煤炭',
    '山西大同',
    '5500大卡',
    '吨'
  ),
  6: commonCatalog(
    ['壁挂式空调', '立柜式空调', '风管机', '多联机'],
    '家用电器',
    '空气调节器',
    '广东佛山',
    '一级能效',
    '台'
  ),
  7: commonCatalog(
    ['一次性注射器', '医用输液器', '医用纱布', '医用防护服'],
    '医疗器械',
    '医用耗材',
    '江苏苏州',
    '无菌包装',
    '箱'
  ),
  8: commonCatalog(
    ['全脂奶粉', '脱脂奶粉', '乳清粉', '黄油'],
    '食品',
    '乳制品',
    '新西兰',
    '食品级',
    '吨'
  )
}

/**
 * 债项资产管理的唯一 Mock 数据源。
 * 项目同时提供出账、关联业务合同、入库日期等信息，避免页面为一个流程拼接多份零散数据。
 */
export const assetManagementAvailableProjects: AssetManagementProject[] = [
  {
    id: 1,
    projectName: '钢贸供应链融资项目',
    projectNo: 'PJ202607010001',
    customerName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    productScheme: '钢材库存质押融资方案',
    creditNo: 'CR202607010001',
    businessContractNo: 'BCT202607010001',
    businessContractName: '热轧卷板采购合同',
    contractAmount: 12000000,
    currency: '人民币',
    contractStartDate: '2026-07-01',
    contractEndDate: '2026-10-31',
    disbursementAmount: 10000000,
    disbursementDate: '2026-07-18',
    arrivalDeadline: '2026-07-26',
    isEffective: true
  },
  {
    id: 2,
    projectName: '金属库存融资项目',
    projectNo: 'PJ202606180006',
    customerName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    productScheme: '有色金属仓单融资方案',
    creditNo: 'CR202606180006',
    businessContractNo: 'BCT202606180002',
    businessContractName: '电解铜现货采购合同',
    contractAmount: 9800000,
    currency: '人民币',
    contractStartDate: '2026-06-18',
    contractEndDate: '2026-09-30',
    disbursementAmount: 7800000,
    disbursementDate: '2026-07-15',
    arrivalDeadline: '2026-07-23',
    isEffective: true
  },
  {
    id: 3,
    projectName: '化工原料仓单融资项目',
    projectNo: 'PJ202605220009',
    customerName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    productScheme: '化工原料质押融资方案',
    creditNo: 'CR202605220009',
    businessContractNo: 'BCT202605220006',
    businessContractName: '聚丙烯年度采购合同',
    contractAmount: 8600000,
    currency: '人民币',
    contractStartDate: '2026-05-22',
    contractEndDate: '2026-11-30',
    disbursementAmount: 6800000,
    disbursementDate: '2026-07-12',
    arrivalDeadline: '2026-07-25',
    isEffective: true
  },
  {
    id: 4,
    projectName: '粮食收储融资项目',
    projectNo: 'PJ202604280012',
    customerName: '丰禾农业发展有限公司',
    coreCustomerNo: 'C2025041800000027',
    productScheme: '粮食仓单融资方案',
    creditNo: 'CR202604280012',
    businessContractNo: 'BCT202604280005',
    businessContractName: '稻谷收储采购合同',
    contractAmount: 6500000,
    currency: '人民币',
    contractStartDate: '2026-04-28',
    contractEndDate: '2026-10-15',
    disbursementAmount: 5000000,
    disbursementDate: '2026-07-08',
    arrivalDeadline: '2026-07-22',
    isEffective: true
  },
  {
    id: 5,
    projectName: '煤炭库存融资项目',
    projectNo: 'PJ202605080007',
    customerName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    productScheme: '能源库存质押融资方案',
    creditNo: 'CR202605080007',
    businessContractNo: 'BCT202605080003',
    businessContractName: '动力煤采购合同',
    contractAmount: 15000000,
    currency: '人民币',
    contractStartDate: '2026-05-08',
    contractEndDate: '2026-12-31',
    disbursementAmount: 12000000,
    disbursementDate: '2026-07-02',
    arrivalDeadline: '2026-07-16',
    isEffective: true
  },
  {
    id: 6,
    projectName: '家电经销商融资项目',
    projectNo: 'PJ202604120015',
    customerName: '臻品家电有限公司',
    coreCustomerNo: 'C2025021100000068',
    productScheme: '家电库存融资方案',
    creditNo: 'CR202604120015',
    businessContractNo: 'BCT202604120011',
    businessContractName: '家用空调采购框架合同',
    contractAmount: 7200000,
    currency: '人民币',
    contractStartDate: '2026-04-12',
    contractEndDate: '2026-09-30',
    disbursementAmount: 5600000,
    disbursementDate: '2026-07-20',
    arrivalDeadline: '2026-07-30',
    isEffective: true,
    allInboundCompleted: true,
    dynamicControlEnabled: true
  },
  {
    id: 7,
    projectName: '医疗耗材供应链项目',
    projectNo: 'PJ202606300021',
    customerName: '华康医疗器械有限公司',
    coreCustomerNo: 'C2025063000000075',
    productScheme: '医疗耗材采购融资方案',
    creditNo: 'CR202606300021',
    businessContractNo: 'BCT202606300008',
    businessContractName: '诊疗耗材采购合同',
    contractAmount: 4200000,
    currency: '人民币',
    contractStartDate: '2026-06-30',
    contractEndDate: '2026-11-30',
    disbursementAmount: 3200000,
    disbursementDate: '2026-07-19',
    arrivalDeadline: '2026-07-29',
    isEffective: true
  },
  {
    id: 8,
    projectName: '进口食品供应链项目',
    projectNo: 'PJ202603180004',
    customerName: '海盛食品贸易有限公司',
    coreCustomerNo: 'C2025031800000081',
    productScheme: '进口食品采购融资方案',
    creditNo: 'CR202603180004',
    businessContractNo: 'BCT202603180002',
    businessContractName: '进口乳制品采购合同',
    contractAmount: 3600000,
    currency: '人民币',
    contractStartDate: '2026-03-18',
    contractEndDate: '2026-06-30',
    disbursementAmount: 2800000,
    disbursementDate: '2026-04-02',
    arrivalDeadline: '2026-04-15',
    isEffective: false
  }
]

const buildOrderContracts = (project: AssetManagementProject): AssetManagementOrderContract[] => {
  const firstContractAmount = amount(project.contractAmount * 0.68)
  const secondContractAmount = amount(project.contractAmount - firstContractAmount)
  const firstUsedAmount = amount(project.disbursementAmount * 0.68)
  const secondUsedAmount = amount(project.disbursementAmount - firstUsedAmount)
  const base = String(project.id).padStart(4, '0')

  return [
    {
      id: project.id * 100 + 1,
      orderContractFlowNo: `OCF2026${base}01`,
      orderContractNo: project.businessContractNo,
      partyOne: project.customerName,
      partyTwo: '宁波通商银行股份有限公司',
      partyThree: '宁波港通监管仓有限公司',
      contractTotalAmount: firstContractAmount,
      currentUsedAmount: firstUsedAmount,
      remainingAvailableAmount: amount(firstContractAmount - firstUsedAmount),
      currency: project.currency,
      contractStartDate: project.contractStartDate,
      contractEndDate: project.contractEndDate,
      dataSource: '业务合同系统'
    },
    {
      id: project.id * 100 + 2,
      orderContractFlowNo: `OCF2026${base}02`,
      orderContractNo: `${project.businessContractNo}-02`,
      partyOne: project.customerName,
      partyTwo: '宁波通商银行股份有限公司',
      partyThree: '宁波港通监管仓有限公司',
      contractTotalAmount: secondContractAmount,
      currentUsedAmount: secondUsedAmount,
      remainingAvailableAmount: amount(secondContractAmount - secondUsedAmount),
      currency: project.currency,
      contractStartDate: project.contractStartDate,
      contractEndDate: project.contractEndDate,
      dataSource: '供应链金融平台'
    }
  ]
}

const buildAssetDetails = (
  project: AssetManagementProject,
  inboundGoodsValue: number,
  contracts: AssetManagementOrderContract[]
): AssetManagementAssetDetail[] => {
  const catalog = assetCatalogs[project.id] || assetCatalogs[1]
  const valueRates = [0.36, 0.29, 0.2, 0.15]
  const quantities = [860, 720, 560, 420]
  let assignedValue = 0

  return catalog.map((item, index) => {
    const initialRecognitionValue =
      index === catalog.length - 1
        ? amount(inboundGoodsValue - assignedValue)
        : amount(inboundGoodsValue * valueRates[index])
    assignedValue = amount(assignedValue + initialRecognitionValue)
    const inboundQuantity = quantities[index] + project.id * 10
    const assetStatus: AssetManagementAssetStatus = index % 2 === 0 ? '已到港' : '待入库'

    return {
      id: project.id * 1000 + index + 1,
      orderContractId: index < 2 ? contracts[0].id : contracts[1].id,
      productCode: `SP${String(project.id).padStart(2, '0')}${String(index + 1).padStart(4, '0')}`,
      productName: item.name,
      largeCategory: item.largeCategory,
      middleCategory: item.middleCategory,
      smallCategory: item.smallCategory,
      batchNo: `PC2026${String(project.id).padStart(2, '0')}${String(index + 1).padStart(3, '0')}`,
      containerNo: `CN${String(project.id).padStart(2, '0')}${String(index + 1).padStart(6, '0')}`,
      origin: item.origin,
      specification: item.specification,
      warehouseName: assetStatus === '已到港' ? '宁波港通监管仓' : '在途监管仓',
      inboundQuantity,
      quantityUnit: item.unit,
      initialRecognitionPrice: amount(initialRecognitionValue / inboundQuantity),
      initialRecognitionValue,
      currency: project.currency,
      goodsStartDate: project.contractStartDate,
      goodsEndDate: project.contractEndDate,
      goodsOwnership: '核心企业',
      remark1: '',
      remark2: '',
      assetStatus
    }
  })
}

const fromProject = (
  project: AssetManagementProject,
  data: Pick<
    AssetManagementApplicationRecord,
    | 'id'
    | 'applicationNo'
    | 'inboundGoodsValue'
    | 'applicationDate'
    | 'inboundType'
    | 'phase'
    | 'status'
    | 'images'
    | 'opinions'
    | 'flowRecords'
    | 'currentStage'
    | 'completedAt'
  >
): AssetManagementApplicationRecord => {
  const orderContracts = buildOrderContracts(project)

  return {
    id: data.id,
    applicationNo: data.applicationNo,
    projectId: project.id,
    projectName: project.projectName,
    projectNo: project.projectNo,
    customerName: project.customerName,
    linkedCustomerName: project.linkedCustomerName || project.customerName,
    coreCustomerNo: project.coreCustomerNo,
    productScheme: project.productScheme,
    productPlan: project.productPlan || project.productScheme,
    creditNo: project.creditNo,
    disbursementFlowNo: projectDisbursementFlowNo(project),
    relatedBusinessContractNo: project.businessContractNo,
    businessContractNo: project.businessContractNo,
    businessContractName: project.businessContractName,
    contractAmount: project.contractAmount,
    businessContractAmount: project.businessContractAmount || project.contractAmount,
    currency: project.currency,
    contractStartDate: project.contractStartDate,
    contractEndDate: project.contractEndDate,
    disbursementAmount: project.disbursementAmount,
    outboundAmount: project.outboundAmount || project.disbursementAmount,
    disbursementDate: project.disbursementDate,
    billingDate: project.billingDate || project.disbursementDate,
    arrivalDeadline: project.arrivalDeadline,
    arrivalPort: project.arrivalPort || '监管仓指定到货地',
    arrivalDate: project.arrivalDate,
    inboundDate: project.inboundDate,
    inboundGoodsValue: data.inboundGoodsValue,
    inboundValue: data.inboundGoodsValue,
    confirmationRemark: '',
    applicationDate: data.applicationDate,
    inboundType: data.inboundType,
    phase: data.phase,
    status: data.status,
    currentStage: data.currentStage,
    completedAt: data.completedAt,
    images: data.images,
    opinions: data.opinions,
    flowRecords: data.flowRecords,
    orderContracts,
    assetDetails: buildAssetDetails(project, data.inboundGoodsValue, orderContracts)
  }
}

/** 为内网页面常用的同义字段补齐值，供“选择有效项目”弹窗直接使用。 */
export const withAssetManagementProjectAliases = (
  project: AssetManagementProject
): AssetManagementProject => ({
  ...project,
  linkedCustomerName: project.linkedCustomerName || project.customerName,
  productPlan: project.productPlan || project.productScheme,
  disbursementFlowNo: projectDisbursementFlowNo(project),
  businessContractAmount: project.businessContractAmount || project.contractAmount,
  outboundAmount: project.outboundAmount || project.disbursementAmount,
  billingDate: project.billingDate || project.disbursementDate,
  arrivalPort: project.arrivalPort || '监管仓指定到货地'
})

/**
 * 待处理、审查审批中、审批通过三个节点均有可直接操作的样例。
 * 有效项目 6、7 尚未生成在途申请，专门保留给“新增”弹窗测试。
 */
export const assetManagementApplicationRecords: AssetManagementApplicationRecord[] = [
  fromProject(assetManagementAvailableProjects[0], {
    id: 1,
    applicationNo: 'AMA202607210001',
    inboundGoodsValue: 8600000,
    applicationDate: '2026-07-21',
    inboundType: '部分入库',
    phase: 'pending',
    status: '待处理',
    images: [
      {
        id: 1,
        name: '钢材入库提单及装箱单.pdf',
        url: '/mock-files/asset-management/steel-arrival-20260721.pdf',
        uploadedAt: '2026-07-21 09:20:00',
        uploader: '张晨'
      }
    ],
    opinions: [],
    flowRecords: [
      flow(1, '入库申请', '创建申请', '张晨', '2026-07-21 09:15:00', '待核实本批货物入库情况')
    ]
  }),
  fromProject(assetManagementAvailableProjects[4], {
    id: 2,
    applicationNo: 'AMA202607200002',
    inboundGoodsValue: 12000000,
    applicationDate: '2026-07-20',
    inboundType: '全部入库',
    phase: 'rejected',
    status: '被否决',
    currentStage: '已退回',
    completedAt: '2026-07-21 10:25:00',
    images: [
      {
        id: 1,
        name: '煤炭入库验收单.jpg',
        url: '/mock-files/asset-management/coal-arrival-20260720.jpg',
        uploadedAt: '2026-07-20 15:40:00',
        uploader: '李敏'
      }
    ],
    opinions: [
      {
        id: 1,
        content: '业务合同项下入库货值与监管仓验收材料不一致，请补充后重新发起。',
        signer: '运营管理部',
        signedAt: '2026-07-21 10:25:00'
      }
    ],
    flowRecords: [
      flow(1, '入库申请', '创建申请', '李敏', '2026-07-20 15:35:00'),
      flow(2, '客户经理', '提交申请', '李敏', '2026-07-20 16:00:00'),
      flow(
        3,
        '经营单位负责人审批',
        '审批否决',
        '运营管理部',
        '2026-07-21 10:25:00',
        '业务合同项下入库货值与监管仓验收材料不一致，请补充后重新发起。'
      )
    ]
  }),
  fromProject(assetManagementAvailableProjects[1], {
    id: 3,
    applicationNo: 'AMA202607180003',
    inboundGoodsValue: 7600000,
    applicationDate: '2026-07-18',
    inboundType: '全部入库',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '经营单位负责人审批',
    images: [
      {
        id: 1,
        name: '电解铜入库确认单.pdf',
        url: '/mock-files/asset-management/copper-inbound-20260718.pdf',
        uploadedAt: '2026-07-18 10:45:00',
        uploader: '王磊'
      }
    ],
    opinions: [
      {
        id: 1,
        content: '请重点核验仓单数量和合同约定数量的一致性。',
        signer: '运营管理部',
        signedAt: '2026-07-19 11:20:00'
      }
    ],
    flowRecords: [
      flow(1, '入库申请', '创建申请', '王磊', '2026-07-18 10:30:00'),
      flow(2, '客户经理', '提交申请', '王磊', '2026-07-18 11:00:00'),
      flow(
        3,
        '经营单位负责人审批',
        '签署意见',
        '运营管理部',
        '2026-07-19 11:20:00',
        '请重点核验仓单数量和合同约定数量的一致性。'
      )
    ]
  }),
  fromProject(assetManagementAvailableProjects[2], {
    id: 4,
    applicationNo: 'AMA202607160004',
    inboundGoodsValue: 6250000,
    applicationDate: '2026-07-16',
    inboundType: '部分入库',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '贷后管理岗审批',
    images: [],
    opinions: [
      {
        id: 1,
        content: '建议补充监管方入库巡检记录后完成审批。',
        signer: '风险管理部',
        signedAt: '2026-07-17 14:35:00'
      }
    ],
    flowRecords: [
      flow(1, '入库申请', '创建申请', '陈芳', '2026-07-16 09:15:00'),
      flow(2, '客户经理', '提交申请', '陈芳', '2026-07-16 10:10:00'),
      flow(
        3,
        '风险管理部',
        '签署意见',
        '风险管理部',
        '2026-07-17 14:35:00',
        '建议补充监管方入库巡检记录后完成审批。'
      )
    ]
  }),
  fromProject(assetManagementAvailableProjects[3], {
    id: 5,
    applicationNo: 'AMA202607120005',
    inboundGoodsValue: 5000000,
    applicationDate: '2026-07-12',
    inboundType: '全部入库',
    phase: 'approved',
    status: '审批通过',
    currentStage: '审批完成',
    completedAt: '2026-07-15 16:30:00',
    images: [
      {
        id: 1,
        name: '粮食入库监管确认书.pdf',
        url: '/mock-files/asset-management/grain-inbound-20260712.pdf',
        uploadedAt: '2026-07-12 13:10:00',
        uploader: '周毅'
      }
    ],
    opinions: [
      {
        id: 1,
        content: '入库货值与实际出账金额匹配，同意入库。',
        signer: '贷后管理岗',
        signedAt: '2026-07-15 16:30:00'
      }
    ],
    flowRecords: [
      flow(1, '入库申请', '创建申请', '周毅', '2026-07-12 09:00:00'),
      flow(2, '客户经理', '提交申请', '周毅', '2026-07-12 10:15:00'),
      flow(
        3,
        '贷后管理岗',
        '审批通过',
        '贷后管理岗',
        '2026-07-15 16:30:00',
        '入库货值与实际出账金额匹配，同意入库。'
      )
    ]
  })
]

const mutationSuccess = (
  record: AssetManagementApplicationRecord,
  message?: string
): AssetManagementApplicationMutationResult => ({
  success: true,
  message,
  record: clone(record)
})

const mutationFailure = (message: string): AssetManagementApplicationMutationResult => ({
  success: false,
  message
})

const nextId = () => Math.max(0, ...assetManagementApplicationRecords.map((item) => item.id)) + 1
const nextChildId = (items: Array<{ id: number }>) =>
  Math.max(0, ...items.map((item) => item.id)) + 1

const appendFlow = (
  record: AssetManagementApplicationRecord,
  node: string,
  action: string,
  operator = '本地演示用户',
  comment?: string
) => {
  record.flowRecords.push(
    flow(nextChildId(record.flowRecords), node, action, operator, now(), comment)
  )
}

const appendOpinion = (
  record: AssetManagementApplicationRecord,
  content: string,
  signer = '本地演示用户'
) => {
  const opinion: AssetManagementApplicationOpinion = {
    id: nextChildId(record.opinions),
    content,
    signer,
    signedAt: now()
  }
  record.opinions.push(opinion)
  appendFlow(record, record.currentStage || '入库申请', '签署意见', signer, content)
  return opinion
}

export const getAssetManagementApplicationRecord = (id: number | string) =>
  assetManagementApplicationRecords.find((item) => item.id === Number(id))

export const updateAssetManagementAssetDetailRecord = (
  applicationId: number | string,
  assetId: number | string,
  payload: AssetManagementAssetUpdatePayload
): AssetManagementApplicationMutationResult => {
  const record = getAssetManagementApplicationRecord(applicationId)
  if (!record) return mutationFailure('债项资产入库申请不存在')

  const asset = record.assetDetails.find((item) => item.id === Number(assetId))
  if (!asset) return mutationFailure('债项资产明细不存在')

  const productName = trim(payload.productName)
  if (!productName) return mutationFailure('商品名称不能为空')

  const largeCategory = trim(payload.largeCategory)
  const middleCategory = trim(payload.middleCategory)
  const smallCategory = trim(payload.smallCategory)
  if (!largeCategory || !middleCategory || !smallCategory)
    return mutationFailure('请选择完整的商品分类')

  const batchNo = trim(payload.batchNo)
  const containerNo = trim(payload.containerNo)
  const specification = trim(payload.specification)
  if (!batchNo || !containerNo || !specification)
    return mutationFailure('请完整填写批次号、柜号和规格')

  const origin = trim(payload.origin)
  if (!origin) return mutationFailure('请选择产地')

  const warehouseName = trim(payload.warehouseName)
  if (!warehouseName) return mutationFailure('请选择仓储地')

  const goodsStartDate = trim(payload.goodsStartDate)
  const goodsEndDate = trim(payload.goodsEndDate)
  if (!goodsStartDate || !goodsEndDate) return mutationFailure('请选择货物起止日期')
  if (goodsEndDate < goodsStartDate) return mutationFailure('货物到期日不能早于货物起始日')

  const inboundQuantity = numberValue(payload.inboundQuantity)
  if (inboundQuantity <= 0) return mutationFailure('入库数量/重量必须大于0')

  const initialRecognitionPrice = amount(payload.initialRecognitionPrice)
  if (initialRecognitionPrice <= 0) return mutationFailure('初始认定价格必须大于0')

  const goodsOwnership = trim(payload.goodsOwnership)
  if (!['核心企业', '借款人'].includes(goodsOwnership))
    return mutationFailure('请选择货物所有权')

  asset.productName = productName
  asset.largeCategory = largeCategory
  asset.middleCategory = middleCategory
  asset.smallCategory = smallCategory
  asset.batchNo = batchNo
  asset.containerNo = containerNo
  asset.origin = origin
  asset.specification = specification
  asset.warehouseName = warehouseName
  asset.goodsStartDate = goodsStartDate
  asset.goodsEndDate = goodsEndDate
  asset.inboundQuantity = inboundQuantity
  asset.initialRecognitionPrice = initialRecognitionPrice
  asset.initialRecognitionValue = amount(inboundQuantity * initialRecognitionPrice)
  asset.goodsOwnership = goodsOwnership
  asset.remark1 = trim(payload.remark1)
  asset.remark2 = trim(payload.remark2)
  return mutationSuccess(record, '债项资产明细已更新')
}

/** 根据项目生成待提交的债项资产入库申请。 */
export const createAssetManagementApplicationRecord = (
  payload: AssetManagementApplicationCreatePayload
): AssetManagementApplicationMutationResult => {
  const projectId = Number(payload.projectId)
  const project = assetManagementAvailableProjects.find(
    (item) => item.id === projectId && item.isEffective
  )
  if (!project) return mutationFailure('请选择符合条件的已完成放款记录')

  const inboundType: AssetManagementInboundType = ['部分入库', '全部入库', '动态补货'].includes(
    String(payload.inboundType)
  )
    ? (payload.inboundType as AssetManagementInboundType)
    : '部分入库'
  if (inboundType === '动态补货') {
    if (!project.allInboundCompleted || !project.dynamicControlEnabled) {
      return mutationFailure('动态补货仅支持已完成全部入库且采用动态控制的放款记录')
    }
  } else if (project.allInboundCompleted) {
    return mutationFailure('该放款记录已完成全部入库，请选择动态补货')
  }

  const disbursementFlowNo = projectDisbursementFlowNo(project)
  if (payload.disbursementFlowNo && trim(payload.disbursementFlowNo) !== disbursementFlowNo) {
    return mutationFailure('所选放款流水与项目不匹配，请重新选择')
  }

  const hasInProgressApplication = assetManagementApplicationRecords.some(
    (item) =>
      item.projectId === project.id && (item.phase === 'pending' || item.phase === 'reviewing')
  )
  if (hasInProgressApplication)
    return mutationFailure('该项目已有待处理或审查审批中的入库申请，不能重复新增')

  const availableContracts = buildOrderContracts(project)
  const businessContractNo = trim(payload.businessContractNo) || project.businessContractNo
  if (!availableContracts.some((item) => item.orderContractNo === businessContractNo))
    return mutationFailure('请选择当前项目下的有效业务合同')

  const id = nextId()
  const record = fromProject(project, {
    id,
    applicationNo: `AMA${today().replaceAll('-', '')}${String(id).padStart(4, '0')}`,
    inboundGoodsValue:
      inboundType === '全部入库'
        ? project.disbursementAmount
        : inboundType === '动态补货'
          ? amount(project.disbursementAmount * 0.2)
          : amount(project.disbursementAmount * 0.8),
    applicationDate: today(),
    inboundType,
    phase: 'pending',
    status: '待提交',
    images: [],
    opinions: [],
    flowRecords: []
  })
  record.relatedBusinessContractNo = businessContractNo
  record.businessContractNo = businessContractNo
  appendFlow(record, '入库申请', '创建申请')
  assetManagementApplicationRecords.unshift(record)
  return mutationSuccess(record, '已创建待提交的债项资产入库申请')
}

/** 待处理节点确认入库货值、入库类型或入库截止日期。 */
export const updateAssetManagementConfirmationRecord = (
  id: number | string,
  payload: AssetManagementConfirmationPayload
): AssetManagementApplicationMutationResult => {
  const record = getAssetManagementApplicationRecord(id)
  if (!record) return mutationFailure('债项资产入库申请不存在')
  if (record.phase !== 'pending') return mutationFailure('仅待提交的债项资产入库申请可修改')

  const rawInboundGoodsValue = payload.inboundGoodsValue ?? payload.inboundValue
  if (rawInboundGoodsValue !== undefined && trim(rawInboundGoodsValue) !== '') {
    const inboundGoodsValue = amount(rawInboundGoodsValue, -1)
    if (inboundGoodsValue < 0) return mutationFailure('入库货值必须为大于等于 0 的金额')
    record.inboundGoodsValue = inboundGoodsValue
    record.inboundValue = inboundGoodsValue
  }
  if (['部分入库', '全部入库', '动态补货'].includes(String(payload.inboundType))) {
    record.inboundType = payload.inboundType as AssetManagementInboundType
  }
  if (payload.arrivalDeadline !== undefined && trim(payload.arrivalDeadline)) {
    record.arrivalDeadline = trim(payload.arrivalDeadline)
  }
  if (payload.confirmationRemark !== undefined) {
    record.confirmationRemark = trim(payload.confirmationRemark)
  }
  appendFlow(record, '入库申请', '更新确认信息')
  return mutationSuccess(record, '入库申请信息已保存')
}

export const signAssetManagementApplicationOpinionRecord = (
  id: number | string,
  opinion: unknown
) => {
  const record = getAssetManagementApplicationRecord(id)
  const content = trim(opinion)
  if (!record || !content) return mutationFailure('请填写签署意见，并确认债项资产入库申请存在')
  const signedOpinion = appendOpinion(record, content)
  return { ...mutationSuccess(record, '签署意见已保存'), opinion: clone(signedOpinion) }
}

export const submitAssetManagementApplicationRecord = (
  id: number | string
): AssetManagementApplicationMutationResult => {
  const record = getAssetManagementApplicationRecord(id)
  if (!record || record.phase !== 'pending')
    return mutationFailure('仅待提交的债项资产入库申请可提交')
  if (record.inboundGoodsValue < 0) return mutationFailure('请填写正确的入库货值后再提交')

  record.phase = 'reviewing'
  record.status = '审查审批中'
  record.currentStage = '经营单位负责人审批'
  record.completedAt = undefined
  appendFlow(record, '客户经理', '提交申请')
  return mutationSuccess(record, '已提交至审查审批流程')
}

export const batchSubmitAssetManagementApplicationRecords = (
  ids: Array<number | string>,
  opinion?: unknown
): AssetManagementBatchSubmitResult => {
  const uniqueIds = Array.from(
    new Set(ids.map((id) => Number(id)).filter((id) => Number.isFinite(id)))
  )
  const failedIds: number[] = []
  let submitted = 0
  uniqueIds.forEach((id) => {
    const record = getAssetManagementApplicationRecord(id)
    if (!record || record.phase !== 'pending') {
      failedIds.push(id)
      return
    }
    const content = trim(opinion)
    if (content) appendOpinion(record, content)
    const result = submitAssetManagementApplicationRecord(id)
    if (result.success) submitted += 1
    else failedIds.push(id)
  })
  return {
    success: failedIds.length === 0,
    submitted,
    failedIds,
    message: failedIds.length
      ? `已提交 ${submitted} 条，${failedIds.length} 条无法提交`
      : `已提交 ${submitted} 条入库申请`
  }
}

export const withdrawAssetManagementApplicationRecord = (
  id: number | string
): AssetManagementApplicationMutationResult => {
  const record = getAssetManagementApplicationRecord(id)
  if (!record || record.phase !== 'reviewing')
    return mutationFailure('仅审查审批中的债项资产入库申请可收回')

  record.phase = 'pending'
  record.status = '待提交'
  record.currentStage = undefined
  record.completedAt = undefined
  appendFlow(record, '客户经理', '收回申请')
  return mutationSuccess(record, '申请已收回至待提交的债项资产入库申请')
}

/** Mock 审批入口，供演示“审批通过的债项资产入库申请”节点。 */
export const approveAssetManagementApplicationRecord = (
  id: number | string,
  opinion?: unknown
): AssetManagementApplicationMutationResult => {
  const record = getAssetManagementApplicationRecord(id)
  if (!record || record.phase !== 'reviewing')
    return mutationFailure('仅审查审批中的债项资产入库申请可审批通过')

  const content = trim(opinion) || '放款流水、入库货值及债项资产明细核验一致，同意审批通过。'
  appendFlow(record, '经营单位负责人', '审批通过', '经营单位负责人', content)
  appendFlow(record, '债项管理岗', '审批通过', '债项管理岗', content)
  const signedOpinion = appendOpinion(record, content, '贷后管理岗')
  record.phase = 'approved'
  record.status = '审批通过'
  record.currentStage = '审批完成'
  record.completedAt = now()
  appendFlow(record, '贷后管理岗', '审批通过', '贷后管理岗', content)
  return {
    ...mutationSuccess(record, '审批通过，已完成债项资产入库确认'),
    opinion: clone(signedOpinion)
  }
}

export const getAssetManagementApplicationImages = (id: number | string) => {
  const record = getAssetManagementApplicationRecord(id)
  return record ? clone(record.images) : undefined
}

export const uploadAssetManagementApplicationImage = (id: number | string, fileName: unknown) => {
  const record = getAssetManagementApplicationRecord(id)
  const name = trim(fileName)
  if (!record || !name) return mutationFailure('请选择影像文件，并确认债项资产入库申请存在')
  const image: AssetManagementApplicationImage = {
    id: nextChildId(record.images),
    name,
    url: `/mock-files/asset-management/${encodeURIComponent(name)}`,
    uploadedAt: now(),
    uploader: '本地演示用户'
  }
  record.images.push(image)
  appendFlow(record, record.currentStage || '入库申请', '上传影像')
  return { ...mutationSuccess(record, '影像上传成功'), image: clone(image) }
}

export const getAssetManagementApplicationOpinions = (id: number | string) => {
  const record = getAssetManagementApplicationRecord(id)
  return record ? clone(record.opinions) : undefined
}

export const getAssetManagementApplicationFlowRecords = (id: number | string) => {
  const record = getAssetManagementApplicationRecord(id)
  return record ? clone(record.flowRecords) : undefined
}
