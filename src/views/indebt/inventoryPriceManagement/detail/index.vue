<template>
  <div class="price-detail-page" v-loading="loading">
    <div class="detail-page-toolbar"><el-button @click="goBack"><Icon icon="ep:arrow-left" class="mr-4px" />返 回</el-button><div v-if="detail" class="application-summary"><span>申请编号：{{ detail.applicationNo }}</span><span>项目名称：{{ detail.projectName }}</span><el-tag :type="statusTagType" effect="light">{{ detail.status }}</el-tag></div></div>
    <el-alert v-if="detail && !canEdit" :title="`当前申请处于“${detail.status}”节点，盯市信息仅支持查看。`" type="info" :closable="false" class="readonly-alert" />
    <el-empty v-if="!loading && !detail" description="未获取到价格盯市申请详情" />
    <el-collapse v-if="detail" v-model="activeSections" class="system-detail-collapse">
      <el-collapse-item name="application"><template #title><span class="collapse-title">申请及项目信息</span></template><div class="collapse-content"><el-form label-width="140px" label-position="left" size="small" class="detail-form">
        <el-row :gutter="48"><el-col :span="12"><el-form-item label="申请编号"><el-input :model-value="detail.applicationNo" disabled /></el-form-item></el-col><el-col :span="12"><el-form-item label="申请日期"><el-input :model-value="detail.applicationDate" disabled /></el-form-item></el-col></el-row>
        <el-row :gutter="48"><el-col :span="12"><el-form-item label="项目名称"><el-input :model-value="detail.projectName" disabled /></el-form-item></el-col><el-col :span="12"><el-form-item label="项目编号"><el-input :model-value="detail.projectNo" disabled /></el-form-item></el-col></el-row>
        <el-row :gutter="48"><el-col :span="12"><el-form-item label="产品方案"><el-input :model-value="detail.productScheme || '-'" disabled /></el-form-item></el-col><el-col :span="12"><el-form-item label="核心企业名称"><el-input :model-value="detail.coreEnterpriseName" disabled /></el-form-item></el-col></el-row>
        <el-row :gutter="48"><el-col :span="12"><el-form-item label="核心客户编号"><el-input :model-value="detail.coreCustomerNo" disabled /></el-form-item></el-col><el-col :span="12"><el-form-item label="当前阶段"><el-input :model-value="detail.currentStage || '-'" disabled /></el-form-item></el-col></el-row>
        <el-row :gutter="48"><el-col :span="12"><el-form-item label="完成时间"><el-input :model-value="detail.completedAt || '-'" disabled /></el-form-item></el-col></el-row>
      </el-form></div></el-collapse-item>
      <el-collapse-item name="prices"><template #title><span class="collapse-title">盯市详情单价维护</span></template><div class="collapse-content">
        <div class="section-toolbar"><span>展示当前项目及产品方案下全部入库商品；预警线按价格波动规则自动计算。</span><div v-if="canEdit"><el-button type="primary" :loading="saving" @click="saveItems">保存</el-button><el-button @click="mockExcel('上传 Excel')">上传 Excel</el-button><el-button @click="mockExcel('导出模板')">导出模板</el-button></div></div>
        <el-table :data="detail.items" border><el-table-column prop="largeCategory" label="商品大类" min-width="130" /><el-table-column prop="middleCategory" label="商品中类" min-width="130" /><el-table-column prop="smallCategory" label="商品小类" min-width="130" /><el-table-column prop="origin" label="产地" min-width="150" />
          <el-table-column label="入库单价" min-width="120" align="right"><template #default="{ row }">{{ formatAmount(row.inboundUnitPrice) }}</template></el-table-column><el-table-column label="最新单价" min-width="120" align="right"><template #default="{ row }">{{ formatAmount(row.latestUnitPrice) }}</template></el-table-column>
          <el-table-column label="本次盯市单价" min-width="155" align="right"><template #default="{ row }"><el-input-number v-if="canEdit" v-model="row.monitoringUnitPrice" :min="0" :precision="2" :controls="false" class="price-input" /><span v-else>{{ formatAmount(row.monitoringUnitPrice) }}</span></template></el-table-column>
          <el-table-column label="盯市来源" min-width="150"><template #default="{ row }"><el-select v-if="canEdit" v-model="row.monitoringSource"><el-option v-for="item in sources" :key="item" :label="item" :value="item" /></el-select><span v-else>{{ row.monitoringSource || '-' }}</span></template></el-table-column>
          <el-table-column label="盯市预警线" min-width="125" align="right"><template #default="{ row }">{{ formatAmount(warningLine(row)) }}</template></el-table-column><el-table-column label="预警状态" width="110" fixed="right"><template #default="{ row }"><el-tag :type="isWarning(row) ? 'danger' : 'success'" effect="light">{{ isWarning(row) ? '低于预警线' : '正常' }}</el-tag></template></el-table-column>
        </el-table>
      </div></el-collapse-item>
      <el-collapse-item name="process"><template #title><span class="collapse-title">审批意见及申请影像</span></template><div class="collapse-content process-grid"><section class="process-panel"><h4>审批意见</h4><el-timeline v-if="detail.opinions.length"><el-timeline-item v-for="item in detail.opinions" :key="item.id" :timestamp="`${item.signer} · ${item.signedAt}`" placement="top">{{ item.content }}</el-timeline-item></el-timeline><el-empty v-else description="暂无已签署意见" :image-size="72" /></section><section class="process-panel"><h4>申请影像</h4><el-table :data="detail.images" border><el-table-column prop="name" label="文件名称" min-width="180" /><el-table-column prop="uploader" label="上传人" width="100" /><el-table-column prop="uploadedAt" label="上传时间" min-width="150" /></el-table><el-empty v-if="!detail.images.length" description="暂无申请影像" :image-size="72" /></section></div></el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getInventoryPriceApplicationDetail, updateInventoryPriceApplication, type InventoryPriceApplicationDetail, type InventoryPriceItem } from '@/api/indebt/inventoryPriceManagement'

