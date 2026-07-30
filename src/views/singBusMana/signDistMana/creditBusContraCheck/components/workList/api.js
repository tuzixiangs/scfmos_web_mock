import request from '@/config/axios'
import { linkedContractApprovalPage } from '@/mock/linked-contract-approval'

// 列表
export const ywContractList = (params) => {
  return request.get({ url: '/system/ContractTask/ywContractList', params })
    .then((res) => res?.list?.some((item) => item?.objectNo) ? res : linkedContractApprovalPage(params))
    .catch(() => linkedContractApprovalPage(params))
}

// 挑选取消
export const aprrovalOptionCancel = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/aprrovalOptionCancel', data })
}
/** 判断当前提交逻辑是否需要进行风险探测强控 */
export const checkSubmitIsRisk = (params) => {
  return request.get({ url: '/system/bpmComment/checkSubmitIsRisk', params })
}

export const exportExcel = (params) => {
  return  request.download({ url: `/system/ContractTask/ywContractExportExcel`, params })
}


/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}
/** 判断业务合同或者放款的业务品种与供应链产品方案的业务边界 */
export const checkBusTypeAndLoanProductCategory = (params) => {
  return request.get({ url: '/system/bpmComment/checkBusTypeAndLoanProductCategory', params })
}
