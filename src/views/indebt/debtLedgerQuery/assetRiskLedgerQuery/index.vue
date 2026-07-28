<template>
  <ContentWrap v-if="!detailVisible" class="asset-risk-ledger-page">
    <Search
      :schema="projectSchemas.searchSchema"
      :model="projectQuery"
      :default-expand="false"
      @search="handleProjectSearch"
      @reset="handleProjectSearch"
    />
    <Table
      :columns="projectSchemas.tableColumns"
      :data="projects"
      :loading="projectLoading"
      :pagination="{ total: projects.length }"
      :show-overflow-tooltip="true"
    >
      <template #action="{ row }">
        <el-button link type="primary" @click.stop="openProject(row)">
          <Icon icon="ep:document" class="mr-3px" />查看单户列表
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <ContentWrap v-else class="asset-risk-ledger-detail">
    <div class="detail-header">
      <el-button link type="primary" @click="backToProjects"><Icon icon="ep:arrow-left" class="mr-4px" />返回项目列表</el-button>
      <span class="detail-title">{{ currentProject?.projectName }} - 债项资产风险台账查询</span>
    </div>
    <el-descriptions v-if="currentProject" :column="4" border class="mb-12px">
      <el-descriptions-item label="项目编号">{{ currentProject.projectNo }}</el-descriptions-item>
      <el-descriptions-item label="项目名称">{{ currentProject.projectName }}</el-descriptions-item>
      <el-descriptions-item label="核心企业名称">{{ currentProject.coreEnterpriseName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ currentProject.coreCustomerNo }}</el-descriptions-item>
    </el-descriptions>
    <el-tabs v-model="activeDimension">
      <el-tab-pane label="客户维度" name="customer" />
      <el-tab-pane label="合同维度" name="contract" />
    </el-tabs>
    <div class="section-heading"><span>{{ activeDimension === 'customer' ? '单户风险台账' : '业务合同风险台账' }}</span><el-tag type="info" effect="plain">共 {{ activeRows.length }} 条</el-tag></div>
    <Table
      :key="`${activeDimension}-${activeRows.length}`"
      :columns="activeDimension === 'customer' ? customerSchemas.tableColumns : contractSchemas.tableColumns"
      :data="activeRows"
      :loading="ledgerLoading"
      :pagination="{ total: activeRows.length }"
      :show-overflow-tooltip="true"
    >
      <template #singleCustomerExposureAmount="{ row }">{{ money(row.singleCustomerExposureAmount) }}</template>
      <template #cumulativeCompensationAmount="{ row }">{{ money(row.cumulativeCompensationAmount) }}</template>
      <template #cumulativePriceDropCompensationAmount="{ row }">{{ money(row.cumulativePriceDropCompensationAmount) }}</template>
      <template #action="{ row }">
        <el-button link type="primary" @click="openLedger(row, '预入库订单台账')">查看预入库订单台账</el-button>
        <el-button link type="primary" @click="openLedger(row, '通用存货台账')">查看通用存货台账</el-button>
      </template>
    </Table>
  </ContentWrap>

  <el-dialog v-model="ledgerDialogVisible" :title="ledgerDialogTitle" width="760px" destroy-on-close>
    <el-descriptions v-if="selectedLedger" :column="2" border>
      <el-descriptions-item label="客户名称">{{ selectedLedger.customerName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ selectedLedger.coreCustomerNo }}</el-descriptions-item>
      <el-descriptions-item label="单户敞口金额">{{ money(selectedLedger.singleCustomerExposureAmount) }}</el-descriptions-item>
      <el-descriptions-item label="未处理预警条数">{{ selectedLedger.pendingWarningCount }}</el-descriptions-item>
      <el-descriptions-item v-if="'businessContractNo' in selectedLedger" label="业务合同编号">{{ selectedLedger.businessContractNo }}</el-descriptions-item>
      <el-descriptions-item v-if="'outgoingFlowNo' in selectedLedger" label="出账流水号">{{ selectedLedger.outgoingFlowNo }}</el-descriptions-item>
    </el-descriptions>
    <div class="ledger-placeholder"><Icon icon="ep:document" /> {{ ledgerDialogTitle }} 明细（Mock）已生成，可作为后续关联页面入口。</div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref } from 'vue'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as AssetRiskLedgerApi from '@/api/indebt/assetRiskLedgerQuery'

defineOptions({ name: 'AssetRiskLedgerQuery' })

const projects = ref<AssetRiskLedgerApi.AssetRiskLedgerProject[]>([])
const projectLoading = ref(false)
const projectQuery = reactive({ projectNo: '', projectName: '', coreEnterpriseName: '', coreCustomerNo: '' })
const detailVisible = ref(false)
const currentProject = ref<AssetRiskLedgerApi.AssetRiskLedgerProject>()
const activeDimension = ref<'customer' | 'contract'>('customer')
const customerRows = ref<AssetRiskLedgerApi.AssetRiskCustomerLedger[]>([])
const contractRows = ref<AssetRiskLedgerApi.AssetRiskContractLedger[]>([])
const ledgerLoading = ref(false)
const ledgerDialogVisible = ref(false)
const ledgerDialogTitle = ref('')
const selectedLedger = ref<AssetRiskLedgerApi.AssetRiskCustomerLedger | AssetRiskLedgerApi.AssetRiskContractLedger>()
const activeRows = computed(() => activeDimension.value === 'customer' ? customerRows.value : contractRows.value)

