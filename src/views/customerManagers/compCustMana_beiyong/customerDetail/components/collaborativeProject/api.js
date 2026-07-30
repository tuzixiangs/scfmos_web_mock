import request from '@/config/axios'

// 获得字典
export const custRelaTeamworkProjectList = (params) => {
  return request.get({ url: '/system/customerinfo/ent/custRelaTeamworkProjectList', params })
}

// 获得字典
export const custRelaTeamworkProjectItem = (params) => {
  return request.get({ url: '/system/customerinfo/ent/custRelaTeamworkProjectItem', params })
}

/** 新增、编辑、删除 */ 
export const saveCustRelaTeamworkProject = (data) => {
  return request.post({
    url: '/system/customerinfo/ent/saveCustRelaTeamworkProject',
    data
  })
}