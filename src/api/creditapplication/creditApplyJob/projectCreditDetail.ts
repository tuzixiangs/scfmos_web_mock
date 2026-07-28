import request from '@/config/axios'

/** 获取项目授信额度申请详情（本地 Mock 由统一 axios 适配器返回） */
export const getProjectCreditDetail = (params: Recordable) =>
  request.get({ url: '/system/creditLimitApply/getProjectDetail', params })

/** 保存详情页中的演示修改 */
export const saveProjectCreditDetail = (data: Recordable) =>
  request.post({ url: '/system/creditLimitApply/saveProjectDetail', data })
