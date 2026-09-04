import request from '@/config/axios'

// 列表
export const aprrovalPage = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/aprrovalPage', params })
}

// 挑选
export const aprrovalOptionConfirm = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/aprrovalOptionConfirm', data })
}

// 挑选取消
export const aprrovalOptionCancel = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/aprrovalOptionCancel', data })
}

// 挑选列表
export const aprrovalOptionPage = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/aprrovalOptionPage', params })
}
/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}

export const addTeamWorkCustomer = (data) => {
  return request.post({ url: '/system/teamwork/relative/add', data })
}
