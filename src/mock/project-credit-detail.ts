/**
 * 项目授信额度申请详情的本地演示数据。
 * 数据结构专供详情页使用，避免依赖内网的动态表单模板服务。
 */

export const projectCreditApplyRecords = [
  {
    id: 30001,
    objectNo: 'BA2026072000000001',
    serialNo: 'BA2026072000000001',
    customerID: 'C2025040300000003',
    customerName: '阿姆特拉斯供应链有限公司',
    projectName: '核心企业供应链金融项目',
    mrchFlg: '供应链金融平台',
    businessType: 'SCF_WORKING_CAPITAL',
    businessTypeName: '单一客户综合授信',
    virtualOccurTypeName: '新增',
    applyModelTypeName: '授信审批',
    currencyName: '人民币',
    businessSum: 10000000,
    exposureSum: 8000000,
    sourceFrom: '供应链金融平台',
    operateUserName: '张晨',
    operateOrgName: '总行供应链金融部',
    flowName: '授信申请流程',
    endTime: '',
    applyType: 'CreditLineApply',
    objectType: 'CreditApply',
    phaseNo: '0010',
    phaseName: '待提交',
    createTime: '2026-07-20 09:30:00',
    operatorName: '张晨',
    operatorOrgName: '总行供应链金融部'
  },
  {
    id: 30002,
    objectNo: 'BA2026071900000002',
    serialNo: 'BA2026071900000002',
    customerID: 'C2025040300000004',
    customerName: '新城贸易有限公司',
    projectName: '经销商融资项目',
    mrchFlg: '客户经理录入',
    businessType: 'SCF_DEALER_FINANCE',
    businessTypeName: '经销商融资',
    virtualOccurTypeName: '续作',
    applyModelTypeName: '授信审批',
    currencyName: '人民币',
    businessSum: 8000000,
    exposureSum: 5600000,
    sourceFrom: '客户经理录入',
    operateUserName: '李敏',
    operateOrgName: '上海分行',
    flowName: '授信申请流程',
    endTime: '',
    applyType: 'CreditLineApply',
    objectType: 'CreditApply',
    phaseNo: '0010',
    phaseName: '待提交',
    createTime: '2026-07-19 14:20:00',
    operatorName: '李敏',
    operatorOrgName: '上海分行'
  }
]

