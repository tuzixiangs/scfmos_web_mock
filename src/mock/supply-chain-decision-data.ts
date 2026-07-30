/**
 * 供应链决策数据管理演示数据。
 * 保持申请、复核查询两个页面的菜单与列表结构一致，便于在无内网服务时完整演示。
 */
export const supplyChainDecisionApplicationMenu = [
  {
    key: '01',
    title: '供应链决策数据申请',
    isLeaf: false,
    children: [
      { key: '1010', title: '待提交的决策数据申请', value: './lists/Draft/index.vue', isLeaf: true, dealtype: '1010' },
      { key: '1020', title: '审查审批中的决策数据申请', value: './lists/Pending/index.vue', isLeaf: true, dealtype: '1020' },
      { key: '1030', title: '被否决的决策数据申请', value: './lists/Rejected/index.vue', isLeaf: true, dealtype: '1030' },
      { key: '1040', title: '退回补件的决策数据申请', value: './lists/Returned/index.vue', isLeaf: true, dealtype: '1040' },
      { key: '1050', title: '审批通过的决策数据申请', value: './lists/Approved/index.vue', isLeaf: true, dealtype: '1050' }
    ]
  }
]

export const supplyChainDecisionCheckMenu = [
  {
    key: '01',
    title: '决策数据查询',
    isLeaf: false,
    children: [
      { key: '010010', title: '当前工作', value: './lists/PendingRecheck/index.vue', isLeaf: true, dealtype: '010010' },
      { key: '010020', title: '已完成工作', value: './lists/CompletedRecheck/index.vue', isLeaf: true, dealtype: '010020' }
    ]
  }
]

