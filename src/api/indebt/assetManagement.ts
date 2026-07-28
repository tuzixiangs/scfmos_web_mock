import request from '@/config/axios'

/** 债项资产管理左侧工作台的三个稳定节点。 */
export type AssetManagementApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'

export type AssetManagementApplicationStatus = '待提交' | '待处理' | '审查审批中' | '被否决' | '审批通过'
export type AssetManagementInboundType = '部分入库' | '已完成入库'
export type AssetManagementCurrency = '人民币' | '美元' | '欧元'

export interface AssetManagementApplicationImage {
  id: number
  name: string
  url: string
  uploadedAt: string
  uploader: string
}

export interface AssetManagementApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

/** 用于“查看流转记录”的 Mock 流程轨迹。 */
export interface AssetManagementFlowRecord {
  id: number
  node: string
  action: string
  operator: string
  operatedAt: string
  comment?: string
}

/** 新增弹窗中可选择的有效项目及其可入库业务合同。 */
export interface AssetManagementProject {
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
  currency: AssetManagementCurrency
  contractStartDate: string
  contractEndDate: string
  disbursementAmount: number
  outboundAmount?: number
  disbursementDate: string
  billingDate?: string
  arrivalDeadline: string
  arrivalPort?: string
  arrivalDate?: string
  inboundDate?: string
  isEffective?: boolean
}

/** 列表、详情共用的债项资产入库/入库申请信息。 */
export interface AssetManagementApplicationRecord {
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
  currency: AssetManagementCurrency
  contractStartDate?: string
  contractEndDate?: string
  disbursementAmount: number
  outboundAmount?: number
  disbursementDate: string
  billingDate?: string
  arrivalDeadline: string
  arrivalPort?: string
  arrivalDate?: string
  inboundDate?: string
  inboundGoodsValue: number
  inboundValue?: number
  confirmationRemark?: string
  applicationDate: string
  inboundType: AssetManagementInboundType
  phase: AssetManagementApplicationPhase
  status: AssetManagementApplicationStatus
  currentStage?: string
  completedAt?: string
  images?: AssetManagementApplicationImage[]
  opinions?: AssetManagementApplicationOpinion[]
  flowRecords?: AssetManagementFlowRecord[]
}

export interface AssetManagementApplicationDetail extends AssetManagementApplicationRecord {
  images: AssetManagementApplicationImage[]
  opinions: AssetManagementApplicationOpinion[]
  flowRecords: AssetManagementFlowRecord[]
}

export interface AssetManagementApplicationQuery {
  pageNo?: number
  pageSize?: number
  phase?: AssetManagementApplicationPhase
  status?: AssetManagementApplicationStatus
  applicationNo?: string
  customerName?: string
  coreCustomerNo?: string
  projectName?: string
  projectNo?: string
  relatedBusinessContractNo?: string
}

export interface AssetManagementApplicationPageResult {
  total: number
  list: AssetManagementApplicationRecord[]
  records: AssetManagementApplicationRecord[]
  pageNo: number
  pageSize: number
}

export interface AssetManagementProjectQuery {
  projectName?: string
  projectNo?: string
  customerName?: string
  linkedCustomerName?: string
  coreCustomerNo?: string
  businessContractNo?: string
}

/**
 * 新增时项目基础信息、出账信息和关联业务合同由有效项目带入，页面仅需选择项目及入库类型。
 */
export interface AssetManagementApplicationCreateForm {
  projectId: number
  inboundType?: AssetManagementInboundType
}

/** 待处理节点的详情允许确认入库货值、入库类型和入库截止日期。 */
export interface AssetManagementConfirmationForm {
  inboundGoodsValue?: number
  /** 兼容内网页面的字段名称。 */
  inboundValue?: number
  inboundType?: AssetManagementInboundType
  arrivalDeadline?: string
  confirmationRemark?: string
}

export interface AssetManagementApplicationMutationResult {
  success: boolean
  message?: string
  record?: AssetManagementApplicationDetail
  image?: AssetManagementApplicationImage
  opinion?: AssetManagementApplicationOpinion
}

export interface AssetManagementBatchSubmitResult {
  success: boolean
  submitted: number
  failedIds: number[]
  message?: string
}

