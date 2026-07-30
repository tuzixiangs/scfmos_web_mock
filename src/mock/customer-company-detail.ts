/**
 * 公司客户详情 Mock。
 *
 * 字段和值来自内网导出的 getCustomerView.json、getCustomerPageVO.json 和 2.json。
 * 原 getCustomerPageVO 含 316 个模板字段；这里保留客户概况首屏会用到的字段，
 * 既能还原页面结构，也避免本地演示一次性渲染大量无值的控件。
 */

type CustomerTemplateField = {
  dockid: string
  colindex: string
  colname: string
  colheader: string
  coltype?: string
  colcheckformat?: string
  coleditstyle?: string
  colvisible?: string
  colreadonly?: string
  colrequired?: string
  colspan?: string | null
  colunit?: string | null
  dono?: string
}

const field = (
  dockid: string,
  colindex: string,
  colname: string,
  colheader: string,
  options: Partial<CustomerTemplateField> = {}
): CustomerTemplateField => ({
  dockid,
  colindex,
  colname,
  colheader,
  dono: 'EnterpriseInfo1010NC',
  coltype: 'String',
  colcheckformat: '字符串',
  coleditstyle: '文本框',
  colvisible: '1',
  colreadonly: '1',
  colrequired: '0',
  colspan: null,
  colunit: null,
  ...options
})

