<template>
  <ContentWrap class="price-ledger-page">
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item label="项目名称"><el-input v-model="query.projectName" clearable placeholder="请输入项目名称" /></el-form-item>
      <el-form-item label="核心企业名称"><el-input v-model="query.coreEnterpriseName" clearable placeholder="请输入核心企业名称" /></el-form-item>
      <el-form-item label="商品分类"><el-input v-model="query.category" clearable placeholder="大类/中类/小类" /></el-form-item>
      <el-form-item><el-button type="primary" @click="search"><Icon icon="ep:search" class="mr-4px" />查询</el-button><el-button @click="reset">重置</el-button></el-form-item>
    </el-form>

    <div class="action-bar"><el-button plain @click="exportLedger"><Icon icon="ep:download" class="mr-4px" />导出Excel</el-button></div>
    <el-table :data="filteredRows" border>
      <el-table-column type="index" label="序号" width="66" align="center" />
      <el-table-column prop="projectNo" label="项目编号" min-width="150" />
      <el-table-column prop="projectName" label="项目名称" min-width="180" />
      <el-table-column prop="coreEnterpriseName" label="核心企业名称" min-width="190" />
      <el-table-column prop="category" label="商品分类" min-width="190" />
      <el-table-column prop="origin" label="产地" min-width="150" />
      <el-table-column prop="initialPrice" label="初始认定价格" min-width="140" align="right" />
      <el-table-column prop="basePrice" label="在库基准货物价格" min-width="160" align="right" />
      <el-table-column prop="latestPrice" label="最新盯市单价" min-width="140" align="right" />
      <el-table-column prop="latestValue" label="在库最新价值" min-width="150" align="right" />
      <el-table-column prop="monitoringDate" label="盯市日期" min-width="130" />
      <el-table-column label="操作" width="140" fixed="right" align="center">
        <template #default="{ row }"><el-button link type="primary" @click="showTrend(row)"><Icon icon="ep:trend-charts" class="mr-3px" />查看单价趋势</el-button></template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'PriceMonitoringLedgerQuery' })

const query = reactive({ projectName: '', coreEnterpriseName: '', category: '' })
const rows = [
  { projectNo: 'PJ202604280012', projectName: '粮食收储融资项目', coreEnterpriseName: '丰禾农业发展有限公司', category: '农产品/粮食/标准品', origin: '吉林省松原市', initialPrice: '3,860.00', basePrice: '3,820.00', latestPrice: '3,790.00', latestValue: '8,716,000.00', monitoringDate: '2026-08-26' },
  { projectNo: 'PJ202605080007', projectName: '煤炭库存融资项目', coreEnterpriseName: '华南能源有限公司', category: '能源矿产/煤炭/优等品', origin: '河北省唐山市', initialPrice: '760.00', basePrice: '748.00', latestPrice: '735.00', latestValue: '7,938,000.00', monitoringDate: '2026-08-26' },
  { projectNo: 'PJ202604120015', projectName: '家电经销商融资项目', coreEnterpriseName: '臻品家电有限公司', category: '家用电器/空气调节器/标准品', origin: '广东省佛山市', initialPrice: '4,200.00', basePrice: '4,180.00', latestPrice: '4,140.00', latestValue: '5,796,000.00', monitoringDate: '2026-08-25' }
]
const filteredRows = computed(() => rows.filter((row) =>
  (!query.projectName || row.projectName.includes(query.projectName)) &&
  (!query.coreEnterpriseName || row.coreEnterpriseName.includes(query.coreEnterpriseName)) &&
  (!query.category || row.category.includes(query.category))
))
const search = () => ElMessage.success(`查询完成，共 ${filteredRows.value.length} 条`)
const reset = () => Object.assign(query, { projectName: '', coreEnterpriseName: '', category: '' })
const exportLedger = () => ElMessage.success('已生成价格盯市台账导出任务（Mock）')
const showTrend = (row: (typeof rows)[number]) => ElMessage.info(`正在查看“${row.category}”单价趋势（Mock）`)
</script>

<style scoped lang="scss">
.price-ledger-page { min-width: 0; }
.query-form { padding: 4px 0 0; }
.action-bar { display: flex; margin-bottom: 12px; gap: 8px; }
</style>
