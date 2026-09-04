import request from '@/config/axios'

// 列表接口
export const getDetail = (params) => {
  return request.get({ url: '/system/big-supply/electron/detail', params })
}

export const saveCustomer = (data) => {
  return request.post({ url: '/system/customerinfo/ent/saveCustomer', data })
}
