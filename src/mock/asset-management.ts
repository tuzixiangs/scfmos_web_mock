export type AssetManagementApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'
export type AssetManagementApplicationStatus = '待提交' | '待处理' | '审查审批中' | '被否决' | '审批通过'
export type AssetManagementInboundType = '部分入库' | '已完成入库'
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
}

export interface AssetManagementApplicationCreatePayload {
  projectId?: number | string
  inboundType?: AssetManagementInboundType
}

export interface AssetManagementConfirmationPayload {
  inboundGoodsValue?: number | string
  inboundValue?: number | string
  inboundType?: AssetManagementInboundType
  arrivalDeadline?: string
  confirmationRemark?: string
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
    isEffective: true
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
): AssetManagementApplicationRecord => ({
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
  flowRecords: data.flowRecords
})

/** 为内网页面常用的同义字段补齐值，供“选择有效项目”弹窗直接使用。 */
export const withAssetManagementProjectAliases = (project: AssetManagementProject): AssetManagementProject => ({
  ...project,
  linkedCustomerName: project.linkedCustomerName || project.customerName,
  productPlan: project.productPlan || project.productScheme,
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
    flowRecords: [flow(1, '入库申请', '创建申请', '张晨', '2026-07-21 09:15:00', '待核实本批货物入库情况')]
  }),
  fromProject(assetManagementAvailableProjects[4], {
    id: 2,
    applicationNo: 'AMA202607200002',
    inboundGoodsValue: 12000000,
    applicationDate: '2026-07-20',
    inboundType: '已完成入库',
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
      flow(3, '运营管理部审查', '审批否决', '运营管理部', '2026-07-21 10:25:00', '业务合同项下入库货值与监管仓验收材料不一致，请补充后重新发起。')
    ]
  }),
  fromProject(assetManagementAvailableProjects[1], {
    id: 3,
    applicationNo: 'AMA202607180003',
    inboundGoodsValue: 7600000,
    applicationDate: '2026-07-18',
    inboundType: '已完成入库',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '运营管理部审查',
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
      flow(3, '运营管理部审查', '签署意见', '运营管理部', '2026-07-19 11:20:00', '请重点核验仓单数量和合同约定数量的一致性。')
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
    currentStage: '授信审批委员会审批',
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
      flow(3, '风险管理部', '签署意见', '风险管理部', '2026-07-17 14:35:00', '建议补充监管方入库巡检记录后完成审批。')
    ]
  }),
  fromProject(assetManagementAvailableProjects[3], {
    id: 5,
    applicationNo: 'AMA202607120005',
    inboundGoodsValue: 5000000,
    applicationDate: '2026-07-12',
    inboundType: '已完成入库',
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
        signer: '授信审批委员会',
        signedAt: '2026-07-15 16:30:00'
      }
    ],
    flowRecords: [
      flow(1, '入库申请', '创建申请', '周毅', '2026-07-12 09:00:00'),
      flow(2, '客户经理', '提交申请', '周毅', '2026-07-12 10:15:00'),
      flow(3, '授信审批委员会', '审批通过', '授信审批委员会', '2026-07-15 16:30:00', '入库货值与实际出账金额匹配，同意入库。')
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

const mutationFailure = (message: string): AssetManagementApplicationMutationResult => ({ success: false, message })

const nextId = () => Math.max(0, ...assetManagementApplicationRecords.map((item) => item.id)) + 1
const nextChildId = (items: Array<{ id: number }>) => Math.max(0, ...items.map((item) => item.id)) + 1

const appendFlow = (
  record: AssetManagementApplicationRecord,
  node: string,
  action: string,
  operator = '本地演示用户',
  comment?: string
) => {
  record.flowRecords.push(flow(nextChildId(record.flowRecords), node, action, operator, now(), comment))
}

const appendOpinion = (record: AssetManagementApplicationRecord, content: string, signer = '本地演示用户') => {
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

/** 根据项目生成待提交的债项资产入库申请。 */
export const createAssetManagementApplicationRecord = (
  payload: AssetManagementApplicationCreatePayload
): AssetManagementApplicationMutationResult => {
  const projectId = Number(payload.projectId)
  const project = assetManagementAvailableProjects.find((item) => item.id === projectId && item.isEffective)
  if (!project) return mutationFailure('请选择仍有效且可办理入库申请的项目')

  const hasInProgressApplication = assetManagementApplicationRecords.some(
    (item) => item.projectId === project.id && (item.phase === 'pending' || item.phase === 'reviewing')
  )
  if (hasInProgressApplication) return mutationFailure('该项目已有待处理或审查审批中的入库申请，不能重复新增')

  const id = nextId()
  const inboundType = payload.inboundType === '已完成入库' ? '已完成入库' : '部分入库'
  const record = fromProject(project, {
    id,
    applicationNo: `AMA${today().replaceAll('-', '')}${String(id).padStart(4, '0')}`,
    inboundGoodsValue:
      inboundType === '已完成入库' ? project.disbursementAmount : amount(project.disbursementAmount * 0.8),
    applicationDate: today(),
    inboundType,
    phase: 'pending',
    status: '待提交',
    images: [],
    opinions: [],
    flowRecords: []
  })
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
  if (payload.inboundType === '部分入库' || payload.inboundType === '已完成入库') {
    record.inboundType = payload.inboundType
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

export const signAssetManagementApplicationOpinionRecord = (id: number | string, opinion: unknown) => {
  const record = getAssetManagementApplicationRecord(id)
  const content = trim(opinion)
  if (!record || !content) return mutationFailure('请填写签署意见，并确认债项资产入库申请存在')
  const signedOpinion = appendOpinion(record, content)
  return { ...mutationSuccess(record, '签署意见已保存'), opinion: clone(signedOpinion) }
}

export const submitAssetManagementApplicationRecord = (id: number | string): AssetManagementApplicationMutationResult => {
  const record = getAssetManagementApplicationRecord(id)
  if (!record || record.phase !== 'pending') return mutationFailure('仅待提交的债项资产入库申请可提交')
  if (record.inboundGoodsValue < 0) return mutationFailure('请填写正确的入库货值后再提交')

  record.phase = 'reviewing'
  record.status = '审查审批中'
  record.currentStage = '运营管理部审查'
  record.completedAt = undefined
  appendFlow(record, '客户经理', '提交申请')
  return mutationSuccess(record, '已提交至审查审批流程')
}

export const batchSubmitAssetManagementApplicationRecords = (
  ids: Array<number | string>,
  opinion?: unknown
): AssetManagementBatchSubmitResult => {
  const uniqueIds = Array.from(new Set(ids.map((id) => Number(id)).filter((id) => Number.isFinite(id))))
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
    message: failedIds.length ? `已提交 ${submitted} 条，${failedIds.length} 条无法提交` : `已提交 ${submitted} 条入库申请`
  }
}

export const withdrawAssetManagementApplicationRecord = (id: number | string): AssetManagementApplicationMutationResult => {
  const record = getAssetManagementApplicationRecord(id)
  if (!record || record.phase !== 'reviewing') return mutationFailure('仅审查审批中的债项资产入库申请可收回')

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
  if (!record || record.phase !== 'reviewing') return mutationFailure('仅审查审批中的债项资产入库申请可审批通过')

  const content = trim(opinion) || '入库货值与关联业务合同匹配，同意审批通过。'
  const signedOpinion = appendOpinion(record, content, '授信审批委员会')
  record.phase = 'approved'
  record.status = '审批通过'
  record.currentStage = '审批完成'
  record.completedAt = now()
  appendFlow(record, '授信审批委员会', '审批通过', '授信审批委员会', content)
  return { ...mutationSuccess(record, '审批通过，已完成债项资产入库确认'), opinion: clone(signedOpinion) }
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