const projectCrudSchemas = reactive<CrudSchema[]>([
  { label: '项目编号', field: 'projectNo', minWidth: 180, isSearch: true },
  { label: '项目名称', field: 'projectName', minWidth: 230, isSearch: true },
  { label: '核心企业名称', field: 'coreEnterpriseName', minWidth: 260, isSearch: true },
  { label: '操作', field: 'action', fixed: 'right', width: 160 }
])
const riskColumns: CrudSchema[] = [
  { label: '客户名称', field: 'customerName', minWidth: 160 },
  { label: '核心客户编号', field: 'coreCustomerNo', minWidth: 165 },
  { label: '单户敞口金额', field: 'singleCustomerExposureAmount', minWidth: 140 },
  { label: '累计赔货/提货金额', field: 'cumulativeCompensationAmount', minWidth: 160 },
  { label: '累计赔货/提货次数', field: 'cumulativeCompensationCount', minWidth: 150 },
  { label: '累计补货金额', field: 'cumulativePriceDropCompensationAmount', minWidth: 140 },
  { label: '累计补货次数', field: 'cumulativePriceDropCompensationCount', minWidth: 130 },
  { label: '触发跌价补偿次数', field: 'priceDropWarningCount', minWidth: 150 },
  { label: '触发预警次数', field: 'priceDropWarningCount', minWidth: 125 },
  { label: '当前未处理预警条数', field: 'pendingWarningCount', minWidth: 160 }
]
const customerCrudSchemas = reactive<CrudSchema[]>([...riskColumns, { label: '操作', field: 'action', fixed: 'right', width: 250 }])
const contractCrudSchemas = reactive<CrudSchema[]>([
  { label: '客户名称', field: 'customerName', minWidth: 150 },
  { label: '核心客户编号', field: 'coreCustomerNo', minWidth: 155 },
  { label: '业务合同编号', field: 'businessContractNo', minWidth: 165 },
  { label: '出账流水号', field: 'outgoingFlowNo', minWidth: 155 },
  { label: '贷款起始日', field: 'loanStartDate', minWidth: 120 },
  { label: '贷款到期日', field: 'loanEndDate', minWidth: 120 },
  ...riskColumns.slice(3),
  { label: '操作', field: 'action', fixed: 'right', width: 250 }
])
const { allSchemas: projectSchemas } = useCrudSchemas(projectCrudSchemas)
const { allSchemas: customerSchemas } = useCrudSchemas(customerCrudSchemas)
const { allSchemas: contractSchemas } = useCrudSchemas(contractCrudSchemas)
const money = (value: number) => Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const loadProjects = async () => { projectLoading.value = true; try { projects.value = await AssetRiskLedgerApi.getAssetRiskLedgerProjects(projectQuery) } finally { projectLoading.value = false } }
const handleProjectSearch = (params: Recordable) => { Object.assign(projectQuery, params); loadProjects() }
const openProject = async (project: AssetRiskLedgerApi.AssetRiskLedgerProject) => { currentProject.value = project; detailVisible.value = true; ledgerLoading.value = true; try { const [customers, contracts] = await Promise.all([AssetRiskLedgerApi.getAssetRiskCustomerLedgers({ projectId: project.id }), AssetRiskLedgerApi.getAssetRiskContractLedgers({ projectId: project.id })]); customerRows.value = customers; contractRows.value = contracts } finally { ledgerLoading.value = false } }
const backToProjects = () => { detailVisible.value = false; currentProject.value = undefined; customerRows.value = []; contractRows.value = [] }
const openLedger = (row: AssetRiskLedgerApi.AssetRiskCustomerLedger | AssetRiskLedgerApi.AssetRiskContractLedger, title: string) => { selectedLedger.value = row; ledgerDialogTitle.value = title; ledgerDialogVisible.value = true }

onMounted(loadProjects)
onActivated(loadProjects)
</script>

<style scoped lang="scss">
.detail-header { display: flex; align-items: center; min-height: 52px; margin: -4px 0 16px; padding-bottom: 12px; border-bottom: 1px solid var(--el-border-color-lighter); }
.detail-title { margin-left: 20px; color: var(--el-text-color-primary); font-size: 20px; font-weight: 600; }
.section-heading { display: flex; align-items: center; justify-content: space-between; margin: 4px 0 12px; color: var(--el-text-color-primary); font-size: 18px; font-weight: 600; }
.ledger-placeholder { margin-top: 16px; padding: 18px; color: var(--el-text-color-secondary); background: var(--el-fill-color-light); }
</style>
