type CreditApprovalType = 'N' | 'Y'

type CreditApprovalRecord = {
  type: CreditApprovalType
  phaseNo: string
  flowNo: string
  objectno: string
  objectNo: string
  customerid: string
  customerID: string
  customername: string
  applymodeltypename: string
  gylflagname: string
  businesstypename: string
  businesstype: string
  viroccurtypename: string
  occurtype: string
  currencyname: string
  businesssum: number
  latestphasename: string
  mrchflg: string
  gylcustomertype: string
  projectname: string
  begintime: string
  endtime: string
  applytype: string
  objecttype: string
  phaseno: string
  flowno: string
}

/** 项目授信审批：左侧流程节点（与 creditReviewAprrovalTreeList 接口字段保持一致） */
export const projectCreditApprovalMenus: Record<CreditApprovalType, Array<Record<string, unknown>>> = {
  N: [
    { flowNo: 'PROJECT_CREDIT_APPROVAL', phaseNo: '1020', phaseName: '待经营单位负责人审批', workCount: 2 },
    { flowNo: 'PROJECT_CREDIT_APPROVAL', phaseNo: '1030', phaseName: '待项目授信审查审批', workCount: 1 },
    { flowNo: 'PROJECT_CREDIT_APPROVAL', phaseNo: '1040', phaseName: '待授信审批', workCount: 1 }
  ],
  Y: [
    { flowNo: 'PROJECT_CREDIT_APPROVAL', phaseNo: '1050', phaseName: '审批通过的项目授信申请', workCount: 2 },
    { flowNo: 'PROJECT_CREDIT_APPROVAL', phaseNo: '1060', phaseName: '被否决的项目授信申请', workCount: 1 }
  ]
}

const record = (
  type: CreditApprovalType,
  phaseNo: string,
  suffix: string,
  customername: string,
  projectname: string,
  businesssum: number,
  latestphasename: string,
  overrides: Partial<CreditApprovalRecord> = {}
): CreditApprovalRecord => {
  const objectNo = `PCA202607${suffix}`
  return {
    type,
    phaseNo,
    flowNo: 'PROJECT_CREDIT_APPROVAL',
    objectno: objectNo,
    objectNo,
    customerid: `C20250403${suffix.slice(-8)}`,
    customerID: `C20250403${suffix.slice(-8)}`,
    customername,
    applymodeltypename: '项目授信审批',
    gylflagname: '供应链金融',
    businesstypename: '单一客户综合授信',
    businesstype: 'SCF_WORKING_CAPITAL',
    viroccurtypename: '新增',
    occurtype: '01',
    currencyname: '人民币',
    businesssum,
    latestphasename,
    mrchflg: '供应链金融平台',
    gylcustomertype: '核心企业',
    projectname,
    begintime: '2026-07-28 09:30:00',
    endtime: type === 'Y' ? '2026-07-30 15:20:00' : '',
    applytype: 'CreditLineApply',
    objecttype: 'CreditApply',
    phaseno: phaseNo,
    flowno: 'PROJECT_CREDIT_APPROVAL',
    ...overrides
  }
}

/** 项目授信审批列表数据。保留 objectno/objectNo 等历史页面会读取的双字段。 */
export const projectCreditApprovalRecords: CreditApprovalRecord[] = [
  record('N', '1020', '280001', '阿姆特拉斯供应链有限公司', '钢贸供应链融资项目', 10000000, '经营单位负责人审批'),
  record('N', '1020', '280002', '新城贸易有限公司', '经销商综合授信项目', 8000000, '经营单位负责人审批', {
    businesstypename: '经销商融资',
    businesstype: 'DEALER_FINANCE',
    viroccurtypename: '续作',
    occurtype: '02',
    mrchflg: '客户经理录入',
    gylcustomertype: '链属企业',
    begintime: '2026-07-28 10:10:00'
  }),
  record('N', '1030', '280003', '华东供应链有限公司', '核心企业供应链金融项目', 12000000, '项目授信审查审批', {
    businesstypename: '供应链流动资金贷款',
    businesstype: 'SCF_WORKING_CAPITAL',
    latestphasename: '项目授信审查审批',
    begintime: '2026-07-29 14:25:00'
  }),
  record('N', '1040', '280004', '上海铜鑫实业有限公司', '金属库存融资项目', 6500000, '授信审批', {
    businesstypename: '货押融资',
    businesstype: 'GOODS_PLEDGE',
    gylcustomertype: '链属企业',
    begintime: '2026-07-30 09:15:00'
  }),
  record('Y', '1050', '250001', '华东供应链有限公司', '核心企业供应链金融项目', 15000000, '审批通过', {
    begintime: '2026-07-23 11:00:00',
    endtime: '2026-07-25 16:20:00'
  }),
  record('Y', '1050', '250002', '双胞胎（饲料）有限公司', '农牧供应链融资项目', 9000000, '审批通过', {
    businesstypename: '先票/款后货',
    businesstype: 'PREPAYMENT_FINANCE',
    gylcustomertype: '链属企业',
    begintime: '2026-07-24 09:40:00',
    endtime: '2026-07-26 10:05:00'
  }),
  record('Y', '1060', '240001', '天马贸易有限公司', '大宗商品贸易融资项目', 5000000, '审批否决', {
    viroccurtypename: '新增',
    gylcustomertype: '链属企业',
    begintime: '2026-07-21 15:30:00',
    endtime: '2026-07-24 18:00:00'
  })
]

export const projectCreditApprovalPage = (params: Record<string, unknown> = {}) => {
  const type = String(params.type || 'N') === 'Y' ? 'Y' : 'N'
  const phaseNo = String(params.phaseNo || params.phaseno || '').trim()
  const flowNo = String(params.flowNo || params.flowno || '').trim()
  const serialNo = String(params.serialNo || params.objectNo || params.objectno || '').trim()
  const customerName = String(params.customerName || params.customername || '').trim()
  const mrchFlg = String(params.mrchFlg || params.mrchflg || '').trim()
  const virtualOccurType = String(params.virtualOccurType || params.occurtype || '').trim()
  const endTime = String(params.endTime || '').trim()
  const pageNo = Math.max(1, Number(params.pageNo || params.pageNum || 1))
  const pageSize = Math.max(1, Number(params.pageSize || 10))
  const filtered = projectCreditApprovalRecords.filter((item) =>
    item.type === type &&
    (!phaseNo || item.phaseNo === phaseNo) &&
    (!flowNo || item.flowNo === flowNo) &&
    (!serialNo || item.objectno.includes(serialNo)) &&
    (!customerName || item.customername.includes(customerName)) &&
    (!mrchFlg || item.mrchflg.includes(mrchFlg)) &&
    (!virtualOccurType || item.occurtype === virtualOccurType) &&
    (!endTime || item.endtime.includes(endTime))
  )
  const start = (pageNo - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)
  return { total: filtered.length, list, records: list, pageNo, pageSize }
}