defineOptions({ name: 'InventoryPriceDetail' })
const route = useRoute(); const router = useRouter(); const loading = ref(false); const saving = ref(false)
const detail = ref<InventoryPriceApplicationDetail>(); const activeSections = ref(['application', 'prices', 'process'])
const sources = ['行业报价', '交易平台', '现场核验', '第三方资讯']
const canEdit = computed(() => detail.value?.phase === 'pending')
const statusTagType = computed(() => detail.value?.phase === 'approved' ? 'success' : detail.value?.phase === 'rejected' ? 'danger' : detail.value?.phase === 'reviewing' ? 'warning' : 'info')
const formatAmount = (value: unknown) => Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const warningLine = (item: InventoryPriceItem) => Number(item.warningLine || item.latestUnitPrice * (1 - Number(item.warningRate || 0)))
const isWarning = (item: InventoryPriceItem) => Number(item.monitoringUnitPrice) < warningLine(item)
const loadDetail = async () => { const id = Number(route.query.id); if (!Number.isFinite(id) || id <= 0) { detail.value = undefined; return }; loading.value = true; try { detail.value = await getInventoryPriceApplicationDetail(id) } catch (error) { detail.value = undefined; ElMessage.error(error instanceof Error ? error.message : '获取详情失败') } finally { loading.value = false } }
const saveItems = async () => { if (!detail.value || !canEdit.value) return; const invalid = detail.value.items.find((item) => Number(item.monitoringUnitPrice) <= 0 || !item.monitoringSource); if (invalid) return ElMessage.warning(`请完善“${invalid.smallCategory}”的盯市单价和来源`); saving.value = true; try { const result = await updateInventoryPriceApplication(detail.value.id, { items: detail.value.items.map((item) => ({ id: item.id, monitoringUnitPrice: item.monitoringUnitPrice, monitoringSource: item.monitoringSource })) }); if (!result.success || !result.record) throw new Error(result.message || '保存失败'); detail.value = result.record; ElMessage.success('盯市详情已保存') } catch (error) { ElMessage.error(error instanceof Error ? error.message : '保存失败') } finally { saving.value = false } }
const mockExcel = (action: string) => ElMessage.info(`${action}已按当前项目及产品方案下的入库商品处理（Mock）`)
const goBack = () => { const query = Object.fromEntries(Object.entries(route.query).filter(([key]) => !['view', 'id', 'phase'].includes(key))); router.push({ path: route.path, query }) }
watch(() => route.query.id, loadDetail, { immediate: true })
</script>

<style scoped lang="scss">
.price-detail-page { min-width: 0; min-height: 100%; padding: 12px 16px 20px; background: #f2f3f5; }.detail-page-toolbar { display: flex; align-items: center; min-height: 52px; margin-bottom: 12px; padding: 8px 20px; background: #fff; gap: 24px; }.application-summary { display: flex; align-items: center; color: #606266; font-size: 13px; gap: 28px; }.readonly-alert { margin-bottom: 12px; }.system-detail-collapse { border: 0; background: transparent; }:deep(.system-detail-collapse .el-collapse-item) { margin-bottom: 12px; }:deep(.system-detail-collapse .el-collapse-item__header) { height: 52px; padding: 0 20px; border: 0; background: #fff; color: #303133; }:deep(.system-detail-collapse .el-collapse-item__wrap) { border: 0; background: #fff; }:deep(.system-detail-collapse .el-collapse-item__content) { padding-bottom: 0; color: #606266; }.collapse-title { font-size: 16px; font-weight: 600; }.collapse-content { min-width: 0; padding: 4px 20px 20px; }.detail-form { padding: 4px 20px 0; }.detail-form :deep(.el-form-item) { margin-bottom: 14px; }.detail-form :deep(.el-input.is-disabled .el-input__wrapper) { background: #f5f7fa; }.section-toolbar { display: flex; align-items: center; justify-content: space-between; min-height: 36px; margin-bottom: 10px; color: #909399; font-size: 13px; gap: 20px; }.price-input { width: 130px; }.process-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }.process-panel { min-height: 230px; padding: 14px 18px; border: 1px solid #ebeef5; }.process-panel h4 { margin: 0 0 18px; color: #303133; font-size: 14px; }@media (max-width: 900px) { .detail-page-toolbar, .application-summary, .section-toolbar { flex-wrap: wrap; }.process-grid { grid-template-columns: 1fr; }:deep(.detail-form .el-col-12) { max-width: 100%; flex: 0 0 100%; } }
</style>
