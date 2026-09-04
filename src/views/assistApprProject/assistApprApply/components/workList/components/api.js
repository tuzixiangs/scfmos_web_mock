import request from '@/config/axios'

// 新增放款申请
export const newApply = (data) => {
  return request.post({ url: '/system/putout-info/newApply', data })
}
