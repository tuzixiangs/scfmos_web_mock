export interface CustomerRiskCheckItem {
  chkItmNo: string
  chkItmNm: string
}

export interface CustomerRiskCheckGroup {
  grpId: string
  grpNm: string
  rskInfArray: CustomerRiskCheckItem[]
}

export interface CustomerRiskCheckResult {
  modelId: string
  status: '1' | '2' | '4'
  message: string
}

export const customerRiskCheckGroups: CustomerRiskCheckGroup[] = [
  {
    grpId: 'customer-basic-information',
    grpNm: '客户基本信息检查',
    rskInfArray: [
      { chkItmNo: 'CUSTOMER_STATUS', chkItmNm: '客户工商登记状态检查' },
      { chkItmNo: 'CUSTOMER_CERTIFICATE', chkItmNm: '统一社会信用代码一致性检查' },
      { chkItmNo: 'CUSTOMER_CORE_NO', chkItmNm: '核心客户号有效性检查' },
      { chkItmNo: 'CUSTOMER_NAME', chkItmNm: '客户名称与工商登记名称一致性检查' },
      { chkItmNo: 'CUSTOMER_ORG_TYPE', chkItmNm: '机构类型及企业性质检查' },
      { chkItmNo: 'CUSTOMER_SCALE', chkItmNm: '企业规模认定信息检查' }
    ]
  },
  {
    grpId: 'customer-equity-information',
    grpNm: '工商及股权关系检查',
    rskInfArray: [
      { chkItmNo: 'CUSTOMER_LEGAL_PERSON', chkItmNm: '法定代表人身份信息检查' },
      { chkItmNo: 'CUSTOMER_REGISTERED_CAPITAL', chkItmNm: '注册资本及实缴资本检查' },
      { chkItmNo: 'CUSTOMER_SHAREHOLDER', chkItmNm: '主要股东信息完整性检查' },
      { chkItmNo: 'CUSTOMER_CONTROLLER', chkItmNm: '实际控制人信息检查' },
      { chkItmNo: 'CUSTOMER_RELATED_PARTY', chkItmNm: '关联企业及关联关系检查' },
      { chkItmNo: 'CUSTOMER_BUSINESS_SCOPE', chkItmNm: '经营范围与申请业务匹配性检查' }
    ]
  },
  {
    grpId: 'customer-access-risk',
    grpNm: '客户准入及风险检查',
    rskInfArray: [
      { chkItmNo: 'CUSTOMER_BLACKLIST', chkItmNm: '客户黑名单及禁入名单检查' },
      { chkItmNo: 'CUSTOMER_JUDICIAL_RISK', chkItmNm: '客户司法及失信风险检查' },
      { chkItmNo: 'CUSTOMER_SANCTION', chkItmNm: '制裁及反洗钱名单检查' },
      { chkItmNo: 'CUSTOMER_TAX_RISK', chkItmNm: '税务异常及重大欠税信息检查' },
      { chkItmNo: 'CUSTOMER_OPERATION_RISK', chkItmNm: '经营异常名录信息检查' },
      { chkItmNo: 'CUSTOMER_PUBLIC_OPINION', chkItmNm: '重大负面舆情信息检查' }
    ]
  },
  {
    grpId: 'customer-credit-information',
    grpNm: '征信及授信信息检查',
    rskInfArray: [
      { chkItmNo: 'CUSTOMER_CREDIT_AUTH', chkItmNm: '征信查询授权有效性检查' },
      { chkItmNo: 'CUSTOMER_CREDIT_REPORT', chkItmNm: '企业征信报告有效期检查' },
      { chkItmNo: 'CUSTOMER_OVERDUE', chkItmNm: '贷款逾期及欠息信息检查' },
      { chkItmNo: 'CUSTOMER_CREDIT_LIMIT', chkItmNm: '客户授信额度有效性检查' },
      { chkItmNo: 'CUSTOMER_LIMIT_OCCUPANCY', chkItmNm: '授信额度占用情况检查' },
      { chkItmNo: 'CUSTOMER_GUARANTEE', chkItmNm: '对外担保及或有负债检查' }
    ]
  },
  {
    grpId: 'customer-business-information',
    grpNm: '客户业务信息完整性检查',
    rskInfArray: [
      { chkItmNo: 'CUSTOMER_MANAGER', chkItmNm: '主办客户经理及主办机构检查' },
      { chkItmNo: 'CUSTOMER_REQUIRED_INFO', chkItmNm: '客户必填信息完整性检查' },
      { chkItmNo: 'CUSTOMER_QUALIFICATION', chkItmNm: '客户资质认定信息检查' },
      { chkItmNo: 'CUSTOMER_BANK_ACCOUNT', chkItmNm: '银行账户信息有效性检查' },
      { chkItmNo: 'CUSTOMER_CONTACT', chkItmNm: '联系人及联系方式完整性检查' },
      { chkItmNo: 'CUSTOMER_IMAGE_DATA', chkItmNm: '影像资料完整性及有效期检查' }
    ]
  }
]

