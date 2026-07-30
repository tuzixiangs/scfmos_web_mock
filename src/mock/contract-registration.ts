export const contractRegistrationMenu = [
  {
    key: '01',
    title: '项目合同登记',
    isLeaf: false,
    children: [
      { key: '010', title: '待登记合同', value: './components/toRegistered/index.vue', isLeaf: true, dealtype: 'BOOK_IN_PENDING' },
      { key: '020', title: '已登记合同', value: './components/toRegistered/index.vue', isLeaf: true, dealtype: 'BOOK_IN_COMPLETED' },
      { key: '024', title: '不登记合同批复', value: './components/toRegistered/index.vue', isLeaf: true, dealtype: 'BOOK_IN_SKIPPED' },
      { key: '026', title: '已取消合同', value: './components/toRegistered/index.vue', isLeaf: true, dealtype: 'BOOK_IN_CANCELLED' }
    ]
  }
]

export const contractRegistrationRecords = [
  {
    id: 'BOOK-IN-001', phaseType: '010', serialno: 'PF202607290001', relativeserialno: 'SQ202607220001', customername: '华东供应链有限公司', customerid: 'C202607200001', customertype: '企业客户', businesstype: 'SCF_WORKING_CAPITAL', businesstypename: '供应链流动资金贷款', occurtype: 'NEW', occurtypename: '新增', currency: '人民币', businesssum: 5000000, vouchtypename: '保证', inputusername: '张晨', inputorgname: '总行供应链金融部', endtime: '2026-07-28 16:30:00', projectname: '华东供应链融资项目', contractstatus: '待登记'
  },
  {
    id: 'BOOK-IN-002', phaseType: '010', serialno: 'PF202607280002', relativeserialno: 'SQ202607210006', customername: '新城贸易有限公司', customerid: 'C202607190002', customertype: '企业客户', businesstype: 'SCF_DEALER_FINANCE', businesstypename: '经销商融资', occurtype: 'RENEW', occurtypename: '续作', currency: '人民币', businesssum: 2800000, vouchtypename: '抵押', inputusername: '李敏', inputorgname: '上海分行', endtime: '2026-07-28 11:15:00', projectname: '新城贸易融资项目', contractstatus: '待登记'
  },
  {
    id: 'BOOK-IN-003', phaseType: '020', serialno: 'PF202607180003', relativeserialno: 'SQ202607150010', customername: '海大饲料（上海）有限公司', customerid: 'C2025040300000003', customertype: '企业客户', businesstype: 'SCF_FACToring', businesstypename: '国内保理融资', occurtype: 'NEW', occurtypename: '新增', currency: '人民币', businesssum: 3600000, vouchtypename: '信用', inputusername: '王菲', inputorgname: '上海分行', endtime: '2026-07-18 14:20:00', projectname: '海大供应链融资项目', contractstatus: '已登记'
  },
  {
    id: 'BOOK-IN-004', phaseType: '024', serialno: 'PF202607120004', relativeserialno: 'SQ202607100011', customername: '双胞胎农牧有限公司', customerid: 'C2025051200000018', customertype: '企业客户', businesstype: 'SCF_INVENTORY', businesstypename: '存货质押融资', occurtype: 'NEW', occurtypename: '新增', currency: '人民币', businesssum: 4200000, vouchtypename: '质押', inputusername: '陈敏', inputorgname: '南昌分行', endtime: '2026-07-12 10:05:00', projectname: '双胞胎农牧融资项目', contractstatus: '批复不登记'
  },
  {
    id: 'BOOK-IN-005', phaseType: '026', serialno: 'PF202607050005', relativeserialno: 'SQ202607010015', customername: '通威饲料贸易有限公司', customerid: 'C2025060100000021', customertype: '企业客户', businesstype: 'SCF_WORKING_CAPITAL', businesstypename: '供应链流动资金贷款', occurtype: 'NEW', occurtypename: '新增', currency: '人民币', businesssum: 1800000, vouchtypename: '保证', inputusername: '周凯', inputorgname: '成都分行', endtime: '2026-07-05 09:40:00', projectname: '通威供应链融资项目', contractstatus: '已取消'
  }
]

export const contractRegistrationPage = (params = {}) => {
  const phaseType = String(params.phaseType || params.key || '').trim()
  const customerName = String(params.customername || params.customerName || '').trim()
  const businessTypeName = String(params.businesstypename || params.businessTypeName || '').trim()
  const records = contractRegistrationRecords.filter((record) =>
    (!phaseType || record.phaseType === phaseType) &&
    (!customerName || record.customername.includes(customerName)) &&
    (!businessTypeName || record.businesstypename.includes(businessTypeName))
  )
  return { total: records.length, list: records, records }
}
