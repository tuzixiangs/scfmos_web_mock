<template>
  <div class="asset-confirmation-detail-page" v-loading="loading">
    <div class="detail-page-toolbar">
      <el-button @click="goBack"><Icon icon="ep:arrow-left" class="mr-4px" />返 回</el-button>
      <div v-if="detail" class="application-summary">
        <span>申请编号：{{ detail.applicationNo }}</span>
        <span>项目名称：{{ detail.projectName }}</span>
        <el-tag :type="statusTagType" effect="light">{{ detail.status }}</el-tag>
      </div>
    </div>
    <el-alert v-if="detail && !canEdit" :title="`当前申请处于“${detail.status}”节点，仅支持查看。`" type="info" :closable="false" class="readonly-alert" />
    <el-empty v-if="!loading && !detail" :description="`未获取到债项资产${businessText}申请详情`" />

    <el-collapse v-if="detail" v-model="activeSections" class="system-detail-collapse">
      <el-collapse-item name="application">
        <template #title><span class="collapse-title">申请及项目信息</span></template>
        <div class="collapse-content">
          <el-form label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="申请编号"><el-input :model-value="detail.applicationNo" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="申请日期"><el-input :model-value="detail.applicationDate || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="项目名称"><el-input :model-value="detail.projectName || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="项目编号"><el-input :model-value="detail.projectNo || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="客户名称"><el-input :model-value="detail.customerName || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="核心客户编号"><el-input :model-value="detail.coreCustomerNo || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="链属客户名称"><el-input :model-value="detail.linkedCustomerName || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="授信编号"><el-input :model-value="detail.creditNo || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="产品方案"><el-input :model-value="detail.productPlan || detail.productScheme || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="当前阶段"><el-input :model-value="detail.currentStage || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row v-if="props.mode === 'outbound'" :gutter="48">
              <el-col :span="12"><el-form-item label="经办人姓名"><el-input :model-value="detail.handlerName || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="身份证号码"><el-input :model-value="detail.handlerIdCard || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row v-if="props.mode === 'outbound' && detail.repaymentLoanNos?.length" :gutter="48">
              <el-col :span="24"><el-form-item label="提前还款借据"><el-input :model-value="detail.repaymentLoanNos.join('、')" type="textarea" :rows="2" disabled /></el-form-item></el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item name="contract">
        <template #title><span class="collapse-title">业务合同基本信息</span></template>
        <div class="collapse-content">
          <el-form label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="关联业务合同编号"><el-input :model-value="detail.businessContractNo || detail.relatedBusinessContractNo || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="业务合同金额"><el-input :model-value="formatAmount(detail.businessContractAmount ?? detail.contractAmount)" disabled><template #append>{{ detail.currency }}</template></el-input></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="合同起始日"><el-input :model-value="detail.contractStartDate || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="合同到期日"><el-input :model-value="detail.contractEndDate || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="出账金额"><el-input :model-value="formatAmount(detail.outboundAmount ?? detail.disbursementAmount)" disabled><template #append>{{ detail.currency }}</template></el-input></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="出账日期"><el-input :model-value="detail.billingDate || detail.disbursementDate || '-'" disabled /></el-form-item></el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>

      <el-collapse-item name="confirmation">
        <template #title><span class="collapse-title">{{ businessText }}确认信息</span></template>
        <div class="collapse-content">
          <el-form v-if="props.mode === 'arrival'" label-width="140px" label-position="left" size="small" class="detail-form">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="到港截止日期"><el-input :model-value="detail.arrivalDeadline || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="实际到港日期"><el-input :model-value="detail.arrivalDate || detail.inboundDate || detail.completedAt || '-'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="生成日期"><el-input :model-value="detail.applicationDate || '-'" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="更新人"><el-input :model-value="detail.updatedBy || '本地演示用户'" disabled /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48"><el-col :span="24"><el-form-item label="确认说明"><el-input :model-value="detail.confirmationRemark || '提交确认后，关联债项资产状态更新为“已到港”。'" type="textarea" :rows="3" disabled /></el-form-item></el-col></el-row>
          </el-form>
          <el-form v-else ref="formRef" :model="form" :rules="rules" label-width="140px" label-position="left" size="small" class="detail-form" :disabled="!canEdit">
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item :label="`${businessText}类型`" prop="confirmationType"><el-select v-model="form.confirmationType" class="w-full"><el-option :label="`部分${businessText}`" :value="`部分${businessText}`" /><el-option :label="`已完成${businessText}`" :value="`已完成${businessText}`" /></el-select></el-form-item></el-col>
              <el-col :span="12"><el-form-item :label="`${businessText}货值`" prop="confirmationValue"><el-input-number v-model="form.confirmationValue" class="w-full" :min="0" :precision="2" :controls="false" /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="12"><el-form-item label="币种"><el-input v-model="form.currency" disabled /></el-form-item></el-col>
              <el-col :span="12"><el-form-item :label="`${businessText}截止日期`" prop="deadline"><el-date-picker v-model="form.deadline" type="date" value-format="YYYY-MM-DD" class="w-full" /></el-form-item></el-col>
            </el-row>
            <el-row :gutter="48"><el-col :span="24"><el-form-item label="确认说明"><el-input v-model="form.remark" type="textarea" :rows="3" maxlength="300" show-word-limit /></el-form-item></el-col></el-row>
          </el-form>
          <div v-if="canEdit" class="section-actions"><el-button type="primary" :loading="saving" @click="saveConfirmation">保存{{ businessText }}确认信息</el-button><span class="action-tip">提交后将进入审查审批流程并转为只读。</span></div>
        </div>
      </el-collapse-item>

      <el-collapse-item v-if="props.mode === 'outbound'" name="documents">
        <template #title><span class="collapse-title">提货申请书/还款凭证</span></template>
        <div class="collapse-content">
          <el-alert
            title="支持 PDF、PNG、JPG、JPEG 格式，单次最多 5 个文件。"
            type="info"
            :closable="false"
            class="mb-14px"
          />
          <el-table v-if="detail.images?.length" :data="detail.images" border size="small">
            <el-table-column type="index" label="序号" width="66" align="center" />
            <el-table-column prop="name" label="文件名称" min-width="260" />
            <el-table-column prop="uploader" label="上传人" min-width="120" />
            <el-table-column prop="uploadedAt" label="上传时间" min-width="170" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
                <el-button link type="primary" @click="ElMessage.info(`正在查看“${row.name}”（Mock）`)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无已上传的提货申请书或还款凭证" :image-size="72" />
        </div>
      </el-collapse-item>

      <el-collapse-item name="process">
        <template #title><span class="collapse-title">审批意见及流转记录</span></template>
        <div class="collapse-content process-grid">
          <section class="process-panel"><h4>审批意见</h4><el-timeline v-if="detail.opinions?.length"><el-timeline-item v-for="item in detail.opinions" :key="item.id" :timestamp="`${item.signer} · ${item.signedAt}`" placement="top">{{ item.content }}</el-timeline-item></el-timeline><el-empty v-else description="暂无已签署意见" :image-size="72" /></section>
          <section class="process-panel"><h4>流转记录</h4><el-timeline v-if="detail.flowRecords?.length"><el-timeline-item v-for="item in detail.flowRecords" :key="item.id" :timestamp="`${item.operator} · ${item.operatedAt}`" placement="top">{{ item.node }}：{{ item.action }}<span v-if="item.comment">（{{ item.comment }}）</span></el-timeline-item></el-timeline><el-empty v-else description="暂无流转记录" :image-size="72" /></section>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import * as ArrivalApi from '@/api/indebt/assetArrivalManagement'
