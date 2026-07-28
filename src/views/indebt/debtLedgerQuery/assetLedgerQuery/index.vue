<template>
  <div v-if="!detailVisible" class="dynamic-container asset-ledger-query-page">
    <DynamicNavmenu
      class="dynamic-navmenu"
      :active-menu="activeMenu"
      :menu-list="planMenuList"
      :customer-openeds="defaultOpeneds"
      @menu-select="handlePlanSelect"
    />
    <main class="component">
      <ContentWrap>
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
              <Icon icon="ep:document" class="mr-3px" />详情
            </el-button>
          </template>
        </Table>
      </ContentWrap>
    </main>
  </div>

  <ContentWrap v-else class="asset-ledger-detail-page">
    <div class="detail-header">
      <el-button link type="primary" @click="backToProjects">
        <Icon icon="ep:arrow-left" class="mr-4px" />返回项目列表
      </el-button>
      <div class="detail-title">{{ currentProject?.projectName }} - 债项资产台账查询</div>
      <el-tag class="ml-12px" effect="plain">{{ currentProductPlan }}</el-tag>
    </div>

    <el-descriptions v-if="currentProject" :column="4" border class="mb-16px">
      <el-descriptions-item label="项目编号">{{ currentProject.projectNo }}</el-descriptions-item>
      <el-descriptions-item label="项目名称">{{ currentProject.projectName }}</el-descriptions-item>
      <el-descriptions-item label="核心企业名称">{{ currentProject.coreEnterpriseName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ currentProject.coreCustomerNo }}</el-descriptions-item>
    </el-descriptions>

    <div class="asset-ledger-layout">
      <el-menu :default-active="activeStatus" class="asset-status-menu" @select="handleStatusSelect">
        <el-menu-item v-for="item in statusMenus" :key="item.key" :index="item.key">
          <span class="status-dot"></span>{{ item.label }}
        </el-menu-item>
      </el-menu>
      <section class="asset-ledger-content">
        <div class="section-heading">
          <span>{{ activeStatusLabel }}</span>
          <el-tag type="info" effect="plain">共 {{ assetRows.length }} 条</el-tag>
        </div>
        <Search
          :schema="assetSearchSchemas"
          :model="assetQuery"
          :is-col="true"
          layout="inline"
          :default-expand="false"
          @search="handleAssetSearch"
          @reset="handleAssetSearch"
        />
        <ActionBar :buttons="assetButtons" />
        <Table
          :key="assetTableKey"
          :columns="assetColumns"
          :data="assetRows"
          :loading="assetLoading"
          :pagination="{ total: assetRows.length }"
          :show-overflow-tooltip="true"
        >
          <template #inStockLatestPrice="{ row }">{{ money(row.inStockLatestPrice) }}</template>
          <template #latestMarketPrice="{ row }">{{ money(row.latestMarketPrice) }}</template>
          <template #inStockLatestValue="{ row }">{{ money(row.inStockLatestValue) }}</template>
          <template #priceTrigger="{ row }">
            <el-tag :type="row.priceTrigger === '已触发' ? 'danger' : 'success'" effect="light">
              {{ row.priceTrigger }}
            </el-tag>
          </template>
          <template #action="{ row }">
            <el-button link type="primary" @click="openImage(row)">
              <Icon icon="ep:picture" class="mr-3px" />查看影像
            </el-button>
          </template>
        </Table>
      </section>
    </div>
  </ContentWrap>

  <el-dialog v-model="imageVisible" title="债项资产影像" width="620px">
    <el-descriptions v-if="imageRow" :column="2" border>
      <el-descriptions-item label="商品名称">{{ imageRow.productName }}</el-descriptions-item>
      <el-descriptions-item label="商品编码">{{ imageRow.productCode }}</el-descriptions-item>
      <el-descriptions-item label="批次号">{{ imageRow.batchNo }}</el-descriptions-item>
      <el-descriptions-item label="仓储地">{{ imageRow.warehouseName }}</el-descriptions-item>
    </el-descriptions>
    <div class="image-placeholder">
      <Icon icon="ep:document" /> 货物入库、仓储监管及权属证明影像（Mock）
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref, unref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import DynamicNavmenu from '@/components/dynamicNavmenu/index.vue'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as AssetLedgerApi from '@/api/indebt/assetLedgerQuery'

defineOptions({ name: 'AssetLedgerQuery' })

