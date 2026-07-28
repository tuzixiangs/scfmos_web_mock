import type {
  OrderContractLedgerAssetItem,
  OrderContractLedgerProject,
  OrderContractLedgerRecord
} from '@/api/indebt/orderContractLedgerQuery'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const orderContractLedgerProjects: OrderContractLedgerProject[] = [
  {
    id: 1,
    projectNo: 'PJ202607010001',
    projectName: '钢贸供应链融资项目',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    coreCustomerNo: 'C2025040300000003',
    productPlan: '先票/款后货'
  },
  {
    id: 2,
    projectNo: 'PJ202606180006',
    projectName: '金属库存融资项目',
    coreEnterpriseName: '华东金属贸易有限公司',
    coreCustomerNo: 'C2025051200000018',
    productPlan: '货押融资'
  },
  {
    id: 3,
    projectNo: 'PJ202605080007',
    projectName: '煤炭库存融资项目',
    coreEnterpriseName: '华南能源有限公司',
    coreCustomerNo: 'C2025050600000052',
    productPlan: '货押融资'
  },
  {
    id: 4,
    projectNo: 'PJ202607220008',
    projectName: '电子元器件先票后货项目',
    coreEnterpriseName: '深圳智联电子供应链有限公司',
    coreCustomerNo: 'C2026072200000088',
    productPlan: '先票/款后货'
  },
  {
    id: 5,
    projectNo: 'PJ202607160009',
    projectName: '农产品款后货采购项目',
    coreEnterpriseName: '山东粮油产业集团有限公司',
    coreCustomerNo: 'C2026071600000021',
    productPlan: '先票/款后货'
  },
  {
    id: 6,
    projectNo: 'PJ202607120010',
    projectName: '汽车零部件订单结算项目',
    coreEnterpriseName: '重庆渝新汽车配套有限公司',
    coreCustomerNo: 'C2026071200000036',
    productPlan: '先票/款后货'
  },
  {
    id: 7,
    projectNo: 'PJ202607090011',
    projectName: '有色金属货押融资项目',
    coreEnterpriseName: '浙江浙金物产有限公司',
    coreCustomerNo: 'C2026070900000045',
    productPlan: '货押融资'
  },
  {
    id: 8,
    projectNo: 'PJ202607050012',
    projectName: '冷链仓单货押融资项目',
    coreEnterpriseName: '福建海峡冷链物流有限公司',
    coreCustomerNo: 'C2026070500000067',
    productPlan: '货押融资'
  }
]

