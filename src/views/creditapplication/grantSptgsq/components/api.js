import request from '@/config/axios'

// 获得字典
export const getCodeLibraryList = (params) => {
  return request.get({ url: '/system/codeLibrary/list', params })
}

// 获取分类数据
export const getApproveClassifyInfo = (data) => {
  return request.post({ url: '/system/credit-apply/getApproveClassifyInfo', data })
}
// 获取分类模板
export const getApproveClassifyDetail = (data) => {
  return request.post({ url: '/system/credit-apply/getApproveClassifyDetail', data })
}
// 获取分类提交
export const submitApproveClassifyInfo  = (data) => {
  return request.post({ url: '/system/credit-apply/submitApproveClassifyInfo', data })
}

export const getWhiteApplyList = (params) => {
  return request.get({ url: '/system/credit-apply/getWhiteApplyList', params })
}

export const addWhiteApply = (data) => {
  return request.post({ url: '/system/credit-apply/addWhiteApply', data })
}
