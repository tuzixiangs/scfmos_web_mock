<template>
  <ContentWrap v-if="!detailVisible" class="order-contract-ledger-query">
    <Search
      :schema="projectSchemas.searchSchema"
      :model="projectQuery"
      :default-expand="false"
      @search="handleProjectSearch"
      @reset="handleProjectSearch"
    />

    <Table
      :columns="projectColumns"
      :data="projectRows"
      :loading="projectLoading"
      :pagination="{ total: projectRows.length }"
      :show-overflow-tooltip="true"
    >
      <template #action="{ row }">
        <el-button link type="primary" @click.stop="openProjectDetail(row)">
          <Icon icon="ep:document" class="mr-3px" />详情
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <ContentWrap v-else class="order-contract-ledger-detail-page">
    <div class="detail-page-header">
      <el-button class="back-button" link @click="goBackToProjects">
        <Icon icon="ep:arrow-left" class="mr-4px" />返回项目列表
      </el-button>
      <div class="detail-page-title">
        <span>{{ detailProject?.projectName }}</span>
        <el-tag type="info" effect="plain">{{ currentProductPlan }}</el-tag>
      </div>
      <div class="detail-page-subtitle">订单/合同台账查询</div>
    </div>

    <el-descriptions v-if="detailProject" :column="4" border class="mb-12px">
      <el-descriptions-item label="项目编号">{{ detailProject.projectNo }}</el-descriptions-item>
      <el-descriptions-item label="项目名称">{{ detailProject.projectName }}</el-descriptions-item>
      <el-descriptions-item label="核心企业名称">{{ detailProject.coreEnterpriseName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ detailProject.coreCustomerNo }}</el-descriptions-item>
    </el-descriptions>

    <el-tabs v-model="activeLedgerStatus" @tab-change="loadLedgerRows">
      <el-tab-pane label="有效的订单/合同" name="valid" />
      <el-tab-pane label="失效的订单/合同" name="invalid" />
    </el-tabs>

    <Search
      :schema="ledgerSchemas.searchSchema"
      :model="ledgerQuery"
      :default-expand="false"
      @search="handleLedgerSearch"
      @reset="handleLedgerSearch"
    />

    <ActionBar :buttons="ledgerButtons" />

    <Table
      :columns="ledgerColumns"
      :data="ledgerRows"
      :loading="ledgerLoading"
      :pagination="{ total: ledgerRows.length }"
      highlight-current-row
      :show-overflow-tooltip="true"
      @cell-click="handleLedgerCellClick"
    >
      <template #contractTotalAmount="{ row }">{{ formatAmount(row.contractTotalAmount) }}</template>
      <template #currentUsedAmount="{ row }">{{ formatAmount(row.currentUsedAmount) }}</template>
      <template #remainingAvailableAmount="{ row }">{{ formatAmount(row.remainingAvailableAmount) }}</template>
      <template #action="{ row }">
        <el-button link type="primary" @click.stop="openImage(row)">
          <Icon icon="ep:picture" class="mr-3px" />查看影像
        </el-button>
        <el-button link type="primary" @click.stop="openAssetItems(row)">
          查看项下资产明细
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <el-dialog v-model="ledgerDetailVisible" title="订单/合同台账详情" width="980px" destroy-on-close>
    <el-descriptions v-if="ledgerDetailRecord" :column="3" border>
      <el-descriptions-item label="订单/合同流水号">{{ ledgerDetailRecord.orderContractFlowNo }}</el-descriptions-item>
      <el-descriptions-item label="订单/合同编号">{{ ledgerDetailRecord.orderContractNo }}</el-descriptions-item>
      <el-descriptions-item label="客户名称">{{ ledgerDetailRecord.customerName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ ledgerDetailRecord.coreCustomerNo }}</el-descriptions-item>
      <el-descriptions-item label="签约方1">{{ ledgerDetailRecord.partyOne }}</el-descriptions-item>
      <el-descriptions-item label="签约方2">{{ ledgerDetailRecord.partyTwo }}</el-descriptions-item>
      <el-descriptions-item label="签约方3">{{ ledgerDetailRecord.partyThree }}</el-descriptions-item>
      <el-descriptions-item label="订单/合同总金额">
        {{ formatAmount(ledgerDetailRecord.contractTotalAmount) }} {{ ledgerDetailRecord.currency }}
      </el-descriptions-item>
      <el-descriptions-item label="本次使用金额">
        {{ formatAmount(ledgerDetailRecord.currentUsedAmount) }} {{ ledgerDetailRecord.currency }}
      </el-descriptions-item>
      <el-descriptions-item label="剩余可用金额">
        {{ formatAmount(ledgerDetailRecord.remainingAvailableAmount) }} {{ ledgerDetailRecord.currency }}
      </el-descriptions-item>
      <el-descriptions-item label="合同起始日">{{ ledgerDetailRecord.contractStartDate }}</el-descriptions-item>
      <el-descriptions-item label="合同到期日">{{ ledgerDetailRecord.contractEndDate }}</el-descriptions-item>
      <el-descriptions-item label="数据来源">{{ ledgerDetailRecord.dataSource }}</el-descriptions-item>
      <el-descriptions-item label="申请日期">{{ ledgerDetailRecord.applicationDate }}</el-descriptions-item>
      <el-descriptions-item label="生效日期">{{ ledgerDetailRecord.effectiveDate }}</el-descriptions-item>
      <el-descriptions-item v-if="ledgerDetailRecord.invalidDate" label="失效日期">
        {{ ledgerDetailRecord.invalidDate }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="assetVisible" title="项下资产明细" width="920px" destroy-on-close>
    <el-table :data="assetItems" border size="small">
      <el-table-column prop="productCode" label="商品编码" min-width="145" />
      <el-table-column prop="productName" label="商品名称" min-width="145" />
      <el-table-column prop="largeCategory" label="商品大类" min-width="110" />
      <el-table-column prop="middleCategory" label="商品中类" min-width="110" />
      <el-table-column prop="smallCategory" label="商品小类" min-width="110" />
      <el-table-column prop="origin" label="产地" min-width="110" />
      <el-table-column prop="warehouseName" label="仓储地" min-width="150" />
      <el-table-column prop="quantityOrWeight" label="数量/重量" min-width="120" align="right" />
      <el-table-column label="最新单价" min-width="120" align="right">
        <template #default="{ row }">{{ formatAmount(row.latestUnitPrice) }}</template>
      </el-table-column>
      <el-table-column label="最新在库货值" min-width="135" align="right">
        <template #default="{ row }">{{ formatAmount(row.latestInventoryValue) }}</template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog v-model="imageVisible" title="订单/合同影像" width="720px" destroy-on-close>
    <el-alert
      :title="`订单/合同编号：${imageRecord?.orderContractNo || ''}`"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <div class="image-file-list">
      <div class="image-file-card">
        <Icon icon="ep:document" class="image-file-icon" />
        <div>
          <strong>订单/合同签署影像.pdf</strong>
          <p>签约方及合同金额影像材料</p>
        </div>
      </div>
      <div class="image-file-card">
        <Icon icon="ep:files" class="image-file-icon" />
        <div>
          <strong>关联业务合同影像.pdf</strong>
          <p>{{ imageRecord?.relatedBusinessContractNo || '关联业务合同' }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref, unref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as OrderContractLedgerApi from '@/api/indebt/orderContractLedgerQuery'

defineOptions({ name: 'OrderContractLedgerWorkList' })

type LedgerStatus = OrderContractLedgerApi.OrderContractLedgerStatus
type LedgerRecord = OrderContractLedgerApi.OrderContractLedgerRecord
type LedgerProject = OrderContractLedgerApi.OrderContractLedgerProject
type LedgerAssetItem = OrderContractLedgerApi.OrderContractLedgerAssetItem

const props = defineProps<{ params?: { productPlan?: string } }>()
const currentProductPlan = computed(() => {
  const productPlan = unref(props.params?.productPlan)
  return typeof productPlan === 'string' && productPlan ? productPlan : '先票/款后货'
})

const projectRows = ref<LedgerProject[]>([])
const projectLoading = ref(false)
const projectQuery = reactive({
  projectNo: '',
  projectName: '',
  coreEnterpriseName: '',
  coreCustomerNo: ''
})

const detailVisible = ref(false)
const detailProject = ref<LedgerProject>()
const activeLedgerStatus = ref<LedgerStatus>('valid')
const ledgerRows = ref<LedgerRecord[]>([])
const ledgerLoading = ref(false)
const ledgerCurrentRow = ref<LedgerRecord>()
const ledgerQuery = reactive({
  customerName: '',
  coreCustomerNo: '',
  relatedBusinessContractNo: ''
})
const ledgerDetailVisible = ref(false)
const ledgerDetailRecord = ref<LedgerRecord>()
const imageVisible = ref(false)
const imageRecord = ref<LedgerRecord>()
const assetVisible = ref(false)
const assetItems = ref<LedgerAssetItem[]>([])

const formatAmount = (value: unknown) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '-'
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const projectCrudSchemas = reactive<CrudSchema[]>([
  {
    label: '项目编号',
    field: 'projectNo',
    minWidth: 170,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入项目编号' } }
  },
  {
    label: '项目名称',
    field: 'projectName',
    minWidth: 190,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入项目名称' } }
  },
  {
    label: '核心企业名称',
    field: 'coreEnterpriseName',
    minWidth: 200,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入核心企业名称' } }
  },
  {
    label: '核心客户编号',
    field: 'coreCustomerNo',
    minWidth: 170,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入核心客户编号' } }
  },
  { label: '操作', field: 'action', fixed: 'right', width: 110 }
])

const ledgerCrudSchemas = reactive<CrudSchema[]>([
  { label: '订单/合同流水号', field: 'orderContractFlowNo', minWidth: 170 },
  { label: '订单/合同编号', field: 'orderContractNo', minWidth: 155 },
  {
    label: '客户名称',
    field: 'customerName',
    minWidth: 170,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入客户名称' } }
  },
  {
    label: '核心客户编号',
    field: 'coreCustomerNo',
    minWidth: 155,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入核心客户编号' } }
  },
  { label: '签约方1', field: 'partyOne', minWidth: 170 },
  { label: '签约方2', field: 'partyTwo', minWidth: 170 },
  { label: '签约方3', field: 'partyThree', minWidth: 170 },
  { label: '订单/合同总金额', field: 'contractTotalAmount', minWidth: 145 },
  { label: '本次使用金额', field: 'currentUsedAmount', minWidth: 135 },
  { label: '剩余可用金额', field: 'remainingAvailableAmount', minWidth: 135 },
  { label: '币种', field: 'currency', minWidth: 95 },
  { label: '合同起始日', field: 'contractStartDate', minWidth: 125 },
  { label: '合同到期日', field: 'contractEndDate', minWidth: 125 },
  {
    label: '关联业务合同编号',
    field: 'relatedBusinessContractNo',
    minWidth: 175,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入关联业务合同编号' } }
  },
  { label: '数据来源', field: 'dataSource', minWidth: 120 },
  { label: '申请日期', field: 'applicationDate', minWidth: 125 },
  { label: '生效日期', field: 'effectiveDate', minWidth: 125 },
  { label: '失效日期', field: 'invalidDate', minWidth: 125 },
  { label: '操作', field: 'action', fixed: 'right', width: 220 }
])

const { allSchemas: projectSchemas } = useCrudSchemas(projectCrudSchemas)
const { allSchemas: ledgerSchemas } = useCrudSchemas(ledgerCrudSchemas)
const projectColumns = computed(() => projectSchemas.tableColumns)
const ledgerColumns = computed(() =>
  ledgerSchemas.tableColumns.filter((column) => activeLedgerStatus.value === 'invalid' || column.field !== 'invalidDate')
)

const loadProjects = async (params = projectQuery) => {
  projectLoading.value = true
  try {
    projectRows.value = await OrderContractLedgerApi.getOrderContractLedgerProjects({
      ...params,
      productPlan: currentProductPlan.value
    })
  } finally {
    projectLoading.value = false
  }
}

const handleProjectSearch = (params: Recordable) => {
  Object.assign(projectQuery, params)
  loadProjects(projectQuery)
}

const openProjectDetail = async (project: LedgerProject) => {
  detailProject.value = project
  activeLedgerStatus.value = 'valid'
  Object.assign(ledgerQuery, {
    customerName: '',
    coreCustomerNo: '',
    relatedBusinessContractNo: ''
  })
  detailVisible.value = true
  await loadLedgerRows()
}

const goBackToProjects = () => {
  detailVisible.value = false
  detailProject.value = undefined
  ledgerRows.value = []
}

const loadLedgerRows = async () => {
  if (!detailProject.value) return
  ledgerLoading.value = true
  ledgerCurrentRow.value = undefined
  try {
    const result = await OrderContractLedgerApi.getOrderContractLedgerPage({
      ...ledgerQuery,
      status: activeLedgerStatus.value,
      projectId: detailProject.value.id
    })
    ledgerRows.value = result.list || result.records || []
  } finally {
    ledgerLoading.value = false
  }
}

const handleLedgerSearch = (params: Recordable) => {
  Object.assign(ledgerQuery, params)
  loadLedgerRows()
}

const handleLedgerCellClick = (record: LedgerRecord) => {
  ledgerCurrentRow.value = record
}

const requireLedgerRecord = (): LedgerRecord | undefined => {
  if (!ledgerCurrentRow.value) {
    ElMessage.warning('请先点击选择一条订单/合同台账')
    return undefined
  }
  return ledgerCurrentRow.value
}

const openLedgerDetail = async () => {
  const record = requireLedgerRecord()
  if (!record) return
  ledgerDetailRecord.value = await OrderContractLedgerApi.getOrderContractLedgerDetail(record.id)
  ledgerDetailVisible.value = true
}

const openImage = (record: LedgerRecord) => {
  ledgerCurrentRow.value = record
  imageRecord.value = record
  imageVisible.value = true
}

const openAssetItems = async (record?: LedgerRecord) => {
  const current = record || requireLedgerRecord()
  if (!current) return
  ledgerCurrentRow.value = current
  assetItems.value = await OrderContractLedgerApi.getOrderContractLedgerAssetItems(current.id)
  assetVisible.value = true
}

const handleExport = () => {
  ElMessage.success('Mock 已生成订单/合同台账导出任务')
}

const ledgerButtons = computed<ActionButton[]>(() => [
  { key: 'detail', label: '详情', icon: 'ep:document', plain: true, onClick: openLedgerDetail },
  { key: 'export', label: '导出 Excel', icon: 'ep:download', plain: true, onClick: handleExport }
])

watch(currentProductPlan, () => {
  detailVisible.value = false
  loadProjects()
})

onActivated(() => {
  loadProjects()
})

onMounted(() => {
  loadProjects()
})
</script>

<style scoped lang="scss">
.order-contract-ledger-query {
  min-width: 0;
}

.order-contract-ledger-detail-page {
  min-width: 0;
  min-height: calc(100vh - 150px);
}

.detail-page-header {
  display: flex;
  align-items: center;
  min-height: 54px;
  margin: -4px 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .back-button {
    margin-right: 24px;
    color: var(--el-color-primary);
    font-size: 14px;
  }
}

.detail-page-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--el-text-color-primary);
  font-size: 21px;
  font-weight: 600;
}

.detail-page-subtitle {
  margin-left: 14px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.image-file-list {
  display: grid;
  gap: 12px;
}

.image-file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 12px 16px;
  border: 1px solid #e3e9f2;
  border-radius: 6px;
  background: #fafcff;

  .image-file-icon {
    color: #3d7ad6;
    font-size: 28px;
  }

  strong {
    display: block;
    color: #27364b;
  }

  p {
    margin: 5px 0 0;
    color: #8492a6;
    font-size: 13px;
  }
}
</style>
