/**
 * 项目/链属客户共用的“批复变更申请”演示数据。
 * 保持接口字段与原页面列表一致，页面在没有内网服务时也可完整走通。
 */
export const approvalChangeApplicationMenu = [
  {
    key: '01',
    title: '批复变更申请',
    isLeaf: false,
    children: [
      { key: '1010', title: '待提交的批复变更申请', value: './components/PendingSubmission/index.vue', isLeaf: true, dealtype: '1010' },
      { key: '1020', title: '审查审批中的批复变更申请', value: './components/UnderReview/index.vue', isLeaf: true, dealtype: '1020' },
      { key: '1025', title: '退回补充资料的批复变更申请', value: './components/ReturnedForCompletion/index.vue', isLeaf: true, dealtype: '1025' },
      { key: '1030', title: '退回补件的批复变更申请', value: './components/ReturnedForDocs/index.vue', isLeaf: true, dealtype: '1030' },
      { key: '1040', title: '审批通过的批复变更申请', value: './components/Approved/index.vue', isLeaf: true, dealtype: '1040' },
      { key: '1050', title: '被否决的批复变更申请', value: './components/Rejected/index.vue', isLeaf: true, dealtype: '1050' }
    ]
  }
]

export const approvalChangeApplicationRecords = [
  {
    id: 'APPROVE-CHANGE-001', dealtype: '1010', objectNo: 'BG202607290001', relativeSerialNo: 'PF202607150018', customerID: 'C2025040300000003', customerName: '海大饲料（上海）有限公司', businessType: 'SCF_WORKING_CAPITAL', businessTypeName: '供应链流动资金贷款', occurTypeName: '额度调整', currencyName: '人民币', businessSum: 6800000, operateUserName: '王菲', operateOrgName: '上海分行供应链金融部', flowName: '批复变更申请流程', phaseName: '待提交', applyModelTypeName: '授信审批', projectName: '海大供应链融资项目', phaseNo: '0010', objectType: 'CreditApply', applyType: 'ApprovalChangeApply'
  },
  {
    id: 'APPROVE-CHANGE-002', dealtype: '1010', objectNo: 'BG202607290002', relativeSerialNo: 'PF202607180025', customerID: 'C202607200001', customerName: '华东供应链有限公司', businessType: 'SCF_FACToring', businessTypeName: '国内保理融资', occurTypeName: '期限调整', currencyName: '人民币', businessSum: 3200000, operateUserName: '张晨', operateOrgName: '总行供应链金融部', flowName: '批复变更申请流程', phaseName: '待提交', applyModelTypeName: '授信审批', projectName: '华东供应链融资项目', phaseNo: '0010', objectType: 'CreditApply', applyType: 'ApprovalChangeApply'
  },
  {
    id: 'APPROVE-CHANGE-003', dealtype: '1020', objectNo: 'BG202607260003', relativeSerialNo: 'PF202607120011', customerID: 'C2025051200000018', customerName: '双胞胎农牧有限公司', businessType: 'SCF_INVENTORY', businessTypeName: '存货质押融资', occurTypeName: '担保方式调整', currencyName: '人民币', businessSum: 4500000, operateUserName: '陈敏', operateOrgName: '南昌分行', flowName: '批复变更申请流程', phaseName: '经营单位负责人审批', applyModelTypeName: '授信审批', projectName: '双胞胎农牧融资项目', phaseNo: '1020', objectType: 'CreditApply', applyType: 'ApprovalChangeApply'
  },
  {
    id: 'APPROVE-CHANGE-004', dealtype: '1025', objectNo: 'BG202607240004', relativeSerialNo: 'PF202607100009', customerID: 'C202607190002', customerName: '新城贸易有限公司', businessType: 'SCF_DEALER_FINANCE', businessTypeName: '经销商融资', occurTypeName: '额度调整', currencyName: '人民币', businessSum: 1800000, operateUserName: '李敏', operateOrgName: '上海分行', flowName: '批复变更申请流程', phaseName: '退回补充资料', applyModelTypeName: '授信审批', projectName: '新城贸易融资项目', phaseNo: '1025', objectType: 'CreditApply', applyType: 'ApprovalChangeApply'
  },
  {
    id: 'APPROVE-CHANGE-005', dealtype: '1030', objectNo: 'BG202607220005', relativeSerialNo: 'PF202607080021', customerID: 'C2025060100000021', customerName: '通威饲料贸易有限公司', businessType: 'SCF_WORKING_CAPITAL', businessTypeName: '供应链流动资金贷款', occurTypeName: '期限调整', currencyName: '人民币', businessSum: 2400000, operateUserName: '周凯', operateOrgName: '成都分行', flowName: '批复变更申请流程', phaseName: '退回补件', applyModelTypeName: '授信审批', projectName: '通威供应链融资项目', phaseNo: '1030', objectType: 'CreditApply', applyType: 'ApprovalChangeApply'
  },
  {
    id: 'APPROVE-CHANGE-006', dealtype: '1040', objectNo: 'BG202607180006', relativeSerialNo: 'PF202607050016', customerID: 'C2025040300000003', customerName: '海大饲料（上海）有限公司', businessType: 'SCF_FACToring', businessTypeName: '国内保理融资', occurTypeName: '额度调整', currencyName: '人民币', businessSum: 5200000, operateUserName: '王菲', operateOrgName: '上海分行供应链金融部', flowName: '批复变更申请流程', phaseName: '审批完成', applyModelTypeName: '授信审批', projectName: '海大供应链融资项目', phaseNo: '1040', objectType: 'CreditApply', applyType: 'ApprovalChangeApply'
  },
  {
    id: 'APPROVE-CHANGE-007', dealtype: '1050', objectNo: 'BG202607150007', relativeSerialNo: 'PF202607010013', customerID: 'C2025051200000018', customerName: '双胞胎农牧有限公司', businessType: 'SCF_INVENTORY', businessTypeName: '存货质押融资', occurTypeName: '额度调整', currencyName: '人民币', businessSum: 1600000, operateUserName: '陈敏', operateOrgName: '南昌分行', flowName: '批复变更申请流程', phaseName: '审批否决', applyModelTypeName: '授信审批', projectName: '双胞胎农牧融资项目', phaseNo: '1050', objectType: 'CreditApply', applyType: 'ApprovalChangeApply'
  }
]

export const approvalChangeApplicationPage = (params: Record<string, unknown> = {}) => {
  const value = (key: string) => String(params[key] ?? '').trim()
  const dealtype = value('dealtype') || value('phaseType') || value('key')
  const objectNo = value('objectNo')
  const customerName = value('customerName')
  const businessTypeName = value('businessTypeName')

  const records = approvalChangeApplicationRecords.filter((record) =>
    (!dealtype || record.dealtype === dealtype) &&
    (!objectNo || record.objectNo.includes(objectNo)) &&
    (!customerName || record.customerName.includes(customerName)) &&
    (!businessTypeName || record.businessTypeName.includes(businessTypeName))
  )

  return { total: records.length, list: records, records }
}
