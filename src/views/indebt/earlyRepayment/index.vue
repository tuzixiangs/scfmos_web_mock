<template>
  <div v-if="showDetail" class="repayment-detail-page">
    <div class="detail-toolbar"><el-button @click="goBack"><Icon icon="ep:arrow-left" class="mr-4px" />返 回</el-button><span>申请编号：{{ current?.applicationNo }}</span><el-tag :type="current?.phase === 'approved' ? 'success' : 'warning'">{{ current?.status }}</el-tag></div>
    <el-collapse v-model="activeSections" class="system-detail-collapse">
      <el-collapse-item name="base"><template #title><span class="collapse-title">提前还款申请信息</span></template><el-form label-width="140px" class="detail-form"><el-row :gutter="48"><el-col v-for="item in detailFields" :key="item.label" :span="12"><el-form-item :label="item.label"><el-input :model-value="item.value" disabled /></el-form-item></el-col></el-row></el-form></el-collapse-item>
      <el-collapse-item name="process"><template #title><span class="collapse-title">审批意见及流转记录</span></template><div class="process-content"><el-timeline><el-timeline-item timestamp="2026-08-27 09:20:00">客户通过企业网银发起提前还款申请</el-timeline-item><el-timeline-item v-if="current?.phase !== 'pending'" timestamp="2026-08-27 10:15:00">客户经理提交至经营单位负责人</el-timeline-item></el-timeline></div></el-collapse-item>
    </el-collapse>
  </div>
  <ContentWrap v-else>
    <el-alert
      title="仅“提前还款申请控制”配置为“存货类”的项目可通过企业网银发起；同一借据只能有一笔提前还款申请。"
      type="info"
      :closable="false"
      show-icon
      class="mb-12px"
    />
    <el-tabs v-model="activePhase"><el-tab-pane v-for="item in phaseOptions" :key="item.value" :label="item.label" :name="item.value" /></el-tabs>
    <el-form :inline="true" :model="query"><el-form-item label="申请编号"><el-input v-model="query.applicationNo" clearable /></el-form-item><el-form-item label="客户名称"><el-input v-model="query.customerName" clearable /></el-form-item><el-form-item label="核心客户编号"><el-input v-model="query.coreCustomerNo" clearable /></el-form-item><el-form-item><el-button type="primary">查询</el-button><el-button @click="resetQuery">重置</el-button></el-form-item></el-form>
    <div class="action-bar"><el-button type="primary" plain @click="openDetail(selected || filteredRows[0])">详情</el-button><el-button v-if="activePhase === 'pending'" plain @click="signOpinion">签署意见</el-button><el-button v-if="activePhase === 'pending'" plain @click="submit">提交</el-button><el-button v-if="activePhase === 'pending'" type="danger" plain @click="reject">否决</el-button><el-button plain @click="viewImage">查看影像</el-button></div>
    <el-table :data="filteredRows" border highlight-current-row @row-click="selected = $event"><el-table-column type="index" label="序号" width="66" /><el-table-column prop="applicationNo" label="申请编号" min-width="175" /><el-table-column prop="loanNo" label="借据号" min-width="170" /><el-table-column prop="customerName" label="客户名称" min-width="190" /><el-table-column prop="businessType" label="业务品种" min-width="140" /><el-table-column prop="currency" label="币种" width="90" /><el-table-column prop="repaymentAmountText" label="还款金额" min-width="140" align="right" /><el-table-column prop="principalText" label="归还本金" min-width="140" align="right" /><el-table-column prop="interestText" label="归还利息" min-width="120" align="right" /><el-table-column prop="repaymentDate" label="还款日期" min-width="130" /><el-table-column prop="applicationChannel" label="申请渠道" min-width="120" /><el-table-column prop="currentStage" label="当前阶段" min-width="160" /></el-table>
  </ContentWrap>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'InventoryEarlyRepayment' })
