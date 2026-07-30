import request from '@/config/axios'
import { loanApprovalPage } from '@/mock/loan-approval'

// 列表
export const ContractList = (data) => {
  return request.post({ url: '/system/putout-info/reviewLendingApplicationsRecheckPage', data })
    .then((res) => res?.list?.some((item) => item?.objectno) ? res : loanApprovalPage(data))
    .catch(() => loanApprovalPage(data))
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}

// 导出 Excel
export const handleExport = async (params) => {
  return await request.download({ url: `/system/putout-info/exportAll`, params })
}

// 挑选取消
export const aprrovalOptionCancel = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/aprrovalOptionCancel', data })
}
/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: '/system/modelManage/apply/checkComment', params })
}
/** 判断当前提交逻辑是否需要进行风险探测强控 */
export const checkSubmitIsRisk = (params) => {
  return request.get({ url: '/system/bpmComment/checkSubmitIsRisk', params })
}

// 填写放贷通知书
export const editFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/editFormatReport', data })
}

// 查看放贷通知书
export const viewFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/viewFormatReport', data })
}

// 判断填写放贷通知书提示
export const judgeFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/judgeFormatReport', data })
}

// 填写放贷通知书前置操作
export const preEditFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/preEditFormatReport', data })
}

// 退回网银
export const returnOnlineBank = (data) => {
  return request.post({ url: '/system/business-contract/returnOnlineBank', data })
}
/** 判断业务合同或者放款的业务品种与供应链产品方案的业务边界 */
export const checkBusTypeAndLoanProductCategory = (params) => {
  return request.get({ url: '/system/bpmComment/checkBusTypeAndLoanProductCategory', params })
}