export const companyCustomerViewMenu = [
  {
    key: '010',
    title: '客户基本信息',
    children: [
      { key: '010010', title: '客户概况', value: './components/customerProfile/index.vue', isLeaf: true },
      { key: '010005', title: '客户资质认定信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010130', title: '企业账户查询', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010135', title: '企业账户明细', value: './components/entAccountDetail/index.vue', isLeaf: true },
      { key: '010140', title: '银行账号信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010020', title: '客户高管信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010030', title: '股东情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010115', title: '影像档案资料', value: './components/imagingSysData/index.vue', isLeaf: true }
    ]
  },
  {
    key: '020',
    title: '客户财务信息',
    children: [
      { key: '020005', title: '财务报表模板下载', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '020010', title: '财务报表', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '020030', title: '客户经营数据', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '040',
    title: '客户关联信息',
    children: [
      { key: '010180', title: '疑似关联关系客户', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '050',
    title: '客户信用信息',
    children: [
      { key: '050011', title: '有效的授信额度信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '050012', title: '失效的授信额度信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '050020', title: '未结清授信业务情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '050030', title: '已结清授信业务情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '080',
    title: '客户信用分析',
    children: [
      { key: '080030', title: '客户信用等级评估', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '080045', title: '贷后资产风险分类', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '080047', title: '贷后客户检查报告', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '110',
    title: '外部数据查询',
    children: [
      { key: '110150', title: '发票核验查询', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '110220', title: '企业资金流查询', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '110410', title: '登记信息查询记录页面', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '120',
    title: '预警信号信息',
    children: [
      { key: '120001', title: '预警信号信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '120004', title: '处置方案', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '120006', title: '当前预警级别信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  }
]

export const companyCustomerDetail = {
  customerid: '2026072800000013',
  mfcustomerid: '73708765',
  enterprisename: '洋寻华柳自动化有限公司',
  customertype: '0110',
  orgnature: '0101',
  certtype: 'Ent02',
  certid: '914143051WXNNQKKAK',
  scope: '3',
  issmallscope: '2',
  registercapital: '50',
  rccurrency: '01',
  licensedate: '2022/03/27',
  licenseno: '914143051WXNNQKKAK',
  countrycode: 'CHN',
  countrycodename: '中国',
  regioncode: '330225',
  regioncodename: '浙江省宁波市象山县',
  registeradd: '宁波市鄞州区',
  officeadd: '宁波市鄞州区',
  officetel: '05745212524',
  officezip: '123123',
  industrytypename: 'F5121-米、面制品及食用油批发',
  yearsregistration: '1',
  employeenumber: '10',
  inputusername: '项猸疼',
  inputorgname: '总营公司业务二部',
  inputdate: '2026/07/28',
  updateusername: '项猸疼',
  updateorgname: '总营公司业务二部',
  updatedate: '2026/07/28',
  tempsaveflag: '2'
}

export const companyCustomerPageVO = {
  docks: [
    { dockid: 'BasicPart', dockname: '基本信息', docktype: 'columns', showType: null },
    { dockid: 'ManagePart', dockname: '经营信息', docktype: 'columns', showType: null },
    { dockid: 'OtherPart', dockname: '附属信息', docktype: 'columns', showType: null },
    { dockid: 'UserPart', dockname: '操作信息', docktype: 'columns', showType: null }
  ],
  templates: [
    field('BasicPart', '0010', 'CustomerID', '客户编号'),
    field('BasicPart', '0011', 'MFCustomerID', '核心客户号'),
    field('BasicPart', '0015', 'OrgNature', '机构类型'),
    field('BasicPart', '0020', 'CorpID', '证件号码'),
    field('BasicPart', '0040', 'EnterpriseName', '客户名称', { colspan: '12' }),
    field('BasicPart', '0070', 'LicenseNo', '工商营业执照号码', { colspan: '12' }),
    field('BasicPart', '0080', 'RCCurrency', '注册资本币种'),
    field('BasicPart', '0090', 'RegisterCapital', '注册资本', { coltype: 'Number', colcheckformat: '数字', colunit: '万元' }),
    field('BasicPart', '0100', 'LicenseDate', '营业执照有效期起始日期', { colcheckformat: '日期' }),
    field('BasicPart', '0155', 'CountryCodeName', '所在国家(地区)'),
    field('BasicPart', '0165', 'RegionCodeName', '注册省市区', { colspan: '12' }),
    field('BasicPart', '0170', 'RegisterAdd', '注册具体地址', { colspan: '12' }),
    field('BasicPart', '0200', 'OfficeAdd', '办公具体地址', { colspan: '12' }),
    field('BasicPart', '0210', 'OfficeTel', '公司联系电话'),
    field('BasicPart', '0220', 'OfficeZip', '邮政编码'),
    field('ManagePart', '7000', 'IndustryTypeName', '国标行业分类', { colspan: '12' }),
    field('ManagePart', '7025', 'MainBusiness', '主营业务', { colspan: '12', coleditstyle: '多行文本框' }),
    field('ManagePart', '7035', 'BusinessHistory', '经营历史', { colspan: '12', coleditstyle: '多行文本框' }),
    field('ManagePart', '7045', 'CooperativeYears', '经营年限'),
    field('ManagePart', '7050', 'TradePosition', '贸易地位'),
    field('ManagePart', '7060', 'EmployeeNumber', '员工人数', { coltype: 'Number', colcheckformat: '整数' }),
    field('OtherPart', '0520', 'EnterpriseBelong', '企业隶属'),
    field('OtherPart', '0560', 'BasicBank', '基本账户行'),
    field('OtherPart', '0565', 'BasicAccount', '基本账户号'),
    field('OtherPart', '0580', 'AccountDate', '在我行首次开立账户时间', { colcheckformat: '日期' }),
    field('OtherPart', '0590', 'CreditDate', '与我行建立信贷关系时间', { colcheckformat: '日期' }),
    field('UserPart', '0710', 'InputUserName', '登记人'),
    field('UserPart', '0730', 'InputOrgName', '登记机构'),
    field('UserPart', '0740', 'InputDate', '登记日期', { colcheckformat: '日期' }),
    field('UserPart', '0760', 'UpdateUserName', '更新人员'),
    field('UserPart', '0780', 'UpdateOrgName', '更新机构'),
    field('UserPart', '0790', 'UpdateDate', '更新日期', { colcheckformat: '日期' })
  ]
}

/** 授信、批复、合同及出账详情共用的本地演示资料。 */
export const workflowDetail = {
  serialno: 'BA202607200000001',
  applicationno: 'BA202607200000001',
  projectno: 'PJ202607010001',
  projectname: '钢贸供应链融资项目',
  customerid: companyCustomerDetail.customerid,
  customername: '洋寻华柳自动化有限公司',
  customerType: '0110',
  enterprisename: '洋寻华柳自动化有限公司',
  businessType: '供应链流动资金贷款',
  // 动态表单在渲染模板时会统一使用小写字段名；保留原字段以兼容业务组件。
  businesstype: '供应链流动资金贷款',
  productname: '先票/款后货',
  currency: '人民币',
  amount: '12000000.00',
  creditamount: '12000000.00',
  validperiod: '12',
  phaseName: '待提交',
  phasename: '待提交',
  status: '待提交',
  sourcefrom: '供应链金融平台',
  createdate: '2026/07/28',
  inputusername: '项猸疼',
  inputorgname: '总营公司业务二部',
  baSerialNo: 'BA202607200000001',
  bapSerialNo: 'BAP202607200000001',
  bcSerialNo: 'BC202607200000001',
  bcApplyType: 'IndependentApply',
  tempsaveflag: '2'
}

export const workflowDetailPageVO = {
  docks: [
    { dockid: 'ApplicationPart', dockname: '申请基本信息', docktype: 'columns', showType: null },
    { dockid: 'CreditPart', dockname: '额度与业务信息', docktype: 'columns', showType: null },
    { dockid: 'OperationPart', dockname: '操作信息', docktype: 'columns', showType: null }
  ],
  templates: [
    field('ApplicationPart', '0010', 'SerialNo', '申请流水号'),
    field('ApplicationPart', '0020', 'ProjectNo', '项目编号'),
    field('ApplicationPart', '0030', 'ProjectName', '项目名称', { colspan: '12' }),
    field('ApplicationPart', '0040', 'CustomerName', '客户名称', { colspan: '12' }),
    field('ApplicationPart', '0050', 'CustomerID', '核心客户编号'),
    field('ApplicationPart', '0060', 'ProductName', '产品方案'),
    field('CreditPart', '0010', 'BusinessType', '业务品种', { colspan: '12' }),
    field('CreditPart', '0020', 'Currency', '币种'),
    field('CreditPart', '0030', 'Amount', '申请金额', { coltype: 'Number', colcheckformat: '数字', colunit: '元' }),
    field('CreditPart', '0040', 'CreditAmount', '授信金额', { coltype: 'Number', colcheckformat: '数字', colunit: '元' }),
    field('CreditPart', '0050', 'ValidPeriod', '期限', { coltype: 'Number', colcheckformat: '整数', colunit: '月' }),
    field('CreditPart', '0060', 'PhaseName', '当前阶段'),
    field('CreditPart', '0070', 'Status', '申请状态'),
    field('OperationPart', '0010', 'SourceFrom', '业务来源'),
    field('OperationPart', '0020', 'InputUserName', '申请人'),
    field('OperationPart', '0030', 'InputOrgName', '申请机构'),
    field('OperationPart', '0040', 'CreateDate', '申请日期', { colcheckformat: '日期' })
  ]
}

export const workflowDetailMenu = [
  {
    key: '010',
    title: '业务申请信息',
    children: [
      { key: '010010', title: '基本信息', value: './components/customerProfile/index.vue', isLeaf: true },
      { key: '010020', title: '额度分配信息', value: './components/creditAllot/index.vue', isLeaf: true },
      { key: '010030', title: '业务分配信息', value: './components/businessAllot/index.vue', isLeaf: true }
    ]
  },
  {
    key: '020',
    title: '审批与资料',
    children: [
      { key: '020010', title: '审批意见', value: './components/approvalOpinion/index.vue', isLeaf: true },
      { key: '020020', title: '影像资料', value: './components/imagingSysData/index.vue', isLeaf: true }
    ]
  }
]

export const companyCustomerList = [
  {
    customerID: companyCustomerDetail.customerid,
    customerId: companyCustomerDetail.customerid,
    customerName: companyCustomerDetail.enterprisename,
    certTypeName: '统一社会信用代码',
    certID: companyCustomerDetail.certid,
    orgNatureName: '企业法人',
    scopeName: '小型企业',
    isSmallScopeName: '否',
    managerUserName: '项猸疼',
    managerOrgName: '总营公司业务二部',
    mfcustomerID: companyCustomerDetail.mfcustomerid,
    belongAttribute: '有',
    belongAttribute1: '有',
    belongAttribute2: '有',
    belongAttribute3: '有',
    tempSaveFlag: '否'
  },
  {
    customerID: 'C2026072800000021',
    customerId: 'C2026072800000021',
    customerName: '华东供应链有限公司',
    certTypeName: '统一社会信用代码',
    certID: '91310115MA1K4C8M8P',
    orgNatureName: '企业法人',
    scopeName: '中型企业',
    isSmallScopeName: '否',
    managerUserName: '张晨',
    managerOrgName: '上海分行公司金融部',
    mfcustomerID: 'SCF2025040300000003',
    belongAttribute: '有',
    belongAttribute1: '有',
    belongAttribute2: '有',
    belongAttribute3: '有',
    tempSaveFlag: '否'
  },
  {
    customerID: 'C2026072800000022',
    customerId: 'C2026072800000022',
    customerName: '新城贸易有限公司',
    certTypeName: '统一社会信用代码',
    certID: '91310115MA1K4D5N7Q',
    orgNatureName: '企业法人',
    scopeName: '小型企业',
    isSmallScopeName: '是',
    managerUserName: '李敏',
    managerOrgName: '上海分行普惠金融部',
    mfcustomerID: 'SCF2026071900000002',
    belongAttribute: '有',
    belongAttribute1: '有',
    belongAttribute2: '有',
    belongAttribute3: '有',
    tempSaveFlag: '否'
  }
]

/** 自雇人士管理：本地演示详情数据。 */
export const selfEmployedCustomerViewMenu = [
  {
    key: '010',
    title: '客户基本信息',
    children: [
      { key: '010010', title: '客户概况', value: './components/personalProfile/index.vue', isLeaf: true },
      { key: '010020', title: '客户资质信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010030', title: '影像档案资料', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '020',
    title: '客户关联信息',
    children: [
      { key: '020010', title: '供应链群成员信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  }
]

export const selfEmployedCustomerDetail = {
  customerid: 'C202607200001',
  customername: '华东供应链有限公司',
  customertype: '0320',
  certtype: '居民身份证',
  certid: '310101198905126721',
  mfcustomerid: 'MF202607200001',
  issmallscope: '是',
  mobilephone: '138****6721',
  nativeplace: '上海市浦东新区',
  workadd: '上海市浦东新区金融街88号',
  entorgcustomername: '华东供应链有限公司',
  unitkindname: '商贸服务业',
  creditbelongname: '一般客户',
  inputusername: '本地演示用户',
  inputorgname: '上海分行供应链金融部',
  inputdate: '2026-07-20'
}

export const selfEmployedCustomerPageVO = {
  docks: [
    { dockid: 'BasicPart', dockname: '基本信息', docktype: 'columns', showType: null },
    { dockid: 'OperationPart', dockname: '经营与操作信息', docktype: 'columns', showType: null }
  ],
  templates: [
    field('BasicPart', '0010', 'CustomerName', '客户名称'),
    field('BasicPart', '0020', 'CustomerID', '客户编号'),
    field('BasicPart', '0030', 'CertType', '证件类型'),
    field('BasicPart', '0040', 'CertID', '证件号'),
    field('BasicPart', '0050', 'MfCustomerID', '核心客户号'),
    field('BasicPart', '0060', 'IsSmallScope', '是否我行定义小微'),
    field('BasicPart', '0070', 'MobilePhone', '联系电话'),
    field('BasicPart', '0080', 'NativePlace', '常住地址', { colspan: '12' }),
    field('BasicPart', '0090', 'WorkAdd', '经营地址', { colspan: '12' }),
    field('OperationPart', '0010', 'EntOrgCustomerName', '主经营机构'),
    field('OperationPart', '0020', 'UnitKindName', '所属行业'),
    field('OperationPart', '0030', 'CreditBelongName', '客户分类'),
    field('OperationPart', '0040', 'InputUserName', '录入人'),
    field('OperationPart', '0050', 'InputOrgName', '录入机构'),
    field('OperationPart', '0060', 'InputDate', '录入日期', { colcheckformat: '日期' })
  ]
}

export const selfEmployedCustomerList = [
  {
    customerId: selfEmployedCustomerDetail.customerid,
    customerID: selfEmployedCustomerDetail.customerid,
    customerName: selfEmployedCustomerDetail.customername,
    customerType: selfEmployedCustomerDetail.customertype,
    certTypeName: selfEmployedCustomerDetail.certtype,
    certId: selfEmployedCustomerDetail.certid,
    isSmallScope: selfEmployedCustomerDetail.issmallscope,
    mfCustomerID: selfEmployedCustomerDetail.mfcustomerid,
    belongAttribute: '有',
    belongAttribute1: '有',
    belongAttribute2: '有',
    belongAttribute3: '有',
    tempSaveFlag: '否'
  },
  {
    customerId: 'C202607190002',
    customerID: 'C202607190002',
    customerName: '新城贸易有限公司',
    customerType: '0320',
    certTypeName: '居民身份证',
    certId: '320102199204168058',
    isSmallScope: '否',
    mfCustomerID: 'MF202607190002',
    belongAttribute: '有',
    belongAttribute1: '有',
    belongAttribute2: '有',
    belongAttribute3: '有',
    tempSaveFlag: '否'
  }
]
