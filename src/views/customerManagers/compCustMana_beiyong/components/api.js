import request from '@/config/axios'

// 客户新增保存校验
export const checkCertIDValidity = (params) => {
  return request.get({ url: '/system/customerinfo/checkCertIDValidity', params })
}