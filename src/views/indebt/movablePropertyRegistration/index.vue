<template>
  <div v-if="showDetail" class="registration-detail-page">
    <div class="detail-toolbar">
      <el-button @click="goBack"><Icon icon="ep:arrow-left" class="mr-4px" />返 回</el-button>
      <span>动产登记编号：{{ current?.registrationNo }}</span>
      <el-tag type="warning" effect="light">{{ current?.status }}</el-tag>
    </div>
    <el-collapse v-model="activeSections" class="system-detail-collapse">
      <el-collapse-item name="base">
        <template #title><span class="collapse-title">动产登记基本信息</span></template>
        <el-form :model="form" label-width="150px" class="detail-form">
          <el-row :gutter="48">
            <el-col :span="12"><el-form-item label="业务合同编号"><el-input v-model="form.businessContractNo" disabled /></el-form-item></el-col>
            <el-col :span="12"><el-form-item label="借款人名称"><el-input v-model="form.borrowerName" disabled /></el-form-item></el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="12"><el-form-item label="质押财产价值"><el-input-number v-model="form.pledgedValue" :min="0" :precision="2" :controls="false" class="w-full" /></el-form-item></el-col>
            <el-col :span="12"><el-form-item label="登记到期日"><el-date-picker v-model="form.expiryDate" type="date" value-format="YYYY-MM-DD" class="w-full" /></el-form-item></el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="12"><el-form-item label="财产描述"><el-input v-model="form.propertyDescription" type="textarea" :rows="4" /></el-form-item></el-col>
            <el-col :span="12"><el-form-item label="变更内容"><el-input v-model="form.changeContent" type="textarea" :rows="4" /></el-form-item></el-col>
          </el-row>
          <el-form-item label="财产要素信息"><el-upload action="#" :auto-upload="false"><el-button plain><Icon icon="ep:upload" class="mr-4px" />上传附件</el-button></el-upload></el-form-item>
          <div class="form-actions"><el-button type="primary" @click="saveDetail">保存</el-button><el-button @click="generateList">生成《质物清单》</el-button></div>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="assets">
        <template #title><span class="collapse-title">质物明细</span></template>
        <div class="collapse-content"><el-table :data="assetRows" border><el-table-column type="index" label="序号" width="66" /><el-table-column prop="productCode" label="商品编号" /><el-table-column prop="productName" label="商品名称" /><el-table-column prop="category" label="商品分类" /><el-table-column prop="quantity" label="数量/重量" /><el-table-column prop="value" label="质物价值" /></el-table></div>
      </el-collapse-item>
    </el-collapse>
  </div>

  <ContentWrap v-else class="registration-list-page">
    <el-alert title="本页面模拟内嵌信贷系统动产登记功能；出账、入库、出库生成的变更待办会自动进入对应列表。" type="info" :closable="false" class="mb-16px" />
    <el-form :inline="true" :model="query">
      <el-form-item label="登记编号"><el-input v-model="query.registrationNo" clearable /></el-form-item>
      <el-form-item label="借款人名称"><el-input v-model="query.borrowerName" clearable /></el-form-item>
      <el-form-item><el-button type="primary"><Icon icon="ep:search" class="mr-4px" />查询</el-button><el-button @click="resetQuery">重置</el-button></el-form-item>
    </el-form>
    <div class="action-bar"><el-button type="primary" plain><Icon icon="ep:plus" class="mr-4px" />新增</el-button></div>
    <el-table :data="filteredRows" border highlight-current-row @row-click="current = $event">
      <el-table-column type="index" label="序号" width="66" align="center" />
      <el-table-column prop="registrationNo" label="登记编号" min-width="180" />
      <el-table-column prop="businessContractNo" label="业务合同编号" min-width="180" />
      <el-table-column prop="borrowerName" label="借款人名称" min-width="200" />
      <el-table-column prop="registrationType" label="登记类型" min-width="120" />
      <el-table-column prop="pledgedValueText" label="质押财产价值" min-width="150" align="right" />
      <el-table-column prop="expiryDate" label="登记到期日" min-width="130" />
      <el-table-column prop="source" label="待办来源" min-width="130" />
      <el-table-column prop="status" label="状态" min-width="110"><template #default="{ row }"><el-tag effect="light">{{ row.status }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="230" fixed="right" align="center">
        <template #default="{ row }"><el-button link type="primary" @click.stop="openDetail(row)">详情</el-button><el-button link type="danger" @click.stop="removeRow(row)">删除</el-button><el-button link type="primary" @click.stop="viewImages(row)">查看影像资料</el-button></template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({ name: 'MovablePropertyRegistration' })
