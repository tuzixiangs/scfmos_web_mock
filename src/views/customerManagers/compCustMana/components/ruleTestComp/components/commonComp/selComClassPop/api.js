import request from '@/config/axios'

// 流转记录
export const getFlowRecordPage = (params) => {
  return request.get({ url: '/system/credit-flow/getFlowRecordPage', params })
}