import {
  intranetPermissionMenus,
  type IntranetPermissionMenu
} from './intranet-permission-menus'
import { intranetQuickMenus } from './intranet-quick-menus'

/**
 * 本地演示数据。只放稳定、脱敏的业务样例，按需可继续补充具体接口。
 * 统一响应在 src/mock/index.ts 中组装为后端约定的 { code, msg, data }。
 */
export const optionData = [
  { label: '是', value: '1', code: '1', name: '是' },
  { label: '否', value: '0', code: '0', name: '否' }
]

export const dictData = [
  { id: 1, dictType: 'common_status', label: '启用', value: '0', colorType: 'success', cssClass: '' },
  { id: 2, dictType: 'common_status', label: '停用', value: '1', colorType: 'danger', cssClass: '' },
  { id: 3, dictType: 'yes_no', label: '是', value: '1', colorType: 'success', cssClass: '' },
  { id: 4, dictType: 'yes_no', label: '否', value: '0', colorType: 'info', cssClass: '' },
  { id: 5, dictType: 'approval_status', label: '待处理', value: '0', colorType: 'warning', cssClass: '' },
  { id: 6, dictType: 'approval_status', label: '已通过', value: '1', colorType: 'success', cssClass: '' }
]

export const pageRecords = [
  {
    id: 10001,
    serialNo: 'SCF202607200001',
    customerId: 'C202607200001',
    customerID: 'C202607200001',
    customerName: '华东供应链有限公司',
    entName: '华东供应链有限公司',
    projectId: 'P20260001',
    projectName: '核心企业供应链金融项目',
    businessNo: 'YW202607200001',
    contractNo: 'HT202607200001',
    creditLineNo: 'ED202607200001',
    amount: 5000000,
    creditAmount: 5000000,
    applyAmount: 1200000,
    status: '0',
    approvalStatus: '0',
    applyStatus: '待审批',
    createTime: '2026-07-20 09:30:00',
    updateTime: '2026-07-20 10:15:00',
    orgName: '总行供应链金融部',
    managerName: '张晨'
  },
  {
    id: 10002,
    serialNo: 'SCF202607190002',
    customerId: 'C202607190002',
    customerID: 'C202607190002',
    customerName: '新城贸易有限公司',
    entName: '新城贸易有限公司',
    projectId: 'P20260002',
    projectName: '经销商融资项目',
    businessNo: 'YW202607190002',
    contractNo: 'HT202607190002',
    creditLineNo: 'ED202607190002',
    amount: 2800000,
    creditAmount: 2800000,
    applyAmount: 800000,
    status: '1',
    approvalStatus: '1',
    applyStatus: '已通过',
    createTime: '2026-07-19 14:20:00',
    updateTime: '2026-07-20 08:45:00',
    orgName: '上海分行',
    managerName: '李敏'
  }
]

export const dashboardTasks = [
  {
    itemNo: 'credit-approval', itemName: '授信审批待办', itemAttribute: '/system/index/mock-credit-pending',
    attribute2: 'credit', attribute3: '授信审批', attribute6: 'credit', backlogGroupName: '授信业务'
  },
  {
    itemNo: 'contract-approval', itemName: '合同审批待办', itemAttribute: '/system/index/mock-contract-pending',
    attribute2: 'contract', attribute3: '合同审批', attribute6: 'contract', backlogGroupName: '合同业务'
  }
]

export const dashboardTabs = [
  { attribute6: 'credit', backlogGroupName: '授信业务', backlogGroupNum: '1', count: 1 },
  { attribute6: 'contract', backlogGroupName: '合同业务', backlogGroupNum: '2', count: 1 }
]

// 这三项在当前导出的前端包中没有对应的页面文件。保留真实菜单入口，
// 并指向本地占位页，避免打开菜单时动态路由找不到组件而报错。
const fallbackMenuComponents = new Set([
  'projectparamconfigerandmanager/preInputApply/index',
  'projectparamconfigerandmanager/preInputMaintianApply/index',
  'projectparamconfigerandmanager/preInputApply/detail/index'
])

const normalizeIntranetMenus = (menus: IntranetPermissionMenu[]): IntranetPermissionMenu[] =>
  menus.map((menu) => ({
    ...menu,
    // 内网返回中有两个同名的 componentName，Vue Router 会覆盖先注册的路由。
    componentName: menu.id === 1285 ? 'DzhtSupplyApproveChain' : menu.componentName,
    component:
      typeof menu.component === 'string' && fallbackMenuComponents.has(menu.component)
        ? 'mock/UnavailableFeature'
        : menu.component,
    children: Array.isArray(menu.children) ? normalizeIntranetMenus(menu.children) : menu.children
  }))

export const permissionInfo = {
  permissions: ['*:*:*'],
  roles: ['admin'],
  roleIds: ['1'],
  user: {
    id: 1,
    username: 'mock_admin',
    nickname: '本地演示用户',
    avatar: '',
    deptId: 1,
    mobile: '13800000000',
    email: 'mock@example.com'
  },
  dept: { id: 1, name: '总行供应链金融部' },
  quickMenus: normalizeIntranetMenus(intranetQuickMenus),
  menus: normalizeIntranetMenus(intranetPermissionMenus)
}
