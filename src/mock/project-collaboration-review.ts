export type ProjectCoreviewRecord = {
  [key: string]: unknown
  serialNo: string
  projectName: string
  customerName: string
  customerId: string
  coreviewMethodNm: string
  coreviewTypeNm: string
  inputUserID: string
  branchName: string
  teamName: string
  businessSum: number
  exposureSum: number
  branchAccess: string
  loanProductCategory: string
  industryType: string
  detail: Record<string, unknown>
}

export const projectCoreviewOldDicts: Record<string, Array<{ itemNo: string; itemName: string }>> = {
  ProjectChannelSource: [
    { itemNo: '01', itemName: '陌生拜访-行业营销' },
    { itemNo: '02', itemName: '陌生拜访-产品模式复制' },
    { itemNo: '03', itemName: '陌生拜访-工会联动营销' },
    { itemNo: '04', itemName: '陌生拜访-名单制营销' },
    { itemNo: '05', itemName: '陌生拜访-展会/论坛营销' },
    { itemNo: '06', itemName: '我行客户介绍-产业链客户介绍(本产业链)' },
    { itemNo: '07', itemName: '我行客户介绍-产业链客户介绍(非本产业链)' },
    { itemNo: '08', itemName: '我行客户介绍-非产业链客户介绍' },
    { itemNo: '09', itemName: '社会关系介绍-朋友介绍' },
    { itemNo: '10', itemName: '社会关系介绍-同业银行介绍' },
    { itemNo: '11', itemName: '社会关系介绍-非银机构介绍' },
    { itemNo: '12', itemName: '社会关系介绍-投资机构介绍' },
    { itemNo: '13', itemName: '社会关系介绍-中介渠道介绍' },
    { itemNo: '14', itemName: '政府介绍-园区管委会介绍' },
    { itemNo: '15', itemName: '政府介绍-区县/商务处介绍' },
    { itemNo: '16', itemName: '存量客户挖掘-直接授信客户挖掘' },
    { itemNo: '17', itemName: '存量客户挖掘-非授信客户挖掘' },
    { itemNo: '99', itemName: '其他' }
  ],
  ProjectIndustryType: [
    { itemNo: 'C31', itemName: '黑色金属冶炼和压延加工业' },
    { itemNo: 'F51', itemName: '批发业' },
    { itemNo: 'F52', itemName: '零售业' },
    { itemNo: 'G59', itemName: '装卸搬运和仓储业' },
    { itemNo: 'L72', itemName: '商务服务业' }
  ],
  GYLLoanProductCategory: [
    { itemNo: 'GYL01', itemName: '未来货权质押开证' },
    { itemNo: 'GYL02', itemName: '多级融资' },
    { itemNo: 'GYL03', itemName: '再保理' },
    { itemNo: 'GYL04', itemName: '买方信贷' },
    { itemNo: 'GYL05', itemName: '出口退税专用账户质押融资业务' },
    { itemNo: 'GYL06', itemName: '出口数据贷' },
    { itemNo: 'GYL07', itemName: '订单融资' },
    { itemNo: 'GYL08', itemName: '保理' },
    { itemNo: 'GYL09', itemName: '国内保理' },
    { itemNo: 'GYL10', itemName: '其他应收类' },
    { itemNo: 'GYL11', itemName: '经销商数据贷' },
    { itemNo: 'GYL12', itemName: '先票/款后货' },
    { itemNo: 'GYL13', itemName: '供应链融资' },
    { itemNo: 'GYL14', itemName: '存货质押融资' },
    { itemNo: 'GYL15', itemName: '应收类商票授信' },
    { itemNo: 'GYL16', itemName: '国内商票质押' },
    { itemNo: 'GYL17', itemName: '其他供应链产品' }
  ],
  YesNo: [
    { itemNo: '1', itemName: '是' },
    { itemNo: '2', itemName: '否' }
  ]
}