export const orderContractLedgerRecords: OrderContractLedgerRecord[] = [
  {
    id: 1,
    status: 'valid',
    orderContractFlowNo: 'OCF202607210001',
    orderContractNo: 'HT202607210001',
    customerName: '南京瑞钢贸易有限公司',
    coreCustomerNo: 'C2025040300000003',
    partyOne: '阿姆特拉斯供应链有限公司',
    partyTwo: '南京瑞钢贸易有限公司',
    partyThree: '中储南京物流有限公司',
    contractTotalAmount: 12000000,
    currentUsedAmount: 3600000,
    remainingAvailableAmount: 8400000,
    currency: '人民币',
    contractStartDate: '2026-07-01',
    contractEndDate: '2027-06-30',
    relatedBusinessContractNo: 'BC202607010001',
    dataSource: '客户经理录入',
    applicationDate: '2026-07-21',
    effectiveDate: '2026-07-22',
    projectId: 1,
    projectNo: 'PJ202607010001',
    projectName: '钢贸供应链融资项目',
    coreEnterpriseName: '阿姆特拉斯供应链有限公司',
    productPlan: '先票/款后货'
  },
  {
    id: 2,
    status: 'valid',
    orderContractFlowNo: 'OCF202607180002',
    orderContractNo: 'HT202607180002',
    customerName: '上海铜鑫实业有限公司',
    coreCustomerNo: 'C2025051200000018',
    partyOne: '华东金属贸易有限公司',
    partyTwo: '上海铜鑫实业有限公司',
    partyThree: '上海物流监管服务有限公司',
    contractTotalAmount: 8800000,
    currentUsedAmount: 2500000,
    remainingAvailableAmount: 6300000,
    currency: '人民币',
    contractStartDate: '2026-06-20',
    contractEndDate: '2027-06-19',
    relatedBusinessContractNo: 'BC202606180006',
    dataSource: '系统同步',
    applicationDate: '2026-07-18',
    effectiveDate: '2026-07-19',
    projectId: 2,
    projectNo: 'PJ202606180006',
    projectName: '金属库存融资项目',
    coreEnterpriseName: '华东金属贸易有限公司',
    productPlan: '货押融资'
  },
  {
    id: 3,
    status: 'invalid',
    orderContractFlowNo: 'OCF202606260003',
    orderContractNo: 'HT202606260003',
    customerName: '唐山港能贸易有限公司',
    coreCustomerNo: 'C2025050600000052',
    partyOne: '华南能源有限公司',
    partyTwo: '唐山港能贸易有限公司',
    partyThree: '中储能源监管有限公司',
    contractTotalAmount: 15000000,
    currentUsedAmount: 0,
    remainingAvailableAmount: 0,
    currency: '人民币',
    contractStartDate: '2026-06-01',
    contractEndDate: '2027-05-31',
    relatedBusinessContractNo: 'BC202605080007',
    dataSource: '客户经理录入',
    applicationDate: '2026-06-26',
    effectiveDate: '2026-06-27',
    invalidDate: '2026-07-20',
    projectId: 3,
    projectNo: 'PJ202605080007',
    projectName: '煤炭库存融资项目',
    coreEnterpriseName: '华南能源有限公司',
    productPlan: '货押融资'
  },
  {
    id: 4,
    status: 'valid',
    orderContractFlowNo: 'OCF202607220004',
    orderContractNo: 'HT202607220004',
    customerName: '深圳芯采科技有限公司',
    coreCustomerNo: 'C2026072200000088',
    partyOne: '深圳智联电子供应链有限公司',
    partyTwo: '深圳芯采科技有限公司',
    partyThree: '顺丰供应链华南分公司',
    contractTotalAmount: 6200000,
    currentUsedAmount: 1800000,
    remainingAvailableAmount: 4400000,
    currency: '人民币',
    contractStartDate: '2026-07-20',
    contractEndDate: '2027-07-19',
    relatedBusinessContractNo: 'BC202607220008',
    dataSource: '客户经理录入',
    applicationDate: '2026-07-22',
    effectiveDate: '2026-07-23',
    projectId: 4,
    projectNo: 'PJ202607220008',
    projectName: '电子元器件先票后货项目',
    coreEnterpriseName: '深圳智联电子供应链有限公司',
    productPlan: '先票/款后货'
  },
  {
    id: 5,
    status: 'valid',
    orderContractFlowNo: 'OCF202607160005',
    orderContractNo: 'HT202607160005',
    customerName: '济南丰禾商贸有限公司',
    coreCustomerNo: 'C2026071600000021',
    partyOne: '山东粮油产业集团有限公司',
    partyTwo: '济南丰禾商贸有限公司',
    partyThree: '齐鲁仓储监管有限公司',
    contractTotalAmount: 9800000,
    currentUsedAmount: 3200000,
    remainingAvailableAmount: 6600000,
    currency: '人民币',
    contractStartDate: '2026-07-15',
    contractEndDate: '2027-01-14',
    relatedBusinessContractNo: 'BC202607160009',
    dataSource: '系统同步',
    applicationDate: '2026-07-16',
    effectiveDate: '2026-07-17',
    projectId: 5,
    projectNo: 'PJ202607160009',
    projectName: '农产品款后货采购项目',
    coreEnterpriseName: '山东粮油产业集团有限公司',
    productPlan: '先票/款后货'
  },
  {
    id: 6,
    status: 'invalid',
    orderContractFlowNo: 'OCF202607120006',
    orderContractNo: 'HT202607120006',
    customerName: '重庆启航零部件有限公司',
    coreCustomerNo: 'C2026071200000036',
    partyOne: '重庆渝新汽车配套有限公司',
    partyTwo: '重庆启航零部件有限公司',
    partyThree: '重庆保税物流监管仓',
    contractTotalAmount: 4500000,
    currentUsedAmount: 0,
    remainingAvailableAmount: 0,
    currency: '人民币',
    contractStartDate: '2026-07-10',
    contractEndDate: '2027-07-09',
    relatedBusinessContractNo: 'BC202607120010',
    dataSource: '客户经理录入',
    applicationDate: '2026-07-12',
    effectiveDate: '2026-07-13',
    invalidDate: '2026-07-22',
    projectId: 6,
    projectNo: 'PJ202607120010',
    projectName: '汽车零部件订单结算项目',
    coreEnterpriseName: '重庆渝新汽车配套有限公司',
    productPlan: '先票/款后货'
  },
  {
    id: 7,
    status: 'valid',
    orderContractFlowNo: 'OCF202607090007',
    orderContractNo: 'HT202607090007',
    customerName: '宁波甬铜贸易有限公司',
    coreCustomerNo: 'C2026070900000045',
    partyOne: '浙江浙金物产有限公司',
    partyTwo: '宁波甬铜贸易有限公司',
    partyThree: '宁波港有色金属监管仓',
    contractTotalAmount: 16800000,
    currentUsedAmount: 5200000,
    remainingAvailableAmount: 11600000,
    currency: '人民币',
    contractStartDate: '2026-07-08',
    contractEndDate: '2027-07-07',
    relatedBusinessContractNo: 'BC202607090011',
    dataSource: '系统同步',
    applicationDate: '2026-07-09',
    effectiveDate: '2026-07-10',
    projectId: 7,
    projectNo: 'PJ202607090011',
    projectName: '有色金属货押融资项目',
    coreEnterpriseName: '浙江浙金物产有限公司',
    productPlan: '货押融资'
  },
  {
    id: 8,
    status: 'valid',
    orderContractFlowNo: 'OCF202607050008',
    orderContractNo: 'HT202607050008',
    customerName: '福州鲜达食品有限公司',
    coreCustomerNo: 'C2026070500000067',
    partyOne: '福建海峡冷链物流有限公司',
    partyTwo: '福州鲜达食品有限公司',
    partyThree: '海峡冷链监管仓',
    contractTotalAmount: 7600000,
    currentUsedAmount: 2100000,
    remainingAvailableAmount: 5500000,
    currency: '人民币',
    contractStartDate: '2026-07-04',
    contractEndDate: '2027-01-03',
    relatedBusinessContractNo: 'BC202607050012',
    dataSource: '客户经理录入',
    applicationDate: '2026-07-05',
    effectiveDate: '2026-07-06',
    projectId: 8,
    projectNo: 'PJ202607050012',
    projectName: '冷链仓单货押融资项目',
    coreEnterpriseName: '福建海峡冷链物流有限公司',
    productPlan: '货押融资'
  }
]

