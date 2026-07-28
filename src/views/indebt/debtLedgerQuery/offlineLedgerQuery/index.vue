<template>
  <div v-if="!detailVisible" class="dynamic-container offline-ledger-query-page">
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

  <ContentWrap v-else class="offline-ledger-query-detail">
    <div class="detail-header">
      <el-button link type="primary" @click="backToProjects">
        <Icon icon="ep:arrow-left" class="mr-4px" />返回项目列表
      </el-button>
      <span class="detail-title">{{ currentProject?.projectName }} - 线下台账查询</span>
      <el-tag class="ml-12px" effect="plain">{{ currentProductPlan }}</el-tag>
    </div>

    <el-descriptions v-if="currentProject" :column="4" border class="mb-16px">
      <el-descriptions-item label="项目编号">{{ currentProject.projectNo }}</el-descriptions-item>
      <el-descriptions-item label="项目名称">{{ currentProject.projectName }}</el-descriptions-item>
      <el-descriptions-item label="核心企业名称">{{ currentProject.coreEnterpriseName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ currentProject.coreCustomerNo }}</el-descriptions-item>
    </el-descriptions>

    <div class="section-heading">
      <span>线下台账记录</span>
      <el-tag type="info" effect="plain">共 {{ ledgerRows.length }} 条</el-tag>
    </div>
    <ActionBar :buttons="detailButtons" />
    <Table
      :key="ledgerTableKey"
      :columns="ledgerSchemas.tableColumns"
      :data="ledgerRows"
      :loading="ledgerLoading"
      :pagination="{ total: ledgerRows.length }"
      :show-overflow-tooltip="true"
    >
      <template #action="{ row }">
        <el-button link type="primary" @click="openImage(row)">
          <Icon icon="ep:picture" class="mr-3px" />查看影像
        </el-button>
      </template>
    </Table>
    <div class="ledger-note">说明：生效日期取台账更新审批通过日期；债项管理岗、贷后管理岗意见取对应签署/审批意见。</div>
  </ContentWrap>

  <el-dialog v-model="imageVisible" title="线下台账影像" width="620px" destroy-on-close>
    <el-descriptions v-if="imageRow" :column="1" border>
      <el-descriptions-item label="影像文件">{{ imageRow.imageName }}</el-descriptions-item>
      <el-descriptions-item label="生效日期">{{ imageRow.effectiveDate }}</el-descriptions-item>
      <el-descriptions-item label="线下管理说明">{{ imageRow.offlineManagementDescription }}</el-descriptions-item>
    </el-descriptions>
    <div class="image-placeholder"><Icon icon="ep:document" /> 线下台账、管理说明及审批意见影像（Mock）</div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import DynamicNavmenu from '@/components/dynamicNavmenu/index.vue'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as OfflineLedgerQueryApi from '@/api/indebt/offlineLedgerQuery'

defineOptions({ name: 'OfflineLedgerQuery' })

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
    children: [{ key: 'prepayment-ledger', title: '线下台账查询', plan: 'prepayment' }]
  },
  {
    key: 'pledge',
    title: '货押融资',
    children: [{ key: 'pledge-ledger', title: '线下台账查询', plan: 'pledge' }]
  }
]
const projects = ref<OfflineLedgerQueryApi.OfflineLedgerQueryProject[]>([])
const projectLoading = ref(false)
const projectQuery = reactive({ projectNo: '', projectName: '', coreEnterpriseName: '', coreCustomerNo: '' })
const detailVisible = ref(false)
const currentProject = ref<OfflineLedgerQueryApi.OfflineLedgerQueryProject>()
const ledgerRows = ref<OfflineLedgerQueryApi.OfflineLedgerQueryRecord[]>([])
const ledgerLoading = ref(false)
const ledgerTableKey = ref(0)
const imageVisible = ref(false)
const imageRow = ref<OfflineLedgerQueryApi.OfflineLedgerQueryRecord>()

