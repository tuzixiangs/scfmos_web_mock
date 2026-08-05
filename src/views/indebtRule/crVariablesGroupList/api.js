import request from '@/config/axios'

/**
 * 新增债项因子组别
 */
const addVariablesGroup = async (data) => {
  return request.post({ url: '/system/crVariablesGroup/add', data })
}

/**
 * 修改债项因子组别
 */
const editVariablesGroup = async (data) => {
  return request.put({ url: '/system/crVariablesGroup/edit', data })
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

/**
 * 新增债项因子
 */
const addVariables = async (data) => {
  return request.post({ url: '/indebt/crVariables/add', data })
}

/**
 * 修改债项因子
 */
const editVariables = async (data) => {
  return request.put({ url: '/indebt/crVariables/edit', data })
}

/**
 * 获取债项因子列表
 */
const getVariablesList = async (params) => {
  return request.get({ url: '/indebt/crVariables/list', params })
}

export {
  addVariablesGroup,
  editVariablesGroup,
  deleteVariablesGroup,
  getVariablesGroupList,
  addVariables,
  editVariables,
  getVariablesList
}
