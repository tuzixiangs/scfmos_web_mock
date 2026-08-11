<template>
  <div class="offline-ledger-detail-page" v-loading="loading">
    <div class="detail-page-toolbar">
      <el-button @click="goBack"><Icon icon="ep:arrow-left" class="mr-4px" />返 回</el-button>
      <div v-if="detail" class="application-summary">
        <span>申请编号：{{ detail.applicationNo }}</span>
        <span>项目名称：{{ detail.projectName }}</span>
        <el-tag :type="statusTagType" effect="light">{{ detail.status }}</el-tag>
      </div>
    </div>

    <el-alert
      v-if="detail && readonly"
      :title="`当前申请处于“${detail.status}”节点，仅支持查看。`"
      type="info"
      :closable="false"
      class="readonly-alert"
    />
    <el-empty v-if="!loading && !detail" description="未获取到线下台账更新申请详情" />

    <el-collapse v-if="detail" v-model="activeSections" class="system-detail-collapse">
      <el-collapse-item name="application">
        <template #title><span class="collapse-title">申请基本信息</span></template>
        <div class="collapse-content">
          <el-form label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="申请编号"><el-input :model-value="detail.applicationNo" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="申请状态"><el-input :model-value="detail.status" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="申请日期"><el-input :model-value="detail.applicationDate || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="当前阶段"><el-input :model-value="detail.currentStage || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="完成时间"><el-input :model-value="detail.completedAt || '-'" disabled /></el-form-item></el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item name="project">
        <template #title><span class="collapse-title">项目及核心客户信息</span></template>
        <div class="collapse-content">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="项目名称" prop="projectName"><el-input v-model.trim="form.projectName" :disabled="readonly" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="项目编号" prop="projectNo"><el-input v-model.trim="form.projectNo" :disabled="readonly" /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="核心企业名称" prop="coreEnterpriseName"><el-input v-model.trim="form.coreEnterpriseName" :disabled="readonly" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="核心客户编号" prop="coreCustomerNo"><el-input v-model.trim="form.coreCustomerNo" :disabled="readonly" /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="产品方案" prop="productPlan"><el-select v-model="form.productPlan" class="w-full" :disabled="readonly"><el-option v-for="item in productPlans" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item name="ledger">
        <template #title><span class="collapse-title">线下台账更新信息</span></template>
        <div class="collapse-content">
          <el-form ref="ledgerFormRef" :model="form" :rules="rules" label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="监管方企业名称" prop="regulatorEnterpriseName"><el-input v-model.trim="form.regulatorEnterpriseName" :disabled="readonly" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="台账名称" prop="offlineLedgerName"><el-input v-model.trim="form.offlineLedgerName" :disabled="readonly" /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="台账代码" prop="offlineLedgerCode"><el-input v-model.trim="form.offlineLedgerCode" :disabled="readonly" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="台账类型" prop="offlineLedgerType"><el-select v-model="form.offlineLedgerType" class="w-full" :disabled="readonly"><el-option v-for="item in ledgerTypes" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="保险到期日"><el-date-picker v-model="form.insuranceExpiryDate" type="date" value-format="YYYY-MM-DD" class="w-full" :disabled="readonly" /></el-form-item></el-col>
            </el-row>
          </el-form>
          <div v-if="!readonly" class="section-actions">
            <el-button type="primary" :loading="saving" @click="saveDetail">保存更新信息</el-button>
            <span class="action-tip">待提交节点可继续补充或调整，提交后自动转为只读。</span>
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item name="process">
        <template #title><span class="collapse-title">审批意见及流转记录</span></template>
        <div class="collapse-content process-grid">
          <section class="process-panel">
            <h4>审批意见</h4>
            <el-timeline v-if="detail.opinions?.length" class="detail-timeline">
              <el-timeline-item v-for="opinion in detail.opinions" :key="opinion.id" :timestamp="`${opinion.signer} · ${opinion.signedAt}`" placement="top">
                {{ opinion.content }}
              </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无已签署意见" :image-size="72" />
          </section>
          <section class="process-panel">
            <h4>流转记录</h4>
            <el-timeline class="detail-timeline">
              <el-timeline-item :timestamp="detail.applicationDate" placement="top">已创建线下台账更新申请，进入“待提交”节点。</el-timeline-item>
              <el-timeline-item v-if="detail.phase !== 'pending'" :timestamp="detail.completedAt || '流程处理中'" type="primary" placement="top">{{ detail.currentStage || detail.status }}</el-timeline-item>
              <el-timeline-item v-if="detail.completedAt" :timestamp="detail.completedAt" :type="detail.phase === 'approved' ? 'success' : 'danger'" placement="top">{{ detail.phase === 'approved' ? '审批通过，流程完成。' : '审批结束。' }}</el-timeline-item>
            </el-timeline>
          </section>
        </div>
      </el-collapse-item>

      <el-collapse-item name="images">
        <template #title><span class="collapse-title">申请影像</span></template>
        <div class="collapse-content">
          <el-table :data="imageItems" border>
            <el-table-column prop="name" label="影像名称" min-width="220" />
            <el-table-column prop="description" label="影像说明" min-width="360" />
            <el-table-column label="操作" width="110" align="center"><template #default><el-button link type="primary" @click="previewImage"><Icon icon="ep:picture" class="mr-3px" />预览</el-button></template></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  getOfflineLedgerApplicationDetail,
  updateOfflineLedgerApplication,
  type OfflineLedgerApplicationCreateForm,
  type OfflineLedgerApplicationPhase,
  type OfflineLedgerApplicationRecord
} from '@/api/indebt/offlineLedgerUpdate'

