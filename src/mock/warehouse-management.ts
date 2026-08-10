export type WarehouseApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'
export type WarehouseApplicationStatus = '待提交' | '审查审批中' | '被否决' | '审批通过'

export interface WarehouseApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

export interface WarehouseApplicationRecord {
  id: number
  applicationNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
  projectName: string
  projectNo: string
  regulatorEnterpriseName: string
  warehouseName: string
  warehouseCode: string
  warehouseType: string
  insuranceExpiryDate: string
  applicationDate: string
  phase: WarehouseApplicationPhase
  status: WarehouseApplicationStatus
  currentStage?: string
  completedAt?: string
  opinions?: WarehouseApplicationOpinion[]
}

export interface WarehouseApplicationCreatePayload {
  coreEnterpriseName?: string
  coreCustomerNo?: string
  projectName?: string
  projectNo?: string
  regulatorEnterpriseName?: string
  warehouseName?: string
  warehouseCode?: string
  warehouseType?: string
  insuranceExpiryDate?: string
}

/**
 * 债项管理 - 仓库管理的唯一 Mock 数据源。
 * 四种状态均保留少量样例，方便左侧节点切换、查询和按钮流转演示。
 */
export const warehouseApplicationRecords: WarehouseApplicationRecord[] = [
  {
    id: 1,
    applicationNo: 'WH202607210001',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    projectName: '钢贸供应链融资项目',
    projectNo: 'PJ202607010001',
    regulatorEnterpriseName: '中储南京物流有限公司',
    warehouseName: '南京滨江钢材仓',
    warehouseCode: 'WH-NJ-001',
    warehouseType: '普通仓',
    insuranceExpiryDate: '2027-06-30',
    applicationDate: '2026-07-21',
    phase: 'pending',
    status: '待提交'
  },
  {
    id: 2,
    applicationNo: 'WH202607200002',
    coreEnterpriseName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    projectName: '金属库存融资项目',
    projectNo: 'PJ202606180006',
    regulatorEnterpriseName: '上海物流监管服务有限公司',
    warehouseName: '上海临港有色仓',
    warehouseCode: 'WH-SH-002',
    warehouseType: '保税仓',
    insuranceExpiryDate: '2027-05-15',
    applicationDate: '2026-07-20',
    phase: 'pending',
    status: '待提交'
  },
  {
    id: 3,
    applicationNo: 'WH202607180003',
    coreEnterpriseName: '新城贸易有限公司',
    coreCustomerNo: 'C2025060800000036',
    projectName: '经销商融资项目',
    projectNo: 'PJ202606050003',
    regulatorEnterpriseName: '华北仓储监管有限公司',
    warehouseName: '天津东丽综合仓',
    warehouseCode: 'WH-TJ-003',
    warehouseType: '普通仓',
    insuranceExpiryDate: '2027-03-31',
    applicationDate: '2026-07-18',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '运营管理部审查',
    opinions: [
      {
        id: 1,
        content: '仓库基础材料齐全，建议进入下一审查环节。',
        signer: '张晨',
        signedAt: '2026-07-19 09:30:00'
      }
    ]
  },
  {
    id: 4,
    applicationNo: 'WH202607160004',
    coreEnterpriseName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    projectName: '化工原料仓单融资项目',
    projectNo: 'PJ202605220009',
    regulatorEnterpriseName: '江苏恒信监管有限公司',
    warehouseName: '常州化工专用仓',
    warehouseCode: 'WH-CZ-004',
    warehouseType: '专用仓',
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
    applicationNo: 'WH202607120005',
    coreEnterpriseName: '丰禾农业发展有限公司',
    coreCustomerNo: 'C2025041800000027',
    projectName: '粮食收储融资项目',
    projectNo: 'PJ202604280012',
    regulatorEnterpriseName: '中粮仓储监管服务有限公司',
    warehouseName: '吉林松原粮食仓',
    warehouseCode: 'WH-JL-005',
    warehouseType: '普通仓',
    insuranceExpiryDate: '2026-10-20',
    applicationDate: '2026-07-12',
    phase: 'rejected',
    status: '被否决',
    currentStage: '审批结束',
    completedAt: '2026-07-15 16:20:00'
  },
  {
    id: 6,
    applicationNo: 'WH202607080006',
    coreEnterpriseName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    projectName: '煤炭库存融资项目',
    projectNo: 'PJ202605080007',
    regulatorEnterpriseName: '中储能源监管有限公司',
    warehouseName: '唐山港煤炭监管仓',
    warehouseCode: 'WH-TS-006',
    warehouseType: '堆场仓',
    insuranceExpiryDate: '2027-01-31',
    applicationDate: '2026-07-08',
    phase: 'approved',
    status: '审批通过',
    currentStage: '审批完成',
    completedAt: '2026-07-14 10:45:00'
  },
  {
    id: 7,
    applicationNo: 'WH202607050007',
    coreEnterpriseName: '臻品家电有限公司',
    coreCustomerNo: 'C2025021100000068',
    projectName: '家电经销商融资项目',
    projectNo: 'PJ202604120015',
    regulatorEnterpriseName: '粤港仓储监管有限公司',
    warehouseName: '广州南沙家电仓',
    warehouseCode: 'WH-GZ-007',
    warehouseType: '普通仓',
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

export const createWarehouseApplicationRecord = (
  payload: WarehouseApplicationCreatePayload
): WarehouseApplicationRecord => {
  const id = Math.max(0, ...warehouseApplicationRecords.map((record) => record.id)) + 1
  const sequence = String(id).padStart(4, '0')
  const record: WarehouseApplicationRecord = {
    id,
    applicationNo: `WH${today().replaceAll('-', '')}${sequence}`,
    coreEnterpriseName: trim(payload.coreEnterpriseName) || '待完善核心企业',
    coreCustomerNo: trim(payload.coreCustomerNo) || '待完善客户编号',
    projectName: trim(payload.projectName) || '待完善项目',
    projectNo: trim(payload.projectNo) || `PJ${today().replaceAll('-', '')}${sequence}`,
    regulatorEnterpriseName: trim(payload.regulatorEnterpriseName) || '待完善监管方企业',
    warehouseName: trim(payload.warehouseName) || '待完善仓库',
    warehouseCode: trim(payload.warehouseCode) || `WH-MOCK-${sequence}`,
    warehouseType: trim(payload.warehouseType) || '普通仓',
    insuranceExpiryDate: trim(payload.insuranceExpiryDate) || '',
    applicationDate: today(),
    phase: 'pending',
    status: '待提交'
  }

  warehouseApplicationRecords.unshift(record)
  return record
}

/** 将待提交申请推入审查审批流程；重复提交或不存在的记录返回 undefined。 */
export const submitWarehouseApplicationRecord = (id: number | string) => {
  const record = warehouseApplicationRecords.find((item) => item.id === Number(id))
  if (!record || record.status !== '待提交') return undefined

  record.status = '审查审批中'
  record.phase = 'reviewing'
  record.currentStage = '运营管理部审查'
  record.completedAt = undefined
  return record
}

/** 审查审批中申请的“收回”操作，重新回到待提交节点。 */
export const withdrawWarehouseApplicationRecord = (id: number | string) => {
  const record = warehouseApplicationRecords.find((item) => item.id === Number(id))
  if (!record || record.phase !== 'reviewing') return undefined

  record.phase = 'pending'
  record.status = '待提交'
  record.currentStage = undefined
  record.completedAt = undefined
  return record
}

export const getWarehouseApplicationRecord = (id: number | string) =>
  warehouseApplicationRecords.find((item) => item.id === Number(id))

export const signWarehouseApplicationOpinionRecord = (id: number | string, opinion: unknown) => {
  const record = warehouseApplicationRecords.find((item) => item.id === Number(id))
  const content = trim(opinion)
  if (!record || !content) return undefined

  const currentOpinions = record.opinions || []
  const signedOpinion: WarehouseApplicationOpinion = {
    id: Math.max(0, ...currentOpinions.map((item) => item.id)) + 1,
    content,
    signer: '本地演示用户',
    signedAt: now()
  }
  record.opinions = [...currentOpinions, signedOpinion]
  return { record, opinion: signedOpinion }
}

export interface WarehouseInspectionRecord {
  id: number
  applicationNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
  projectName: string
  projectNo: string
  inspectionDate: string
  applicationDate: string
  phase: WarehouseApplicationPhase
  status: WarehouseApplicationStatus
  currentStage?: string
  completedAt?: string
  receivedAt?: string
  opinions?: WarehouseApplicationOpinion[]
}

export interface ProjectWarehouseInfo {
  id: number
  warehouseName: string
  warehouseCode: string
  warehouseType: string
  regulatorEnterpriseName: string
  insuranceExpiryDate: string
  inspectionDate: string
  status: string
}

export interface EffectiveSupplyChainProject {
  id: number
  projectName: string
  projectNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
  productPlan: string
}

export const effectiveSupplyChainProjects: EffectiveSupplyChainProject[] = [
  {
    id: 1,
    projectName: '钢贸供应链融资项目',
    projectNo: 'PJ202607010001',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    productPlan: '货押融资'
  },
  {
    id: 2,
    projectName: '金属库存融资项目',
    projectNo: 'PJ202606180006',
    coreEnterpriseName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    productPlan: '先票后货'
  },
  {
    id: 3,
    projectName: '化工原料仓单融资项目',
    projectNo: 'PJ202605220009',
    coreEnterpriseName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    productPlan: '货押融资'
  },
  {
    id: 4,
    projectName: '粮食收储融资项目',
    projectNo: 'PJ202604280012',
    coreEnterpriseName: '丰禾农业发展有限公司',
    coreCustomerNo: 'C2025041800000027',
    productPlan: '先票后货'
  },
  {
    id: 5,
    projectName: '煤炭库存融资项目',
    projectNo: 'PJ202605080007',
    coreEnterpriseName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    productPlan: '货押融资'
  }
]

export const projectWarehousesMap: Record<string, ProjectWarehouseInfo[]> = {
  PJ202607010001: [
    {
      id: 1,
      warehouseName: '南京滨江钢材仓',
      warehouseCode: 'WH-NJ-001',
      warehouseType: '普通仓',
      regulatorEnterpriseName: '中储南京物流有限公司',
      insuranceExpiryDate: '2027-06-30',
      inspectionDate: '2026-06-15',
      status: '正常运营'
    },
    {
      id: 2,
      warehouseName: '无锡太湖钢材中心仓',
      warehouseCode: 'WH-WX-002',
      warehouseType: '普通仓',
      regulatorEnterpriseName: '江苏大金物流有限公司',
      insuranceExpiryDate: '2027-04-20',
      inspectionDate: '2026-06-15',
      status: '正常运营'
    }
  ],
  PJ202606180006: [
    {
      id: 3,
      warehouseName: '上海临港有色仓',
      warehouseCode: 'WH-SH-002',
      warehouseType: '保税仓',
      regulatorEnterpriseName: '上海物流监管服务有限公司',
      insuranceExpiryDate: '2027-05-15',
      inspectionDate: '2026-05-20',
      status: '正常运营'
    }
  ],
  PJ202605220009: [
    {
      id: 4,
      warehouseName: '常州化工专用仓',
      warehouseCode: 'WH-CZ-004',
      warehouseType: '专用仓',
      regulatorEnterpriseName: '江苏恒信监管有限公司',
      insuranceExpiryDate: '2026-12-31',
      inspectionDate: '2026-05-10',
      status: '正常运营'
    }
  ],
  PJ202605080007: [
    {
      id: 5,
      warehouseName: '唐山港煤炭监管仓',
      warehouseCode: 'WH-TS-006',
      warehouseType: '堆场仓',
      regulatorEnterpriseName: '中储能源监管有限公司',
      insuranceExpiryDate: '2027-01-31',
      inspectionDate: '2026-07-25',
      status: '正常运营'
    }
  ]
}

export const warehouseInspectionRecords: WarehouseInspectionRecord[] = [
  {
    id: 1,
    applicationNo: 'INSP202608010001',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    projectName: '钢贸供应链融资项目',
    projectNo: 'PJ202607010001',
    inspectionDate: '2026-08-15',
    applicationDate: '2026-08-01',
    phase: 'pending',
    status: '待提交'
  },
  {
    id: 2,
    applicationNo: 'INSP202608020002',
    coreEnterpriseName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    projectName: '金属库存融资项目',
    projectNo: 'PJ202606180006',
    inspectionDate: '2026-08-20',
    applicationDate: '2026-08-02',
    phase: 'pending',
    status: '待提交'
  },
  {
    id: 3,
    applicationNo: 'INSP202607280003',
    coreEnterpriseName: '恒源化工有限公司',
    coreCustomerNo: 'C2025032600000041',
    projectName: '化工原料仓单融资项目',
    projectNo: 'PJ202605220009',
    inspectionDate: '2026-08-10',
    applicationDate: '2026-07-28',
    receivedAt: '2026-07-29 09:00:00',
    phase: 'reviewing',
    status: '审查审批中',
    currentStage: '分行债项管理岗审批',
    opinions: [
      {
        id: 1,
        content: '巡库计划时间合理，仓库经营情况良好，拟同意巡库申请。',
        signer: '王立强',
        signedAt: '2026-07-29 10:15:00'
      }
    ]
  },
  {
    id: 4,
    applicationNo: 'INSP202607200004',
    coreEnterpriseName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    projectName: '煤炭库存融资项目',
    projectNo: 'PJ202605080007',
    inspectionDate: '2026-07-25',
    applicationDate: '2026-07-20',
    receivedAt: '2026-07-21 10:00:00',
    phase: 'approved',
    status: '审批通过',
    currentStage: '审批完成',
    completedAt: '2026-07-23 15:30:00',
    opinions: [
      {
        id: 2,
        content: '审批通过。巡库日期已更新至该项目关联的所有仓库。',
        signer: '分行债项管理岗',
        signedAt: '2026-07-23 15:30:00'
      }
    ]
  }
]

export const createWarehouseInspectionRecord = (payload: any): WarehouseInspectionRecord => {
  const id = Math.max(0, ...warehouseInspectionRecords.map((r) => r.id)) + 1
  const sequence = String(id).padStart(4, '0')
  const record: WarehouseInspectionRecord = {
    id,
    applicationNo: `INSP${today().replaceAll('-', '')}${sequence}`,
    coreEnterpriseName: trim(payload.coreEnterpriseName) || '阿姆特拉斯供应链有限公司',
    coreCustomerNo: trim(payload.coreCustomerNo) || 'C2025040300000003',
    projectName: trim(payload.projectName) || '钢贸供应链融资项目',
    projectNo: trim(payload.projectNo) || 'PJ202607010001',
    inspectionDate: trim(payload.inspectionDate) || today(),
    applicationDate: today(),
    phase: 'pending',
    status: '待提交'
  }
  warehouseInspectionRecords.unshift(record)
  return record
}

export const submitWarehouseInspectionRecord = (id: number | string) => {
  const record = warehouseInspectionRecords.find((r) => r.id === Number(id))
  if (!record || record.phase !== 'pending') return undefined
  record.phase = 'reviewing'
  record.status = '审查审批中'
  record.currentStage = '分行债项管理岗审批'
  record.receivedAt = now()
  return record
}

export const withdrawWarehouseInspectionRecord = (id: number | string) => {
  const record = warehouseInspectionRecords.find((r) => r.id === Number(id))
  if (!record || record.phase !== 'reviewing') return undefined
  record.phase = 'pending'
  record.status = '待提交'
  record.currentStage = undefined
  return record
}

export const approveWarehouseInspectionRecord = (id: number | string, opinion?: unknown) => {
  const record = warehouseInspectionRecords.find((r) => r.id === Number(id))
  if (!record || record.phase !== 'reviewing') return undefined
  record.phase = 'approved'
  record.status = '审批通过'
  record.currentStage = '审批完成'
  record.completedAt = now()
  const content = trim(opinion) || '审批通过，已将巡库日期同步更新至项目下所有关联仓库。'
  const currentOpinions = record.opinions || []
  record.opinions = [
    ...currentOpinions,
    {
      id: Math.max(0, ...currentOpinions.map((item) => item.id)) + 1,
      content,
      signer: '分行债项管理岗',
      signedAt: now()
    }
  ]

  const pNo = record.projectNo
  if (projectWarehousesMap[pNo]) {
    projectWarehousesMap[pNo].forEach((wh) => {
      wh.inspectionDate = record.inspectionDate
    })
  }

  return record
}

export const signWarehouseInspectionOpinionRecord = (id: number | string, opinion: unknown) => {
  const record = warehouseInspectionRecords.find((r) => r.id === Number(id))
  const content = trim(opinion)
  if (!record || !content) return undefined
  const currentOpinions = record.opinions || []
  const signedOpinion = {
    id: Math.max(0, ...currentOpinions.map((item) => item.id)) + 1,
    content,
    signer: '分行债项管理岗',
    signedAt: now()
  }
  record.opinions = [...currentOpinions, signedOpinion]
  return { record, opinion: signedOpinion }
}

export const getProjectWarehousesRecord = (projectNo: string) => {
  const list = projectWarehousesMap[projectNo]
  if (list) return list
  return [
    {
      id: 99,
      warehouseName: '标准供应链监管仓',
      warehouseCode: 'WH-STD-099',
      warehouseType: '普通仓',
      regulatorEnterpriseName: '中央仓储物流有限公司',
      insuranceExpiryDate: '2027-12-31',
      inspectionDate: '2026-07-01',
      status: '正常运营'
    }
  ]
}