const createDetail = (overrides: Record<string, unknown>) => ({
  serialno: 'SC2026081900000001',
  customerid: 'SC2025040700000001',
  customername: '高能煜宇供应链有限公司',
  projectname: '高能煜宇钢材供应链协审项目',
  channelsource: '01,05,06,10,14,16',
  industrytype: 'F51',
  loanproductcategory: 'GYL09,GYL12,GYL14',
  branchaccess: '1',
  coreviewtype: '01',
  coreviewmethod: '01',
  branchname: '宁波分行',
  inputorgid: '公司业务二部',
  businesssum: 18000,
  exposuresum: 12500,
  remark:
    '核心企业深耕钢材供应链领域，已形成覆盖采购、仓储、物流及销售的完整经营体系。上年度营业收入稳定，主要上下游客户合作年限较长，结算记录正常，具备较强的产业组织及货物管控能力。',
  scenename:
    '拟为核心企业及其优质链属客户配置存货质押融资、先票/款后货和国内保理方案。项目额度18,000万元，其中敞口12,500万元；根据交易背景、订单合同、物流及仓储数据进行额度启用和提款审核，并持续开展价格盯市及货物监管。',
  recommendwill: '1',
  noreason: '',
  recommendnum: '36',
  searchnum: '28',
  spcsentname:
    '宁波盛达钢贸有限公司、浙江华联金属材料有限公司、嘉兴恒通供应链有限公司等',
  spcsentremark:
    '已完成28户链属企业的现场或远程访谈，其中24户能够提供完整的订单、发票、物流及回款资料；主要客户对线上确认、电子合同及账户监管安排配合度较高。',
  spcsentrecommend:
    '链属企业建议适当提高旺季临时额度的审批效率，并明确不同商品品类的质押率和补仓线。部分客户关注价格波动触发补仓后的处理时限，建议在项目方案中补充预警通知及宽限期安排。',
  tempsaveflag: '1',
  ...overrides
})

