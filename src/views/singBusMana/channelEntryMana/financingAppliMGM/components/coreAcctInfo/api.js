import request from '@/config/axios'

// 列表接口
export const getCoreAcctInfoPage = (data) => {
  return request.post({ url: '/system/sxctCreditApply/getCoreAcctInfoPage', data })
}

// 查询余额
export const queryBalance = (data) => {
  return request.post({ url: '/system/sxctCreditApply/queryBalance', data })
}

export const getQFDFDetailList = (data) => {
  return request.post({ url: '/system/sxctCreditApply/getQFDFDetailList', data })
}

export const updateResult = (data) => {
  return request.post({ url: '/system/sxctCreditApply/updateResult', data })
}

export const noticToCT = (data) => {
  return request.post({ url: '/system/sxctCreditApply/noticToCT', data })
}
