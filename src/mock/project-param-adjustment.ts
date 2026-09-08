/** 项目参数调整申请的本地演示菜单与业务数据。 */
export const projectParamAdjustmentMenu = [
  { key: '1010', title: '待提交的项目参数调整申请', value: ['add', 'cancel', 'detail', 'signOpinion', 'submit'], isLeaf: true },
  { key: '1020', title: '审查审批中的项目参数调整申请', value: ['detail', 'toRecord', 'viewOpinion'], isLeaf: true },
  { key: '1040', title: '审批通过的项目参数调整申请', value: ['detail', 'toRecord', 'viewOpinion'], isLeaf: true }
]

export const projectParamAdjustmentRecords = [
  {
    id: 'PARAM-001', phaseType: '1010', serialNo: 'PC202607300001', serialno: 'PC202607300001', projectId: 'PJ202607010001', customerId: 'C2025040300000003', customerName: '阿姆特拉斯供应链有限公司', projectName: '钢贸供应链融资项目', projectTypeNm: '先票/款后货', flowName: '项目参数调整申请流程', phaseName: '待提交', phaseNo: '1010', inputUserId: '张晨', inputOrgId: '上海分行供应链金融部', inputDate: '2026-07-30 09:20:00', objectType: 'ParamAdjustGYL'
  },
  {
    id: 'PARAM-002', phaseType: '1010', serialNo: 'PC202607300002', serialno: 'PC202607300002', projectId: 'PJ202607010002', customerId: 'C202607200001', customerName: '华东供应链有限公司', projectName: '华东商贸保理项目', projectTypeNm: '供应链保理融资', flowName: '项目参数调整申请流程', phaseName: '待提交', phaseNo: '1010', inputUserId: '李敏', inputOrgId: '总行供应链金融部', inputDate: '2026-07-30 10:05:00', objectType: 'ParamAdjustGYL'
  },
  {
    id: 'PARAM-003', phaseType: '1020', serialNo: 'PC202607280003', serialno: 'PC202607280003', projectId: 'PJ202607020003', customerId: 'C2025051200000018', customerName: '双胞胎农牧有限公司', projectName: '双胞胎农牧融资项目', projectTypeNm: '货押融资', flowName: '项目参数调整申请流程', phaseName: '经营单位负责人审批', phaseNo: '1020', inputUserId: '陈敏', inputOrgId: '南昌分行', inputDate: '2026-07-28 15:30:00', objectType: 'ParamAdjustGYL'
  },
  {
    id: 'PARAM-004', phaseType: '1040', serialNo: 'PC202607180004', serialno: 'PC202607180004', projectId: 'PJ202607050006', customerId: 'C2025060100000021', customerName: '通威饲料贸易有限公司', projectName: '通威供应链融资项目', projectTypeNm: '供应链流动资金贷款', flowName: '项目参数调整申请流程', phaseName: '审批完成', phaseNo: '1040', inputUserId: '周凯', inputOrgId: '成都分行', inputDate: '2026-07-18 16:10:00', objectType: 'ParamAdjustGYL'
  }
]

const nextSerialNo = () => `PC${new Date().toISOString().slice(0, 10).replaceAll('-', '')}${String(projectParamAdjustmentRecords.length + 1).padStart(4, '0')}`

export const projectParamAdjustmentPage = (params: Record<string, unknown> = {}) => {
  const value = (key: string) => String(params[key] ?? '').trim()
  const phaseType = value('phaseType') || value('key')
  const projectName = value('projectName')
  const customerName = value('customerName')
  const pageNo = Math.max(1, Number(value('pageNo') || value('pageNum') || 1))
  const pageSize = Math.max(1, Number(value('pageSize') || 20))
  const records = projectParamAdjustmentRecords.filter((record) =>
    (!phaseType || record.phaseType === phaseType) &&
    (!projectName || record.projectName.includes(projectName)) &&
    (!customerName || record.customerName.includes(customerName))
  )
  const list = records.slice((pageNo - 1) * pageSize, pageNo * pageSize)
  return { total: records.length, list, records: list, pageNo, pageSize }
}

export const projectParamAdjustmentProjects = [
  { projectId: 'PJ202607010001', projectName: '钢贸供应链融资项目', coreEntName: '阿姆特拉斯供应链有限公司', customerId: 'C2025040300000003', projectTypeNm: '先票/款后货' },
  { projectId: 'PJ202607010002', projectName: '华东商贸保理项目', coreEntName: '华东供应链有限公司', customerId: 'C202607200001', projectTypeNm: '供应链保理融资' },
  { projectId: 'PJ202607020003', projectName: '双胞胎农牧融资项目', coreEntName: '双胞胎农牧有限公司', customerId: 'C2025051200000018', projectTypeNm: '货押融资' }
]