import * as OutboundApi from '@/api/indebt/assetOutboundManagement'

interface DetailOpinion { id: number; content: string; signer: string; signedAt: string }
interface DetailFlow { id: number; node: string; action: string; operator: string; operatedAt: string; comment?: string }
interface DetailImage { id: number; name: string; url: string; uploadedAt: string; uploader: string }
interface AssetConfirmationRecord {
  id: number; applicationNo: string; applicationDate: string; projectName: string; projectNo: string;
  customerName: string; coreCustomerNo: string; linkedCustomerName?: string; creditNo: string;
  productPlan?: string; productScheme?: string; currentStage?: string; status: string; phase: string;
  businessContractNo?: string; relatedBusinessContractNo: string; businessContractAmount?: number;
  contractAmount: number; currency: string; contractStartDate?: string; contractEndDate?: string;
  outboundAmount?: number; disbursementAmount: number; billingDate?: string; disbursementDate: string;
  arrivalDeadline: string; inboundType?: string; outboundType?: string; inboundValue?: number;
  inboundGoodsValue?: number; outboundValue?: number; outboundGoodsValue?: number; confirmationRemark?: string;
  arrivalDate?: string; inboundDate?: string; updatedBy?: string;
  completedAt?: string;
  handlerName?: string; handlerIdCard?: string; repaymentLoanNos?: string[]; images?: DetailImage[];
  opinions?: DetailOpinion[]; flowRecords?: DetailFlow[]
}

