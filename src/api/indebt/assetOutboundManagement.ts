import request from '@/config/axios'

/** 债项资产管理左侧工作台的三个稳定节点。 */
export type AssetOutboundManagementApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'

export type AssetOutboundManagementApplicationStatus = '待提交' | '待处理' | '审查审批中' | '被否决' | '审批通过'
export type AssetOutboundManagementOutboundType = '部分出库' | '已完成出库'
export type AssetOutboundManagementCurrency = '人民币' | '美元' | '欧元'

export interface AssetOutboundManagementApplicationImage {
  id: number
  name: string
  url: string
  uploadedAt: string
  uploader: string
}

export interface AssetOutboundManagementApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

/** 用于“查看流转记录”的 Mock 流程轨迹。 */
export interface AssetOutboundManagementFlowRecord {
  id: number
  node: string
  action: string
  operator: string
  operatedAt: string
  comment?: string
}

/** 新增弹窗中可选择的有效项目及其可出库业务合同。 */
export interface AssetOutboundManagementProject {
  id: number
  projectName: string
  projectNo: string
  customerName: string
  /** 链属客户名称是内网页面的字段叫法，Mock 与 customerName 同步返回。 */
  linkedCustomerName?: string
  coreCustomerNo: string
  productScheme: string
  productPlan?: string
  creditNo: string
  businessContractNo: string
  businessContractName?: string
  contractAmount: number
  businessContractAmount?: number
  currency: AssetOutboundManagementCurrency
  contractStartDate: string
  contractEndDate: string
  disbursementAmount: number
  outboundAmount?: number
  disbursementDate: string
  billingDate?: string
  arrivalDeadline: string
  arrivalPort?: string
  arrivalDate?: string
  outboundDate?: string
  isEffective?: boolean
}

/** 列表、详情共用的债项资产出库/出库申请信息。 */
export interface AssetOutboundManagementApplicationRecord {
  id: number
  applicationNo: string
  projectId: number
  projectName: string
  projectNo: string
  customerName: string
  linkedCustomerName?: string
  coreCustomerNo: string
  productScheme: string
  productPlan?: string
  creditNo: string
  relatedBusinessContractNo: string
  businessContractNo?: string
  businessContractName?: string
  contractAmount: number
  businessContractAmount?: number
  currency: AssetOutboundManagementCurrency
  contractStartDate?: string
  contractEndDate?: string
  disbursementAmount: number
  outboundAmount?: number
  disbursementDate: string
  billingDate?: string
  arrivalDeadline: string
  arrivalPort?: string
  arrivalDate?: string
  outboundDate?: string
  outboundGoodsValue: number
  outboundValue?: number
  latestInventoryValue?: number
  proposedOutboundAmount?: number
  applicationChannel?: string
  confirmationRemark?: string
  applicationDate: string
  outboundType: AssetOutboundManagementOutboundType
  phase: AssetOutboundManagementApplicationPhase
  status: AssetOutboundManagementApplicationStatus
  currentStage?: string
  completedAt?: string
  images?: AssetOutboundManagementApplicationImage[]
  opinions?: AssetOutboundManagementApplicationOpinion[]
  flowRecords?: AssetOutboundManagementFlowRecord[]
}

export interface AssetOutboundManagementApplicationDetail extends AssetOutboundManagementApplicationRecord {
  images: AssetOutboundManagementApplicationImage[]
  opinions: AssetOutboundManagementApplicationOpinion[]
  flowRecords: AssetOutboundManagementFlowRecord[]
}

export interface AssetOutboundManagementApplicationQuery {
  pageNo?: number
  pageSize?: number
  phase?: AssetOutboundManagementApplicationPhase
  status?: AssetOutboundManagementApplicationStatus
  applicationNo?: string
  customerName?: string
  coreCustomerNo?: string
  projectName?: string
  projectNo?: string
  relatedBusinessContractNo?: string
}

export interface AssetOutboundManagementApplicationPageResult {
  total: number
  list: AssetOutboundManagementApplicationRecord[]
  records: AssetOutboundManagementApplicationRecord[]
  pageNo: number
  pageSize: number
}

export interface AssetOutboundManagementProjectQuery {
  projectName?: string
  projectNo?: string
  customerName?: string
  linkedCustomerName?: string
  coreCustomerNo?: string
  businessContractNo?: string
}

/**
 * 新增时项目基础信息、出账信息和关联业务合同由有效项目带入，页面仅需选择项目及出库类型。
 */
export interface AssetOutboundManagementApplicationCreateForm {
  projectId: number
  outboundType?: AssetOutboundManagementOutboundType
}

/** 待处理节点的详情允许确认出库在库货值、出库类型和出库截止日期。 */
export interface AssetOutboundManagementConfirmationForm {
  outboundGoodsValue?: number
  /** 兼容内网页面的字段名称。 */
  outboundValue?: number
  outboundType?: AssetOutboundManagementOutboundType
  arrivalDeadline?: string
  confirmationRemark?: string
}

export interface AssetOutboundManagementApplicationMutationResult {
  success: boolean
  message?: string
  record?: AssetOutboundManagementApplicationDetail
  image?: AssetOutboundManagementApplicationImage
  opinion?: AssetOutboundManagementApplicationOpinion
}