const projectCrudSchemas = reactive<CrudSchema[]>([
  { label: '项目编号', field: 'projectNo', minWidth: 180, isSearch: true },
  { label: '项目名称', field: 'projectName', minWidth: 220, isSearch: true },
  { label: '核心企业名称', field: 'coreEnterpriseName', minWidth: 240, isSearch: true },
  { label: '核心客户编号', field: 'coreCustomerNo', minWidth: 190, isSearch: true },
  { label: '操作', field: 'action', fixed: 'right', width: 110 }
])
const ledgerCrudSchemas = reactive<CrudSchema[]>([
  { label: '生效日期', field: 'effectiveDate', minWidth: 130 },
  { label: '线下管理说明', field: 'offlineManagementDescription', minWidth: 330 },
  { label: '债项管理岗意见', field: 'debtManagerOpinion', minWidth: 260 },
  { label: '贷后管理岗意见', field: 'postLoanManagerOpinion', minWidth: 260 },
  { label: '操作', field: 'action', fixed: 'right', width: 130 }
])
const { allSchemas: projectSchemas } = useCrudSchemas(projectCrudSchemas)
const { allSchemas: ledgerSchemas } = useCrudSchemas(ledgerCrudSchemas)

const loadProjects = async () => {
  projectLoading.value = true
  try {
    projects.value = await OfflineLedgerQueryApi.getOfflineLedgerQueryProjects({ ...projectQuery, productPlan: currentProductPlan.value })
  } finally { projectLoading.value = false }
}
const handleProjectSearch = (params: Recordable) => { Object.assign(projectQuery, params); loadProjects() }
const handlePlanSelect = (menu: { key: string; plan?: ProductPlanKey }) => {
  if (menu.plan) activePlan.value = menu.plan
  activeMenu.value = menu.key
}
const openProject = async (project: OfflineLedgerQueryApi.OfflineLedgerQueryProject) => {
  currentProject.value = project
  detailVisible.value = true
  await loadLedgerRows()
}
const backToProjects = () => { detailVisible.value = false; currentProject.value = undefined; ledgerRows.value = [] }
const loadLedgerRows = async () => {
  if (!currentProject.value) return
  ledgerLoading.value = true
  try {
    const result = await OfflineLedgerQueryApi.getOfflineLedgerQueryPage({ projectId: currentProject.value.id })
    ledgerRows.value = result.list || result.records || []
    ledgerTableKey.value += 1
  } finally { ledgerLoading.value = false }
}
const openImage = (row: OfflineLedgerQueryApi.OfflineLedgerQueryRecord) => { imageRow.value = row; imageVisible.value = true }
const detailButtons = computed<ActionButton[]>(() => [{
  key: 'export', label: '导出 Excel', icon: 'ep:download', plain: true,
  onClick: () => ElMessage.success('Mock 已生成线下台账查询导出任务')
}])

watch(currentProductPlan, () => { detailVisible.value = false; loadProjects() })
onMounted(loadProjects)
onActivated(loadProjects)
</script>

<style scoped lang="scss">
.offline-ledger-query-page { display: flex; min-width: 0; min-height: calc(100vh - 150px); background: #f5f6f8; }
.offline-ledger-query-page .dynamic-navmenu { width: 228px; min-width: 228px; flex: 0 0 228px; background: #f1f1f1 !important; }
.offline-ledger-query-page .component { min-width: 0; flex: 1; overflow: auto; }
.detail-header { display: flex; align-items: center; min-height: 52px; margin: -4px 0 16px; padding-bottom: 12px; border-bottom: 1px solid var(--el-border-color-lighter); }
.detail-title { margin-left: 20px; color: var(--el-text-color-primary); font-size: 20px; font-weight: 600; }
.section-heading { display: flex; align-items: center; justify-content: space-between; margin: 4px 0 12px; color: var(--el-text-color-primary); font-size: 18px; font-weight: 600; }
.ledger-note { margin-top: 12px; color: var(--el-text-color-secondary); font-size: 13px; }
.image-placeholder { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 18px; color: var(--el-text-color-secondary); background: var(--el-fill-color-light); }
@media (max-width: 900px) { .offline-ledger-query-page .dynamic-navmenu { width: 198px; min-width: 198px; flex-basis: 198px; } }
</style>
