export type OfflineLedgerApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'
export type OfflineLedgerApplicationStatus = '待提交' | '审查审批中' | '被否决' | '审批通过'

export interface OfflineLedgerApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

export interface OfflineLedgerApplicationRecord {
  id: number
  applicationNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productPlan: string
  projectName: string
  projectNo: string
  regulatorEnterpriseName: string
  offlineLedgerName: string
  offlineLedgerCode: string
  offlineLedgerType: string
  insuranceExpiryDate: string
  applicationDate: string
  phase: OfflineLedgerApplicationPhase
  status: OfflineLedgerApplicationStatus
  currentStage?: string
  completedAt?: string
  opinions?: OfflineLedgerApplicationOpinion[]
}

export interface OfflineLedgerApplicationCreatePayload {
  coreEnterpriseName?: string
  coreCustomerNo?: string
  productPlan?: string
  projectName?: string
  projectNo?: string
  regulatorEnterpriseName?: string
  offlineLedgerName?: string
  offlineLedgerCode?: string
  offlineLedgerType?: string
  insuranceExpiryDate?: string
}

/**
 * 债项管理 - 台账管理的唯一 Mock 数据源。
 * 四种状态均保留少量样例，方便左侧节点切换、查询和按钮流转演示。
 */
export const offlineLedgerApplicationRecords: OfflineLedgerApplicationRecord[] = [
  {
    id: 1,
    applicationNo: 'OLU202607210001',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    productPlan: '单一客户综合授信',
    projectName: '钢贸供应链融资项目',
    projectNo: 'PJ202607010001',
    regulatorEnterpriseName: '中储南京物流有限公司',
    offlineLedgerName: '南京滨江钢材仓',
    offlineLedgerCode: 'WH-NJ-001',
    offlineLedgerType: '线下台账',
    insuranceExpiryDate: '2027-06-30',
    applicationDate: '2026-07-21',
    phase: 'pending',
    status: '待提交'
  },
  {
    id: 2,
    applicationNo: 'OLU202607200002',
    coreEnterpriseName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    productPlan: '存货质押融资',
    projectName: '金属库存融资项目',
    projectNo: 'PJ202606180006',
    regulatorEnterpriseName: '上海物流监管服务有限公司',
    offlineLedgerName: '上海临港有色仓',
    offlineLedgerCode: 'WH-SH-002',
    offlineLedgerType: '历史台账',
    insuranceExpiryDate: '2027-05-15',
    applicationDate: '2026-07-20',
    phase: 'pending',
    status: '待提交'
  },
  {
    id: 3,
    applicationNo: 'OLU202607180003',
    coreEnterpriseName: '新城贸易有限公司',
    coreCustomerNo: 'C2025060800000036',
    productPlan: '经销商融资',
    projectName: '经销商融资项目',
    projectNo: 'PJ202606050003',
    regulatorEnterpriseName: '华北仓储监管有限公司',
    offlineLedgerName: '天津东丽综合仓',
    offlineLedgerCode: 'WH-TJ-003',
    offlineLedgerType: '线下台账',
    insuranceExpiryDate: '2027-03-31',
    applicationDate: '2026-07-18',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '运营管理部审查',
    opinions: [
      {
        id: 1,
        content: '台账基础材料齐全，建议进入下一审查环节。',
        signer: '张晨',
        signedAt: '2026-07-19 09:30:00'
      }
    ]
  },
  {
    id: 4,
    applicationNo: 'OLU202607160004',
    coreEnterpriseName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    productPlan: '仓单质押融资',
    projectName: '化工原料仓单融资项目',
    projectNo: 'PJ202605220009',
    regulatorEnterpriseName: '江苏恒信监管有限公司',
    offlineLedgerName: '常州化工线下管理说明',
    offlineLedgerCode: 'WH-CZ-004',
    offlineLedgerType: '线下管理说明',
    insuranceExpiryDate: '2026-12-31',
    applicationDate: '2026-07-16',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '授信审批委员会审批',
    opinions: [
      {
        id: 2,
        content: '请关注保险续保安排及监管方现场巡检频次。',
        signer: '李敏',
        signedAt: '2026-07-17 14:10:00'
      }
    ]
  },
  {
    id: 5,
    applicationNo: 'OLU202607120005',
    coreEnterpriseName: '丰禾农业发展有限公司',
    coreCustomerNo: 'C2025041800000027',
    productPlan: '农产品存货融资',
    projectName: '粮食收储融资项目',
    projectNo: 'PJ202604280012',
    regulatorEnterpriseName: '中粮仓储监管服务有限公司',
    offlineLedgerName: '吉林松原粮食仓',
    offlineLedgerCode: 'WH-JL-005',
    offlineLedgerType: '线下台账',
    insuranceExpiryDate: '2026-10-20',
    applicationDate: '2026-07-12',
    phase: 'rejected',
    status: '被否决',
    currentStage: '审批结束',
    completedAt: '2026-07-15 16:20:00'
  },
  {
    id: 6,
    applicationNo: 'OLU202607080006',
    coreEnterpriseName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    productPlan: '能源库存融资',
    projectName: '煤炭库存融资项目',
    projectNo: 'PJ202605080007',
    regulatorEnterpriseName: '中储能源监管有限公司',
    offlineLedgerName: '唐山港煤炭监管仓',
    offlineLedgerCode: 'WH-TS-006',
    offlineLedgerType: '台账附件',
    insuranceExpiryDate: '2027-01-31',
    applicationDate: '2026-07-08',
    phase: 'approved',
    status: '审批通过',
    currentStage: '审批完成',
    completedAt: '2026-07-14 10:45:00'
  },
  {
    id: 7,
    applicationNo: 'OLU202607050007',
    coreEnterpriseName: '臻品家电有限公司',
    coreCustomerNo: 'C2025021100000068',
    productPlan: '经销商存货融资',
    projectName: '家电经销商融资项目',
    projectNo: 'PJ202604120015',
    regulatorEnterpriseName: '粤港仓储监管有限公司',
    offlineLedgerName: '广州南沙家电仓',
    offlineLedgerCode: 'WH-GZ-007',
    offlineLedgerType: '线下台账',
    insuranceExpiryDate: '2027-02-28',
    applicationDate: '2026-07-05',
    phase: 'approved',
    status: '审批通过',
    currentStage: '审批完成',
    completedAt: '2026-07-11 14:30:00'
  }
]

