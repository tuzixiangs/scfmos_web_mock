/** 链属客户签约发放管理：合同审批菜单与列表演示数据。 */
export const linkedQuotaApprovalMenus = {
  N: [
    { phaseNo: '0035', phaseName: '客户经理审批', workCount: 2, flowNo: 'CreditContractFlow' },
    { phaseNo: '0050', phaseName: '经营单位负责人审批', workCount: 1, flowNo: 'CreditContractFlow' }
  ],
  Y: [
    { phaseNo: '4000', phaseName: '审批通过', workCount: 2, flowNo: 'CreditContractFlow' },
    { phaseNo: '5000', phaseName: '审批否决', workCount: 1, flowNo: 'CreditContractFlow' }
  ]
}

export const linkedBusinessApprovalMenus = {
  N: [
    { phaseNo: '0035', phaseName: '客户经理审批', workCount: 2, flowNo: 'BusinessContractFlow' },
    { phaseNo: '0050', phaseName: '债项管理岗审批', workCount: 1, flowNo: 'BusinessContractFlow' }
  ],
  Y: [
    { phaseNo: '4000', phaseName: '审批通过', workCount: 2, flowNo: 'BusinessContractFlow' },
    { phaseNo: '5000', phaseName: '审批否决', workCount: 1, flowNo: 'BusinessContractFlow' }
  ]
}

const record = (id: string, flowNo: string, phaseNo: string, objectNo: string, customerName: string, businessTypeName: string, businesssum: number, phaseName: string, projectName: string, endTime = '') => ({
  id, flowNo, phaseNo, objectNo, serialNo: objectNo, businessType: businessTypeName === '存货质押融资' ? 'SCF_INVENTORY' : businessTypeName === '国内保理融资' ? 'SCF_FACToring' : 'SCF_WORKING_CAPITAL', businessTypeName, occurTypeName: phaseNo === '5000' ? '新增' : '续作', currencyName: '人民币', businesssum, exposuresum: flowNo === 'CreditContractFlow' ? Math.round(businesssum * 0.7) : 0, customerName, customerID: customerName.includes('华东') ? 'C202607200001' : customerName.includes('双胞胎') ? 'C2025051200000018' : customerName.includes('新城') ? 'C202607190002' : 'C2025060100000021', phaseName, channelsource: '供应链金融平台', gylflag: '是', gylflagName: '纯供应链', gylcustomerType: '链属客户', projectName, endTime, beginTime: '2026-07-29 09:20:00', tempSaveFlag: '0'
})

export const linkedContractApprovalRecords = [
  record('LINKED-CREDIT-001', 'CreditContractFlow', '0035', 'ED202607290001', '华东供应链有限公司', '供应链流动资金贷款', 5000000, '客户经理审批', '华东供应链融资项目'),
  record('LINKED-CREDIT-002', 'CreditContractFlow', '0035', 'ED202607290002', '新城贸易有限公司', '国内保理融资', 3200000, '客户经理审批', '新城贸易融资项目'),
  record('LINKED-CREDIT-003', 'CreditContractFlow', '0050', 'ED202607280003', '双胞胎农牧有限公司', '存货质押融资', 4200000, '经营单位负责人审批', '双胞胎农牧融资项目'),
  record('LINKED-CREDIT-004', 'CreditContractFlow', '4000', 'ED202607200004', '通威饲料贸易有限公司', '供应链流动资金贷款', 2600000, '审批通过', '通威供应链融资项目', '2026-07-21 14:30:00'),
  record('LINKED-CREDIT-005', 'CreditContractFlow', '5000', 'ED202607180005', '双胞胎农牧有限公司', '存货质押融资', 1800000, '审批否决', '双胞胎农牧融资项目', '2026-07-19 16:20:00'),
  record('LINKED-BUSINESS-001', 'BusinessContractFlow', '0035', 'HT202607290011', '华东供应链有限公司', '供应链流动资金贷款', 4600000, '客户经理审批', '华东供应链融资项目'),
  record('LINKED-BUSINESS-002', 'BusinessContractFlow', '0035', 'HT202607290012', '新城贸易有限公司', '国内保理融资', 2800000, '客户经理审批', '新城贸易融资项目'),
  record('LINKED-BUSINESS-003', 'BusinessContractFlow', '0050', 'HT202607280013', '双胞胎农牧有限公司', '存货质押融资', 3900000, '债项管理岗审批', '双胞胎农牧融资项目'),
  record('LINKED-BUSINESS-004', 'BusinessContractFlow', '4000', 'HT202607220014', '通威饲料贸易有限公司', '供应链流动资金贷款', 2200000, '审批通过', '通威供应链融资项目', '2026-07-23 10:10:00'),
  record('LINKED-BUSINESS-005', 'BusinessContractFlow', '5000', 'HT202607190015', '新城贸易有限公司', '国内保理融资', 1500000, '审批否决', '新城贸易融资项目', '2026-07-20 17:00:00')
]

export const linkedContractApprovalPage = (params: Record<string, unknown> = {}) => {
  const value = (key: string) => String(params[key] ?? '').trim()
  const flowNo = value('flowNo')
  const phaseNo = value('phaseNo')
  const customerName = value('customerName')
  const occurTypeName = value('occurTypeName')
  const projectName = value('projectName')
  const records = linkedContractApprovalRecords.filter((item) =>
    (!flowNo || item.flowNo === flowNo) &&
    (!phaseNo || item.phaseNo === phaseNo) &&
    (!customerName || item.customerName.includes(customerName)) &&
    (!occurTypeName || item.occurTypeName.includes(occurTypeName)) &&
    (!projectName || item.projectName.includes(projectName))
  )
  return { total: records.length, list: records, records }
}
