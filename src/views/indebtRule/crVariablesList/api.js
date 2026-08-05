import request from '@/config/axios'

/**
 * 新增债项因子组别
 */
const addVariables = async (data) => {
  return request.post({ url: '/system/crVariables/add', data })
}

/**
 * 修改债项因子组别
 */
const editVariables = async (data) => {
  return request.put({ url: '/system/crVariables/edit', data })
}

/**
 * 删除债项因子组别
 */
const deleteVariablesGroup = async (id) => {
  return request.delete({ url: `/system/crVariablesGroup/delete?id=${id}` })
}

/**
 * 获取债项因子组别列表
 */
const getVariablesGroupList = async (params) => {
  return request.get({ url: '/system/crVariablesGroup/list', params })
}

export {
  addVariables,
  editVariables,
  deleteVariablesGroup,
  getVariablesGroupList
}