export const supplyChainDecisionRecords = [
  {
    id: 'DECISION-001', dealtype: '1010', serialNo: 'JCSJ202607290001', objectNo: 'JCSJ202607290001', projectId: 'PJ202607010001', projectName: '钢贸供应链融资项目', loanProductName: '先票/款后货融资', borrowerId: 'C2025040300000003', borrowerName: '阿姆特拉斯供应链有限公司', borrowerType: '企业客户', certId: '91310115MA1K4A001Q', inputUserName: '张晨', updatedate: '2026-07-29 09:20:00', updateOrgName: '上海分行供应链金融部', effeName: '有效', unEffeDate: '', selectDate: '', systemPushFlag: '否', systemPushFlagCode: '0', phaseNo: '1010', tempSaveFlag: '0'
  },
  {
    id: 'DECISION-002', dealtype: '1010', serialNo: 'JCSJ202607290002', objectNo: 'JCSJ202607290002', projectId: 'PJ202607010002', projectName: '华东商贸保理项目', loanProductName: '供应链保理融资', borrowerId: 'C202607200001', borrowerName: '华东供应链有限公司', borrowerType: '企业客户', certId: '91310112MA1K4B002R', inputUserName: '李敏', updatedate: '2026-07-29 10:05:00', updateOrgName: '总行供应链金融部', effeName: '有效', unEffeDate: '', selectDate: '', systemPushFlag: '是', systemPushFlagCode: '1', phaseNo: '1010', tempSaveFlag: '0'
  },
  {
    id: 'DECISION-003', dealtype: '1020', serialNo: 'JCSJ202607260003', objectNo: 'JCSJ202607260003', projectId: 'PJ202607020003', projectName: '双胞胎农牧融资项目', loanProductName: '货押融资', borrowerId: 'C2025051200000018', borrowerName: '双胞胎农牧有限公司', borrowerType: '企业客户', certId: '91360100MA1K4C003S', inputUserName: '陈敏', updatedate: '2026-07-26 15:30:00', updateOrgName: '南昌分行', effeName: '有效', unEffeDate: '', selectDate: '2026-07-27 09:10:00', systemPushFlag: '是', systemPushFlagCode: '1', phaseNo: '1020', tempSaveFlag: '0'
  },
  {
    id: 'DECISION-004', dealtype: '1030', serialNo: 'JCSJ202607220004', objectNo: 'JCSJ202607220004', projectId: 'PJ202607030004', projectName: '通威饲料贸易项目', loanProductName: '经销商融资', borrowerId: 'C2025060100000021', borrowerName: '通威饲料贸易有限公司', borrowerType: '企业客户', certId: '91510100MA1K4D004T', inputUserName: '周凯', updatedate: '2026-07-22 16:40:00', updateOrgName: '成都分行', effeName: '失效', unEffeDate: '2026-07-23 11:30:00', selectDate: '2026-07-22 17:00:00', systemPushFlag: '否', systemPushFlagCode: '0', phaseNo: '1030', tempSaveFlag: '0'
  },
  {
    id: 'DECISION-005', dealtype: '1040', serialNo: 'JCSJ202607240005', objectNo: 'JCSJ202607240005', projectId: 'PJ202607040005', projectName: '新城贸易融资项目', loanProductName: '国内保理融资', borrowerId: 'C202607190002', borrowerName: '新城贸易有限公司', borrowerType: '企业客户', certId: '91310114MA1K4E005U', inputUserName: '王菲', updatedate: '2026-07-24 14:20:00', updateOrgName: '上海分行', effeName: '有效', unEffeDate: '', selectDate: '2026-07-25 08:50:00', systemPushFlag: '否', systemPushFlagCode: '0', phaseNo: '1040', tempSaveFlag: '0'
  },
  {
    id: 'DECISION-006', dealtype: '1050', serialNo: 'JCSJ202607180006', objectNo: 'JCSJ202607180006', projectId: 'PJ202607050006', projectName: '海大供应链融资项目', loanProductName: '供应链流动资金贷款', borrowerId: 'C2025040300000003', borrowerName: '阿姆特拉斯供应链有限公司', borrowerType: '企业客户', certId: '91310115MA1K4A001Q', inputUserName: '张晨', updatedate: '2026-07-18 10:15:00', updateOrgName: '上海分行供应链金融部', effeName: '有效', unEffeDate: '', selectDate: '2026-07-19 09:30:00', systemPushFlag: '是', systemPushFlagCode: '1', phaseNo: '1050', tempSaveFlag: '0'
  },
  {
    id: 'DECISION-007', dealtype: '010010', serialNo: 'JCSJ202607280007', objectNo: 'JCSJ202607280007', projectId: 'PJ202607060007', projectName: '美团采购融资项目', loanProductName: '先票/款后货融资', borrowerId: 'C2025070100000028', borrowerName: '美团采购有限公司', borrowerType: '企业客户', certId: '91110108MA1K4F006V', inputUserName: '赵磊', updatedate: '2026-07-28 11:20:00', updateOrgName: '北京分行', effeName: '有效', unEffeDate: '', selectDate: '2026-07-28 13:40:00', systemPushFlag: '是', systemPushFlagCode: '1', phaseNo: '010010', tempSaveFlag: '0'
  },
  {
    id: 'DECISION-008', dealtype: '010020', serialNo: 'JCSJ202607160008', objectNo: 'JCSJ202607160008', projectId: 'PJ202607070008', projectName: '正邦农牧融资项目', loanProductName: '货押融资', borrowerId: 'C2025061500000025', borrowerName: '正邦农牧有限公司', borrowerType: '企业客户', certId: '91360100MA1K4G007W', inputUserName: '刘洋', updatedate: '2026-07-16 17:10:00', updateOrgName: '南昌分行', effeName: '有效', unEffeDate: '', selectDate: '2026-07-17 08:40:00', systemPushFlag: '否', systemPushFlagCode: '0', phaseNo: '010020', tempSaveFlag: '0'
  }
]

export const supplyChainDecisionPage = (params: Record<string, unknown> = {}) => {
  const value = (key: string) => String(params[key] ?? '').trim()
  const dealtype = value('dealtype') || value('phaseType') || value('key')
  const projectName = value('projectName')
  const borrowerName = value('borrowerName')
  const pageNo = Math.max(1, Number(value('pageNo') || value('pageNum') || 1))
  const pageSize = Math.max(1, Number(value('pageSize') || 20))
  const records = supplyChainDecisionRecords.filter((record) =>
    (!dealtype || record.dealtype === dealtype) &&
    (!projectName || record.projectName.includes(projectName)) &&
    (!borrowerName || record.borrowerName.includes(borrowerName))
  )
  const list = records.slice((pageNo - 1) * pageSize, pageNo * pageSize)

  return { total: records.length, list, records: list, pageNo, pageSize }
}