export const projectCreditDetail = {
  title: '项目授信额度详情',
  applicationNo: 'BA2026072000000001',
  customerName: '阿姆特拉斯供应链有限公司',
  customerId: 'C2025040300000003',
  status: '待提交',
  tabs: [
    { key: 'detail', label: '授信额度详情' },
    { key: 'customer', label: '客户详情' },
    { key: 'image', label: '影像系统资料' }
  ],
  menuGroups: [
    {
      key: 'application',
      title: '额度申请信息',
      items: [
        { key: 'basic', label: '基本信息' },
        { key: 'relatedCredit', label: '关联授信额度' },
        { key: 'stockBusiness', label: '存量单笔业务' },
        { key: 'projectInfo', label: '供应链项目情况' },
        { key: 'modelScore', label: '决策模型评分' }
      ]
    },
    {
      key: 'guarantee',
      title: '担保信息',
      items: [
        { key: 'guaranteeInfo', label: '新增的担保信息' },
        { key: 'guaranteeContract', label: '拟引入的担保合同' },
        { key: 'customerRating', label: '客户信用等级评估' },
        { key: 'guarantorRating', label: '保证人信用等级评估' }
      ]
    },
    {
      key: 'risk',
      title: '风险分类与调整',
      items: [
        { key: 'preLoanRisk', label: '贷前客户风险分类' },
        { key: 'riskMitigation', label: '风险缓释措施' },
        { key: 'planAdjust', label: '授信方案调整' },
        { key: 'bankFlow', label: '银行流水识别' }
      ]
    }
  ],
  sections: {
    basic: {
      title: '基本信息',
      description: '本申请为核心企业供应链金融项下的新增综合授信额度申请。',
      fields: [
        { key: 'customerNo', label: '客户编号', value: 'SC2025040300000003', editor: 'text', required: true },
        { key: 'coreEnterpriseName', label: '核心企业名称', value: '阿姆特拉斯供应链有限公司', editor: 'picker', picker: 'enterprise', required: true },
        { key: 'occurDate', label: '发生日期', value: '2026/07/20', editor: 'date', required: true },
        {
          key: 'occurType',
          label: '发生方式',
          value: '续作',
          editor: 'select',
          options: ['新增', '续作', '复议', '重组'],
          required: true
        },
        { key: 'businessType', label: '业务品种', value: '单一客户综合授信', editor: 'picker', picker: 'businessType', required: true },
        {
          key: 'currency',
          label: '币种',
          value: '人民币',
          editor: 'select',
          options: ['人民币', '美元', '欧元', '港币'],
          required: true
        },
        { key: 'creditAmount', label: '额度金额', value: 10000000, editor: 'number', unit: '元', required: true },
        {
          key: 'supplyChainFlag',
          label: '供应链标识',
          value: '纯供应链',
          editor: 'select',
          options: ['纯供应链', '非纯供应链', '混合供应链'],
          required: true
        },
        {
          key: 'productPlan',
          label: '供应链产品方案',
          value: ['保理融资', '经销商融资', '订单融资'],
          editor: 'checkbox',
          options: ['保理融资', '订单融资', '经销商融资', '预付款融资', '存货质押融资', '国内保理'],
          span: 2,
          required: true
        },
        { key: 'exposureAmount', label: '敞口金额', value: 8000000, editor: 'number', unit: '元', required: true },
        { key: 'term', label: '期限', value: 6, editor: 'number', unit: '月', required: true },
        { key: 'creditPeriod', label: '额度使用期限', value: '2026/07/20 至 2027/07/19', editor: 'text' },
        {
          key: 'businessSource',
          label: '业务来源',
          value: '供应链作业平台',
          editor: 'select',
          options: ['供应链作业平台', '客户经理录入', '网银渠道', '批量导入']
        },
        {
          key: 'isCirculation',
          label: '是否循环',
          value: '是',
          editor: 'select',
          options: ['是', '否'],
          required: true
        },
        { key: 'guaranteeMode', label: '主要担保方式', value: '保证、应收账款质押', editor: 'picker', picker: 'guarantee', required: true },
        {
          key: 'industryLoanType',
          label: '养老产业贷款',
          value: '非养老产业贷款',
          editor: 'select',
          options: ['非养老产业贷款', '养老产业贷款']
        },
        { key: 'guaranteeRatio', label: '最低保证金比例', value: 2, editor: 'number', unit: '%' },
        {
          key: 'isTransferCredit',
          label: '是否转授信',
          value: '是',
          editor: 'select',
          options: ['是', '否'],
          required: true
        },
        { key: 'averageSalary', label: '企业平均月工资', value: 12000, editor: 'number', unit: '元' },
        { key: 'remark', label: '备注', value: '用于核心企业上下游供应商融资及经销商备货融资。', editor: 'textarea', span: 2 }
      ]
    },
    relatedCredit: {
      title: '关联授信额度',
      description: '当前申请与已有客户授信、集团授信的关联关系。',
      columns: [
        { prop: 'creditNo', label: '授信编号' },
        { prop: 'creditType', label: '额度类型' },
        { prop: 'creditAmount', label: '批复额度' },
        { prop: 'usedAmount', label: '已用额度' },
        { prop: 'availableAmount', label: '可用额度' },
        { prop: 'status', label: '状态' }
      ],
      rows: [
        { creditNo: 'ED20250715000001', creditType: '流动资金综合授信', creditAmount: '8,000,000.00', usedAmount: '3,200,000.00', availableAmount: '4,800,000.00', status: '正常' },
        { creditNo: 'ED20250608000002', creditType: '供应链专项额度', creditAmount: '5,000,000.00', usedAmount: '1,500,000.00', availableAmount: '3,500,000.00', status: '正常' }
      ]
    },
    stockBusiness: {
      title: '存量单笔业务',
      description: '用于评估本次额度申请的存量业务占用情况。',
      columns: [
        { prop: 'businessNo', label: '业务编号' },
        { prop: 'product', label: '产品名称' },
        { prop: 'counterparty', label: '交易对手' },
        { prop: 'amount', label: '融资金额' },
        { prop: 'dueDate', label: '到期日' },
        { prop: 'riskLevel', label: '风险等级' }
      ],
      rows: [
        { businessNo: 'YW202607180001', product: '保理融资', counterparty: '华东贸易有限公司', amount: '1,200,000.00', dueDate: '2026/12/18', riskLevel: '低' },
        { businessNo: 'YW202607120002', product: '订单融资', counterparty: '新城经销有限公司', amount: '800,000.00', dueDate: '2026/11/12', riskLevel: '低' }
      ]
    },
    projectInfo: {
      title: '供应链项目情况',
      fields: [
        { label: '项目编号', value: 'P20260001' },
        { label: '项目名称', value: '核心企业供应链金融项目' },
        { label: '核心企业', value: '阿姆特拉斯供应链有限公司' },
        { label: '合作年限', value: '4 年' },
        { label: '上游供应商数量', value: '126 家' },
        { label: '下游经销商数量', value: '248 家' },
        { label: '近12个月交易额', value: '216,800,000.00 元' },
        { label: '历史逾期率', value: '0.12%' },
        { label: '项目说明', value: '以核心企业真实贸易背景、应收账款和订单为基础开展融资。', span: 2 }
      ]
    },
    modelScore: {
      title: '决策模型评分',
      fields: [
        { label: '综合评分', value: '86 分（建议通过）' },
        { label: '客户信用评分', value: '88 分' },
        { label: '贸易真实性评分', value: '90 分' },
        { label: '还款能力评分', value: '84 分' },
        { label: '担保缓释评分', value: '82 分' },
        { label: '预警提示', value: '无重大负面预警' }
      ]
    },
    guaranteeInfo: {
      title: '新增的担保信息',
      columns: [
        { prop: 'guarantor', label: '保证人/担保物' },
        { prop: 'type', label: '担保方式' },
        { prop: 'amount', label: '担保金额' },
        { prop: 'coverage', label: '覆盖率' },
        { prop: 'status', label: '状态' }
      ],
      rows: [
        { guarantor: '阿姆特拉斯集团有限公司', type: '连带责任保证', amount: '6,000,000.00', coverage: '60%', status: '已核验' },
        { guarantor: '应收账款池', type: '应收账款质押', amount: '5,000,000.00', coverage: '50%', status: '已核验' }
      ]
    },
    guaranteeContract: {
      title: '拟引入的担保合同',
      fields: [
        { label: '合同编号', value: 'HT20260720000018' },
        { label: '合同状态', value: '待签署' },
        { label: '担保人', value: '阿姆特拉斯集团有限公司' },
        { label: '担保方式', value: '连带责任保证' },
        { label: '担保金额', value: '6,000,000.00 元' },
        { label: '合同有效期', value: '2026/07/20 至 2027/07/19' }
      ]
    },
    customerRating: {
      title: '客户信用等级评估',
      fields: [
        { label: '内部评级', value: 'A-' },
        { label: '评级日期', value: '2026/06/30' },
        { label: '评级有效期', value: '12 个月' },
        { label: '风险分类', value: '正常类' },
        { label: '经营评价', value: '稳定' },
        { label: '现金流评价', value: '良好' }
      ]
    },
    guarantorRating: {
      title: '保证人信用等级评估',
      fields: [
        { label: '保证人名称', value: '阿姆特拉斯集团有限公司' },
        { label: '内部评级', value: 'A' },
        { label: '净资产', value: '128,000,000.00 元' },
        { label: '资产负债率', value: '45.20%' },
        { label: '担保能力评价', value: '充足' },
        { label: '风险分类', value: '正常类' }
      ]
    },
    preLoanRisk: {
      title: '贷前客户风险分类',
      fields: [
        { label: '当前分类', value: '正常类' },
        { label: '分类依据', value: '财务、现金流、行业及交易数据综合判断' },
        { label: '客户风险等级', value: '低风险' },
        { label: '行业风险等级', value: '中低风险' },
        { label: '分类日期', value: '2026/07/18' },
        { label: '下次复核日期', value: '2027/01/18' }
      ]
    },
    riskMitigation: {
      title: '风险缓释措施',
      fields: [
        { label: '第一还款来源', value: '核心企业确认的应收账款回款' },
        { label: '第二还款来源', value: '集团公司连带责任保证' },
        { label: '贷后监控', value: '交易流水、回款账户、预警信号按月跟踪' },
        { label: '额度控制', value: '单笔融资不超过可用额度的 30%' },
        { label: '预警阈值', value: '应收账款逾期超过 15 天触发预警' },
        { label: '补充措施', value: '必要时追加应收账款质押' }
      ]
    },
    planAdjust: {
      title: '授信方案调整',
      fields: [
        { label: '额度调整', value: '新增 10,000,000.00 元综合授信额度' },
        { label: '期限调整', value: '额度有效期 12 个月，单笔最长 6 个月' },
        { label: '业务范围', value: '保理融资、订单融资、经销商融资' },
        { label: '限定因素', value: '仅限真实贸易背景项下使用' },
        { label: '预警调整', value: '新增核心企业付款异常预警规则' },
        { label: '审批结论', value: '建议按方案报批' }
      ]
    },
    bankFlow: {
      title: '银行流水识别',
      fields: [
        { label: '核验账户', value: '招商银行上海分行 6214 **** **** 8896' },
        { label: '核验期间', value: '2026/01/01 至 2026/06/30' },
        { label: '月均流入', value: '18,066,666.67 元' },
        { label: '最大单月流入', value: '23,800,000.00 元' },
        { label: '异常流水', value: '未发现重大异常' },
        { label: '核验结论', value: '与申请资料及贸易背景基本一致' }
      ]
    }
  },
  customer: {
    fields: [
      { label: '客户名称', value: '阿姆特拉斯供应链有限公司' },
      { label: '统一社会信用代码', value: '91310000MA1H000001' },
      { label: '法定代表人', value: '王磊' },
      { label: '注册资本', value: '50,000,000.00 元' },
      { label: '所属行业', value: '供应链管理服务业' },
      { label: '成立日期', value: '2018/05/16' },
      { label: '注册地址', value: '上海市浦东新区金融街 88 号', span: 2 },
      { label: '客户经理', value: '张晨' },
      { label: '管理机构', value: '总行供应链金融部' }
    ]
  },
  attachments: [
    { name: '授信额度申请书.pdf', type: '申请资料', date: '2026/07/20 09:31', status: '已归档' },
    { name: '核心企业贸易背景说明.pdf', type: '尽调资料', date: '2026/07/20 09:33', status: '已归档' },
    { name: '保证合同（待签署）.pdf', type: '担保资料', date: '2026/07/20 09:35', status: '待补充' }
  ]
}
