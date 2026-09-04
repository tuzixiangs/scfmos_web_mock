import request from '@/config/axios'

// 列表接口
export const pagePutOutList = (data) => {
  return request.post({ url: '/system/sxctCreditApply/pagePutOutList', data })
}

export const getCustomerInfoEntPage = (params) => {
  return request.get({ url: '/system/customerinfo/ent/customerInfoEntPage', params })
}