export const orderContractLedgerAssetItems: Record<number, OrderContractLedgerAssetItem[]> = {
  1: [
    {
      id: 1,
      productCode: 'GC-HRB400-001',
      productName: '螺纹钢 HRB400E',
      largeCategory: '黑色金属',
      middleCategory: '钢材',
      smallCategory: '螺纹钢',
      origin: '江苏南京',
      warehouseName: '南京滨江钢材仓',
      quantityOrWeight: 780,
      latestUnitPrice: 3920,
      latestInventoryValue: 3057600,
      currency: '人民币'
    }
  ],
  2: [
    {
      id: 2,
      productCode: 'YS-CU-001',
      productName: '电解铜',
      largeCategory: '有色金属',
      middleCategory: '铜',
      smallCategory: '电解铜',
      origin: '江西贵溪',
      warehouseName: '上海临港有色仓',
      quantityOrWeight: 36,
      latestUnitPrice: 71200,
      latestInventoryValue: 2563200,
      currency: '人民币'
    }
  ],
  3: [
    {
      id: 3,
      productCode: 'NY-MT-001',
      productName: '动力煤',
      largeCategory: '能源化工',
      middleCategory: '煤炭',
      smallCategory: '动力煤',
      origin: '山西大同',
      warehouseName: '唐山港煤炭监管仓',
      quantityOrWeight: 5200,
      latestUnitPrice: 780,
      latestInventoryValue: 4056000,
      currency: '人民币'
    }
  ],
  4: [
    {
      id: 4,
      productCode: 'DZ-IC-001',
      productName: '工业控制芯片',
      largeCategory: '电子产品',
      middleCategory: '集成电路',
      smallCategory: '控制芯片',
      origin: '广东深圳',
      warehouseName: '深圳前海电子监管仓',
      quantityOrWeight: 12000,
      latestUnitPrice: 86,
      latestInventoryValue: 1032000,
      currency: '人民币'
    }
  ],
  5: [
    {
      id: 5,
      productCode: 'NP-SOY-001',
      productName: '非转基因大豆',
      largeCategory: '农产品',
      middleCategory: '粮油',
      smallCategory: '大豆',
      origin: '黑龙江绥化',
      warehouseName: '济南粮油监管仓',
      quantityOrWeight: 2800,
      latestUnitPrice: 4460,
      latestInventoryValue: 12488000,
      currency: '人民币'
    }
  ],
  6: [
    {
      id: 6,
      productCode: 'QC-GEAR-001',
      productName: '变速箱齿轮组件',
      largeCategory: '装备制造',
      middleCategory: '汽车零部件',
      smallCategory: '传动部件',
      origin: '重庆两江新区',
      warehouseName: '重庆保税物流监管仓',
      quantityOrWeight: 4300,
      latestUnitPrice: 380,
      latestInventoryValue: 1634000,
      currency: '人民币'
    }
  ],
  7: [
    {
      id: 7,
      productCode: 'YS-AL-001',
      productName: '铝锭 A00',
      largeCategory: '有色金属',
      middleCategory: '铝',
      smallCategory: '铝锭',
      origin: '广西百色',
      warehouseName: '宁波港有色金属监管仓',
      quantityOrWeight: 210,
      latestUnitPrice: 19650,
      latestInventoryValue: 4126500,
      currency: '人民币'
    }
  ],
  8: [
    {
      id: 8,
      productCode: 'LL-SHRIMP-001',
      productName: '冷冻白虾',
      largeCategory: '食品生鲜',
      middleCategory: '水产',
      smallCategory: '冷冻虾类',
      origin: '福建福州',
      warehouseName: '海峡冷链监管仓',
      quantityOrWeight: 96,
      latestUnitPrice: 48500,
      latestInventoryValue: 4656000,
      currency: '人民币'
    }
  ]
}

export const getOrderContractLedgerRecord = (id: number | string) =>
  orderContractLedgerRecords.find((item) => item.id === Number(id))

export const getOrderContractLedgerAssetItems = (id: number | string) =>
  clone(orderContractLedgerAssetItems[Number(id)] || [])
