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
    key: 'approved',
    value: './components/workList/index.vue',
    title: '已完成的债项资产到港确认',
    isLeaf: true,
    id: 'approved',
    children: null,
    phase: 'approved'
  }
]
