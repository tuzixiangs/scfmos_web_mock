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
  coleditsourcetype?: string
  coleditsource?: string
  collimit?: number
  code?: string
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

const selectField = (
  dockid: string,
  colindex: string,
  colname: string,
  colheader: string,
  options: Array<{ label: string; value: string }>,
  extra: Partial<CustomerTemplateField> = {}
) =>
  field(dockid, colindex, colname, colheader, {
    coleditstyle: '选择框',
    coleditsourcetype: 'JSON',
    coleditsource: JSON.stringify(
      options.map((item) => ({ itemName: item.label, itemNo: item.value }))
    ),
    colreadonly: '0',
    ...extra
  })

export const companyCustomerViewMenu = [
  {
    key: '010',
    title: '客户基本信息',
    children: [
      { key: '010005', title: '客户资质认定信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010010', title: '客户概况', value: './components/customerProfile/index.vue', isLeaf: true },
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
    belongAttribute2: '无',
    belongAttribute3: '无',
    tempSaveFlag: '否'
  }
]

/** 自雇人士管理：本地演示详情数据。 */
export const selfEmployedCustomerViewMenu = [
  {
    key: '010',
    title: '自雇人士基本信息',
    children: [
      { key: '010010', title: '个人概况', value: './components/personalProfile/index.vue', isLeaf: true },
      { key: '010021', title: '配偶或家庭主要成员情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010031', title: '紧急联系人信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010040', title: '家庭年收入明细', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010050', title: '对外股权投资情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010060', title: '其他关联关系维护', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010070', title: '影像系统资料', value: './components/imagingSysData/index.vue', isLeaf: true },
      { key: '010080', title: '受托人账号信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010090', title: '征信查询', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010100', title: '征信授权', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010110', title: '征信本机构查询', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '010120', title: '账户冻结交易', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '020',
    title: '自雇人士财务信息',
    children: [
      { key: '020010', title: '财务报表', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '050',
    title: '本行业务活动信息',
    children: [
      { key: '050020', title: '未结清授信业务情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '050021', title: '未结清联合贷款业务情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '050030', title: '已结清授信业务情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '050031', title: '已结清联合贷款业务情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '050040', title: '为本行客户提供担保情况', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '050050', title: '统一授信视图', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '080030', title: '客户信用等级评估', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '110',
    title: '外部数据查询',
    children: [
      { key: '110140', title: '客户身份识别', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '110150', title: '发票核验查询', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '130',
    title: '百融个人被执行查询',
    children: [
      { key: '110410', title: '登记信息查询记录页面', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '080',
    title: '贷后贷款检查',
    children: [
      { key: '080047', title: '贷后贷款用途检查报告', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '080048', title: '贷后贷款行为评分', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  },
  {
    key: '120',
    title: '预警信号信息',
    children: [
      { key: '120001', title: '预警信号信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '120004', title: '处置方案', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '120006', title: '当前预警级别信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true },
      { key: '120007', title: '历史预警级别信息', value: '@/components/busiComp/crmsIframe/index.vue', isLeaf: true }
    ]
  }
]

/** 受薪人士详情与自雇人士保持相同栏目结构，仅替换客户类型标题。 */
export const salaryEarnerCustomerViewMenu = selfEmployedCustomerViewMenu.map((group) => ({
  ...group,
  title: group.title.replace('自雇人士', '受薪人士'),
  children: group.children.map((item) => ({ ...item }))
}))

export const selfEmployedCustomerDetail = {
  customerid: 'C202607200001',
  customername: '徐斌吧',
  customertype: '0320',
  mfcustomerid: '18130850',
  fullname: '徐斌吧',
  certtype: '01',
  certid: '370685199009187520',
  countryname: '中国',
  countrycode: 'CHN',
  birthday: '1990/09/18',
  sex: '2',
  marriage: '20',
  eduexperience: '20',
  edudegree: '4',
  nationality: '01',
  nativeplace: '山东省烟台市招远市',
  nativeplacedetail: '山东省烟台市招远市温泉街道金晖路18号',
  familyadd: '上海市浦东新区',
  familyadddetail: '上海市浦东新区世纪大道88号',
  familyzip: '200120',
  registeredplace: '山东省烟台市',
  botype: '3',
  farmersort: '1',
  familystatus: '2',
  peresidence: '1',
  ifliveout: '1',
  ctcdstccdname: '上海市浦东新区',
  ctcdstccd: '310115',
  commadd: '上海市浦东新区世纪大道88号',
  commzip: '200120',
  mobilephonehx: '138****6721',
  mobiletelephone: '13816886721',
  mobilephonebackup: '139****5218',
  familytel: '021-58881234',
  workcorp: '上海华东供应链服务中心',
  worktel: '021-58886688',
  workadd: '上海市浦东新区',
  workadddetail: '上海市浦东新区金融街88号',
  yearincome: 360000,
  unitkind: 'F51',
  unitkindname: '批发业',
  occupation: '10',
  creditbelong: 'A01',
  creditbelongname: '个人经营类客户评级模板',
  worktime: 8,
  headship: '2',
  headshipdetail: '经营负责人',
  workbegindate: '2018/07/01',
  position: '3',
  headshiptime: 6,
  relativeflag: '2',
  blacklistflag: '2',
  sectiontype: '0',
  esriskclass: '2',
  issmallscope: '是',
  creditrating: 'A',
  twolinkcustomerflag: '1',
  mobilephone: '138****6721',
  entorgcustomername: '华东供应链有限公司',
  entregistercapital: 1200,
  entyears: 9,
  bosstype: '010',
  entorgtypename: '自然人控股',
  entstockrate: 65,
  entemployee: 48,
  enttaxsum: 36.8,
  inputuserid: '总行系统科技管理员',
  inputorgid: '总行风险管理部',
  inputusername: '本地演示用户',
  inputorgname: '上海分行供应链金融部',
  inputdate: '2026/03/03',
  updatedate: '2026/03/03'
}

export const customerRegionTree = [
  {
    key: '310000',
    title: '上海市',
    children: [
      {
        key: '310100',
        title: '上海市',
        children: [
          { key: '310115', title: '浦东新区', isLeaf: true },
          { key: '310106', title: '静安区', isLeaf: true },
          { key: '310104', title: '徐汇区', isLeaf: true }
        ]
      }
    ]
  },
  {
    key: '370000',
    title: '山东省',
    children: [
      {
        key: '370600',
        title: '烟台市',
        children: [
          { key: '370685', title: '招远市', isLeaf: true },
          { key: '370602', title: '芝罘区', isLeaf: true },
          { key: '370613', title: '莱山区', isLeaf: true }
        ]
      },
      {
        key: '370200',
        title: '青岛市',
        children: [
          { key: '370202', title: '市南区', isLeaf: true },
          { key: '370212', title: '崂山区', isLeaf: true }
        ]
      }
    ]
  },
  {
    key: '320000',
    title: '江苏省',
    children: [
      {
        key: '320100',
        title: '南京市',
        children: [
          { key: '320102', title: '玄武区', isLeaf: true },
          { key: '320106', title: '鼓楼区', isLeaf: true }
        ]
      }
    ]
  }
]

export const customerIndustryTree = [
  {
    key: 'F',
    title: '批发和零售业',
    children: [
      {
        key: 'F51',
        title: '批发业',
        children: [
          { key: 'F511', title: '农、林、牧、渔产品批发', isLeaf: true },
          { key: 'F516', title: '矿产品、建材及化工产品批发', isLeaf: true },
          { key: 'F519', title: '其他批发业', isLeaf: true }
        ]
      },
      {
        key: 'F52',
        title: '零售业',
        children: [
          { key: 'F521', title: '综合零售', isLeaf: true },
          { key: 'F529', title: '其他零售业', isLeaf: true }
        ]
      }
    ]
  },
  {
    key: 'L',
    title: '租赁和商务服务业',
    children: [
      { key: 'L72', title: '商务服务业', isLeaf: true },
      { key: 'L71', title: '租赁业', isLeaf: true }
    ]
  }
]

export const customerCountryTree = [
  {
    id: 'ASIA',
    key: 'ASIA',
    title: '亚洲',
    children: [
      { id: 'CHN', key: 'CHN', title: '中国', isLeaf: true },
      { id: 'SGP', key: 'SGP', title: '新加坡', isLeaf: true },
      { id: 'JPN', key: 'JPN', title: '日本', isLeaf: true }
    ]
  },
  {
    id: 'EUROPE',
    key: 'EUROPE',
    title: '欧洲',
    children: [
      { id: 'DEU', key: 'DEU', title: '德国', isLeaf: true },
      { id: 'FRA', key: 'FRA', title: '法国', isLeaf: true }
    ]
  }
]

export const customerHoldingTypeTree = [
  {
    id: 'CONTROL',
    key: 'CONTROL',
    title: '控股类型',
    children: [
      { id: '01', key: '01', title: '自然人控股', isLeaf: true },
      { id: '02', key: '02', title: '国有控股', isLeaf: true },
      { id: '03', key: '03', title: '集体控股', isLeaf: true },
      { id: '04', key: '04', title: '外商控股', isLeaf: true }
    ]
  }
]

export const customerCreditTemplateTree = [
  {
    id: 'INDIVIDUAL',
    key: 'INDIVIDUAL',
    title: '个人客户评级模板',
    children: [
      { id: 'A01', key: 'A01', title: '个人经营类客户评级模板', isLeaf: true },
      { id: 'A02', key: 'A02', title: '个体工商户评级模板', isLeaf: true },
      { id: 'A03', key: 'A03', title: '小微企业主评级模板', isLeaf: true }
    ]
  }
]

export const customerEnterpriseOptions = [
  {
    customerid: 'ENT202603030001',
    customername: '华东供应链有限公司',
    customertype: '公司客户',
    certtypename: '统一社会信用代码',
    certid: '91310115MA1K4C8M8P'
  },
  {
    customerid: 'ENT202602180006',
    customername: '上海金属材料贸易有限公司',
    customertype: '公司客户',
    certtypename: '统一社会信用代码',
    certid: '91310000MA1FL7QX2N'
  },
  {
    customerid: 'ENT202601120011',
    customername: '宁波供应链服务有限公司',
    customertype: '公司客户',
    certtypename: '统一社会信用代码',
    certid: '91330201MA2H5K9R7W'
  }
]

export const selfEmployedCustomerPageVO = {
  docks: [
    { dockid: 'BasicPart', dockname: '基本信息', docktype: 'columns', showType: null },
    { dockid: 'EnterprisePart', dockname: '企业信息', docktype: 'columns', showType: null },
    { dockid: 'OperationPart', dockname: '操作信息', docktype: 'columns', showType: null }
  ],
  templates: [
    field('BasicPart', '0010', 'MfCustomerID', '核心客户号', { colrequired: '1' }),
    field('BasicPart', '0020', 'FullName', '姓名', { colrequired: '1', colunit: '（征信M）' }),
    selectField('BasicPart', '0030', 'CertType', '证件类型', [
      { label: '身份证', value: '01' },
      { label: '护照', value: '02' }
    ], { colunit: '（征信M）' }),
    field('BasicPart', '0040', 'CertID', '证件号码', { colrequired: '1', colunit: '（征信M）' }),
    field('BasicPart', '0050', 'CountryName', '国别', {
      colreadonly: '0', colunit: '<input type=button value=...>（征信M）', code: 'Country'
    }),
    field('BasicPart', '0060', 'Birthday', '出生日期', {
      colcheckformat: '日期', colreadonly: '0', colrequired: '1', colunit: '（征信M）'
    }),
    selectField('BasicPart', '0070', 'Sex', '性别', [
      { label: '男性', value: '1' }, { label: '女性', value: '2' }
    ], { colrequired: '1', colunit: '（征信M）' }),
    selectField('BasicPart', '0080', 'Marriage', '婚姻状况', [
      { label: '未婚', value: '10' }, { label: '已婚', value: '20' }, { label: '离异', value: '40' }
    ], { colrequired: '1', colunit: '（征信M）' }),
    selectField('BasicPart', '0090', 'EduExperience', '最高学历', [
      { label: '研究生', value: '10' }, { label: '大学本科', value: '20' }, { label: '大学专科', value: '30' }
    ], { colrequired: '1', colunit: '（征信M）' }),
    selectField('BasicPart', '0100', 'EduDegree', '最高学位', [
      { label: '博士', value: '1' }, { label: '硕士', value: '2' },
      { label: '学士', value: '4' }, { label: '其他', value: '9' }
    ], { colrequired: '1', colunit: '（征信M）' }),
    selectField('BasicPart', '0110', 'Nationality', '民族', [
      { label: '汉族', value: '01' }, { label: '蒙古族', value: '02' }, { label: '回族', value: '03' }
    ], { colrequired: '1' }),
    selectField('BasicPart', '0120', 'Peresidence', '长期(一年以上)居住地', [
      { label: '城市', value: '1' }, { label: '农村', value: '2' }
    ], { colrequired: '1' }),
    field('BasicPart', '0130', 'NativePlace', '户籍地址（区域）', {
      colreadonly: '0', colrequired: '1', colunit: '<input type=button value=...>（征信O）'
    }),
    selectField('BasicPart', '0140', 'IfLiveOut', '举家外出谋生时间', [
      { label: '未外出', value: '1' }, { label: '一年以内', value: '2' }, { label: '一年以上', value: '3' }
    ]),
    field('BasicPart', '0150', 'NativePlaceDetail', '户籍详细地址', { colreadonly: '0', collimit: 200 }),
    field('BasicPart', '0160', 'FamilyZip', '常住地址邮编', {
      colreadonly: '0', colrequired: '1', collimit: 6
    }),
    field('BasicPart', '0170', 'FamilyAdd', '常住地址（区域）', {
      colreadonly: '0', colrequired: '1', colunit: '<input type=button value=...>（征信O）'
    }),
    field('BasicPart', '0180', 'MobileTelephone', '手机号码', {
      colreadonly: '0', colrequired: '1', collimit: 11
    }),
    field('BasicPart', '0190', 'FamilyAddDetail', '常住详细地址', {
      colreadonly: '0', colrequired: '1', collimit: 200
    }),
    field('BasicPart', '0200', 'MobilePhoneBackup', '手机号码（备用）', { colreadonly: '0', collimit: 11 }),
    field('BasicPart', '0210', 'RegisteredPlace', '户口所在地', { colreadonly: '0', colrequired: '1' }),
    field('BasicPart', '0220', 'MobilePhoneHX', '手机号码（核心）'),
    selectField('BasicPart', '0230', 'BoType', '借款人类型', [
      { label: '国有农场职工', value: '1' },
      { label: '国有经济单位集体户', value: '2' },
      { label: '其他', value: '3' }
    ], { colrequired: '1' }),
    field('BasicPart', '0240', 'FamilyTel', '住宅电话', { colreadonly: '0', collimit: 23 }),
    selectField('BasicPart', '0250', 'FarmerSort', '是否农户', [
      { label: '否', value: '1' }, { label: '是', value: '2' }
    ], { colrequired: '1' }),
    field('BasicPart', '0260', 'WorkCorp', '单位名称', { colreadonly: '0', colrequired: '1', collimit: 80 }),
    selectField('BasicPart', '0270', 'FamilyStatus', '居住状况', [
      { label: '自有住房', value: '1' }, { label: '按揭住房', value: '2' },
      { label: '租赁住房', value: '3' }, { label: '其他', value: '9' }
    ], { colrequired: '1', colunit: '（征信M）' }),
    field('BasicPart', '0280', 'WorkTel', '办公电话', { colreadonly: '0', colrequired: '1', collimit: 23 }),
    field('BasicPart', '0290', 'CtcdstccdName', '通讯地址（区域）', {
      colreadonly: '0', colrequired: '1', colunit: '<input type=button value=...>（征信M）'
    }),
    field('BasicPart', '0300', 'WorkAdd', '单位地址', {
      colreadonly: '0', colrequired: '1', colunit: '<input type=button value=...>（征信O）'
    }),
    field('BasicPart', '0310', 'CommAdd', '通讯地址', { colreadonly: '0', colrequired: '1', collimit: 200 }),
    field('BasicPart', '0320', 'WorkAddDetail', '单位详细地址', { colreadonly: '0', collimit: 200 }),
    field('BasicPart', '0330', 'CommZip', '通讯地址邮编', { colreadonly: '0', colrequired: '1', collimit: 6 }),
    field('BasicPart', '0340', 'YearIncome', '个人年收入', {
      coltype: 'Number', colcheckformat: '数字', colreadonly: '0', colunit: '元（征信O）'
    }),
    field('BasicPart', '0350', 'UnitKindName', '单位所属行业', {
      colreadonly: '0', colrequired: '1', colunit: '<input type=button value=...>（征信O）'
    }),
    field('BasicPart', '0360', 'CreditBelongName', '信用等级评估模板名称', {
      colreadonly: '0', colrequired: '1', colunit: '<input type=button value=...>'
    }),
    selectField('BasicPart', '0370', 'Occupation', '职业', [
      { label: '企业负责人', value: '10' }, { label: '商业、服务业人员', value: '40' },
      { label: '农民', value: '27' }, { label: '其他', value: '90' }
    ], { colrequired: '1', colunit: '（征信M）' }),
    field('BasicPart', '0380', 'WorkTime', '现单位工作年限', {
      coltype: 'Number', colcheckformat: '整数', colreadonly: '1', colunit: '年'
    }),
    selectField('BasicPart', '0390', 'Headship', '职务', [
      { label: '单位负责人', value: '1' }, { label: '部门负责人', value: '2' }, { label: '一般员工', value: '3' }
    ], { colrequired: '1' }),
    field('BasicPart', '0400', 'HeadshipTime', '职务年限', {
      coltype: 'Number', colcheckformat: '整数', colreadonly: '0', colrequired: '1', colunit: '年'
    }),
    field('BasicPart', '0410', 'HeadshipDetail', '具体职务', { colreadonly: '0', collimit: 20 }),
    field('BasicPart', '0420', 'WorkBeginDate', '本单位工作起始日', {
      colcheckformat: '日期', colreadonly: '0', colrequired: '1'
    }),
    selectField('BasicPart', '0430', 'Position', '职称', [
      { label: '高级', value: '1' }, { label: '中级', value: '2' },
      { label: '初级', value: '3' }, { label: '无职称', value: '9' }
    ], { colrequired: '1' }),
    selectField('BasicPart', '0450', 'RelativeFlag', '是否内部人', [
      { label: '是', value: '1' }, { label: '否', value: '2' }
    ], { colunit: '（征信M）' }),
    selectField('BasicPart', '0460', 'IsSmallScope', '是否我行定义小微', [
      { label: '是', value: '是' }, { label: '否', value: '否' }
    ], { colrequired: '1' }),
    selectField('BasicPart', '0470', 'BlackListFlag', '是否黑名单客户', [
      { label: '是', value: '1' }, { label: '否', value: '2' }
    ]),
    selectField('BasicPart', '0480', 'CreditRating', '信用评级', [
      { label: 'AAA', value: 'AAA' }, { label: 'AA', value: 'AA' },
      { label: 'A', value: 'A' }, { label: 'BBB', value: 'BBB' }
    ]),
    selectField('BasicPart', '0490', 'SectionType', '黑名单类型', [
      { label: '无', value: '0' }, { label: '关注名单', value: '1' }, { label: '禁入名单', value: '2' }
    ]),
    selectField('BasicPart', '0500', 'TwoLinkCustomerFlag', '是否一区两链客户', [
      { label: '是', value: '1' }, { label: '否', value: '2' }
    ]),
    selectField('BasicPart', '0510', 'EsRiskClass', '环境与社会风险程度分类', [
      { label: '低风险', value: '1' }, { label: '中风险', value: '2' }, { label: '高风险', value: '3' }
    ]),
    field('EnterprisePart', '0010', 'EntRegisterCapital', '企业注册资金', {
      coltype: 'Number', colcheckformat: '数字', colreadonly: '0', colunit: '万元'
    }),
    field('EnterprisePart', '0020', 'EntYears', '企业经营年份', {
      coltype: 'Number', colcheckformat: '整数', colreadonly: '0', colunit: '年'
    }),
    field('EnterprisePart', '0030', 'EntOrgCustomerName', '主经营企业名称', {
      colreadonly: '0', colunit: '<input type=button value=...>'
    }),
    selectField('EnterprisePart', '0040', 'BossType', '企业主类型', [
      { label: '企业实际控制人', value: '010' },
      { label: '个体工商户', value: '020' },
      { label: '其他', value: '090' }
    ]),
    field('EnterprisePart', '0050', 'EntOrgTypeName', '控股类型', {
      colreadonly: '0', colunit: '<input type=button value=...>', code: 'EntOrgType'
    }),
    field('EnterprisePart', '0060', 'EntStockRate', '所在企业股份占比', {
      coltype: 'Number', colcheckformat: '利率', colreadonly: '0', colunit: '%'
    }),
    field('EnterprisePart', '0070', 'EntEmployee', '所在企业雇员人数', {
      coltype: 'Number', colcheckformat: '整数', colreadonly: '0', colunit: '人'
    }),
    field('EnterprisePart', '0080', 'EntTaxSum', '所在企业月均缴税额', {
      coltype: 'Number', colcheckformat: '数字', colreadonly: '0', colunit: '万元'
    }),
    field('OperationPart', '0010', 'InputUserID', '登记人'),
    field('OperationPart', '0020', 'InputOrgID', '登记单位'),
    field('OperationPart', '0030', 'InputDate', '登记日期', { colcheckformat: '日期' }),
    field('OperationPart', '0040', 'UpdateDate', '更新日期', { colcheckformat: '日期' })
  ]
}

export const selfEmployedCustomerList = [
  {
    customerId: selfEmployedCustomerDetail.customerid,
    customerID: selfEmployedCustomerDetail.customerid,
    customerName: selfEmployedCustomerDetail.customername,
    customerType: selfEmployedCustomerDetail.customertype,
    certTypeName: '身份证',
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
    belongAttribute2: '无',
    belongAttribute3: '无',
    tempSaveFlag: '否'
  }
]
