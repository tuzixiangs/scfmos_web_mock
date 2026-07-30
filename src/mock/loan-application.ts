export const loanApplicationMenu = [
  {
    key: '01',
    title: '项目放贷申请',
    isLeaf: false,
    children: [
      { key: '1010', title: '待提交的放贷申请', value: './components/pendPutOutApplyList/index.vue', isLeaf: true, dealtype: 'PUT_OUT_PENDING' },
      { key: '1020', title: '审查审批中的放贷申请', value: './components/pendPutOutApplyList/index.vue', isLeaf: true, dealtype: 'PUT_OUT_REVIEWING' },
      { key: '1030', title: '退回补件的放贷申请', value: './components/pendPutOutApplyList/index.vue', isLeaf: true, dealtype: 'PUT_OUT_RETURNED' },
      { key: '1040', title: '审批通过的放贷申请', value: './components/pendPutOutApplyList/index.vue', isLeaf: true, dealtype: 'PUT_OUT_APPROVED' },
      { key: '1050', title: '已放款申请', value: './components/pendPutOutApplyList/index.vue', isLeaf: true, dealtype: 'PUT_OUT_FINISHED' },
      { key: '1060', title: '被否决的放贷申请', value: './components/pendPutOutApplyList/index.vue', isLeaf: true, dealtype: 'PUT_OUT_REJECTED' }
    ]
  }
]

export const loanApplicationRecords = [
  {
    id: 'PUTOUT-001', phaseType: '1010', mfcustomerid: 'C2025040300000003', customername: '海大饲料（上海）有限公司', customerid: 'C2025040300000003', customertype: '企业客户', businesstype: 'SCF_WORKING_CAPITAL', businesstypename: '供应链流动资金贷款', currencyname: '人民币', businesssum: 680000, affirmflag: '待确认', serialno: 'CZ202607290001', putoutchannel: '供应链金融平台', contractserialno: 'HT202607010001', occurtypename: '新增', putoutstatusname: '待提交', flowname: '放贷申请流程', phasename: '待提交', phaseno: '0010', gylflag: '是', gylcustomertype: '核心企业', projectname: '海大供应链融资项目', endtime: ''
  },
  {
    id: 'PUTOUT-002', phaseType: '1010', mfcustomerid: 'C202607200001', customername: '华东供应链有限公司', customerid: 'C202607200001', customertype: '企业客户', businesstype: 'SCF_FACToring', businesstypename: '国内保理融资', currencyname: '人民币', businesssum: 1200000, affirmflag: '已确认', serialno: 'CZ202607290002', putoutchannel: '客户经理录入', contractserialno: 'HT202607020002', occurtypename: '续作', putoutstatusname: '待提交', flowname: '放贷申请流程', phasename: '待提交', phaseno: '0010', gylflag: '是', gylcustomertype: '链属客户', projectname: '华东供应链融资项目', endtime: ''
  },
  {
    id: 'PUTOUT-003', phaseType: '1020', mfcustomerid: 'C2025051200000018', customername: '双胞胎农牧有限公司', customerid: 'C2025051200000018', customertype: '企业客户', businesstype: 'SCF_INVENTORY', businesstypename: '存货质押融资', currencyname: '人民币', businesssum: 950000, affirmflag: '已确认', serialno: 'CZ202607260003', putoutchannel: '供应链金融平台', contractserialno: 'HT202607030003', occurtypename: '新增', putoutstatusname: '审批中', flowname: '放贷申请流程', phasename: '经营单位负责人审批', phaseno: '1020', gylflag: '是', gylcustomertype: '核心企业', projectname: '双胞胎农牧融资项目', endtime: ''
  },
  {
    id: 'PUTOUT-004', phaseType: '1040', mfcustomerid: 'C202607190002', customername: '新城贸易有限公司', customerid: 'C202607190002', customertype: '企业客户', businesstype: 'SCF_DEALER_FINANCE', businesstypename: '经销商融资', currencyname: '人民币', businesssum: 800000, affirmflag: '已确认', serialno: 'CZ202607180004', putoutchannel: '客户经理录入', contractserialno: 'HT202607040004', occurtypename: '新增', putoutstatusname: '审批通过', flowname: '放贷申请流程', phasename: '审批完成', phaseno: '1040', gylflag: '是', gylcustomertype: '链属客户', projectname: '新城贸易融资项目', endtime: '2026-07-19 15:10:00'
  },
  {
    id: 'PUTOUT-005', phaseType: '1060', mfcustomerid: 'C2025060100000021', customername: '通威饲料贸易有限公司', customerid: 'C2025060100000021', customertype: '企业客户', businesstype: 'SCF_WORKING_CAPITAL', businesstypename: '供应链流动资金贷款', currencyname: '人民币', businesssum: 520000, affirmflag: '未确认', serialno: 'CZ202607120005', putoutchannel: '供应链金融平台', contractserialno: 'HT202607050005', occurtypename: '新增', putoutstatusname: '已否决', flowname: '放贷申请流程', phasename: '流程结束', phaseno: '1060', gylflag: '是', gylcustomertype: '核心企业', projectname: '通威供应链融资项目', endtime: '2026-07-13 10:25:00'
  }
]

export const loanApplicationPage = (params = {}) => {
  const phaseType = String(params.phaseType || params.key || '').trim()
  const customerName = String(params.customername || '').trim()
  const customerNo = String(params.mfcustomerid || '').trim()
  const serialNo = String(params.serialno || '').trim()
  const businessType = String(params.businesstypename || '').trim()
  const records = loanApplicationRecords.filter((record) =>
    (!phaseType || record.phaseType === phaseType) &&
    (!customerName || record.customername.includes(customerName)) &&
    (!customerNo || record.mfcustomerid.includes(customerNo)) &&
    (!serialNo || record.serialno.includes(serialNo)) &&
    (!businessType || record.businesstypename.includes(businessType))
  )
  return { total: records.length, list: records, records }
}
