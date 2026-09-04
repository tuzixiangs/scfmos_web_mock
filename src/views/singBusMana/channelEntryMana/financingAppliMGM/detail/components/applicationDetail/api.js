import request from '@/config/axios'

// 获得客户详情数据
export const getChangeCustomerInfo = (params) => {
  return request.get({ url: '/system/customerinfo/ent/customerInfoEntDetail', params })
}

export const saveCustomer = (data) => {
  return request.post({ url: '/system/customerinfo/ent/saveCustomer', data })
}
