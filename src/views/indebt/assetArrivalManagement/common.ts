export const assetArrivalApplicationMenus = [
  {
    key: 'pending',
    value: './components/workList/index.vue',
    title: '待处理的债项资产到港确认',
    isLeaf: true,
    id: 'pending',
    children: null,
    phase: 'pending'
  },
  {
    key: 'reviewing',
    value: './components/workList/index.vue',
    title: '审查审批中的债项资产入库申请',
    isLeaf: true,
    id: 'reviewing',
    children: null,
    phase: 'reviewing'
  },
  {
    key: 'approved',
    value: './components/workList/index.vue',
    title: '审批通过的债项资产入库申请',
    isLeaf: true,
    id: 'approved',
    children: null,
    phase: 'approved'
  }
]