export const projectCoreviewRecords: ProjectCoreviewRecord[] = [
  {
    serialNo: 'SC2026081900000001',
    projectName: '高能煜宇钢材供应链协审项目',
    customerName: '高能煜宇供应链有限公司',
    customerId: 'SC2025040700000001',
    coreviewMethodNm: '新增协审',
    coreviewTypeNm: '项目方案协审',
    inputUserID: '王海峰',
    branchName: '宁波分行',
    teamName: '公司业务二部',
    businessSum: 18000,
    exposureSum: 12500,
    branchAccess: '是',
    loanProductCategory: 'GYL09,GYL12,GYL14',
    industryType: '批发业',
    phaseType: '1010',
    phaseNo: '1010',
    phaseName: '待提交',
    tempSaveFlag: 2,
    objectNo: 'SC2026081900000001',
    objectType: 'ProjectCoreviewGYL',
    customerID: 'SC2025040700000001',
    businessType: 'ProjectCoreviewGYL',
    ftSerialNo: 'FT2026081900000001',
    ftSerialno: 'FT2026081900000001',
    inputDate: '2026-08-19 09:20:00',
    endTime: '',
    detail: createDetail({})
  },
  {
    serialNo: 'SC2026081800000002',
    projectName: '华东有色金属存货融资项目',
    customerName: '华东有色供应链有限公司',
    customerId: 'SC2025051600000008',
    coreviewMethodNm: '新增协审',
    coreviewTypeNm: '项目方案协审',
    inputUserID: '李敏',
    branchName: '上海分行',
    teamName: '供应链金融部',
    businessSum: 15000,
    exposureSum: 9800,
    branchAccess: '是',
    loanProductCategory: 'GYL12,GYL14',
    industryType: '批发业',
    phaseType: '1020',
    phaseNo: '1020',
    phaseName: '审查审批中',
    tempSaveFlag: 2,
    objectNo: 'SC2026081800000002',
    objectType: 'ProjectCoreviewGYL',
    customerID: 'SC2025051600000008',
    businessType: 'ProjectCoreviewGYL',
    ftSerialNo: 'FT2026081800000002',
    ftSerialno: 'FT2026081800000002',
    inputDate: '2026-08-18 10:15:00',
    endTime: '',
    detail: createDetail({
      serialno: 'SC2026081800000002',
      customerid: 'SC2025051600000008',
      customername: '华东有色供应链有限公司',
      projectname: '华东有色金属存货融资项目',
      branchname: '上海分行',
      inputorgid: '供应链金融部',
      businesssum: 15000,
      exposuresum: 9800,
      recommendnum: '24',
      searchnum: '19'
    })
  },
  {
    serialNo: 'SC2026081700000003',
    projectName: '浙北制造业应收及存货融资项目',
    customerName: '浙北产业发展有限公司',
    customerId: 'SC2025061100000012',
    coreviewMethodNm: '续作协审',
    coreviewTypeNm: '授信方案协审',
    inputUserID: '陈晨',
    branchName: '杭州分行',
    teamName: '公司金融一部',
    businessSum: 12000,
    exposureSum: 8000,
    branchAccess: '否',
    loanProductCategory: 'GYL09,GYL13',
    industryType: '黑色金属冶炼和压延加工业',
    phaseType: '1040',
    phaseNo: '1040',
    phaseName: '审批通过',
    tempSaveFlag: 2,
    objectNo: 'SC2026081700000003',
    objectType: 'ProjectCoreviewGYL',
    customerID: 'SC2025061100000012',
    businessType: 'ProjectCoreviewGYL',
    ftSerialNo: 'FT2026081700000003',
    ftSerialno: 'FT2026081700000003',
    inputDate: '2026-08-17 14:10:00',
    endTime: '2026-08-20 16:30:00',
    detail: createDetail({
      serialno: 'SC2026081700000003',
      customerid: 'SC2025061100000012',
      customername: '浙北产业发展有限公司',
      projectname: '浙北制造业应收及存货融资项目',
      coreviewtype: '02',
      coreviewmethod: '02',
      branchaccess: '2',
      branchname: '杭州分行',
      inputorgid: '公司金融一部',
      businesssum: 12000,
      exposuresum: 8000,
      loanproductcategory: 'GYL09,GYL13'
    })
  },
  {
    serialNo: 'SC2026081600000004',
    projectName: '华南家电经销协审项目',
    customerName: '华南家电供应链有限公司',
    customerId: 'SC2025061800000016',
    coreviewMethodNm: '新增协审',
    coreviewTypeNm: '项目方案协审',
    inputUserID: '刘洋',
    branchName: '广州分行',
    teamName: '公司金融部',
    businessSum: 9000,
    exposureSum: 6200,
    branchAccess: '是',
    loanProductCategory: 'GYL11,GYL12',
    industryType: '零售业',
    phaseType: '1030',
    phaseNo: '1030',
    phaseName: '退回资料补充',
    tempSaveFlag: 2,
    objectNo: 'SC2026081600000004',
    objectType: 'ProjectCoreviewGYL',
    customerID: 'SC2025061800000016',
    businessType: 'ProjectCoreviewGYL',
    ftSerialNo: 'FT2026081600000004',
    ftSerialno: 'FT2026081600000004',
    inputDate: '2026-08-16 11:20:00',
    endTime: '',
    detail: createDetail({
      serialno: 'SC2026081600000004',
      customerid: 'SC2025061800000016',
      customername: '华南家电供应链有限公司',
      projectname: '华南家电经销协审项目',
      branchname: '广州分行',
      inputorgid: '公司金融部',
      businesssum: 9000,
      exposuresum: 6200,
      industrytype: 'F52',
      loanproductcategory: 'GYL11,GYL12',
      tempsaveflag: '2'
    })
  },
  {
    serialNo: 'SC2026081500000005',
    projectName: '西南农产品供应链协审项目',
    customerName: '西南农产品贸易有限公司',
    customerId: 'SC2025062000000020',
    coreviewMethodNm: '续作协审',
    coreviewTypeNm: '授信方案协审',
    inputUserID: '周凯',
    branchName: '成都分行',
    teamName: '普惠金融部',
    businessSum: 7500,
    exposureSum: 5000,
    branchAccess: '否',
    loanProductCategory: 'GYL09,GYL13',
    industryType: '批发业',
    phaseType: '1050',
    phaseNo: '1050',
    phaseName: '已否决',
    tempSaveFlag: 2,
    objectNo: 'SC2026081500000005',
    objectType: 'ProjectCoreviewGYL',
    customerID: 'SC2025062000000020',
    businessType: 'ProjectCoreviewGYL',
    ftSerialNo: 'FT2026081500000005',
    ftSerialno: 'FT2026081500000005',
    inputDate: '2026-08-15 15:40:00',
    endTime: '2026-08-18 10:05:00',
    detail: createDetail({
      serialno: 'SC2026081500000005',
      customerid: 'SC2025062000000020',
      customername: '西南农产品贸易有限公司',
      projectname: '西南农产品供应链协审项目',
      coreviewtype: '02',
      coreviewmethod: '02',
      branchaccess: '2',
      branchname: '成都分行',
      inputorgid: '普惠金融部',
      businesssum: 7500,
      exposuresum: 5000,
      loanproductcategory: 'GYL09,GYL13',
      tempsaveflag: '2'
    })
  }
]

