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