type AssetStatus = AssetLedgerApi.AssetLedgerStatus
type ProductPlanKey = 'prepayment' | 'pledge'
const route = useRoute()
const initialPlan: ProductPlanKey = String(route.path).includes('/pledge') ? 'pledge' : 'prepayment'
const activePlan = ref<ProductPlanKey>(initialPlan)
const activeMenu = ref(`${initialPlan}-ledger`)
const currentProductPlan = computed(() => activePlan.value === 'pledge' ? '货押融资' : '先票/款后货')
const defaultOpeneds = [initialPlan]
const planMenuList = [
  {
    key: 'prepayment',
    title: '先票/款后货',
    children: [{ key: 'prepayment-ledger', title: '债项资产台账查询', plan: 'prepayment' }]
  },
  {
    key: 'pledge',
    title: '货押融资',
    children: [{ key: 'pledge-ledger', title: '债项资产台账查询', plan: 'pledge' }]
  }
]
const projects = ref<AssetLedgerApi.AssetLedgerProject[]>([])
const projectLoading = ref(false)
const projectQuery = reactive({ projectNo: '', projectName: '', coreEnterpriseName: '', coreCustomerNo: '' })
const detailVisible = ref(false)
const currentProject = ref<AssetLedgerApi.AssetLedgerProject>()
const activeStatus = ref<AssetStatus>('inStock')
const assetRows = ref<AssetLedgerApi.AssetLedgerRecord[]>([])
const assetLoading = ref(false)
// 表格列较多，异步回填 Mock 数据后重建一次表格，避免 Element Plus 未重新计算列宽而出现空白区域。
const assetTableKey = ref(0)
const assetQuery = reactive({
  customerName: '', coreCustomerNo: '', relatedBusinessContractNo: '', productCode: '', productName: '', orderContractNo: '', orderContractFlowNo: ''
})
const imageVisible = ref(false)
const imageRow = ref<AssetLedgerApi.AssetLedgerRecord>()

const projectCrudSchemas = reactive<CrudSchema[]>([
  { label: '项目编号', field: 'projectNo', minWidth: 170, isSearch: true },
  { label: '项目名称', field: 'projectName', minWidth: 200, isSearch: true },
  { label: '核心企业名称', field: 'coreEnterpriseName', minWidth: 220, isSearch: true },
  { label: '核心客户编号', field: 'coreCustomerNo', minWidth: 180, isSearch: true },
  { label: '操作', field: 'action', fixed: 'right', width: 110 }
])
const assetCrudSchemas = reactive<CrudSchema[]>([
  { label: '商品编码', field: 'productCode', minWidth: 130, isSearch: true },
  { label: '商品名称', field: 'productName', minWidth: 125, isSearch: true },
  { label: '商品大类', field: 'largeCategory', minWidth: 105 },
  { label: '商品中类', field: 'middleCategory', minWidth: 105 },
  { label: '商品小类', field: 'smallCategory', minWidth: 105 },
  { label: '订单/合同编号', field: 'orderContractNo', minWidth: 155, isSearch: true },
  { label: '订单/合同流水号', field: 'orderContractFlowNo', minWidth: 165, isSearch: true },
  { label: '客户名称', field: 'customerName', minWidth: 165, isSearch: true },
  { label: '核心客户编号', field: 'coreCustomerNo', minWidth: 155, isSearch: true },
  { label: '关联业务合同编号', field: 'relatedBusinessContractNo', minWidth: 175, isSearch: true },
  { label: '批次号', field: 'batchNo', minWidth: 135 },
  { label: '柜号', field: 'cabinetNo', minWidth: 95 },
  { label: '产地', field: 'origin', minWidth: 90 },
  { label: '仓储地', field: 'warehouseName', minWidth: 150 },
  { label: '规格', field: 'specification', minWidth: 120 },
  { label: '在库最新价格', field: 'inStockLatestPrice', minWidth: 130 },
  { label: '最新市价', field: 'latestMarketPrice', minWidth: 110 },
  { label: '在库数量/重量', field: 'inStockQuantityOrWeight', minWidth: 135 },
  { label: '在库最新货值', field: 'inStockLatestValue', minWidth: 135 },
  { label: '价衰触发', field: 'priceTrigger', minWidth: 100 },
  { label: '跌幅', field: 'dropRate', minWidth: 80 },
  { label: '单价更新日期', field: 'unitPriceUpdatedAt', minWidth: 125 },
  { label: '跌价补偿金额', field: 'priceCompensationAmount', minWidth: 135 },
  { label: '币种', field: 'currency', minWidth: 80 },
  { label: '货物所有权', field: 'goodsOwnership', minWidth: 110 },
  { label: '货物起始日', field: 'goodsStartDate', minWidth: 115 },
  { label: '货物到期日', field: 'goodsEndDate', minWidth: 115 },
  { label: '货物状态', field: 'goodsStatus', minWidth: 100 },
  { label: '操作', field: 'action', fixed: 'right', width: 120 }
])
const { allSchemas: projectSchemas } = useCrudSchemas(projectCrudSchemas)
const { allSchemas: assetSchemas } = useCrudSchemas(assetCrudSchemas)
const assetColumns = computed(() => assetSchemas.tableColumns)
const assetSearchSchemas = computed(() =>
  assetSchemas.searchSchema.map((schema) => ({
    ...schema,
    colProps: { xs: 24, sm: 12, md: 8, lg: 8, xl: 8 }
  }))
)
const statusMenus = computed(() => {
  const base = [{ key: 'inStock' as const, label: '在库的债项资产明细' }, { key: 'pendingInbound' as const, label: '待入库债项资产明细' }, { key: 'outbound' as const, label: '已出库的债项资产明细' }, { key: 'invalid' as const, label: '失效的债项资产明细' }]
  return currentProductPlan.value === '货押融资' ? base.filter((item) => item.key !== 'pendingInbound') : base
})
const activeStatusLabel = computed(() => statusMenus.value.find((item) => item.key === activeStatus.value)?.label || '')

