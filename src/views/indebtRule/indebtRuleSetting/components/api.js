import request from '@/config/axios'

// 流转记录
export const contantGroupList = (params) => {
  return request.get({ url: '/system/credit-flow/getFlowRecordPage', params })
}

// 流转记录
export const contantList = (params) => {
  return request.get({ url: '/system/credit-flow/getFlowRecordPage', params })
}