export const customerRiskCheckResults: CustomerRiskCheckResult[] = [
  { modelId: 'CUSTOMER_STATUS', status: '1', message: '工商登记状态正常，客户处于存续状态。' },
  { modelId: 'CUSTOMER_CERTIFICATE', status: '1', message: '统一社会信用代码与客户档案一致。' },
  { modelId: 'CUSTOMER_CORE_NO', status: '1', message: '核心客户号有效，客户映射关系正常。' },
  { modelId: 'CUSTOMER_NAME', status: '1', message: '客户名称与工商登记名称一致。' },
  { modelId: 'CUSTOMER_ORG_TYPE', status: '1', message: '机构类型及企业性质信息有效。' },
  { modelId: 'CUSTOMER_SCALE', status: '1', message: '企业规模认定信息完整。' },
  { modelId: 'CUSTOMER_LEGAL_PERSON', status: '1', message: '法定代表人身份信息有效。' },
  { modelId: 'CUSTOMER_REGISTERED_CAPITAL', status: '1', message: '注册资本信息与工商数据一致。' },
  {
    modelId: 'CUSTOMER_SHAREHOLDER',
    status: '4',
    message: '主要股东信息已维护，请关注最近一次工商变更日期。'
  },
  { modelId: 'CUSTOMER_CONTROLLER', status: '1', message: '实际控制人信息完整。' },
  { modelId: 'CUSTOMER_RELATED_PARTY', status: '1', message: '关联企业及关联关系已完成核验。' },
  { modelId: 'CUSTOMER_BUSINESS_SCOPE', status: '1', message: '经营范围与申请业务匹配。' },
  { modelId: 'CUSTOMER_BLACKLIST', status: '1', message: '未命中客户黑名单或业务禁入名单。' },
  { modelId: 'CUSTOMER_JUDICIAL_RISK', status: '1', message: '未发现影响当前业务办理的重大司法风险。' },
  { modelId: 'CUSTOMER_SANCTION', status: '1', message: '未命中制裁及反洗钱关注名单。' },
  { modelId: 'CUSTOMER_TAX_RISK', status: '1', message: '未发现重大欠税及税务异常信息。' },
  { modelId: 'CUSTOMER_OPERATION_RISK', status: '1', message: '未列入经营异常名录。' },
  {
    modelId: 'CUSTOMER_PUBLIC_OPINION',
    status: '4',
    message: '发现一般性行业舆情，暂未对客户正常经营产生重大影响。'
  },
  { modelId: 'CUSTOMER_CREDIT_AUTH', status: '1', message: '征信查询授权在有效期内。' },
  { modelId: 'CUSTOMER_CREDIT_REPORT', status: '1', message: '企业征信报告在有效期内。' },
  { modelId: 'CUSTOMER_OVERDUE', status: '1', message: '未发现贷款逾期或欠息记录。' },
  { modelId: 'CUSTOMER_CREDIT_LIMIT', status: '1', message: '客户授信额度状态有效。' },
  { modelId: 'CUSTOMER_LIMIT_OCCUPANCY', status: '1', message: '授信额度占用未超过审批额度。' },
  { modelId: 'CUSTOMER_GUARANTEE', status: '1', message: '对外担保及或有负债处于合理范围。' },
  { modelId: 'CUSTOMER_MANAGER', status: '1', message: '主办客户经理及主办机构信息完整。' },
  { modelId: 'CUSTOMER_REQUIRED_INFO', status: '1', message: '客户基本资料必填项均已维护。' },
  {
    modelId: 'CUSTOMER_QUALIFICATION',
    status: '4',
    message: '客户资质认定信息已维护，请在业务办理前关注资质材料有效期。'
  },
  { modelId: 'CUSTOMER_BANK_ACCOUNT', status: '1', message: '银行账户状态正常。' },
  { modelId: 'CUSTOMER_CONTACT', status: '1', message: '联系人及联系方式信息完整。' },
  { modelId: 'CUSTOMER_IMAGE_DATA', status: '1', message: '影像资料齐全且均在有效期内。' }
]

const resultBatchSize = 5
let returnedResultCount = 0

export const createCustomerRiskCheckTask = (customerNo = '') => {
  returnedResultCount = 0
  return {
    txnCd: `CUSTOMER-RISK-${customerNo || 'MOCK'}-001`,
    listArray: customerRiskCheckGroups
  }
}

export const getCustomerRiskCheckResults = () => {
  returnedResultCount = Math.min(
    returnedResultCount + resultBatchSize,
    customerRiskCheckResults.length
  )
  return {
    list: customerRiskCheckResults.slice(0, returnedResultCount)
  }
}
