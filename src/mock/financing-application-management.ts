export const financingApplicationMenu = [
  {
    key: '01',
    title: '海大',
    isLeaf: false,
    children: [
      { key: '1010', title: '待进件的融资申请', value: './components/applicationList/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' },
      { key: '1020', title: '已进件的融资申请', value: './components/applicationList/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' },
      { key: '1030', title: '失效的融资申请', value: './components/applicationList/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' },
      { key: '1040', title: '待购买票据管理', value: './components/letterTicketList/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' },
      { key: '1080', title: '票据清分登记', value: './components/letterTicketList2/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' }
    ]
  },
  {
    key: '02',
    title: '双胞胎',
    isLeaf: false,
    children: [
      { key: '2010', title: '待进件的融资申请', value: './components/applicationList/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' },
      { key: '2020', title: '已进件的融资申请', value: './components/applicationList/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' },
      { key: '2030', title: '失效的融资申请', value: './components/applicationList/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' },
      { key: '2040', title: '待购买票据管理', value: './components/letterTicketList/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' },
      { key: '2080', title: '票据清分登记', value: './components/letterTicketList2/index.vue', isLeaf: true, codeNo: 'TSELCreditApplyMain' }
    ]
  }
]

export const financingApplicationRecords = [
  {
    id: 'SXCT-1010-001', phaseType: '1010', serialno: 'DJ202607290001', customername: '海大饲料（上海）有限公司', certid: '91310115MA1H2A1B8K', subbillnum: 'ZP202607290001', subbillamt: 680000, interestate: '4.35%', rootbillnum: 'MP202607010001', rootbillissuamt: 1000000, rootbillissudt: '2026-07-01', rootbillpaydt: '2026-12-28', coreentpayacctcustnm: '海大集团股份有限公司', coreentcreditcode: '91440101231288888X', subbillentnm: '海大供应链服务有限公司', corecustname: '海大集团股份有限公司', accountno: '310001234567890', accountbankname: '中国银行上海浦东分行', factoringhandlingfeepayer: '供应商', prepayinterestpayer: '供应商', inputdate: '2026-07-29 09:20:00', applystatus: '待发起申请', baserialno: 'SX202607290001', bcserialno: 'HT202607010001'
  },
  {
    id: 'SXCT-1020-001', phaseType: '1020', serialno: 'DJ202607220002', customername: '海大农牧贸易有限公司', certid: '91440101MA5C3F2P7Q', subbillnum: 'ZP202607220002', subbillamt: 450000, interestate: '4.20%', rootbillnum: 'MP202607020006', rootbillissuamt: 800000, rootbillissudt: '2026-07-02', rootbillpaydt: '2026-11-30', coreentpayacctcustnm: '海大集团股份有限公司', coreentcreditcode: '91440101231288888X', subbillentnm: '华东供应链服务有限公司', corecustname: '海大集团股份有限公司', accountno: '310001234567891', accountbankname: '中国工商银行上海徐汇支行', factoringhandlingfeepayer: '核心企业', prepayinterestpayer: '供应商', inputdate: '2026-07-22 14:36:00', passdate: '2026-07-23 10:15:00', applystatus: '审核中', baserialno: 'SX202607220002', bcserialno: 'HT202607020006'
  },
  {
    id: 'SXCT-1030-001', phaseType: '1030', serialno: 'DJ202607180003', customername: '海大农产品销售有限公司', certid: '91310118MA1JM8QJ3C', subbillnum: 'ZP202607180003', subbillamt: 320000, interestate: '4.50%', rootbillnum: 'MP202606280010', rootbillissuamt: 600000, rootbillissudt: '2026-06-28', rootbillpaydt: '2026-10-30', coreentpayacctcustnm: '海大集团股份有限公司', coreentcreditcode: '91440101231288888X', subbillentnm: '华南农牧供应链有限公司', corecustname: '海大集团股份有限公司', accountno: '310001234567892', accountbankname: '招商银行上海分行', factoringhandlingfeepayer: '供应商', prepayinterestpayer: '核心企业', inputdate: '2026-07-18 16:10:00', refusedate: '2026-07-19 11:20:00', applystatus: '已失效', baserialno: 'SX202607180003', bcserialno: 'HT202606280010'
  },
  {
    id: 'SXCT-2010-001', phaseType: '2010', serialno: 'DJ202607290011', channelid: 'SBT-ONLINE-01', customername: '双胞胎饲料贸易有限公司', certid: '91360100MA35X2L7P6', subbillnum: 'ZP202607290011', subbillamt: 520000, interestate: '4.30%', rootbillnum: 'MP202607030012', rootbillissuamt: 900000, rootbillissudt: '2026-07-03', rootbillpaydt: '2026-12-25', subbillentnm: '双胞胎供应链有限公司', corecustname: '双胞胎（集团）股份有限公司', accountno: '360001234567890', accountbankname: '中国建设银行南昌分行', factoringhandlingfeepayer: '供应商', prepayinterestpayer: '供应商', inputdate: '2026-07-29 10:05:00', applystatus: '待发起申请', baserialno: 'SX202607290011', bcserialno: 'HT202607030012'
  },
  {
    id: 'SXCT-2020-001', phaseType: '2020', serialno: 'DJ202607210012', channelid: 'SBT-ONLINE-01', customername: '双胞胎农牧有限公司', certid: '91360100MA35X2L8P7', subbillnum: 'ZP202607210012', subbillamt: 760000, interestate: '4.15%', rootbillnum: 'MP202607040015', rootbillissuamt: 1200000, rootbillissudt: '2026-07-04', rootbillpaydt: '2026-12-20', subbillentnm: '双胞胎供应链有限公司', corecustname: '双胞胎（集团）股份有限公司', accountno: '360001234567891', accountbankname: '交通银行南昌分行', factoringhandlingfeepayer: '核心企业', prepayinterestpayer: '供应商', inputdate: '2026-07-21 15:45:00', passdate: '2026-07-22 09:30:00', applystatus: '审核中', baserialno: 'SX202607210012', bcserialno: 'HT202607040015'
  },
  {
    id: 'SXCT-2030-001', phaseType: '2030', serialno: 'DJ202607160013', channelid: 'SBT-ONLINE-01', customername: '双胞胎粮贸有限公司', certid: '91360100MA35X2L9P8', subbillnum: 'ZP202607160013', subbillamt: 280000, interestate: '4.60%', rootbillnum: 'MP202606260020', rootbillissuamt: 500000, rootbillissudt: '2026-06-26', rootbillpaydt: '2026-10-25', subbillentnm: '双胞胎供应链有限公司', corecustname: '双胞胎（集团）股份有限公司', accountno: '360001234567892', accountbankname: '中国农业银行南昌分行', factoringhandlingfeepayer: '供应商', prepayinterestpayer: '核心企业', inputdate: '2026-07-16 11:10:00', refusedate: '2026-07-17 09:40:00', applystatus: '已失效', baserialno: 'SX202607160013', bcserialno: 'HT202606260020'
  }
]

