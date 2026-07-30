export const loanApprovalMenus = {
  N: [
    { phaseNo: '1020', phaseName: '经营单位负责人审批', workCount: 2 },
    { phaseNo: '1030', phaseName: '债项管理岗审批', workCount: 1 }
  ],
  Y: [
    { phaseNo: '1040', phaseName: '审批通过', workCount: 2 },
    { phaseNo: '1060', phaseName: '审批否决', workCount: 1 }
  ]
}

export const loanApprovalRecords = [
  {
    id: 'LOAN-APPROVAL-001', type: 'N', phaseNo: '1020', objectno: 'CZ202607290001', serialno: 'CZ202607290001', businesstypename: '供应链流动资金贷款', businesstype: 'SCF_WORKING_CAPITAL', currencyname: '人民币', businesssum: 680000, putoutchannel: '供应链金融平台', customername: '海大饲料（上海）有限公司', customerid: 'C2025040300000003', customertype: '企业客户', flowname: '放贷申请流程', phasename: '经营单位负责人审批', occurtypename: '新增', putoutdate: '2026-07-29', maturity: '2027-01-29', putoutstatusname: '审批中', transdate: '2026-07-29', gylflag: '是', gylcustomertype: '核心企业', projectname: '海大供应链融资项目', endtime: '', begintime: '2026-07-29 09:15:00'
  },
  {
    id: 'LOAN-APPROVAL-002', type: 'N', phaseNo: '1020', objectno: 'CZ202607290002', serialno: 'CZ202607290002', businesstypename: '国内保理融资', businesstype: 'SCF_FACToring', currencyname: '人民币', businesssum: 1200000, putoutchannel: '客户经理录入', customername: '华东供应链有限公司', customerid: 'C202607200001', customertype: '企业客户', flowname: '放贷申请流程', phasename: '经营单位负责人审批', occurtypename: '续作', putoutdate: '2026-07-29', maturity: '2027-01-20', putoutstatusname: '审批中', transdate: '2026-07-29', gylflag: '是', gylcustomertype: '链属客户', projectname: '华东供应链融资项目', endtime: '', begintime: '2026-07-29 10:05:00'
  },
  {
    id: 'LOAN-APPROVAL-003', type: 'N', phaseNo: '1030', objectno: 'CZ202607260003', serialno: 'CZ202607260003', businesstypename: '存货质押融资', businesstype: 'SCF_INVENTORY', currencyname: '人民币', businesssum: 950000, putoutchannel: '供应链金融平台', customername: '双胞胎农牧有限公司', customerid: 'C2025051200000018', customertype: '企业客户', flowname: '放贷申请流程', phasename: '债项管理岗审批', occurtypename: '新增', putoutdate: '2026-07-26', maturity: '2027-01-26', putoutstatusname: '审批中', transdate: '2026-07-26', gylflag: '是', gylcustomertype: '核心企业', projectname: '双胞胎农牧融资项目', endtime: '', begintime: '2026-07-26 15:30:00'
  },
  {
    id: 'LOAN-APPROVAL-004', type: 'Y', phaseNo: '1040', objectno: 'CZ202607180004', serialno: 'CZ202607180004', businesstypename: '经销商融资', businesstype: 'SCF_DEALER_FINANCE', currencyname: '人民币', businesssum: 800000, putoutchannel: '客户经理录入', customername: '新城贸易有限公司', customerid: 'C202607190002', customertype: '企业客户', flowname: '放贷申请流程', phasename: '审批完成', occurtypename: '新增', putoutdate: '2026-07-18', maturity: '2027-01-18', putoutstatusname: '审批通过', transdate: '2026-07-19', gylflag: '是', gylcustomertype: '链属客户', projectname: '新城贸易融资项目', endtime: '2026-07-19 15:10:00', begintime: '2026-07-18 13:40:00'
  },
  {
    id: 'LOAN-APPROVAL-005', type: 'Y', phaseNo: '1060', objectno: 'CZ202607120005', serialno: 'CZ202607120005', businesstypename: '供应链流动资金贷款', businesstype: 'SCF_WORKING_CAPITAL', currencyname: '人民币', businesssum: 520000, putoutchannel: '供应链金融平台', customername: '通威饲料贸易有限公司', customerid: 'C2025060100000021', customertype: '企业客户', flowname: '放贷申请流程', phasename: '流程结束', occurtypename: '新增', putoutdate: '2026-07-12', maturity: '2027-01-12', putoutstatusname: '审批否决', transdate: '2026-07-13', gylflag: '是', gylcustomertype: '核心企业', projectname: '通威供应链融资项目', endtime: '2026-07-13 10:25:00', begintime: '2026-07-12 09:40:00'
  }
]

export const loanApprovalPage = (params = {}) => {
  const type = String(params.type || '').trim()
  const phaseNo = String(params.phaseNo || params.phaseno || '').trim()
  const serialNo = String(params.serialno || '').trim()
  const customerName = String(params.customername || '').trim()
  const records = loanApprovalRecords.filter((record) =>
    (!type || record.type === type) &&
    (!phaseNo || record.phaseNo === phaseNo) &&
    (!serialNo || record.objectno.includes(serialNo)) &&
    (!customerName || record.customername.includes(customerName))
  )
  return { total: records.length, list: records, records }
}
