import request from '@/config/axios'

// 菜单
export const getCustomerView = (params) => {
  return request.get({ url: '/system/custom-self-employed/getCustomerView', params })
}