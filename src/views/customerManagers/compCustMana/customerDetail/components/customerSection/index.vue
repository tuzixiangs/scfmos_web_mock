<template>
  <div class="customer-section-page">
    <ContentWrap :body-style="{ padding: '14px 16px 10px' }">
      <div class="section-heading">
        <div>
          <h3>{{ currentTitle }}</h3>
          <p>{{ definition.description }}</p>
        </div>
        <el-tag effect="plain">Mock 数据</el-tag>
      </div>

      <el-form :inline="true" :model="query" class="query-form">
        <el-form-item :label="definition.searchLabel || '关键字'">
          <el-input
            v-model.trim="query.keyword"
            clearable
            :placeholder="definition.searchPlaceholder || `请输入${currentTitle}关键字`"
            @keyup.enter="search"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable placeholder="全部状态" class="status-select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">
            <Icon icon="ep:search" class="mr-4px" />查询
          </el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap :body-style="{ padding: '12px 16px 16px' }">
      <div class="table-toolbar">
        <div>
          <el-button plain @click="exportReport">
            <Icon icon="ep:download" class="mr-4px" />导出 Excel
          </el-button>
          <el-button plain @click="refreshData">
            <Icon icon="ep:refresh" class="mr-4px" />刷新
          </el-button>
        </div>
        <span>共 {{ filteredRows.length }} 条</span>
      </div>

      <el-table :data="pageRows" border stripe height="calc(100vh - 360px)" min-height="330">
        <el-table-column type="index" label="序号" width="66" align="center" />
        <el-table-column
          v-for="column in definition.columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth || 130"
          :align="column.align || 'left'"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag
              v-if="column.prop === 'status'"
              :type="statusTagType(row[column.prop])"
              effect="light"
            >
              {{ row[column.prop] || '-' }}
            </el-tag>
            <span v-else>{{ row[column.prop] ?? '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="definition.actionType === 'download' ? 100 : 120" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleRowAction(row)">
              <Icon :icon="definition.actionType === 'download' ? 'ep:download' : 'ep:document'" class="mr-3px" />
              {{ definition.actionLabel || '详情' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50]"
          :total="filteredRows.length"
        />
      </div>
    </ContentWrap>

    <el-dialog v-model="detailVisible" :title="`${currentTitle}详情`" width="820px">
      <el-descriptions v-if="selectedRow" :column="2" border>
        <el-descriptions-item
          v-for="column in definition.columns"
          :key="column.prop"
          :label="column.label"
        >
          {{ selectedRow[column.prop] ?? '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button @click="detailVisible = false">关 闭</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'CompanyCustomerReportSection' })

type CellValue = string | number
type DataRow = Record<string, CellValue>
interface ReportColumn {
  prop: string
  label: string
  width?: number
  minWidth?: number
  align?: 'left' | 'center' | 'right'
}
interface SectionDefinition {
  description: string
  columns: ReportColumn[]
  rows: DataRow[]
  searchLabel?: string
  searchPlaceholder?: string
  actionLabel?: string
  actionType?: 'detail' | 'download'
}

const props = defineProps<{
  params?: {
    key?: string
    title?: string
    customerId?: string
    detailInfo?: Record<string, unknown> | { value?: Record<string, unknown> }
  }
}>()

const section = (
  description: string,
  columns: ReportColumn[],
  rows: DataRow[],
  actionLabel = '详情',
  actionType: SectionDefinition['actionType'] = 'detail'
): SectionDefinition => ({ description, columns, rows, actionLabel, actionType })

const sectionDefinitions: Record<string, SectionDefinition> = {
  '010130': section(
    '展示该客户在我行开立的企业账户及当前账户状态。',
    [
      { prop: 'accountName', label: '账户名称', minWidth: 190 },
      { prop: 'bankName', label: '开户机构', minWidth: 180 },
      { prop: 'accountNo', label: '账号', minWidth: 190 },
      { prop: 'accountType', label: '账户类型' },
      { prop: 'currency', label: '币种', width: 90 },
      { prop: 'openedAt', label: '开户日期', width: 120 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { accountName: '洋寻华柳自动化有限公司', bankName: '宁波分行营业部', accountNo: '6222 **** **** 8036', accountType: '基本存款账户', currency: '人民币', openedAt: '2022-04-12', status: '正常' },
      { accountName: '洋寻华柳自动化有限公司', bankName: '宁波鄞州支行', accountNo: '6222 **** **** 9185', accountType: '一般结算账户', currency: '人民币', openedAt: '2024-07-18', status: '正常' }
    ]
  ),
  '010140': section(
    '展示企业银行账号、账户用途以及验证情况。',
    [
      { prop: 'bankName', label: '开户银行', minWidth: 190 },
      { prop: 'bankCode', label: '联行号', minWidth: 150 },
      { prop: 'accountNo', label: '银行账号', minWidth: 190 },
      { prop: 'accountName', label: '户名', minWidth: 190 },
      { prop: 'accountUsage', label: '账户用途', minWidth: 130 },
      { prop: 'verifiedAt', label: '验证日期', width: 120 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { bankName: '宁波通商银行营业部', bankCode: '313332000018', accountNo: '9010 **** **** 0036', accountName: '洋寻华柳自动化有限公司', accountUsage: '贷款资金接收', verifiedAt: '2026-07-28', status: '已验证' },
      { bankName: '中国银行宁波鄞州支行', bankCode: '104332003021', accountNo: '3924 **** **** 1208', accountName: '洋寻华柳自动化有限公司', accountUsage: '日常结算', verifiedAt: '2026-06-15', status: '已验证' }
    ]
  ),
  '010020': section(
    '展示企业法定代表人、董事、监事及高级管理人员信息。',
    [
      { prop: 'name', label: '姓名', width: 110 },
      { prop: 'position', label: '职务', minWidth: 130 },
      { prop: 'certType', label: '证件类型', minWidth: 120 },
      { prop: 'certNo', label: '证件号码', minWidth: 190 },
      { prop: 'phone', label: '联系电话', minWidth: 140 },
      { prop: 'term', label: '任职期限', minWidth: 190 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { name: '王志远', position: '法定代表人/董事长', certType: '居民身份证', certNo: '3302********3218', phone: '138****3816', term: '2024-01-01 至 2027-12-31', status: '在任' },
      { name: '李海燕', position: '财务负责人', certType: '居民身份证', certNo: '3302********2842', phone: '136****2095', term: '2023-05-18 至今', status: '在任' },
      { name: '陈立峰', position: '监事', certType: '居民身份证', certNo: '3302********1156', phone: '139****7621', term: '2024-01-01 至 2027-12-31', status: '在任' }
    ]
  ),
  '010030': section(
    '展示股东构成、认缴金额、持股比例及股权质押情况。',
    [
      { prop: 'shareholderName', label: '股东名称', minWidth: 190 },
      { prop: 'shareholderType', label: '股东类型', minWidth: 120 },
      { prop: 'subscribedCapital', label: '认缴金额（万元）', minWidth: 150, align: 'right' },
      { prop: 'paidCapital', label: '实缴金额（万元）', minWidth: 150, align: 'right' },
      { prop: 'shareRatio', label: '持股比例', width: 110, align: 'right' },
      { prop: 'pledged', label: '股权质押', width: 110 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { shareholderName: '王志远', shareholderType: '自然人', subscribedCapital: '3,250.00', paidCapital: '3,250.00', shareRatio: '65.00%', pledged: '否', status: '有效' },
      { shareholderName: '宁波华柳投资有限公司', shareholderType: '企业法人', subscribedCapital: '1,750.00', paidCapital: '1,750.00', shareRatio: '35.00%', pledged: '否', status: '有效' }
    ]
  ),
  '020005': section(
    '提供客户财务报表填报模板及配套说明文件。',
    [
      { prop: 'templateName', label: '模板名称', minWidth: 240 },
      { prop: 'reportType', label: '报表类型', minWidth: 140 },
      { prop: 'applicablePeriod', label: '适用期间', minWidth: 140 },
      { prop: 'version', label: '版本号', width: 100 },
      { prop: 'updatedAt', label: '更新日期', width: 120 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { templateName: '企业年度财务报表模板.xlsx', reportType: '年度报表', applicablePeriod: '2026年度', version: 'V3.2', updatedAt: '2026-07-01', status: '可下载' },
      { templateName: '企业月度经营数据模板.xlsx', reportType: '月度报表', applicablePeriod: '2026年度', version: 'V2.5', updatedAt: '2026-06-18', status: '可下载' },
      { templateName: '财务指标填报说明.pdf', reportType: '填报说明', applicablePeriod: '长期有效', version: 'V1.8', updatedAt: '2026-05-10', status: '可下载' }
    ],
    '下载',
    'download'
  ),
  '020010': section(
    '展示客户已报送的资产负债表、利润表及审计情况。',
    [
      { prop: 'period', label: '报表期间', width: 120 },
      { prop: 'reportType', label: '报表口径', minWidth: 130 },
      { prop: 'auditAgency', label: '审计机构', minWidth: 190 },
      { prop: 'totalAssets', label: '资产总额（万元）', minWidth: 150, align: 'right' },
      { prop: 'totalLiabilities', label: '负债总额（万元）', minWidth: 150, align: 'right' },
      { prop: 'revenue', label: '营业收入（万元）', minWidth: 150, align: 'right' },
      { prop: 'netProfit', label: '净利润（万元）', minWidth: 140, align: 'right' },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { period: '2025年度', reportType: '合并报表', auditAgency: '宁波正源会计师事务所', totalAssets: '9,600.00', totalLiabilities: '4,180.00', revenue: '12,800.00', netProfit: '926.00', status: '已审计' },
      { period: '2026年6月', reportType: '单体报表', auditAgency: '企业报送', totalAssets: '10,280.00', totalLiabilities: '4,360.00', revenue: '7,560.00', netProfit: '612.00', status: '已复核' }
    ]
  ),
  '020030': section(
    '按期间展示客户核心经营指标及同比变化。',
    [
      { prop: 'period', label: '数据期间', width: 120 },
      { prop: 'indicator', label: '经营指标', minWidth: 180 },
      { prop: 'value', label: '指标值', minWidth: 140, align: 'right' },
      { prop: 'unit', label: '单位', width: 90 },
      { prop: 'yearOnYear', label: '同比变化', width: 110, align: 'right' },
      { prop: 'source', label: '数据来源', minWidth: 150 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { period: '2026年7月', indicator: '主营业务收入', value: '1,280.00', unit: '万元', yearOnYear: '+8.6%', source: '企业经营数据', status: '正常' },
      { period: '2026年7月', indicator: '订单签约金额', value: '1,560.00', unit: '万元', yearOnYear: '+12.4%', source: '订单系统', status: '正常' },
      { period: '2026年7月', indicator: '存货周转天数', value: '42', unit: '天', yearOnYear: '-3.0%', source: '财务报表', status: '正常' }
    ]
  ),
  '010180': section(
    '展示通过投资、控制、交易及人员关系识别出的疑似关联客户。',
    [
      { prop: 'customerNo', label: '客户编号', minWidth: 170 },
      { prop: 'customerName', label: '客户名称', minWidth: 210 },
      { prop: 'relationType', label: '关联类型', minWidth: 130 },
      { prop: 'relationPath', label: '关联路径', minWidth: 220 },
      { prop: 'controlRatio', label: '控制/持股比例', minWidth: 130 },
      { prop: 'riskLevel', label: '风险等级', width: 110 },
      { prop: 'status', label: '核实状态', width: 110 }
    ],
    [
      { customerNo: 'C2026041800000027', customerName: '宁波华柳投资有限公司', relationType: '股权关联', relationPath: '法人股东直接持股', controlRatio: '35.00%', riskLevel: '低', status: '已确认' },
      { customerNo: 'C2026051200000018', customerName: '象山华柳贸易有限公司', relationType: '人员关联', relationPath: '法定代表人近亲属任职', controlRatio: '-', riskLevel: '中', status: '待核实' }
    ]
  ),
  '050011': section(
    '展示当前有效授信额度、已用额度及可用余额。',
    [
      { prop: 'creditNo', label: '授信编号', minWidth: 180 },
      { prop: 'product', label: '授信产品', minWidth: 170 },
      { prop: 'creditAmount', label: '授信金额', minWidth: 130, align: 'right' },
      { prop: 'usedAmount', label: '已用额度', minWidth: 130, align: 'right' },
      { prop: 'availableAmount', label: '可用额度', minWidth: 130, align: 'right' },
      { prop: 'currency', label: '币种', width: 90 },
      { prop: 'validPeriod', label: '有效期', minWidth: 200 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { creditNo: 'CR202607010001', product: '存货质押融资', creditAmount: '12,000,000.00', usedAmount: '6,800,000.00', availableAmount: '5,200,000.00', currency: '人民币', validPeriod: '2026-07-01 至 2027-06-30', status: '有效' },
      { creditNo: 'CR202606180006', product: '流动资金贷款', creditAmount: '5,000,000.00', usedAmount: '2,000,000.00', availableAmount: '3,000,000.00', currency: '人民币', validPeriod: '2026-06-18 至 2027-06-17', status: '有效' }
    ]
  ),
  '050012': section(
    '展示已经到期、终止或被替换的历史授信额度。',
    [
      { prop: 'creditNo', label: '授信编号', minWidth: 180 },
      { prop: 'product', label: '授信产品', minWidth: 170 },
      { prop: 'creditAmount', label: '授信金额', minWidth: 130, align: 'right' },
      { prop: 'expiredAt', label: '失效日期', width: 120 },
      { prop: 'invalidReason', label: '失效原因', minWidth: 200 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { creditNo: 'CR202507150008', product: '国内贸易融资', creditAmount: '6,000,000.00', expiredAt: '2026-07-14', invalidReason: '授信期限届满', status: '已失效' },
      { creditNo: 'CR202503120015', product: '存货质押融资', creditAmount: '8,000,000.00', expiredAt: '2026-03-11', invalidReason: '新授信方案替换', status: '已失效' }
    ]
  ),
  '050020': section(
    '展示当前尚未结清的授信业务及剩余本金。',
    [
      { prop: 'businessNo', label: '业务编号', minWidth: 180 },
      { prop: 'contractNo', label: '合同编号', minWidth: 190 },
      { prop: 'product', label: '业务品种', minWidth: 150 },
      { prop: 'loanAmount', label: '发放金额', minWidth: 130, align: 'right' },
      { prop: 'balance', label: '当前余额', minWidth: 130, align: 'right' },
      { prop: 'startDate', label: '起始日', width: 120 },
      { prop: 'endDate', label: '到期日', width: 120 },
      { prop: 'status', label: '状态', width: 110 }
    ],
    [
      { businessNo: 'LN202607010008', contractNo: 'BCT202607010001', product: '货押融资', loanAmount: '6,800,000.00', balance: '6,120,000.00', startDate: '2026-07-02', endDate: '2027-06-30', status: '正常' },
      { businessNo: 'LN202606150012', contractNo: 'BCT202606150008', product: '先票/款后货', loanAmount: '2,000,000.00', balance: '1,480,000.00', startDate: '2026-06-16', endDate: '2027-06-15', status: '正常' }
    ]
  ),
  '050030': section(
    '展示已正常结清或提前结清的历史授信业务。',
    [
      { prop: 'businessNo', label: '业务编号', minWidth: 180 },
      { prop: 'contractNo', label: '合同编号', minWidth: 190 },
      { prop: 'product', label: '业务品种', minWidth: 150 },
      { prop: 'loanAmount', label: '发放金额', minWidth: 130, align: 'right' },
      { prop: 'settledAt', label: '结清日期', width: 120 },
      { prop: 'settlementType', label: '结清方式', minWidth: 120 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { businessNo: 'LN202505180006', contractNo: 'BCT202505180003', product: '流动资金贷款', loanAmount: '3,000,000.00', settledAt: '2026-05-17', settlementType: '到期结清', status: '已结清' },
      { businessNo: 'LN202508220011', contractNo: 'BCT202508220009', product: '订单融资', loanAmount: '1,500,000.00', settledAt: '2026-03-10', settlementType: '提前还款', status: '已结清' }
    ]
  ),
  '080030': section(
    '展示客户信用等级评估结果、评分模型及有效期限。',
    [
      { prop: 'assessmentNo', label: '评估编号', minWidth: 180 },
      { prop: 'grade', label: '信用等级', width: 110 },
      { prop: 'score', label: '综合得分', width: 110, align: 'right' },
      { prop: 'model', label: '评级模型', minWidth: 190 },
      { prop: 'assessedAt', label: '评估日期', width: 120 },
      { prop: 'validUntil', label: '有效期至', width: 120 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { assessmentNo: 'CRA202607280001', grade: 'A+', score: '86.5', model: '供应链企业信用评级模型', assessedAt: '2026-07-28', validUntil: '2027-07-27', status: '有效' },
      { assessmentNo: 'CRA202507160008', grade: 'A', score: '82.0', model: '公司客户信用评级模型', assessedAt: '2025-07-16', validUntil: '2026-07-15', status: '已失效' }
    ],
    '评估详情'
  ),
  '080045': section(
    '展示客户贷后资产风险分类及分类调整轨迹。',
    [
      { prop: 'classificationNo', label: '分类编号', minWidth: 180 },
      { prop: 'loanNo', label: '借据号', minWidth: 180 },
      { prop: 'currentClass', label: '当前分类', width: 110 },
      { prop: 'previousClass', label: '上次分类', width: 110 },
      { prop: 'reason', label: '分类依据', minWidth: 250 },
      { prop: 'classifiedAt', label: '分类日期', width: 120 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { classificationNo: 'ARC202608250001', loanNo: 'LN202607010008', currentClass: '正常', previousClass: '正常', reason: '还本付息正常，质押物价值覆盖充分', classifiedAt: '2026-08-25', status: '有效' },
      { classificationNo: 'ARC202608180006', loanNo: 'LN202606150012', currentClass: '正常', previousClass: '正常', reason: '订单回款及货物流转符合预期', classifiedAt: '2026-08-18', status: '有效' }
    ]
  ),
  '080047': section(
    '展示贷后客户检查计划、检查结论及整改情况。',
    [
      { prop: 'reportNo', label: '检查报告编号', minWidth: 190 },
      { prop: 'checkType', label: '检查类型', minWidth: 120 },
      { prop: 'checkPeriod', label: '检查期间', minWidth: 140 },
      { prop: 'checker', label: '检查人', width: 110 },
      { prop: 'checkedAt', label: '检查日期', width: 120 },
      { prop: 'conclusion', label: '检查结论', minWidth: 230 },
      { prop: 'status', label: '状态', width: 110 }
    ],
    [
      { reportNo: 'PCR202608200001', checkType: '现场检查', checkPeriod: '2026年第三季度', checker: '张晨', checkedAt: '2026-08-20', conclusion: '经营正常，库存及回款符合要求', status: '已完成' },
      { reportNo: 'PCR202605180004', checkType: '非现场检查', checkPeriod: '2026年第二季度', checker: '李敏', checkedAt: '2026-05-18', conclusion: '未发现重大风险事项', status: '已完成' }
    ]
  ),
  '110150': section(
    '展示企业发票核验记录及税务平台核验结果。',
    [
      { prop: 'invoiceCode', label: '发票代码', minWidth: 150 },
      { prop: 'invoiceNo', label: '发票号码', minWidth: 150 },
      { prop: 'seller', label: '销售方', minWidth: 200 },
      { prop: 'buyer', label: '购买方', minWidth: 200 },
      { prop: 'amount', label: '价税合计', minWidth: 130, align: 'right' },
      { prop: 'issuedAt', label: '开票日期', width: 120 },
      { prop: 'verifiedAt', label: '核验日期', width: 120 },
      { prop: 'status', label: '核验结果', width: 110 }
    ],
    [
      { invoiceCode: '033002600111', invoiceNo: '11862035', seller: '宁波钢铁有限公司', buyer: '洋寻华柳自动化有限公司', amount: '1,268,000.00', issuedAt: '2026-08-18', verifiedAt: '2026-08-20', status: '一致' },
      { invoiceCode: '033002600112', invoiceNo: '11862106', seller: '浙江华柳物流有限公司', buyer: '洋寻华柳自动化有限公司', amount: '86,500.00', issuedAt: '2026-08-21', verifiedAt: '2026-08-22', status: '一致' }
    ],
    '核验详情'
  ),
  '110220': section(
    '按月汇总企业账户资金流入、流出及大额交易情况。',
    [
      { prop: 'period', label: '统计期间', width: 120 },
      { prop: 'inflow', label: '资金流入', minWidth: 140, align: 'right' },
      { prop: 'outflow', label: '资金流出', minWidth: 140, align: 'right' },
      { prop: 'netFlow', label: '净流入', minWidth: 140, align: 'right' },
      { prop: 'largeTransactionCount', label: '大额交易笔数', minWidth: 130, align: 'right' },
      { prop: 'source', label: '数据来源', minWidth: 150 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { period: '2026年8月', inflow: '13,820,000.00', outflow: '12,460,000.00', netFlow: '1,360,000.00', largeTransactionCount: 18, source: '本行账户流水', status: '正常' },
      { period: '2026年7月', inflow: '12,760,000.00', outflow: '11,980,000.00', netFlow: '780,000.00', largeTransactionCount: 15, source: '本行账户流水', status: '正常' }
    ]
  ),
  '110410': section(
    '展示工商、司法、动产登记等外部信息查询记录。',
    [
      { prop: 'queryNo', label: '查询流水号', minWidth: 180 },
      { prop: 'queryType', label: '查询类型', minWidth: 150 },
      { prop: 'subject', label: '查询主体', minWidth: 210 },
      { prop: 'queriedAt', label: '查询时间', minWidth: 160 },
      { prop: 'result', label: '查询结果', minWidth: 220 },
      { prop: 'operator', label: '查询人', width: 110 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { queryNo: 'EQ202608280001', queryType: '动产融资统一登记', subject: '洋寻华柳自动化有限公司', queriedAt: '2026-08-28 09:20', result: '查询到有效质押登记 2 笔', operator: '张晨', status: '已完成' },
      { queryNo: 'EQ202608150006', queryType: '司法涉诉查询', subject: '洋寻华柳自动化有限公司', queriedAt: '2026-08-15 14:35', result: '未发现重大未决诉讼', operator: '李敏', status: '已完成' }
    ]
  ),
  '120001': section(
    '集中展示当前及历史预警信号、触发来源和处理状态。',
    [
      { prop: 'warningNo', label: '预警编号', minWidth: 180 },
      { prop: 'warningLevel', label: '预警级别', width: 110 },
      { prop: 'warningType', label: '预警类型', minWidth: 150 },
      { prop: 'content', label: '预警内容', minWidth: 280 },
      { prop: 'triggeredAt', label: '触发时间', minWidth: 160 },
      { prop: 'source', label: '预警来源', minWidth: 140 },
      { prop: 'status', label: '处理状态', width: 110 }
    ],
    [
      { warningNo: 'WR202608260001', warningLevel: '黄色', warningType: '价格波动预警', content: '热轧卷板最新盯市价格接近预警线', triggeredAt: '2026-08-26 10:20', source: '价格盯市', status: '处理中' },
      { warningNo: 'WR202607180008', warningLevel: '蓝色', warningType: '回款进度预警', content: '业务合同回款较计划延迟 3 天', triggeredAt: '2026-07-18 09:10', source: '回款监测', status: '已解除' }
    ],
    '预警详情'
  ),
  '120004': section(
    '展示预警处置措施、责任人、计划完成日期及执行进度。',
    [
      { prop: 'planNo', label: '方案编号', minWidth: 180 },
      { prop: 'warningNo', label: '关联预警编号', minWidth: 180 },
      { prop: 'measure', label: '处置措施', minWidth: 280 },
      { prop: 'owner', label: '责任人', width: 110 },
      { prop: 'dueDate', label: '计划完成日', width: 120 },
      { prop: 'progress', label: '完成进度', width: 110 },
      { prop: 'status', label: '状态', width: 110 }
    ],
    [
      { planNo: 'DP202608260001', warningNo: 'WR202608260001', measure: '补充最新价格来源并通知客户追加价格监测频次', owner: '张晨', dueDate: '2026-09-03', progress: '60%', status: '执行中' },
      { planNo: 'DP202607180004', warningNo: 'WR202607180008', measure: '核实应收账款回款节点并补充回款凭证', owner: '李敏', dueDate: '2026-07-22', progress: '100%', status: '已完成' }
    ],
    '方案详情'
  ),
  '120006': section(
    '展示客户当前综合预警级别及形成该级别的主要因素。',
    [
      { prop: 'customerName', label: '客户名称', minWidth: 210 },
      { prop: 'warningLevel', label: '当前预警级别', minWidth: 130 },
      { prop: 'effectiveDate', label: '生效日期', width: 120 },
      { prop: 'mainReason', label: '主要预警因素', minWidth: 300 },
      { prop: 'pendingCount', label: '未处理信号数', minWidth: 130, align: 'right' },
      { prop: 'updatedAt', label: '最近更新', minWidth: 160 },
      { prop: 'status', label: '状态', width: 100 }
    ],
    [
      { customerName: '洋寻华柳自动化有限公司', warningLevel: '黄色', effectiveDate: '2026-08-26', mainReason: '部分存货价格接近债项规则预警线', pendingCount: 1, updatedAt: '2026-08-26 10:20', status: '生效中' }
    ],
    '级别详情'
  )
}

const fallbackDefinition = section(
  '展示当前页签对应的客户业务信息。',
  [
    { prop: 'recordNo', label: '记录编号', minWidth: 180 },
    { prop: 'recordName', label: '记录名称', minWidth: 220 },
    { prop: 'updatedAt', label: '更新日期', width: 120 },
    { prop: 'operator', label: '操作人', width: 110 },
    { prop: 'status', label: '状态', width: 100 }
  ],
  [
    { recordNo: 'REC202608280001', recordName: '客户信息记录', updatedAt: '2026-08-28', operator: '本地演示用户', status: '有效' }
  ]
)

const currentKey = computed(() => String(props.params?.key || ''))
const currentTitle = computed(() => props.params?.title || '客户信息')
const definition = computed(() => sectionDefinitions[currentKey.value] || fallbackDefinition)
const query = reactive({ keyword: '', status: '' })
const currentPage = ref(1)
const pageSize = ref(10)
const detailVisible = ref(false)
const selectedRow = ref<DataRow>()

const statusOptions = computed(() => [
  ...new Set(definition.value.rows.map((row) => String(row.status || '')).filter(Boolean))
])
const filteredRows = computed(() => {
  const keyword = query.keyword.toLowerCase()
  return definition.value.rows.filter(
    (row) =>
      (!keyword || Object.values(row).some((value) => String(value).toLowerCase().includes(keyword))) &&
      (!query.status || row.status === query.status)
  )
})
const pageRows = computed(() =>
  filteredRows.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
)

const statusTagType = (status: CellValue) => {
  const text = String(status || '')
  if (/失效|异常|拒绝|高风险|红色/.test(text)) return 'danger'
  if (/待|处理中|执行中|黄色/.test(text)) return 'warning'
  if (/有效|正常|完成|通过|一致|验证|在任|可下载|已审计|已复核/.test(text)) return 'success'
  return 'info'
}
const search = () => {
  currentPage.value = 1
  ElMessage.success(`查询完成，共 ${filteredRows.value.length} 条`)
}
const resetQuery = () => {
  Object.assign(query, { keyword: '', status: '' })
  currentPage.value = 1
}
const refreshData = () => ElMessage.success(`${currentTitle.value}已刷新`)
const exportReport = () => ElMessage.success(`${currentTitle.value}导出任务已生成（Mock）`)
const handleRowAction = (row: DataRow) => {
  if (definition.value.actionType === 'download') {
    ElMessage.success(`“${row.templateName || currentTitle.value}”已开始下载（Mock）`)
    return
  }
  selectedRow.value = row
  detailVisible.value = true
}

watch(currentKey, () => {
  resetQuery()
  selectedRow.value = undefined
  detailVisible.value = false
})
</script>

<style scoped lang="scss">
.customer-section-page { min-width: 0; min-height: 100%; background: #f2f3f5; }
.section-heading { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; gap: 20px; }
.section-heading h3 { margin: 0 0 6px; color: #303133; font-size: 16px; }
.section-heading p { margin: 0; color: #909399; font-size: 13px; }
.query-form { padding-top: 2px; }
.query-form :deep(.el-form-item) { margin-bottom: 4px; }
.query-form :deep(.el-input) { width: 260px; }
.status-select { width: 150px; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; color: #909399; font-size: 13px; }
.pagination-wrap { display: flex; justify-content: flex-end; padding-top: 14px; }
</style>