export const getProjectCoreviewDetail = (serialNo: unknown) => {
  const normalizedSerialNo = String(serialNo || '').trim()
  const record = projectCoreviewRecords.find((item) => item.serialNo === normalizedSerialNo)
  if (record) return record.detail

  return createDetail({ serialno: normalizedSerialNo || projectCoreviewRecords[0].serialNo })
}

export const createProjectCoreviewRecord = (payload: Record<string, unknown>) => {
  const serialNo = `SC20260904${String(projectCoreviewRecords.length + 1).padStart(8, '0')}`
  const coreviewMethod = String(payload.coreviewMethod || '01')
  const coreviewType = String(payload.coreviewType || '01')
  const customerId = String(payload.customerId || '')
  const customerName = String(payload.customerName || '')
  const detail = createDetail({
    serialno: serialNo,
    customerid: customerId,
    customername: customerName,
    coreviewmethod: coreviewMethod,
    coreviewtype: coreviewType,
    relativeserialno: String(payload.relativeSerialNo || ''),
    createtm: String(payload.createTm || ''),
    projectname: '',
    channelsource: '',
    industrytype: '',
    loanproductcategory: '',
    businesssum: '',
    exposuresum: '',
    remark: '',
    scenename: '',
    tempsaveflag: '1'
  })
  const record: ProjectCoreviewRecord = {
    serialNo,
    projectName: '',
    customerName,
    customerId,
    coreviewMethodNm: coreviewMethod === '02' ? '续作协审' : '新增协审',
    coreviewTypeNm: coreviewType === '02' ? '授信方案协审' : '项目方案协审',
    inputUserID: '本地演示用户',
    branchName: '',
    teamName: '',
    businessSum: 0,
    exposureSum: 0,
    branchAccess: '',
    loanProductCategory: '',
    industryType: '',
    phaseType: '1010',
    phaseNo: '1010',
    phaseName: '待提交',
    tempSaveFlag: 1,
    objectNo: serialNo,
    objectType: 'ProjectCoreviewGYL',
    customerID: customerId,
    businessType: 'ProjectCoreviewGYL',
    ftSerialNo: `FT${serialNo.slice(2)}`,
    ftSerialno: `FT${serialNo.slice(2)}`,
    inputDate: '2026-09-04 10:00:00',
    endTime: '',
    detail
  }

  projectCoreviewRecords.unshift(record)
  return { ...detail, serialNo }
}