const trim = (value: unknown) => String(value || '').trim()
const now = () => new Date().toLocaleString('sv-SE').replace('T', ' ')
const today = () => now().slice(0, 10)

export const createOfflineLedgerApplicationRecord = (
  payload: OfflineLedgerApplicationCreatePayload
): OfflineLedgerApplicationRecord => {
  const id = Math.max(0, ...offlineLedgerApplicationRecords.map((record) => record.id)) + 1
  const sequence = String(id).padStart(4, '0')
  const record: OfflineLedgerApplicationRecord = {
    id,
    applicationNo: `OLU${today().replaceAll('-', '')}${sequence}`,
    coreEnterpriseName: trim(payload.coreEnterpriseName) || '待完善核心企业',
    coreCustomerNo: trim(payload.coreCustomerNo) || '待完善客户编号',
    productPlan: trim(payload.productPlan) || '待完善产品方案',
    projectName: trim(payload.projectName) || '待完善项目',
    projectNo: trim(payload.projectNo) || `PJ${today().replaceAll('-', '')}${sequence}`,
    regulatorEnterpriseName: trim(payload.regulatorEnterpriseName) || '待完善监管方企业',
    offlineLedgerName: trim(payload.offlineLedgerName) || '待完善台账',
    offlineLedgerCode: trim(payload.offlineLedgerCode) || `OL-MOCK-${sequence}`,
    offlineLedgerType: trim(payload.offlineLedgerType) || '线下台账',
    insuranceExpiryDate: trim(payload.insuranceExpiryDate) || '',
    applicationDate: today(),
    phase: 'pending',
    status: '待提交'
  }

  offlineLedgerApplicationRecords.unshift(record)
  return record
}

/** 将待提交申请推入审查审批流程；重复提交或不存在的记录返回 undefined。 */
export const submitOfflineLedgerApplicationRecord = (id: number | string) => {
  const record = offlineLedgerApplicationRecords.find((item) => item.id === Number(id))
  if (!record || record.status !== '待提交') return undefined

  record.status = '审查审批中'
  record.phase = 'reviewing'
  record.currentStage = '运营管理部审查'
  record.completedAt = undefined
  return record
}

/** 审查审批中申请的“收回”操作，重新回到待提交节点。 */
export const withdrawOfflineLedgerApplicationRecord = (id: number | string) => {
  const record = offlineLedgerApplicationRecords.find((item) => item.id === Number(id))
  if (!record || record.phase !== 'reviewing') return undefined

  record.phase = 'pending'
  record.status = '待提交'
  record.currentStage = undefined
  record.completedAt = undefined
  return record
}

export const getOfflineLedgerApplicationRecord = (id: number | string) =>
  offlineLedgerApplicationRecords.find((item) => item.id === Number(id))

export const signOfflineLedgerApplicationOpinionRecord = (id: number | string, opinion: unknown) => {
  const record = offlineLedgerApplicationRecords.find((item) => item.id === Number(id))
  const content = trim(opinion)
  if (!record || !content) return undefined

  const currentOpinions = record.opinions || []
  const signedOpinion: OfflineLedgerApplicationOpinion = {
    id: Math.max(0, ...currentOpinions.map((item) => item.id)) + 1,
    content,
    signer: '本地演示用户',
    signedAt: now()
  }
  record.opinions = [...currentOpinions, signedOpinion]
  return { record, opinion: signedOpinion }
}
