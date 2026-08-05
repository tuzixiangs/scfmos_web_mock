import request from '@/config/axios'

// 流转记录
export const crVariablesGroup = (params) => {
  return request.get({ url: '/system/crVariablesGroup/list', params })
}

// 流转记录
export const crVariables = (params) => {
  return request.get({ url: '/system/crVariables/list', params })
}

// 流转记录
export const varAndConst = (data) => {
  return request.post({ url: '/system/crRule/query/varAndConst', data })
}