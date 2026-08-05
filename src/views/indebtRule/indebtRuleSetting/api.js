import request from '@/config/axios'

// 保存
export const crRuleAdd = (data) => {
  return request.post({ url: '/system/crRule/add', data })
}

// 修改
export const crRuleEdit = (data) => {
  return request.put({ url: '/system/crRule/edit', data })
}