export interface AssetOutboundManagementBatchSubmitResult {
  success: boolean
  submitted: number
  failedIds: number[]
  message?: string
}

/** 三个左侧节点共用的申请列表。 */
export const getAssetOutboundManagementApplicationPage = (params: AssetOutboundManagementApplicationQuery) =>
  request.get<AssetOutboundManagementApplicationPageResult>({
    url: '/system/indebt/asset-outbound-management-applications/page',
    params
  })

/** 新增弹窗中选择仍有效、可办理出库申请的项目。 */
export const getAvailableAssetOutboundManagementProjects = (params?: AssetOutboundManagementProjectQuery) =>
  request.get<AssetOutboundManagementProject[]>({
    url: '/system/indebt/asset-outbound-management-applications/available-projects',
    params
  })

export const getEffectiveAssetOutboundManagementProjects = getAvailableAssetOutboundManagementProjects

export const createAssetOutboundManagementApplication = (data: AssetOutboundManagementApplicationCreateForm) =>
  request.post<AssetOutboundManagementApplicationMutationResult>({
    url: '/system/indebt/asset-outbound-management-applications/create',
    data
  })

export const getAssetOutboundManagementApplicationDetail = (id: number) =>
  request.get<AssetOutboundManagementApplicationDetail>({
    url: '/system/indebt/asset-outbound-management-applications/detail',
    params: { id }
  })

/** 与“待提交的债项资产出库申请”节点的业务措辞保持一致。 */
export const updateAssetOutboundManagementConfirmation = (id: number, data: AssetOutboundManagementConfirmationForm) =>
  request.put<AssetOutboundManagementApplicationMutationResult>({
    url: '/system/indebt/asset-outbound-management-applications/update-confirmation',
    data: { id, ...data }
  })

export const updateAssetOutboundManagementApplication = updateAssetOutboundManagementConfirmation

export const getAssetOutboundManagementApplicationImages = (id: number) =>
  request.get<AssetOutboundManagementApplicationImage[]>({
    url: '/system/indebt/asset-outbound-management-applications/images',
    params: { id }
  })

/** 本地 Mock 仅传文件名，即可模拟影像上传。 */
export const uploadAssetOutboundManagementApplicationImage = (id: number, fileName: string) =>
  request.post<AssetOutboundManagementApplicationMutationResult>({
    url: '/system/indebt/asset-outbound-management-applications/image/upload',
    data: { id, fileName }
  })

export const getAssetOutboundManagementApplicationOpinions = (id: number) =>
  request.get<AssetOutboundManagementApplicationOpinion[]>({
    url: '/system/indebt/asset-outbound-management-applications/opinions',
    params: { id }
  })

export const getAssetOutboundManagementApplicationFlowRecords = (id: number) =>
  request.get<AssetOutboundManagementFlowRecord[]>({
    url: '/system/indebt/asset-outbound-management-applications/flow-records',
    params: { id }
  })

export const signAssetOutboundManagementApplicationOpinion = (id: number, opinion: string) =>
  request.post<AssetOutboundManagementApplicationMutationResult>({
    url: '/system/indebt/asset-outbound-management-applications/sign-opinion',
    data: { id, opinion }
  })

/** 待处理出库申请提交后进入审查审批节点。 */
export const submitAssetOutboundManagementApplication = (id: number) =>
  request.post<AssetOutboundManagementApplicationMutationResult>({
    url: '/system/indebt/asset-outbound-management-applications/submit',
    data: { id }
  })

export const batchSubmitAssetOutboundManagementApplications = (ids: number[], opinion?: string) =>
  request.post<AssetOutboundManagementBatchSubmitResult>({
    url: '/system/indebt/asset-outbound-management-applications/batch-submit',
    data: { ids, opinion }
  })

/** 审查审批中的出库申请可收回至待处理出库申请。 */
export const withdrawAssetOutboundManagementApplication = (id: number) =>
  request.post<AssetOutboundManagementApplicationMutationResult>({
    url: '/system/indebt/asset-outbound-management-applications/withdraw',
    data: { id }
  })

/** 方便本地演示审批通过后的台账状态流转。 */
export const approveAssetOutboundManagementApplication = (id: number, opinion?: string) =>
  request.post<AssetOutboundManagementApplicationMutationResult>({
    url: '/system/indebt/asset-outbound-management-applications/approve',
    data: { id, opinion }
  })

// 页面按更简短的业务名称引用时可使用以下兼容别名。
export const getAssetOutboundManagementPage = getAssetOutboundManagementApplicationPage
export const getAvailableAssetOutboundManagementProjectsForCreate = getAvailableAssetOutboundManagementProjects
export const getAssetOutboundManagementDetail = getAssetOutboundManagementApplicationDetail
export const signAssetOutboundManagementOpinion = signAssetOutboundManagementApplicationOpinion
export const batchSubmitAssetOutboundManagement = batchSubmitAssetOutboundManagementApplications
export const withdrawAssetOutboundManagement = withdrawAssetOutboundManagementApplication
