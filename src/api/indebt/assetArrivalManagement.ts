import request from '@/config/axios'

/** 债项资产到港管理左侧工作台的三个稳定节点。 */
export type AssetArrivalApplicationPhase = 'pending' | 'reviewing' | 'approved'

export type AssetArrivalApplicationStatus = '待处理' | '审查审批中' | '审批通过'
export type AssetArrivalInboundType = '部分入库' | '已完成入库'
export type AssetArrivalCurrency = '人民币' | '美元' | '欧元'

export interface AssetArrivalApplicationImage {
  id: number
  name: string
  url: string
  uploadedAt: string
  uploader: string
}

export interface AssetArrivalApplicationOpinion {
  id: number
  content: string
  signer: string
  signedAt: string
}

/** 用于“查看流转记录”的 Mock 流程轨迹。 */
export interface AssetArrivalFlowRecord {
  id: number
  node: string
  action: string
  operator: string
  operatedAt: string
  comment?: string
}

/** 新增弹窗中可选择的有效项目及其可到港业务合同。 */
export interface AssetArrivalProject {
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
  currency: AssetArrivalCurrency
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

/** 列表、详情共用的债项资产到港/入库申请信息。 */
export interface AssetArrivalApplicationRecord {
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
  currency: AssetArrivalCurrency
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
  inboundType: AssetArrivalInboundType
  phase: AssetArrivalApplicationPhase
  status: AssetArrivalApplicationStatus
  currentStage?: string
  completedAt?: string
  images?: AssetArrivalApplicationImage[]
  opinions?: AssetArrivalApplicationOpinion[]
  flowRecords?: AssetArrivalFlowRecord[]
}

export interface AssetArrivalApplicationDetail extends AssetArrivalApplicationRecord {
  images: AssetArrivalApplicationImage[]
  opinions: AssetArrivalApplicationOpinion[]
  flowRecords: AssetArrivalFlowRecord[]
}

export interface AssetArrivalApplicationQuery {
  pageNo?: number
  pageSize?: number
  phase?: AssetArrivalApplicationPhase
  status?: AssetArrivalApplicationStatus
  applicationNo?: string
  customerName?: string
  coreCustomerNo?: string
  projectName?: string
  projectNo?: string
  relatedBusinessContractNo?: string
}

export interface AssetArrivalApplicationPageResult {
  total: number
  list: AssetArrivalApplicationRecord[]
  records: AssetArrivalApplicationRecord[]
  pageNo: number
  pageSize: number
}

export interface AssetArrivalProjectQuery {
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
export interface AssetArrivalApplicationCreateForm {
  projectId: number
  inboundType?: AssetArrivalInboundType
}

/** 待处理节点的详情允许确认入库货值、入库类型和到港截止日期。 */
export interface AssetArrivalConfirmationForm {
  inboundGoodsValue?: number
  /** 兼容内网页面的字段名称。 */
  inboundValue?: number
  inboundType?: AssetArrivalInboundType
  arrivalDeadline?: string
  confirmationRemark?: string
}

export interface AssetArrivalApplicationMutationResult {
  success: boolean
  message?: string
  record?: AssetArrivalApplicationDetail
  image?: AssetArrivalApplicationImage
  opinion?: AssetArrivalApplicationOpinion
}

export interface AssetArrivalBatchSubmitResult {
  success: boolean
  submitted: number
  failedIds: number[]
  message?: string
}

/** 三个左侧节点共用的申请列表。 */
export const getAssetArrivalApplicationPage = (params: AssetArrivalApplicationQuery) =>
  request.get<AssetArrivalApplicationPageResult>({
    url: '/system/indebt/asset-arrival-applications/page',
    params
  })

/** 新增弹窗中选择仍有效、可办理到港确认的项目。 */
export const getAvailableAssetArrivalProjects = (params?: AssetArrivalProjectQuery) =>
  request.get<AssetArrivalProject[]>({
    url: '/system/indebt/asset-arrival-applications/available-projects',
    params
  })

export const getEffectiveAssetArrivalProjects = getAvailableAssetArrivalProjects

export const createAssetArrivalApplication = (data: AssetArrivalApplicationCreateForm) =>
  request.post<AssetArrivalApplicationMutationResult>({
    url: '/system/indebt/asset-arrival-applications/create',
    data
  })

export const getAssetArrivalApplicationDetail = (id: number) =>
  request.get<AssetArrivalApplicationDetail>({
    url: '/system/indebt/asset-arrival-applications/detail',
    params: { id }
  })

/** 与“待处理的债项资产到港确认”节点的业务措辞保持一致。 */
export const updateAssetArrivalConfirmation = (id: number, data: AssetArrivalConfirmationForm) =>
  request.put<AssetArrivalApplicationMutationResult>({
    url: '/system/indebt/asset-arrival-applications/update-confirmation',
    data: { id, ...data }
  })

export const updateAssetArrivalApplication = updateAssetArrivalConfirmation

export const getAssetArrivalApplicationImages = (id: number) =>
  request.get<AssetArrivalApplicationImage[]>({
    url: '/system/indebt/asset-arrival-applications/images',
    params: { id }
  })

/** 本地 Mock 仅传文件名，即可模拟影像上传。 */
export const uploadAssetArrivalApplicationImage = (id: number, fileName: string) =>
  request.post<AssetArrivalApplicationMutationResult>({
    url: '/system/indebt/asset-arrival-applications/image/upload',
    data: { id, fileName }
  })

export const getAssetArrivalApplicationOpinions = (id: number) =>
  request.get<AssetArrivalApplicationOpinion[]>({
    url: '/system/indebt/asset-arrival-applications/opinions',
    params: { id }
  })

export const getAssetArrivalApplicationFlowRecords = (id: number) =>
  request.get<AssetArrivalFlowRecord[]>({
    url: '/system/indebt/asset-arrival-applications/flow-records',
    params: { id }
  })

export const signAssetArrivalApplicationOpinion = (id: number, opinion: string) =>
  request.post<AssetArrivalApplicationMutationResult>({
    url: '/system/indebt/asset-arrival-applications/sign-opinion',
    data: { id, opinion }
  })

/** 待处理到港确认提交后进入审查审批节点。 */
export const submitAssetArrivalApplication = (id: number) =>
  request.post<AssetArrivalApplicationMutationResult>({
    url: '/system/indebt/asset-arrival-applications/submit',
    data: { id }
  })

export const batchSubmitAssetArrivalApplications = (ids: number[], opinion?: string) =>
  request.post<AssetArrivalBatchSubmitResult>({
    url: '/system/indebt/asset-arrival-applications/batch-submit',
    data: { ids, opinion }
  })

/** 审查审批中的入库申请可收回至待处理到港确认。 */
export const withdrawAssetArrivalApplication = (id: number) =>
  request.post<AssetArrivalApplicationMutationResult>({
    url: '/system/indebt/asset-arrival-applications/withdraw',
    data: { id }
  })

/** 方便本地演示审批通过后的台账状态流转。 */
export const approveAssetArrivalApplication = (id: number, opinion?: string) =>
  request.post<AssetArrivalApplicationMutationResult>({
    url: '/system/indebt/asset-arrival-applications/approve',
    data: { id, opinion }
  })

// 页面按更简短的业务名称引用时可使用以下兼容别名。
export const getAssetArrivalPage = getAssetArrivalApplicationPage
export const getAvailableAssetArrivalProjectsForCreate = getAvailableAssetArrivalProjects
export const getAssetArrivalDetail = getAssetArrivalApplicationDetail
export const signAssetArrivalOpinion = signAssetArrivalApplicationOpinion
export const batchSubmitAssetArrival = batchSubmitAssetArrivalApplications
export const withdrawAssetArrival = withdrawAssetArrivalApplication