interface RegistrationRow { id: number; registrationNo: string; businessContractNo: string; borrowerName: string; registrationType: string; pledgedValue: number; pledgedValueText: string; expiryDate: string; source: string; status: string; propertyDescription: string; changeContent: string }
const route = useRoute()
const router = useRouter()
const showDetail = computed(() => route.query.view === 'detail' && Boolean(route.query.id))
const activeSections = ref(['base', 'assets'])
const query = reactive({ registrationNo: '', borrowerName: '' })
const rows = ref<RegistrationRow[]>([
  { id: 1, registrationNo: 'MPR202608270001', businessContractNo: 'BCT202607010001', borrowerName: '阿姆特拉斯供应链有限公司', registrationType: '变更登记', pledgedValue: 5590000, pledgedValueText: '5,590,000.00', expiryDate: '2027-07-01', source: '债项资产入库', status: '待提交', propertyDescription: '钢材库存及其对应仓单', changeContent: '新增本次入库质物明细' },
  { id: 2, registrationNo: 'MPR202608260002', businessContractNo: 'BCT202606150008', borrowerName: '华东金属贸易有限公司', registrationType: '变更登记', pledgedValue: 3180000, pledgedValueText: '3,180,000.00', expiryDate: '2027-06-15', source: '债项资产出库', status: '复核中', propertyDescription: '有色金属库存', changeContent: '扣减本次出库质物明细' }
])
const filteredRows = computed(() => rows.value.filter((row) => (!query.registrationNo || row.registrationNo.includes(query.registrationNo)) && (!query.borrowerName || row.borrowerName.includes(query.borrowerName))))
const current = ref<RegistrationRow>()
const form = reactive({ businessContractNo: '', borrowerName: '', pledgedValue: 0, expiryDate: '', propertyDescription: '', changeContent: '' })
const assetRows = [{ productCode: 'SP010001', productName: '热轧卷板', category: '金属材料/钢材/标准品', quantity: '860 吨', value: '3,612,000.00' }, { productCode: 'SP010002', productName: '冷轧卷板', category: '金属材料/钢材/优等品', quantity: '520 吨', value: '1,978,000.00' }]
const applyCurrent = () => { const row = rows.value.find((item) => item.id === Number(route.query.id)); current.value = row; if (row) Object.assign(form, row) }
const openDetail = (row: RegistrationRow) => router.push({ path: route.path, query: { ...route.query, view: 'detail', id: row.id } })
const goBack = () => router.push({ path: route.path, query: Object.fromEntries(Object.entries(route.query).filter(([key]) => !['view', 'id'].includes(key))) })
const resetQuery = () => Object.assign(query, { registrationNo: '', borrowerName: '' })
const saveDetail = () => { if (!current.value) return; Object.assign(current.value, form, { pledgedValueText: Number(form.pledgedValue).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }); ElMessage.success('动产登记信息已保存') }
const generateList = () => ElMessage.success(`已生成“${form.borrowerName}质物明细${new Date().toISOString().slice(0, 10)}.pdf”（Mock）`)
const removeRow = async (row: RegistrationRow) => { try { await ElMessageBox.confirm(`确认删除登记待办“${row.registrationNo}”吗？`, '删除确认', { type: 'warning' }) } catch { return }; rows.value = rows.value.filter((item) => item.id !== row.id); ElMessage.success('删除成功') }
const viewImages = (row: RegistrationRow) => ElMessage.info(`正在查看“${row.registrationNo}”影像资料（Mock）`)
watch(() => route.query.id, applyCurrent, { immediate: true })
</script>

<style scoped lang="scss">
.registration-detail-page { min-height: 100%; padding: 12px 16px 20px; background: #f2f3f5; }
.detail-toolbar { display: flex; align-items: center; min-height: 52px; margin-bottom: 12px; padding: 8px 20px; background: #fff; color: #606266; gap: 24px; }
.system-detail-collapse { border: 0; background: transparent; }
:deep(.system-detail-collapse .el-collapse-item) { margin-bottom: 12px; }
:deep(.system-detail-collapse .el-collapse-item__header) { height: 52px; padding: 0 20px; border: 0; background: #fff; }
:deep(.system-detail-collapse .el-collapse-item__wrap) { border: 0; background: #fff; }
.collapse-title { font-size: 16px; font-weight: 600; }
.detail-form, .collapse-content { padding: 12px 20px 20px; }
.form-actions { padding-left: 150px; }
.action-bar { margin-bottom: 12px; }
</style>
