import request from '@/config/axios'

// 获得授权信息
export const getCustomerInfoEntPage = (params) => {
  return request.get({ url: '/system/customerinfo/ent/customerInfoEntPage', params })
}

// 加入供应链群取数
export const selectTeamWork = (params) => {
  return request.get({ url: '/system/customerinfo/ent/selectTeamWork', params })
}

// 加入供应链群保存校验
export const createTeamWorkCustomer = (data) => {
  return request.post({ url: '/system/teamwork/relative/create', data })
}

// 加入供应链群保存
export const addTeamWorkCustomer = (data) => {
  return request.post({ url: '/system/teamwork/relative/add', data })
}


// 新增
export const addCustomer = (data) => {
  return  request.post({url:`/system/customerinfo/addCustomer`,data})
}

// 权限申请保存
export const applyRole = (data) => {
  return  request.post({url:`/system/customerinfo/applyRole`,data})
}

// 删除
export const deleteBelongAttribute1 = (data) => {
  return  request.post({url:`system/customerinfo/deleteBelongAttribute1`,data})
}