import request from '@/config/axios'
import { contractRegistrationPage } from '@/mock/contract-registration'

// 列表接口
export const getCustomerInfoEntPage = (data) => {
  return request.post({ url: '/system/business-approve/getBusinessApprovePage', data })
    .then((res) => res?.list?.some((item) => item.serialno) ? res : contractRegistrationPage(data))
    .catch(() => contractRegistrationPage(data))
}

// 登记合同
export const bookInContract = (data) => {
  return request.post({ url: '/system/business-approve/bookInContract', data })
}

// 登记合同
export const bookInContract2 = (params) => {
  return request.get({ url: '/system/business-contract/get', params })
}

// 业务取消
export const cancelContract = (data) => {
  return request.post({ url: '/system/business-contract/cancelContract', data })
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}

// 重新生成批复通知书
export const againApproveBookDoc = (data) => {
  return request.post({ url: '/system/business-approve/againApproveBookDoc', data })
}

// 批复不登记
export const unBookInContract = (data) => {
  return request.post({ url: '/system/business-approve/unBookInContract', data })
}

// 查看调查报告
export const queryCreditlineReport = (data) => {
  return request.post({ url: '/system/credit-line/query-creditline-report', data })
}
