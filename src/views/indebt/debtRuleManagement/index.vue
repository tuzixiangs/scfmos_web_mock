<template>
  <ContentWrap class="debt-rule-management-page">
    <div class="page-title">{{ pageTitle }}</div>
    <el-tabs v-if="mode === 'supplementApply'" v-model="activeFilter" @tab-change="loadRows">
      <el-tab-pane label="待提交的补配申请" name="待提交" /><el-tab-pane label="审查审批中的申请" name="审查审批中" />
      <el-tab-pane label="审批通过的申请" name="审批通过" /><el-tab-pane label="被否决的申请" name="被否决" />
    </el-tabs>
    <el-tabs v-else-if="mode === 'supplementApproval'" v-model="activeFilter" @tab-change="loadRows">
      <el-tab-pane label="当前工作" name="当前工作" /><el-tab-pane label="已完成工作" name="已完成工作" />
    </el-tabs>
    <el-tabs v-else-if="mode === 'ruleMaintenance'" v-model="activeFilter" @tab-change="loadRows">
      <el-tab-pane label="授信债项规则查询" name="授信债项规则查询" /><el-tab-pane label="出账债项规则查询" name="出账债项规则查询" />
    </el-tabs>
    <el-tabs v-else v-model="activeFilter" @tab-change="loadRows">
      <el-tab-pane label="先票/款后货" name="先票/款后货" /><el-tab-pane label="货押融资" name="货押融资" />
    </el-tabs>
    <Search :schema="schemas.searchSchema" :model="query" :default-expand="false" @search="handleSearch" @reset="handleSearch" />
    <ActionBar :buttons="buttons" />
    <Table :columns="schemas.tableColumns" :data="rows" :loading="loading" :pagination="{ total: rows.length }" :show-overflow-tooltip="true">
      <template #action="{ row }">
        <el-button link type="primary" @click="showDetail(row)"><Icon icon="ep:document" class="mr-3px" />{{ mode === 'ruleLibrary' ? '编辑' : '详情' }}</el-button>
        <el-button v-if="mode === 'ruleLibrary'" link type="primary" @click="message('已切换规则状态')">{{ row.ruleStatus === '有效' ? '停用' : '启用' }}</el-button>
        <el-button v-else-if="mode !== 'ruleMaintenance'" link type="primary" @click="message('已打开签署意见')">签署意见</el-button>
      </template>
    </Table>
  </ContentWrap>
  <el-dialog v-model="dialogVisible" :title="mode === 'ruleLibrary' ? '债项规则维护' : '债项规则补配详情'" width="820px">
    <el-descriptions v-if="selected" :column="2" border>
      <el-descriptions-item v-for="item in detailItems" :key="item.label" :label="item.label">{{ item.value }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as DebtRuleApi from '@/api/indebt/debtRuleManagement'

defineOptions({ name: 'DebtRuleManagement' })
const route = useRoute()
const mode = computed<DebtRuleApi.DebtRulePageType>(() => route.path.includes('supplementApproval') ? 'supplementApproval' : route.path.includes('ruleMaintenance') ? 'ruleMaintenance' : route.path.includes('ruleLibrary') ? 'ruleLibrary' : 'supplementApply')
const pageTitle = computed(() => ({ supplementApply: '债项规则补配申请', supplementApproval: '债项规则补配审批', ruleMaintenance: '债项规则维护', ruleLibrary: '债项规则库管理' })[mode.value])
const activeFilter = ref('待提交')
const rows = ref<DebtRuleApi.DebtRuleRecord[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const selected = ref<DebtRuleApi.DebtRuleRecord>()
const query = reactive({ applicationNo: '', customerName: '', coreCustomerNo: '', businessNo: '', applicationType: '' })
const commonColumns: CrudSchema[] = [
  { label: '申请编号', field: 'applicationNo', minWidth: 180, isSearch: true }, { label: '客户名称', field: 'customerName', minWidth: 170, isSearch: true },
  { label: '核心客户编号', field: 'coreCustomerNo', minWidth: 165, isSearch: true }, { label: '业务编号', field: 'businessNo', minWidth: 160, isSearch: true },
  { label: '产品方案', field: 'productPlan', minWidth: 130 }, { label: '申请类型', field: 'applicationType', minWidth: 125, isSearch: true },
  { label: '申请日期', field: 'applicationDate', minWidth: 125 }, { label: '当前阶段', field: 'currentStage', minWidth: 150 }, { label: '完成时间', field: 'completedAt', minWidth: 175 }
]
const libraryColumns: CrudSchema[] = [
  { label: '规则编号', field: 'ruleNo', minWidth: 140 }, { label: '规则分类', field: 'ruleCategory', minWidth: 115 }, { label: '流程阶段', field: 'processStage', minWidth: 100 },
  { label: '规则名称', field: 'ruleName', minWidth: 150 }, { label: '规则说明', field: 'ruleDescription', minWidth: 240 }, { label: '计算公式', field: 'formula', minWidth: 180 },
  { label: '支持资产类型', field: 'supportedAssetType', minWidth: 130 }, { label: '债项因子', field: 'debtFactor', minWidth: 100 }, { label: '预警颜色', field: 'warningColor', minWidth: 90 },
  { label: '规则状态', field: 'ruleStatus', minWidth: 90 }, { label: '更新人', field: 'updatedBy', minWidth: 110 }, { label: '更新日期', field: 'updatedAt', minWidth: 120 }
]
const { allSchemas: commonSchemas } = useCrudSchemas([
  ...commonColumns,
  { label: '操作', field: 'action', fixed: 'right', width: 150 }
])
const { allSchemas: librarySchemas } = useCrudSchemas([
  ...libraryColumns,
  { label: '操作', field: 'action', fixed: 'right', width: 145 }
])
const schemas = computed(() => mode.value === 'ruleLibrary' ? librarySchemas : commonSchemas)
const loadRows = async () => { loading.value = true; try { const params: any = { type: mode.value }; if (mode.value === 'ruleLibrary') params.productPlan = activeFilter.value; else params.status = activeFilter.value; rows.value = await DebtRuleApi.getDebtRuleRecords(params) } finally { loading.value = false } }
const handleSearch = () => loadRows()
const message = (text: string) => ElMessage.success(`Mock：${text}`)
const showDetail = (row: DebtRuleApi.DebtRuleRecord) => { selected.value = row; dialogVisible.value = true }
const detailItems = computed(() => selected.value ? Object.entries(mode.value === 'ruleLibrary' ? { '规则编号': selected.value.ruleNo, '规则名称': selected.value.ruleName, '规则说明': selected.value.ruleDescription, '计算公式': selected.value.formula, '预警处理方案': selected.value.warningHandlingPlan, '规则要求': selected.value.ruleRequirement, '因子修改控制': selected.value.factorModificationControl, '规则状态': selected.value.ruleStatus } : { '申请编号': selected.value.applicationNo, '客户名称': selected.value.customerName, '核心客户编号': selected.value.coreCustomerNo, '业务编号': selected.value.businessNo, '产品方案': selected.value.productPlan, '申请类型': selected.value.applicationType, '当前阶段': selected.value.currentStage, '申请日期': selected.value.applicationDate }).map(([label, value]) => ({ label, value: String(value || '-') })) : [])
const buttons = computed<ActionButton[]>(() => mode.value === 'ruleLibrary' ? [{ key: 'add', label: '新增规则', icon: 'ep:plus', type: 'primary', onClick: () => message('已新建规则草稿') }, { key: 'history', label: '查看历史记录', icon: 'ep:clock', plain: true, onClick: () => message('已打开规则历史记录') }] : [{ key: 'add', label: mode.value === 'supplementApply' ? '新增' : '导出 Excel', icon: mode.value === 'supplementApply' ? 'ep:plus' : 'ep:download', type: mode.value === 'supplementApply' ? 'primary' : undefined, plain: mode.value !== 'supplementApply', onClick: () => message(mode.value === 'supplementApply' ? '已创建补配申请草稿' : '已生成导出任务') }])
const resetFilter = () => { activeFilter.value = mode.value === 'supplementApply' ? '待提交' : mode.value === 'supplementApproval' ? '当前工作' : mode.value === 'ruleMaintenance' ? '授信债项规则查询' : '先票/款后货'; loadRows() }
watch(mode, resetFilter)
onMounted(resetFilter)
onActivated(resetFilter)
</script>

<style scoped lang="scss">
.page-title { margin-bottom: 12px; color: var(--el-text-color-primary); font-size: 20px; font-weight: 600; }
</style>