export const financingTicketRecords = [
  {
    id: 'SXCT-TICKET-001', phaseType: '1040', serialno: 'GM202607290001', bpserialno: 'CZ202607290001', alserialno: 'J202607290001', customername: '海大饲料（上海）有限公司', businesssum1: 680000, subbillamt: 680000, accountno: '310001234567890', accountbankname: '中国银行上海浦东分行', rootbillnum: 'MP202607010001', subbillnum: 'ZP202607290001', putoutdate: '2026-07-29', factoringhandlingfeepayer: '供应商', prepayinterestpayer: '供应商', inputdate: '2026-07-29 10:20:00', buystatus: '01', remark: ''
  },
  {
    id: 'SXCT-TICKET-002', phaseType: '2040', serialno: 'GM202607290011', bpserialno: 'CZ202607290011', alserialno: 'J202607290011', customername: '双胞胎饲料贸易有限公司', businesssum1: 520000, subbillamt: 520000, accountno: '360001234567890', accountbankname: '中国建设银行南昌分行', rootbillnum: 'MP202607030012', subbillnum: 'ZP202607290011', putoutdate: '2026-07-29', factoringhandlingfeepayer: '供应商', prepayinterestpayer: '供应商', inputdate: '2026-07-29 10:50:00', buystatus: '01', remark: ''
  }
]

export const financingClearingRecords = [
  { id: 'SXCT-CLEAR-001', phaseType: '1080', coreentcustomerid: 'C2025040300000003', coreentcreditcode: '91440101231288888X', rootbillnum: 'MP202607010001', totalamt: 1000000, inputdate: '2026-07-29 08:30:00' },
  { id: 'SXCT-CLEAR-002', phaseType: '2080', coreentcustomerid: 'C2025051200000018', coreentcreditcode: '91360100MA35X2L0P1', rootbillnum: 'MP202607030012', totalamt: 900000, inputdate: '2026-07-29 09:10:00' }
]
