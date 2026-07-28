/** 存货类价格盯市申请的四个流程节点。 */
export const inventoryPriceApplicationMenus = [
  {
    key: 'pending',
    value: './components/workList/index.vue',
    title: '待提交的价格盯市申请',
    isLeaf: true,
    id: 'pending',
    children: null,
    phase: 'pending'
  },
  {
    key: 'reviewing',
    value: './components/workList/index.vue',
    title: '审查审批中的价格盯市申请',
    isLeaf: true,
    id: 'reviewing',
    children: null,
    phase: 'reviewing'
  },
  {
    key: 'rejected',
    value: './components/workList/index.vue',
    title: '被否决的价格盯市申请',
    isLeaf: true,
    id: 'rejected',
    children: null,
    phase: 'rejected'
  },
  {
    key: 'approved',
    value: './components/workList/index.vue',
    title: '审批通过的价格盯市申请',
    isLeaf: true,
    id: 'approved',
    children: null,
    phase: 'approved'
  }
]