const money = (value: number) => Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const loadProjects = async () => {
  projectLoading.value = true
  try { projects.value = await AssetLedgerApi.getAssetLedgerProjects({ ...projectQuery, productPlan: currentProductPlan.value }) } finally { projectLoading.value = false }
}
const handleProjectSearch = (params: Recordable) => { Object.assign(projectQuery, params); loadProjects() }
const handlePlanSelect = (menu: { key: string; plan?: ProductPlanKey }) => {
  if (menu.plan) activePlan.value = menu.plan
  activeMenu.value = menu.key
}
const openProject = async (project: AssetLedgerApi.AssetLedgerProject) => {
  currentProject.value = project
  activeStatus.value = 'inStock'
  Object.keys(assetQuery).forEach((key) => { assetQuery[key as keyof typeof assetQuery] = '' })
  detailVisible.value = true
  await loadAssets()
}
const backToProjects = () => { detailVisible.value = false; currentProject.value = undefined; assetRows.value = [] }
const loadAssets = async () => {
  if (!currentProject.value) return
  assetLoading.value = true
  try {
    const result = await AssetLedgerApi.getAssetLedgerPage({ ...assetQuery, status: activeStatus.value, projectId: currentProject.value.id, productPlan: currentProductPlan.value })
    assetRows.value = result.list || result.records || []
    assetTableKey.value += 1
  } finally { assetLoading.value = false }
}
const handleAssetSearch = (params: Recordable) => { Object.assign(assetQuery, params); loadAssets() }
const handleStatusSelect = (key: string) => { activeStatus.value = key as AssetStatus; loadAssets() }
const openImage = (row: AssetLedgerApi.AssetLedgerRecord) => { imageRow.value = row; imageVisible.value = true }
const handleExport = () => ElMessage.success('Mock 已生成债项资产台账导出任务')
const assetButtons = computed<ActionButton[]>(() => [{ key: 'export', label: '导出 Excel', icon: 'ep:download', plain: true, onClick: handleExport }])
watch(currentProductPlan, () => { detailVisible.value = false; loadProjects() })
onMounted(loadProjects)
onActivated(loadProjects)
</script>

<style scoped lang="scss">
.asset-ledger-query-page { display: flex; min-width: 0; min-height: calc(100vh - 150px); background: #f5f6f8; }
.asset-ledger-query-page .dynamic-navmenu { width: 228px; min-width: 228px; flex: 0 0 228px; background: #f1f1f1 !important; }
.asset-ledger-query-page .component { min-width: 0; flex: 1; overflow: auto; }
.asset-ledger-detail-page { min-width: 0; }
.detail-header { display: flex; align-items: center; min-height: 52px; margin: -4px 0 16px; padding-bottom: 12px; border-bottom: 1px solid var(--el-border-color-lighter); }
.detail-title { margin-left: 20px; color: var(--el-text-color-primary); font-size: 20px; font-weight: 600; }
.asset-ledger-layout { display: flex; gap: 16px; min-height: calc(100vh - 340px); }
.asset-status-menu { width: 230px; flex: 0 0 230px; border: 1px solid var(--el-border-color-lighter); border-radius: 4px; }
.asset-status-menu :deep(.el-menu-item.is-active) { color: var(--el-color-primary); background: var(--el-color-primary-light-9); }
.status-dot { display: inline-block; width: 7px; height: 7px; margin-right: 9px; border-radius: 50%; background: var(--el-color-success); }
.asset-ledger-content { min-width: 0; flex: 1; overflow-x: auto; overflow-y: visible; padding-bottom: 8px; }
.asset-ledger-content :deep(.el-table) { min-width: 3400px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; margin: 2px 0 12px; color: var(--el-text-color-primary); font-size: 18px; font-weight: 600; }
.image-placeholder { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 18px; color: var(--el-text-color-secondary); background: var(--el-fill-color-light); }
@media (max-width: 900px) { .asset-ledger-query-page .dynamic-navmenu { width: 198px; min-width: 198px; flex-basis: 198px; } }
</style>
