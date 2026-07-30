import request from '@/config/axios'

// 列表
export const custRelaTeamworkProjectList = (params) => {
  return request.get({ url: '/system/customerinfo/getIndWorkList', params })
}

// 获得字典
export const custRelaTeamworkProjectItem = (params) => {
  return request.get({ url: '/system/customerinfo/ent/custRelaTeamworkProjectItem', params })
}