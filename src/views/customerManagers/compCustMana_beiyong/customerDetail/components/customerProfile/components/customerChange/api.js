import request from '@/config/axios'

// 客户变更保存
export const saveChangeCustomer = (data) => {
  return request.post({ url: '/system/customerinfo/ent/saveChangeCustomer', data })
}

// 客户变更取数
export const changeCustomerInfo = (params) => {
  return request.get({ url: '/system/customerinfo/ent/changeCustomerInfo', params })
}
