export const assetOutboundManagementApplicationMenus = [
  {
    key: 'pending',
    value: './components/workList/index.vue',
    title: '待提交的债项资产出库申请',
    isLeaf: true,
    id: 'pending',
    children: null,
    phase: 'pending'
  },
  {
    key: 'reviewing',
    value: './components/workList/index.vue',
    title: '审查审批中的债项资产出库申请',
    isLeaf: true,
    id: 'reviewing',
    children: null,
    phase: 'reviewing'
  },
  {
    key: 'rejected',
    value: './components/workList/index.vue',
    title: '被否决的债项资产出库申请',
    isLeaf: true,
    id: 'rejected',
    children: null,
    phase: 'rejected'
  },
  {
    key: 'approved',
    value: './components/workList/index.vue',
    title: '审批通过的债项资产出库申请',
    isLeaf: true,
    id: 'approved',
    children: null,
    phase: 'approved'
  }
]

export const assetOutboundManagementApprovalMenus = [
  {
    key: 'current',
    value: './components/workList/index.vue',
    title: '当前工作',
    isLeaf: true,
    id: 'current',
    children: null,
    phase: 'reviewing'
  },
  {
    key: 'completed',
    value: './components/workList/index.vue',
    title: '已完成工作',
    isLeaf: true,
    id: 'completed',
    children: null,
    phase: 'approved'
  }
]
