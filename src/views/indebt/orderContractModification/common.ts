/**
 * 订单/合同信息修改包含待提交的修改申请，以及已经提交后的修改记录。
 * 两个菜单复用同一份工作列表组件，通过 mode 决定字段与操作按钮。
 */
export const orderContractModificationMenus = [
  {
    key: 'application',
    value: './components/workList/index.vue',
    title: '订单/合同信息修改',
    isLeaf: true,
    id: 'application',
    children: null,
    mode: 'application'
  },
  {
    key: 'record',
    value: './components/workList/index.vue',
    title: '订单/合同信息修改记录',
    isLeaf: true,
    id: 'record',
    children: null,
    mode: 'record'
  }
]