defineOptions({ name: 'OfflineLedgerUpdateDetail' })

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const detail = ref<OfflineLedgerApplicationRecord>()
const formRef = ref<FormInstance>()
const ledgerFormRef = ref<FormInstance>()
const activeSections = ref(['application', 'project', 'ledger', 'process', 'images'])
const productPlans = ['单一客户综合授信', '存货质押融资', '经销商融资', '仓单质押融资', '农产品存货融资', '能源库存融资', '经销商存货融资']
const ledgerTypes = ['线下台账', '历史台账', '线下管理说明', '台账附件']
const form = reactive<OfflineLedgerApplicationCreateForm>({
  projectName: '', projectNo: '', coreEnterpriseName: '', coreCustomerNo: '', productPlan: '',
  regulatorEnterpriseName: '', offlineLedgerName: '', offlineLedgerCode: '', offlineLedgerType: '', insuranceExpiryDate: ''
})
const required = (message: string, trigger = 'blur') => ({ required: true, message, trigger })
const rules: FormRules<OfflineLedgerApplicationCreateForm> = {
  projectName: [required('请输入项目名称')], projectNo: [required('请输入项目编号')],
  coreEnterpriseName: [required('请输入核心企业名称')], coreCustomerNo: [required('请输入核心客户编号')],
  productPlan: [required('请选择产品方案', 'change')], regulatorEnterpriseName: [required('请输入监管方企业名称')],
  offlineLedgerName: [required('请输入台账名称')], offlineLedgerCode: [required('请输入台账代码')],
  offlineLedgerType: [required('请选择台账类型', 'change')]
}
const routePhase = computed<OfflineLedgerApplicationPhase>(() => {
  const value = String(route.query.phase || route.query.key || 'pending')
  return ['pending', 'reviewing', 'rejected', 'approved'].includes(value)
    ? (value as OfflineLedgerApplicationPhase)
    : 'pending'
})
const readonly = computed(() => (detail.value?.phase || routePhase.value) !== 'pending')
const statusTagType = computed(() => {
  if (detail.value?.phase === 'approved') return 'success'
  if (detail.value?.phase === 'rejected') return 'danger'
  if (detail.value?.phase === 'reviewing') return 'warning'
  return 'info'
})
const imageItems = computed(() => [
  { name: '台账现场照片', description: `${detail.value?.offlineLedgerName || '台账'}现场影像资料` },
  { name: '仓储保险凭证', description: `保险到期日：${detail.value?.insuranceExpiryDate || '待补充'}` },
  { name: '监管方合作材料', description: detail.value?.regulatorEnterpriseName || '监管方企业材料' }
])
const applyDetail = (record: OfflineLedgerApplicationRecord) => {
  detail.value = record
  Object.assign(form, {
    projectName: record.projectName, projectNo: record.projectNo,
    coreEnterpriseName: record.coreEnterpriseName, coreCustomerNo: record.coreCustomerNo,
    productPlan: record.productPlan, regulatorEnterpriseName: record.regulatorEnterpriseName,
    offlineLedgerName: record.offlineLedgerName, offlineLedgerCode: record.offlineLedgerCode,
    offlineLedgerType: record.offlineLedgerType, insuranceExpiryDate: record.insuranceExpiryDate
  })
}
const loadDetail = async () => {
  const id = Number(route.query.id)
  if (!Number.isFinite(id) || id <= 0) { detail.value = undefined; return }
  loading.value = true
  try { applyDetail(await getOfflineLedgerApplicationDetail(id)) }
  catch (error) { detail.value = undefined; ElMessage.error(error instanceof Error ? error.message : '获取详情失败') }
  finally { loading.value = false }
}
const saveDetail = async () => {
  if (!detail.value || readonly.value) return
  const validations = await Promise.all(
    [formRef.value, ledgerFormRef.value].map((instance) =>
      instance?.validate().then(() => true).catch(() => false)
    )
  )
  if (validations.some((valid) => !valid)) return
  saving.value = true
  try {
    const result = await updateOfflineLedgerApplication(detail.value.id, { ...form })
    if (!result.success || !result.record) throw new Error(result.message || '保存失败')
    applyDetail(result.record)
    ElMessage.success('线下台账更新信息已保存')
  } catch (error) { ElMessage.error(error instanceof Error ? error.message : '保存失败') }
  finally { saving.value = false }
}
const previewImage = () => ElMessage.info('当前为 Mock 演示影像，可在此接入实际影像系统')
const goBack = () => {
  const query = Object.fromEntries(Object.entries(route.query).filter(([key]) => !['view', 'id', 'phase'].includes(key)))
  router.push({ path: route.path, query })
}
watch(() => route.query.id, loadDetail, { immediate: true })
</script>