export const createProjectParamAdjustmentRecord = (payload: Record<string, unknown> = {}) => {
  const project = projectParamAdjustmentProjects.find((item) => item.projectId === String(payload.projectId || '')) || projectParamAdjustmentProjects[0]
  const serialNo = nextSerialNo()
  const record = {
    id: `PARAM-${String(projectParamAdjustmentRecords.length + 1).padStart(3, '0')}`,
    phaseType: '1010', serialNo, serialno: serialNo,
    projectId: String(payload.projectId || project.projectId), customerId: String(payload.customerId || project.customerId),
    customerName: String(payload.coreEntName || project.coreEntName), projectName: String(payload.projectName || project.projectName),
    projectTypeNm: project.projectTypeNm, flowName: '项目参数调整申请流程', phaseName: '待提交', phaseNo: '1010',
    inputUserId: '本地演示用户', inputOrgId: '上海分行供应链金融部', inputDate: new Date().toLocaleString('sv-SE'), objectType: 'ParamAdjustGYL'
  }
  projectParamAdjustmentRecords.unshift(record)
  return record
}

export const cancelProjectParamAdjustmentRecord = (serialNo: unknown) => {
  const index = projectParamAdjustmentRecords.findIndex((item) => item.serialNo === String(serialNo || ''))
  if (index < 0) return null
  return projectParamAdjustmentRecords.splice(index, 1)[0]
}

const headDocks = [
  ['BasicPart_HEAD', '基本信息'],
  ['CreditPart_HEAD', '授信参数'],
  ['ContractPart_HEAD', '出账参数'],
  ['OperationsPart_HEAD', '运营参数'],
  ['SCPart_HEAD', '供应链参数']
]

const dockDefinitions = [
  ['BasicProjectPart', '项目基本信息', 'BasicPart_HEAD'],
  ['CreditBasePart', '额度及授信参数', 'CreditPart_HEAD'],
  ['ContractBasePart', '出账控制参数', 'ContractPart_HEAD'],
  ['OperationsBasePart', '运营管理参数', 'OperationsPart_HEAD'],
  ['SupplyChainBasePart', '供应链业务参数', 'SCPart_HEAD']
]

const fieldsByDock: Record<string, Array<[string, string, string?, string?]>> = {
  BasicProjectPart: [
    ['项目编号', 'projectid'], ['项目名称', 'projectname'], ['核心企业/合作方名称', 'customername'],
    ['客户编号', 'customerid'], ['项目类型', 'projecttype'], ['项目状态', 'projectstatus'],
    ['申请编号', 'serialno'], ['申请机构', 'applyorgname']
  ],
  CreditBasePart: [
    ['项目额度', 'businesssum', '数字', '万元'], ['项目敞口', 'exposuresum', '数字', '万元'],
    ['额度期限', 'creditterm', '整数', '月'], ['币种', 'currency'], ['贷款投向', 'directionname'],
    ['是否循环额度', 'isrevolving'], ['主要担保方式', 'vouchtypename'], ['风险缓释措施', 'riskmitigation']
  ],
  ContractBasePart: [
    ['单笔最小金额', 'singleminamount', '数字', '万元'], ['单笔最大金额', 'singlemaxamount', '数字', '万元'],
    ['最高融资比例', 'financingratio', '数字', '%'], ['单笔最长期限', 'singlemaxterm', '整数', '天'],
    ['利率浮动范围', 'ratefloatrange'], ['是否受托支付', 'istrustedpayment'],
    ['回款账户', 'repaymentaccount'], ['还款方式', 'repaymentmethod']
  ],
  OperationsBasePart: [
    ['额度使用预警阈值', 'creditwarningrate', '数字', '%'], ['业务对账频率', 'reconciliationfrequency'],
    ['价格跌幅预警阈值', 'pricewarningrate', '数字', '%'], ['是否自动监控', 'isautomonitor'],
    ['数据更新频率', 'dataupdatefrequency'], ['每日业务截止时间', 'businesscutofftime']
  ],
  SupplyChainBasePart: [
    ['核心企业回款账户', 'corepaymentaccount'], ['上游客户准入方式', 'upstreamaccess'],
    ['下游客户准入方式', 'downstreamaccess'], ['最大链属层级', 'maxchainlevel', '整数', '级'],
    ['链属客户单户限额', 'singlecustomerlimit', '数字', '万元'], ['供应链集合额度', 'chaincreditlimit', '数字', '万元'],
    ['供应链管理员', 'chainmanager'], ['参数生效日期', 'effectivedate', '日期']
  ]
}