const props = defineProps<{ mode: 'arrival' | 'outbound' }>()
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const detail = ref<AssetConfirmationRecord>()
const formRef = ref<FormInstance>()
const activeSections = ref(['application', 'contract', 'confirmation', 'documents', 'process'])
const businessText = computed(() => props.mode === 'arrival' ? '到港' : '出库')
const canEdit = computed(() => props.mode === 'outbound' && detail.value?.phase === 'pending')
const statusTagType = computed(() => detail.value?.phase === 'approved' ? 'success' : detail.value?.phase === 'reviewing' ? 'warning' : detail.value?.phase === 'rejected' ? 'danger' : 'info')
const form = reactive({ confirmationType: '', confirmationValue: 0, currency: '人民币', deadline: '', remark: '' })
const rules: FormRules = {
  confirmationType: [{ required: true, message: '请选择确认类型', trigger: 'change' }],
  confirmationValue: [{ required: true, message: '请输入确认货值', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
}
const formatAmount = (value: unknown) => Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const applyDetail = (record: AssetConfirmationRecord) => {
  detail.value = record
  Object.assign(form, {
    confirmationType: props.mode === 'arrival' ? record.inboundType : record.outboundType,
    confirmationValue: props.mode === 'arrival' ? (record.inboundValue ?? record.inboundGoodsValue) : (record.outboundValue ?? record.outboundGoodsValue),
    currency: record.currency || '人民币', deadline: record.arrivalDeadline, remark: record.confirmationRemark || ''
  })
}
const loadDetail = async () => {
  const id = Number(route.query.id)
  if (!Number.isFinite(id) || id <= 0) { detail.value = undefined; return }
  loading.value = true
  try {
    const record = props.mode === 'arrival' ? await ArrivalApi.getAssetArrivalApplicationDetail(id) : await OutboundApi.getAssetOutboundManagementApplicationDetail(id)
    applyDetail(record as unknown as AssetConfirmationRecord)
  } catch (error) { detail.value = undefined; ElMessage.error(error instanceof Error ? error.message : '获取详情失败') }
  finally { loading.value = false }
}
const saveConfirmation = async () => {
  if (!detail.value || !canEdit.value) return
  const valid = await formRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return
  if (form.confirmationValue <= 0) return ElMessage.warning(`${businessText.value}货值必须大于0`)
  saving.value = true
  try {
    const result = props.mode === 'arrival'
      ? await ArrivalApi.updateAssetArrivalConfirmation(detail.value.id, { inboundType: form.confirmationType as ArrivalApi.AssetArrivalInboundType, inboundValue: form.confirmationValue, arrivalDeadline: form.deadline, confirmationRemark: form.remark })
      : await OutboundApi.updateAssetOutboundManagementConfirmation(detail.value.id, { outboundType: form.confirmationType as OutboundApi.AssetOutboundManagementOutboundType, outboundValue: form.confirmationValue, arrivalDeadline: form.deadline, confirmationRemark: form.remark })
    if (!result.success || !result.record) throw new Error(result.message || '保存失败')
    applyDetail(result.record as unknown as AssetConfirmationRecord)
    ElMessage.success(`${businessText.value}确认信息已保存`)
  } catch (error) { ElMessage.error(error instanceof Error ? error.message : '保存失败') }
  finally { saving.value = false }
}
const goBack = () => {
  const query = Object.fromEntries(Object.entries(route.query).filter(([key]) => !['view', 'id', 'phase'].includes(key)))
  router.push({ path: route.path, query })
}
watch(() => route.query.id, loadDetail, { immediate: true })
</script>

<style scoped lang="scss">
.asset-confirmation-detail-page { min-width: 0; min-height: 100%; padding: 12px 16px 20px; background: #f2f3f5; }
.detail-page-toolbar { display: flex; align-items: center; min-height: 52px; margin-bottom: 12px; padding: 8px 20px; background: #fff; gap: 24px; }
.application-summary { display: flex; align-items: center; color: #606266; font-size: 13px; gap: 28px; }
.readonly-alert { margin-bottom: 12px; }
.system-detail-collapse { border: 0; background: transparent; }
:deep(.system-detail-collapse .el-collapse-item) { margin-bottom: 12px; }
:deep(.system-detail-collapse .el-collapse-item__header) { height: 52px; padding: 0 20px; border: 0; background: #fff; color: #303133; }
:deep(.system-detail-collapse .el-collapse-item__wrap) { border: 0; background: #fff; }
:deep(.system-detail-collapse .el-collapse-item__content) { padding-bottom: 0; color: #606266; }
.collapse-title { font-size: 16px; font-weight: 600; }
.collapse-content { min-width: 0; padding: 4px 20px 20px; }
.detail-form { padding: 4px 20px 0; }
.detail-form :deep(.el-form-item) { margin-bottom: 14px; }
.detail-form :deep(.el-input.is-disabled .el-input__wrapper) { background: #f5f7fa; }
.section-actions { display: flex; align-items: center; padding: 4px 20px 0 160px; gap: 12px; }
.action-tip { color: #909399; font-size: 12px; }
.process-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.process-panel { min-height: 210px; padding: 14px 18px; border: 1px solid #ebeef5; }
.process-panel h4 { margin: 0 0 18px; color: #303133; font-size: 14px; }
@media (max-width: 900px) { .detail-page-toolbar, .application-summary { flex-wrap: wrap; } .process-grid { grid-template-columns: 1fr; } :deep(.detail-form .el-col-12) { max-width: 100%; flex: 0 0 100%; } }
</style>
