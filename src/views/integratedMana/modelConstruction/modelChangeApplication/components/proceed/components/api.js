import request from '@/config/axios'

export const getDetail = (params) => request.get({ url: '/system/modelManage/change/getDetail', params })

// 新增
export const qryCoreviewApplyCustomerPage = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/qryCoreviewApplyCustomerPage', params })
}

// 新增
export const addSave = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/add', data })
}

// 获取协审编号
export const getLatestSerialNo = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/getLatestSerialNo', params })
}