interface RepaymentRow { id: number; applicationNo: string; loanNo: string; customerName: string; coreCustomerNo: string; coreEnterpriseName: string; businessType: string; repaymentControl: string; currency: string; repaymentAmountText: string; principalText: string; interestText: string; repaymentDate: string; applicationDate: string; applicationChannel: string; currentStage: string; phase: string; status: string }
const route = useRoute(); const router = useRouter()
const isApproval = computed(() => route.path.includes('InventoryPreReturnApproval'))
const phaseOptions = computed(() => isApproval.value ? [{ label: '当前工作', value: 'reviewing' }, { label: '已完成工作', value: 'approved' }] : [{ label: '待处理的提前还款申请', value: 'pending' }, { label: '审查审批中的提前还款申请', value: 'reviewing' }, { label: '被否决的提前还款申请', value: 'rejected' }, { label: '审批通过的提前还款申请', value: 'approved' }])
const activePhase = ref(isApproval.value ? 'reviewing' : 'pending')
watch(isApproval, (value) => { activePhase.value = value ? 'reviewing' : 'pending' })
const query = reactive({ applicationNo: '', customerName: '', coreCustomerNo: '' })
const rows = ref<RepaymentRow[]>([
  { id: 1, applicationNo: 'ERA202608270001', loanNo: 'DK202607010008', customerName: '阿姆特拉斯供应链有限公司', coreCustomerNo: 'C2025040300000003', coreEnterpriseName: '宁波钢铁贸易有限公司', businessType: '货押融资', repaymentControl: '存货类', currency: '人民币', repaymentAmountText: '1,200,000.00', principalText: '1,180,000.00', interestText: '20,000.00', repaymentDate: '2026-08-29', applicationDate: '2026-08-27', applicationChannel: '企业网银', currentStage: '客户经理确认', phase: 'pending', status: '待处理' },
  { id: 2, applicationNo: 'ERA202608260002', loanNo: 'DK202606150012', customerName: '华东金属贸易有限公司', coreCustomerNo: 'C2025050600000012', coreEnterpriseName: '华东钢铁集团有限公司', businessType: '先票/款后货', repaymentControl: '存货类', currency: '人民币', repaymentAmountText: '860,000.00', principalText: '850,000.00', interestText: '10,000.00', repaymentDate: '2026-08-28', applicationDate: '2026-08-26', applicationChannel: '企业网银', currentStage: '经营单位负责人', phase: 'reviewing', status: '审查审批中' },
  { id: 3, applicationNo: 'ERA202608200003', loanNo: 'DK202605200006', customerName: '丰禾农业发展有限公司', coreCustomerNo: 'C2025042800000021', coreEnterpriseName: '丰禾农业集团有限公司', businessType: '货押融资', repaymentControl: '存货类', currency: '人民币', repaymentAmountText: '700,000.00', principalText: '690,000.00', interestText: '10,000.00', repaymentDate: '2026-08-22', applicationDate: '2026-08-20', applicationChannel: '企业网银', currentStage: '审批完成', phase: 'approved', status: '审批通过' }
])
const filteredRows = computed(() => rows.value.filter((row) => row.phase === activePhase.value && (!query.applicationNo || row.applicationNo.includes(query.applicationNo)) && (!query.customerName || row.customerName.includes(query.customerName)) && (!query.coreCustomerNo || row.coreCustomerNo.includes(query.coreCustomerNo))))
const selected = ref<RepaymentRow>(); const current = computed(() => rows.value.find((row) => row.id === Number(route.query.id))); const showDetail = computed(() => route.query.view === 'detail' && Boolean(current.value)); const activeSections = ref(['base', 'process'])
const detailFields = computed(() => { const row = current.value; return row ? [{ label: '借据号', value: row.loanNo }, { label: '客户名称', value: row.customerName }, { label: '核心企业名称', value: row.coreEnterpriseName }, { label: '业务品种', value: row.businessType }, { label: '提前还款申请控制', value: row.repaymentControl }, { label: '还款金额', value: `${row.repaymentAmountText} ${row.currency}` }, { label: '归还本金', value: row.principalText }, { label: '归还利息', value: row.interestText }, { label: '还款日期', value: row.repaymentDate }, { label: '申请日期', value: row.applicationDate }, { label: '申请渠道', value: row.applicationChannel }, { label: '当前阶段', value: row.currentStage }] : [] })
const openDetail = (row?: RepaymentRow) => { if (!row) return ElMessage.warning('暂无可查看的数据'); router.push({ path: route.path, query: { ...route.query, view: 'detail', id: row.id } }) }
const goBack = () => router.push({ path: route.path })
const resetQuery = () => Object.assign(query, { applicationNo: '', customerName: '', coreCustomerNo: '' })
const signOpinion = () => ElMessage.success('审批意见已保存（Mock）')
const viewImage = () => ElMessage.info('正在查看还款凭证影像（Mock）')
const submit = () => { if (!selected.value) return ElMessage.warning('请先选择一条申请'); if (selected.value.applicationChannel === '企业网银' && selected.value.repaymentControl !== '存货类') return ElMessage.warning('该项目未配置“存货类”提前还款申请控制'); const duplicate = rows.value.some((row) => row.id !== selected.value?.id && row.loanNo === selected.value?.loanNo && ['pending', 'reviewing'].includes(row.phase)); if (duplicate) return ElMessage.warning('同一借据已有一笔提前还款申请，不能重复提交'); selected.value.phase = 'reviewing'; selected.value.status = '审查审批中'; selected.value.currentStage = '经营单位负责人'; ElMessage.success('已提交至经营单位负责人') }
const reject = () => { if (!selected.value) return ElMessage.warning('请先选择一条申请'); selected.value.phase = 'rejected'; selected.value.status = '被否决'; selected.value.currentStage = '客户经理否决'; ElMessage.success('申请已否决') }
</script>

<style scoped lang="scss">
.repayment-detail-page { min-height: 100%; padding: 12px 16px 20px; background: #f2f3f5; }.detail-toolbar { display: flex; align-items: center; min-height: 52px; margin-bottom: 12px; padding: 8px 20px; background: #fff; gap: 24px; }.system-detail-collapse { border: 0; background: transparent; }:deep(.system-detail-collapse .el-collapse-item) { margin-bottom: 12px; }:deep(.system-detail-collapse .el-collapse-item__header), :deep(.system-detail-collapse .el-collapse-item__wrap) { padding: 0 20px; border: 0; background: #fff; }.collapse-title { font-size: 16px; font-weight: 600; }.detail-form, .process-content { padding: 16px 20px; }.action-bar { display: flex; margin-bottom: 12px; gap: 8px; }
</style>
