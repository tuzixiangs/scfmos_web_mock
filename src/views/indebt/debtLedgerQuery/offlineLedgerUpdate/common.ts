export const offlineLedgerApplicationMenus = [
  {
    key: 'pending',
    value: './components/workList/index.vue',
    title: '待提交的线下台账更新申请',
    isLeaf: true,
    id: 'pending',
    children: null,
    phase: 'pending'
  },
  {
    key: 'reviewing',
    value: './components/workList/index.vue',
    title: '审查审批中的线下台账更新申请',
    isLeaf: true,
    id: 'reviewing',
    children: null,
    phase: 'reviewing'
  },
  {
    key: 'rejected',
    value: './components/workList/index.vue',
    title: '被否决的线下台账更新申请',
    isLeaf: true,
    id: 'rejected',
    children: null,
    phase: 'rejected'
  },
  {
    key: 'approved',
    value: './components/workList/index.vue',
    title: '审批通过的线下台账更新申请',
    isLeaf: true,
    id: 'approved',
    children: null,
    phase: 'approved'
  }
]
