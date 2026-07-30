import request from '@/config/axios'
import { loanApplicationPage } from '@/mock/loan-application'

// 列表接口
export const pendPutOutApplyList = (params) => {
  return request.get({ url: '/system/putout-info/pendPutOutApplyList', params })
    .then((res) => res?.list?.some((item) => item.mfcustomerid) ? res : loanApplicationPage(params))
    .catch(() => loanApplicationPage(params))
}

// 登记合同
export const bookInContract = (data) => {
  return request.post({ url: '/system/business-approve/bookInContract', data })
}

// 业务取消
export const cancelContract = (data) => {
  return request.post({ url: '/system/business-contract/cancelContract', data })
}

// 同步合同信息
export const syncContractInfo = (data) => {
  return request.post({ url: '/system/business-contract/syncContractInfo', data })
}

// 退回网银
export const returnOnlineBank = (data) => {
  return request.post({ url: '/system/business-contract/returnOnlineBank', data })
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}

// 导出 Excel
export const handleExport = async (params) => {
  return await request.download({ url: `/system/putout-info/exportExcel`, params })
}

// 同步视频系统
export const syncVideo = (data) => {
  return request.post({ url: '/system/business-contract/synVideo', data })
}

// 判断填写放贷通知书提示
export const judgeFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/judgeFormatReport', data })
}

// 填写放贷通知书前置操作
export const preEditFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/preEditFormatReport', data })
}

// 填写放贷通知书
export const editFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/editFormatReport', data })
}

// 查看放贷通知书
export const viewFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/viewFormatReport', data })
}

// 新增放贷
export const newApply = (data) => {
  return request.post({ url: 'system/putout-info/newApply', data })
}

// 获取保存标识
export const getTempSaveFlag = (params) => {
  return request.get({ url: 'system/putout-info/getTempSaveFlag', params })
}

// 集中作业任务-挑选确认
export const concentratedWorkOption = (params) => {
  return request.get({ url: '/system/business-contract/concentratedWorkOption', params })
}
// 集中作业任务-退回
export const concentratedWorkBack = (params) => {
  return request.get({ url: '/system/business-contract/concentratedWorkBack', params })
}
/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}
/** 判断当前提交逻辑是否需要进行风险探测强控 */
export const checkSubmitIsRisk = (params) => {
  return request.get({ url: '/system/bpmComment/checkSubmitIsRisk', params })
}
/** 判断业务合同或者放款的业务品种与供应链产品方案的业务边界 */
export const checkBusTypeAndLoanProductCategory = (params) => {
  return request.get({ url: '/system/bpmComment/checkBusTypeAndLoanProductCategory', params })
}
