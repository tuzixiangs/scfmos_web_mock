import request from '@/config/axios'
import { loanApprovalPage } from '@/mock/loan-approval'

// 列表
export const ContractList = (data) => {
  return request.post({ url: '/system/putout-info/reviewLendingApplicationsRecheckPage', data })
    .then((res) => res?.list?.some((item) => item.objectno) ? res : loanApprovalPage(data))
    .catch(() => loanApprovalPage(data))
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}

// 导出 Excel
export const handleExport = async (params) => {
  return await request.download({ url: `/system/putout-info/exportExcel`, params })
}