export const projectParamAdjustmentTemplateInfo = {
  headdocks: headDocks.map(([dockid, dockname]) => ({ dockid, dockname })),
  docks: dockDefinitions.map(([dockid, dockname, grouphead]) => ({
    dockid, dockname, grouphead, docktype: 'columns'
  })),
  templates: dockDefinitions.flatMap(([dockid]) =>
    fieldsByDock[dockid].map(([colheader, colname, colcheckformat, colunit], index) => ({
      dockid,
      colheader,
      colname,
      colspan: 6,
      colvisible: '1',
      colreadonly: dockid === 'BasicProjectPart' ? '1' : '0',
      colrequired: '0',
      coleditstyle: '文本框',
      colcheckformat: colcheckformat || '',
      colunit: colunit || '',
      colindex: index + 1
    }))
  )
}

const savedParametersKey = 'mock-project-param-adjustment-values'
export const projectParamAdjustmentHistoryTemplate = {
  templates: [
    ['申请编号', 'serialno'], ['项目名称', 'projectname'], ['调整状态', 'phasename'],
    ['申请人', 'inputuserid'], ['申请日期', 'inputdate'], ['操作', 'operation']
  ].map(([colheader, colname]) => ({ colheader, colname, colvisible: '1', colhtmlstyle: 'width:200px' }))
}

export const projectParamAdjustmentHistoryPage = (projectId: unknown) => {
  const list = projectParamAdjustmentRecords
    .filter((record) => record.projectId === String(projectId))
    .map((record) => ({
      serialno: record.serialNo, projectname: record.projectName, phasename: record.phaseName,
      inputuserid: record.inputUserId, inputdate: record.inputDate
    }))
  return { list, records: list, total: list.length }
}

const readSavedParameters = (): Record<string, Record<string, unknown>> => {
  try {
    return JSON.parse(sessionStorage.getItem(savedParametersKey) || '{}')
  } catch {
    return {}
  }
}

export const saveProjectParamAdjustmentTemplateValue = (payload: Record<string, unknown>) => {
  const serialNo = String(payload.serialno || payload.serialNo || '')
  if (!serialNo) throw new Error('申请编号不能为空')
  const saved = readSavedParameters()
  saved[serialNo] = { ...saved[serialNo], ...payload }
  sessionStorage.setItem(savedParametersKey, JSON.stringify(saved))
  return true
}

export const getProjectParamAdjustmentTemplateValue = (serialNo: unknown) => {
  const record = projectParamAdjustmentRecords.find((item) => item.serialNo === String(serialNo || '')) || projectParamAdjustmentRecords[0]
  return {
    projectid: record.projectId,
    projectname: record.projectName,
    customername: record.customerName,
    customerid: record.customerId,
    projecttype: record.projectTypeNm,
    projectstatus: record.phaseName,
    serialno: record.serialNo,
    applyorgname: record.inputOrgId,
    businesssum: 12000,
    exposuresum: 8500,
    creditterm: 12,
    currency: '人民币',
    directionname: '批发和零售业流动资金周转',
    isrevolving: '是',
    vouchtypename: '存货质押+核心企业回购',
    riskmitigation: '动态盯市、跌价补仓、回款闭环管理',
    singleminamount: 50,
    singlemaxamount: 2000,
    financingratio: 80,
    singlemaxterm: 180,
    ratefloatrange: 'LPR+80BP至LPR+180BP',
    istrustedpayment: '是',
    repaymentaccount: '6217000012345678901',
    repaymentmethod: '按月付息、到期还本',
    creditwarningrate: 85,
    reconciliationfrequency: '每日',
    pricewarningrate: 10,
    isautomonitor: '是',
    dataupdatefrequency: '每2小时',
    businesscutofftime: '17:30',
    corepaymentaccount: '6217000098765432108',
    upstreamaccess: '核心企业推荐并经银行审核',
    downstreamaccess: '白名单准入',
    maxchainlevel: 3,
    singlecustomerlimit: 1500,
    chaincreditlimit: 10000,
    chainmanager: '张晨（上海分行供应链金融部）',
    effectivedate: '2026-08-01',
    ...readSavedParameters()[String(serialNo || record.serialNo)]
  }
}