/** 三个左侧节点共用的申请列表。 */
export const getAssetManagementApplicationPage = (params: AssetManagementApplicationQuery) =>
  request.get<AssetManagementApplicationPageResult>({
    url: '/system/indebt/asset-management-applications/page',
    params
  })

/** 新增弹窗中选择仍有效、可办理入库申请的项目。 */
export const getAvailableAssetManagementProjects = (params?: AssetManagementProjectQuery) =>
  request.get<AssetManagementProject[]>({
    url: '/system/indebt/asset-management-applications/available-projects',
    params
  })

export const getEffectiveAssetManagementProjects = getAvailableAssetManagementProjects

export const createAssetManagementApplication = (data: AssetManagementApplicationCreateForm) =>
  request.post<AssetManagementApplicationMutationResult>({
    url: '/system/indebt/asset-management-applications/create',
    data
  })

export const getAssetManagementApplicationDetail = (id: number) =>
  request.get<AssetManagementApplicationDetail>({
    url: '/system/indebt/asset-management-applications/detail',
    params: { id }
  })

/** 与“待提交的债项资产入库申请”节点的业务措辞保持一致。 */
export const updateAssetManagementConfirmation = (id: number, data: AssetManagementConfirmationForm) =>
  request.put<AssetManagementApplicationMutationResult>({
    url: '/system/indebt/asset-management-applications/update-confirmation',
    data: { id, ...data }
  })

export const updateAssetManagementApplication = updateAssetManagementConfirmation

export const getAssetManagementApplicationImages = (id: number) =>
  request.get<AssetManagementApplicationImage[]>({
    url: '/system/indebt/asset-management-applications/images',
    params: { id }
  })

/** 本地 Mock 仅传文件名，即可模拟影像上传。 */
export const uploadAssetManagementApplicationImage = (id: number, fileName: string) =>
  request.post<AssetManagementApplicationMutationResult>({
    url: '/system/indebt/asset-management-applications/image/upload',
    data: { id, fileName }
  })

export const getAssetManagementApplicationOpinions = (id: number) =>
  request.get<AssetManagementApplicationOpinion[]>({
    url: '/system/indebt/asset-management-applications/opinions',
    params: { id }
  })

export const getAssetManagementApplicationFlowRecords = (id: number) =>
  request.get<AssetManagementFlowRecord[]>({
    url: '/system/indebt/asset-management-applications/flow-records',
    params: { id }
  })

export const signAssetManagementApplicationOpinion = (id: number, opinion: string) =>
  request.post<AssetManagementApplicationMutationResult>({
    url: '/system/indebt/asset-management-applications/sign-opinion',
    data: { id, opinion }
  })

/** 待处理入库申请提交后进入审查审批节点。 */
export const submitAssetManagementApplication = (id: number) =>
  request.post<AssetManagementApplicationMutationResult>({
    url: '/system/indebt/asset-management-applications/submit',
    data: { id }
  })

export const batchSubmitAssetManagementApplications = (ids: number[], opinion?: string) =>
  request.post<AssetManagementBatchSubmitResult>({
    url: '/system/indebt/asset-management-applications/batch-submit',
    data: { ids, opinion }
  })

/** 审查审批中的入库申请可收回至待处理入库申请。 */
export const withdrawAssetManagementApplication = (id: number) =>
  request.post<AssetManagementApplicationMutationResult>({
    url: '/system/indebt/asset-management-applications/withdraw',
    data: { id }
  })

/** 方便本地演示审批通过后的台账状态流转。 */
export const approveAssetManagementApplication = (id: number, opinion?: string) =>
  request.post<AssetManagementApplicationMutationResult>({
    url: '/system/indebt/asset-management-applications/approve',
    data: { id, opinion }
  })

// 页面按更简短的业务名称引用时可使用以下兼容别名。
export const getAssetManagementPage = getAssetManagementApplicationPage
export const getAvailableAssetManagementProjectsForCreate = getAvailableAssetManagementProjects
export const getAssetManagementDetail = getAssetManagementApplicationDetail
export const signAssetManagementOpinion = signAssetManagementApplicationOpinion
export const batchSubmitAssetManagement = batchSubmitAssetManagementApplications
export const withdrawAssetManagement = withdrawAssetManagementApplication
