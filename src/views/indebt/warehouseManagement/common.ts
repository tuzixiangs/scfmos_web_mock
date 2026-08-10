export const warehouseApplicationMenus = [
  {
    key: 'establishment_group',
    title: '仓库建立申请',
    children: [
      {
        key: 'pending',
        value: './components/workList/index.vue',
        title: '待提交的仓库建立申请',
        isLeaf: true,
        id: 'pending',
        phase: 'pending',
        category: 'establishment'
      },
      {
        key: 'reviewing',
        value: './components/workList/index.vue',
        title: '审查审批中的仓库建立申请',
        isLeaf: true,
        id: 'reviewing',
        phase: 'reviewing',
        category: 'establishment'
      },
      {
        key: 'rejected',
        value: './components/workList/index.vue',
        title: '被否决的仓库建立申请',
        isLeaf: true,
        id: 'rejected',
        phase: 'rejected',
        category: 'establishment'
      },
      {
        key: 'approved',
        value: './components/workList/index.vue',
        title: '审批通过的仓库建立申请',
        isLeaf: true,
        id: 'approved',
        phase: 'approved',
        category: 'establishment'
      }
    ]
  },
  {
    key: 'inspection_group',
    title: '巡库申请',
    children: [
      {
        key: 'inspection_pending',
        value: './components/inspectionList/index.vue',
        title: '待提交的巡库申请',
        isLeaf: true,
        id: 'inspection_pending',
        phase: 'pending',
        category: 'inspection'
      },
      {
        key: 'inspection_reviewing',
        value: './components/inspectionList/index.vue',
        title: '审查审批中的巡库申请',
        isLeaf: true,
        id: 'inspection_reviewing',
        phase: 'reviewing',
        category: 'inspection'
      },
      {
        key: 'inspection_approved',
        value: './components/inspectionList/index.vue',
        title: '审批通过的仓库巡库申请',
        isLeaf: true,
        id: 'inspection_approved',
        phase: 'approved',
        category: 'inspection'
      }
    ]
  }
]

export const warehouseApprovalMenus = [
  {
    key: 'approval_establishment_group',
    title: '仓库建立审批',
    children: [
      {
        key: 'current',
        value: './components/workList/index.vue',
        title: '当前工作',
        isLeaf: true,
        id: 'current',
        phase: 'reviewing',
        category: 'establishment',
        isApproval: true
      },
      {
        key: 'completed',
        value: './components/workList/index.vue',
        title: '已完成工作',
        isLeaf: true,
        id: 'completed',
        phase: 'approved',
        category: 'establishment',
        isApproval: true
      }
    ]
  },
  {
    key: 'approval_inspection_group',
    title: '巡库审批',
    children: [
      {
        key: 'inspection_approval_current',
        value: './components/inspectionList/index.vue',
        title: '当前工作',
        isLeaf: true,
        id: 'inspection_approval_current',
        phase: 'reviewing',
        category: 'inspection',
        isApproval: true
      },
      {
        key: 'inspection_approval_completed',
        value: './components/inspectionList/index.vue',
        title: '已完成工作',
        isLeaf: true,
        id: 'inspection_approval_completed',
        phase: 'approved',
        category: 'inspection',
        isApproval: true
      }
    ]
  }
]

