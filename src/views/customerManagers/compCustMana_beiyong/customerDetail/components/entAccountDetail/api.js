import request from '@/config/axios'

// 获得授权信息
export const entAccountDetailUrl = (params) => {
  return request.get({ url: '/system/customerinfo/ent/entAccountDetailUrl', params })
}