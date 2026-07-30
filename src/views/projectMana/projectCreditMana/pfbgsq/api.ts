import request from '@/config/axios'
import { approvalChangeApplicationMenu, approvalChangeApplicationPage } from '@/mock/approval-change-application'

export const getApproveMenuList = (params) => {
  return request.get({ url: '/system/approveChangeApply/getMenuList', params })
    .then((res) => Array.isArray(res) && res.some((item) => item?.children?.length) ? res : approvalChangeApplicationMenu)
    .catch(() => approvalChangeApplicationMenu)
}

/** 批复变更列表各阶段列表 */
export const getApproveChangeApplyList = (params) => {
  return request.get({ url: '/system/approveChangeApply/getApproveChangeApplyList', params})
    .then((res) => res?.list?.some((item) => item?.objectNo) ? res : approvalChangeApplicationPage(params))
    .catch(() => approvalChangeApplicationPage(params))
}

/** 获取可用的批复变更列表 */
export const getUsedBusinessApproveList = (params) => {
  params.creditSourceFlag = '01'
  return request.get({ url: '/system/approveChangeApply/UsedBusinessApproveReq', params})
}

/** 新增批复变更申请 */
export const addApproveChangeApply = (data) => {
  return request.post({ url: '/system/approveChangeApply/addApproveChangeApply', data})
}

/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}