<style scoped lang="scss">
.offline-ledger-detail-page { min-width: 0; min-height: 100%; padding: 12px 16px 20px; background: #f2f3f5; }
.detail-page-toolbar { display: flex; align-items: center; min-height: 52px; margin-bottom: 12px; padding: 8px 20px; background: #fff; gap: 24px; }
.application-summary { display: flex; align-items: center; color: #606266; font-size: 13px; gap: 28px; }
.readonly-alert { margin-bottom: 12px; }
.system-detail-collapse { border: 0; background: transparent; }
:deep(.system-detail-collapse .el-collapse-item) { margin-bottom: 12px; }
:deep(.system-detail-collapse .el-collapse-item__header) { height: 52px; padding: 0 20px; border-bottom: 0; background: #fff; color: #303133; }
:deep(.system-detail-collapse .el-collapse-item__wrap) { border-bottom: 0; background: #fff; }
:deep(.system-detail-collapse .el-collapse-item__content) { padding-bottom: 0; color: #606266; }
.collapse-title { font-size: 16px; font-weight: 600; }
.collapse-content { min-width: 0; padding: 4px 20px 20px; }
.detail-form { padding: 4px 20px 0; }
.detail-form :deep(.el-form-item) { margin-bottom: 14px; }
.detail-form :deep(.el-form-item__label) { color: #606266; font-weight: 400; }
.detail-form :deep(.el-input.is-disabled .el-input__wrapper) { background: #f5f7fa; }
.section-actions { display: flex; align-items: center; padding: 4px 20px 0 160px; gap: 12px; }
.action-tip { color: #909399; font-size: 12px; }
.process-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.process-panel { min-height: 210px; padding: 14px 18px; border: 1px solid #ebeef5; }
.process-panel h4 { margin: 0 0 18px; color: #303133; font-size: 14px; }
.detail-timeline { padding: 4px 8px 0; }
@media (max-width: 900px) {
  .detail-page-toolbar, .application-summary { flex-wrap: wrap; }
  .process-grid { grid-template-columns: 1fr; }
  :deep(.detail-form .el-col-12) { max-width: 100%; flex: 0 0 100%; }
}
</style>