export const updateProjectCoreviewDetail = (
  payload: Record<string, unknown>,
  tempSaveFlag: '1' | '2'
) => {
  const serialNo = String(payload.serialno || payload.serialNo || '').trim()
  const record = projectCoreviewRecords.find((item) => item.serialNo === serialNo)
  const updatedDetail = { ...(record?.detail || createDetail({ serialno: serialNo })), ...payload, tempsaveflag: tempSaveFlag }

  if (record) {
    record.detail = updatedDetail
    record.tempSaveFlag = Number(tempSaveFlag)
    record.projectName = String(updatedDetail.projectname || record.projectName)
    record.businessSum = Number(updatedDetail.businesssum || 0)
    record.exposureSum = Number(updatedDetail.exposuresum || 0)
    record.loanProductCategory = String(updatedDetail.loanproductcategory || '')
    const industryCode = String(updatedDetail.industrytype || '')
    record.industryType =
      projectCoreviewOldDicts.ProjectIndustryType.find((item) => item.itemNo === industryCode)
        ?.itemName || industryCode
    record.branchAccess = String(updatedDetail.branchaccess || '') === '2' ? '否' : '是'
  }
  return updatedDetail
}

const projectCoreviewOpinions = new Map<string, Record<string, unknown>>()

export const deleteProjectCoreviewRecord = (serialNo: unknown) => {
  const index = projectCoreviewRecords.findIndex((item) => item.serialNo === String(serialNo || ''))
  if (index < 0) return false
  projectCoreviewRecords.splice(index, 1)
  return true
}

export const getProjectCoreviewOpinion = (serialNo: unknown) => {
  const key = String(serialNo || '')
  return projectCoreviewOpinions.get(key) || {
    id: `OP-${key}`,
    businessId: key,
    objectType: 'ProjectCoreviewGYL',
    approvalComment: '经核验，客户及项目资料完整，业务背景真实，建议按流程继续审查。',
    nickName: '本地演示用户',
    oprDate: '2026-09-04',
    orgName: '宁波分行公司业务部',
    canModify: true,
    canDelete: true
  }
}

export const saveProjectCoreviewOpinion = (payload: Record<string, unknown>) => {
  const businessId = String(payload.businessId || payload.id || '')
  const opinion = {
    ...getProjectCoreviewOpinion(businessId),
    ...payload,
    id: `OP-${businessId}`,
    canModify: true,
    canDelete: true
  }
  projectCoreviewOpinions.set(businessId, opinion)
  return opinion
}

export const removeProjectCoreviewOpinion = (serialNo: unknown) => {
  projectCoreviewOpinions.delete(String(serialNo || '').replace(/^OP-/, ''))
  return true
}

export const hasProjectCoreviewOpinion = (serialNo: unknown) =>
  Boolean(projectCoreviewOpinions.get(String(serialNo || ''))?.approvalComment)

export const submitProjectCoreviewRecord = (serialNo: unknown) => {
  const record = projectCoreviewRecords.find((item) => item.serialNo === String(serialNo || ''))
  if (!record) return false
  record.phaseType = '1020'
  record.phaseNo = '1020'
  record.phaseName = '审查审批中'
  return true
}

export const withdrawProjectCoreviewRecord = (serialNo: unknown) => {
  const record = projectCoreviewRecords.find((item) => item.serialNo === String(serialNo || ''))
  if (!record) return false
  record.phaseType = '1010'
  record.phaseNo = '1010'
  record.phaseName = '待提交'
  return true
}

export const getProjectCoreviewFlowRecords = (serialNo: unknown) => {
  const objectNo = String(serialNo || '')
  return [
    {
      serialNo: `FT-${objectNo}-01`, objectNo, phaseNo: '1010', phaseName: '申请录入',
      userId: 'U1001', userName: '本地演示用户', orgId: 'ORG001', orgName: '宁波分行公司业务部',
      phaseAction: '保存', phaseOpinion1: '协审信息录入完成', beginTime: '2026-09-04 09:30:00', endTime: '2026-09-04 10:00:00'
    },
    {
      serialNo: `FT-${objectNo}-02`, objectNo, phaseNo: '1020', phaseName: '提交审查',
      userId: 'U1001', userName: '本地演示用户', orgId: 'ORG001', orgName: '宁波分行公司业务部',
      phaseAction: '提交', phaseOpinion1: '同意提交项目协审', beginTime: '2026-09-04 10:00:00', endTime: '2026-09-04 10:05:00'
    }
  ]
}
