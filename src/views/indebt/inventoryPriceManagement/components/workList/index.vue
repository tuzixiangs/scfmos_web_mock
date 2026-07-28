<template>
  <ContentWrap class="inventory-price-work-list">
    <Search
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      :default-expand="false"
      @search="handleSearch"
      @reset="handleSearch"
    />

    <ActionBar :buttons="visibleButtons" />

    <Table
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{ total: tableObject.total }"
      :selection="currentPhase === 'pending'"
      highlight-current-row
      :show-overflow-tooltip="true"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @cell-click="handleCellClick"
      @selection-change="handleSelectionChange"
      @register="register"
    >
      <template #inboundUnitPrice="{ row }">
        {{ formatAmount(row.inboundUnitPrice) }}
      </template>
      <template #latestUnitPrice="{ row }">
        {{ formatAmount(row.latestUnitPrice) }}
      </template>
      <template #monitoringUnitPrice="{ row }">
        {{ formatAmount(row.monitoringUnitPrice) }}
      </template>
      <template #currentStage="{ row }">
        <el-tag v-if="row.currentStage" type="warning" effect="light">
          {{ row.currentStage }}
        </el-tag>
        <span v-else>-</span>
      </template>
      <template #completedAt="{ row }">
        {{ row.completedAt || '-' }}
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click.stop="openImage(row)">
          <Icon icon="ep:picture" class="mr-3px" />
          查看影像
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <el-dialog
    v-model="createVisible"
    title="新增价格盯市申请"
    width="920px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-alert
      title="请选择一个有效项目。新增完成后，申请默认进入“待提交的价格盯市申请”节点。"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="108px">
      <el-form-item label="项目查询">
        <div class="project-query-row">
          <el-input
            v-model.trim="projectKeyword"
            clearable
            placeholder="请输入项目名称或项目编号"
            @keyup.enter="handleProjectSearch"
          />
          <el-input
            v-model.trim="coreEnterpriseKeyword"
            clearable
            placeholder="请输入核心企业名称"
            @keyup.enter="handleProjectSearch"
          />
          <el-button :loading="projectsLoading" @click="handleProjectSearch">
            <Icon icon="ep:search" class="mr-4px" />查询项目
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="有效项目" prop="projectId">
        <div class="project-picker">
          <el-table
            :data="filteredProjects"
            size="small"
            border
            highlight-current-row
            max-height="220"
            @row-click="selectProject"
          >
            <el-table-column width="58" align="center">
              <template #default="{ row }">
                <el-radio
                  :model-value="String(createForm.projectId)"
                  :label="String(row.id)"
                  @change="selectProject(row)"
                >
                  <span class="sr-only">选择项目</span>
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目名称" min-width="180" />
            <el-table-column prop="projectNo" label="项目编号" min-width="170" />
            <el-table-column prop="coreEnterpriseName" label="核心企业名称" min-width="180" />
            <el-table-column prop="coreCustomerNo" label="核心客户编号" min-width="155" />
          </el-table>
          <el-empty
            v-if="!projectsLoading && !filteredProjects.length"
            :image-size="58"
            description="未找到可用于价格盯市的有效项目"
          />
        </div>
      </el-form-item>
      <div class="price-form-grid">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="createForm.projectName" readonly placeholder="请先从上方选择项目" />
        </el-form-item>
        <el-form-item label="项目编号" prop="projectNo">
          <el-input v-model="createForm.projectNo" readonly placeholder="请先从上方选择项目" />
        </el-form-item>
        <el-form-item label="核心企业名称" prop="coreEnterpriseName">
          <el-input
            v-model="createForm.coreEnterpriseName"
            readonly
            placeholder="请先从上方选择项目"
          />
        </el-form-item>
        <el-form-item label="核心客户编号" prop="coreCustomerNo">
          <el-input
            v-model="createForm.coreCustomerNo"
            readonly
            placeholder="请先从上方选择项目"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="createVisible = false">取 消</el-button>
      <el-button type="primary" :loading="createLoading" @click="handleCreate">保 存</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="detailVisible"
    title="价格盯市申请详情"
    width="1180px"
    top="5vh"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <template v-if="detailRecord">
      <el-descriptions :column="3" border class="mb-16px">
        <el-descriptions-item label="申请编号">{{ detailRecord.applicationNo }}</el-descriptions-item>
        <el-descriptions-item label="申请状态">
          <el-tag :type="statusTagType(detailRecord.phase)" effect="light">
            {{ detailRecord.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请日期">{{ detailRecord.applicationDate }}</el-descriptions-item>
        <el-descriptions-item label="项目名称">{{ detailRecord.projectName }}</el-descriptions-item>
        <el-descriptions-item label="项目编号">{{ detailRecord.projectNo }}</el-descriptions-item>
        <el-descriptions-item label="核心企业名称">{{ detailRecord.coreEnterpriseName }}</el-descriptions-item>
        <el-descriptions-item label="核心客户编号">{{ detailRecord.coreCustomerNo }}</el-descriptions-item>
        <el-descriptions-item label="当前阶段">{{ detailRecord.currentStage || '-' }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ detailRecord.completedAt || '-' }}</el-descriptions-item>
      </el-descriptions>

      <section class="price-item-section">
        <div class="price-item-heading">
          <div>
            <strong>盯市详情单价维护</strong>
            <span>预警线根据价格波动规则自动计算；本次盯市单价低于预警线时会提示预警。</span>
          </div>
          <div v-if="canEditPriceItems" class="price-item-actions">
            <el-button :loading="priceItemsSaving" type="primary" @click="handleSavePriceItems">
              <Icon icon="ep:check" class="mr-4px" />保存
            </el-button>
            <el-button :loading="excelUploading" @click="handleMockUpload">
              <Icon icon="ep:upload" class="mr-4px" />上传 Excel
            </el-button>
            <el-button :loading="templateDownloading" @click="handleDownloadTemplate">
              <Icon icon="ep:download" class="mr-4px" />导出模板
            </el-button>
          </div>
        </div>
        <el-table :data="detailRecord.priceItems || []" border max-height="430">
          <el-table-column label="商品大类" prop="largeCategory" min-width="125" />
          <el-table-column label="商品中类" prop="middleCategory" min-width="125" />
          <el-table-column label="商品小类" prop="smallCategory" min-width="125" />
          <el-table-column label="产地" prop="origin" min-width="165" />
          <el-table-column label="入库单价" min-width="116" align="right">
            <template #default="{ row }">{{ formatAmount(row.inboundUnitPrice) }}</template>
          </el-table-column>
          <el-table-column label="最新单价" min-width="116" align="right">
            <template #default="{ row }">{{ formatAmount(row.latestUnitPrice) }}</template>
          </el-table-column>
          <el-table-column label="本次盯市单价" min-width="155" align="right">
            <template #default="{ row }">
              <el-input-number
                v-if="canEditPriceItems"
                v-model="row.monitoringUnitPrice"
                :min="0"
                :precision="2"
                :controls="false"
                class="price-number-input"
              />
              <span v-else>{{ formatAmount(row.monitoringUnitPrice) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="盯市来源" min-width="150">
            <template #default="{ row }">
              <el-select v-if="canEditPriceItems" v-model="row.monitoringSource" placeholder="请选择来源">
                <el-option label="行业报价" value="行业报价" />
                <el-option label="交易平台" value="交易平台" />
                <el-option label="现场核验" value="现场核验" />
                <el-option label="第三方资讯" value="第三方资讯" />
              </el-select>
              <span v-else>{{ row.monitoringSource || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="盯市预警线" min-width="120" align="right">
            <template #default="{ row }">{{ formatAmount(warningLineOf(row)) }}</template>
          </el-table-column>
          <el-table-column label="预警状态" fixed="right" width="105">
            <template #default="{ row }">
              <el-tag :type="isPriceWarning(row) ? 'danger' : 'success'" effect="light">
                {{ isPriceWarning(row) ? '低于预警线' : '正常' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="!(detailRecord.priceItems || []).length" description="该项目暂无可维护的商品盯市信息" />
      </section>
    </template>
    <template #footer>
      <el-button @click="detailVisible = false">关 闭</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="signOpinionVisible" title="签署意见" width="600px" destroy-on-close>
    <el-form label-width="92px">
      <el-form-item label="当前申请">
        <el-input :model-value="currentRecord?.applicationNo || ''" readonly />
      </el-form-item>
      <el-form-item label="意见内容" required>
        <el-input
          v-model="signOpinionContent"
          type="textarea"
          :rows="5"
          maxlength="500"
          show-word-limit
          placeholder="请输入签署意见"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="signOpinionVisible = false">取 消</el-button>
      <el-button type="primary" :loading="signOpinionLoading" @click="handleSignOpinion">确 定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="batchSubmitVisible" title="批量提交价格盯市申请" width="620px" destroy-on-close>
    <el-alert
      :title="`已选择 ${selectedRecords.length} 条待提交申请，可统一签署意见后批量提交。`"
      type="warning"
      :closable="false"
      class="mb-16px"
    />
    <el-form label-width="92px">
      <el-form-item label="签署意见">
        <el-input
          v-model="batchSubmitOpinion"
          type="textarea"
          :rows="5"
          maxlength="500"
          show-word-limit
          placeholder="请输入统一签署意见（选填）"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="batchSubmitVisible = false">取 消</el-button>
      <el-button type="primary" :loading="batchSubmitting" @click="handleBatchSubmit">确认提交</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="opinionVisible" title="查看意见" width="720px" destroy-on-close>
    <el-timeline v-if="opinionRecord?.opinions?.length" class="price-timeline">
      <el-timeline-item
        v-for="opinion in opinionRecord.opinions"
        :key="opinion.id"
        :timestamp="`${opinion.signer} · ${opinion.signedAt}`"
        placement="top"
      >
        {{ opinion.content }}
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无已签署意见" />
  </el-dialog>

  <el-dialog v-model="historyVisible" title="查看流转记录" width="680px" destroy-on-close>
    <el-timeline class="price-timeline">
      <el-timeline-item :timestamp="historyRecord?.applicationDate || ''" placement="top">
        已创建价格盯市申请，进入“待提交”节点。
      </el-timeline-item>
      <el-timeline-item
        v-if="historyRecord && historyRecord.phase !== 'pending'"
        :timestamp="historyRecord.completedAt || '流程处理中'"
        type="primary"
        placement="top"
      >
        {{ historyRecord.currentStage || historyRecord.status || '审查审批中' }}
      </el-timeline-item>
      <el-timeline-item
        v-if="historyRecord?.completedAt"
        :timestamp="historyRecord.completedAt"
        :type="historyRecord.phase === 'approved' ? 'success' : 'danger'"
        placement="top"
      >
        {{ historyRecord.phase === 'approved' ? '审批通过，流程完成。' : '审批结束。' }}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>

  <el-dialog v-model="trendVisible" title="查看单价趋势" width="860px" destroy-on-close>
    <el-alert
      :title="`项目：${trendRecord?.projectName || '-'}（${trendRecord?.projectNo || '-'}）`"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <el-table :data="trendRows" border max-height="430" v-loading="trendLoading">
      <el-table-column prop="date" label="盯市日期" min-width="145" />
      <el-table-column prop="smallCategory" label="商品小类" min-width="145" />
      <el-table-column prop="origin" label="产地" min-width="160" />
      <el-table-column label="入库单价" min-width="120" align="right">
        <template #default="{ row }">{{ formatAmount(row.inboundUnitPrice) }}</template>
      </el-table-column>
      <el-table-column label="最新单价" min-width="120" align="right">
        <template #default="{ row }">{{ formatAmount(row.latestUnitPrice) }}</template>
      </el-table-column>
      <el-table-column label="盯市单价" min-width="120" align="right">
        <template #default="{ row }">{{ formatAmount(row.monitoringUnitPrice) }}</template>
      </el-table-column>
      <el-table-column label="预警线" min-width="110" align="right">
        <template #default="{ row }">{{ formatAmount(row.warningLine) }}</template>
      </el-table-column>
    </el-table>
    <el-empty v-if="!trendLoading && !trendRows.length" description="暂无单价趋势数据" />
  </el-dialog>

  <el-dialog v-model="imageVisible" title="价格盯市申请影像" width="760px" destroy-on-close>
    <el-alert
      :title="`申请编号：${imageRecord?.applicationNo || ''}`"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <div class="image-file-list">
      <div v-for="image in imageItems" :key="image.id" class="image-file-card">
        <Icon :icon="image.icon" class="image-file-icon" />
        <div>
          <strong>{{ image.name }}</strong>
          <p>{{ image.description }}</p>
        </div>
        <el-button link type="primary" @click="ElMessage.info('当前为 Mock 演示影像，可在此接入实际影像系统')">
          预览
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as InventoryPriceApi from '@/api/indebt/inventoryPriceManagement'

defineOptions({ name: 'InventoryPriceApplicationWorkList' })

type PriceApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'

interface PriceOpinion {
  id: number | string
  content: string
  signer: string
  signedAt: string
}

interface PriceItem {
  id: number | string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  origin: string
  inboundUnitPrice: number
  latestUnitPrice: number
  monitoringUnitPrice: number
  monitoringSource: string
  warningRate?: number
  warningLine?: number
}

interface InventoryPriceRecord {
  id: number | string
  phase: PriceApplicationPhase
  status: string
  applicationNo: string
  projectNo: string
  projectName: string
  coreEnterpriseName: string
  coreCustomerNo: string
  largeCategory: string
  middleCategory: string
  smallCategory: string
  origin: string
  inboundUnitPrice: number
  latestUnitPrice: number
  monitoringUnitPrice: number
  monitoringSource: string
  applicationDate: string
  currentStage?: string
  completedAt?: string
  opinions?: PriceOpinion[]
  priceItems?: PriceItem[]
}

interface InventoryPriceProject {
  id: number | string
  projectName: string
  projectNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
}

interface CreateForm {
  projectId: number | string | ''
  projectName: string
  projectNo: string
  coreEnterpriseName: string
  coreCustomerNo: string
}

interface PriceTrendRow {
  date: string
  smallCategory: string
  origin: string
  inboundUnitPrice: number
  latestUnitPrice: number
  monitoringUnitPrice: number
  warningLine: number
}

interface ImageFile {
  id: number | string
  name: string
  description: string
  icon: string
}

interface PricePageResult {
  total: number
  list: InventoryPriceRecord[]
  records?: InventoryPriceRecord[]
  pageNo?: number
  pageSize?: number
}

const props = defineProps<{
  params?: {
    phase?: PriceApplicationPhase
  }
}>()

const validPhases: PriceApplicationPhase[] = ['pending', 'reviewing', 'rejected', 'approved']
const isPriceApplicationPhase = (value: unknown): value is PriceApplicationPhase =>
  validPhases.includes(value as PriceApplicationPhase)
const currentPhase = computed<PriceApplicationPhase>(() =>
  isPriceApplicationPhase(props.params?.phase) ? props.params.phase : 'pending'
)

type ApiFunction = (...args: any[]) => Promise<any>
const api = InventoryPriceApi as unknown as Record<string, ApiFunction>
const callApi = async <T,>(name: string, ...args: any[]): Promise<T> => {
  const fn = api[name]
  if (typeof fn !== 'function') {
    throw new Error(`存货类价格管理 Mock 未提供 ${name} 接口`)
  }
  return fn(...args) as Promise<T>
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '申请编号',
    field: 'applicationNo',
    fixed: 'left',
    minWidth: 175,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入申请编号' } }
  },
  {
    label: '项目编号',
    field: 'projectNo',
    minWidth: 165,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入项目编号' } }
  },
  {
    label: '项目名称',
    field: 'projectName',
    minWidth: 180,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入项目名称' } }
  },
  { label: '商品大类', field: 'largeCategory', minWidth: 125 },
  { label: '商品中类', field: 'middleCategory', minWidth: 125 },
  {
    label: '商品小类',
    field: 'smallCategory',
    minWidth: 125,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入商品小类' } }
  },
  {
    label: '产地',
    field: 'origin',
    minWidth: 160,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入产地' } }
  },
  { label: '入库单价', field: 'inboundUnitPrice', minWidth: 116 },
  { label: '最新单价', field: 'latestUnitPrice', minWidth: 116 },
  { label: '本次盯市单价', field: 'monitoringUnitPrice', minWidth: 140 },
  { label: '盯市来源', field: 'monitoringSource', minWidth: 140 },
  { label: '申请日期', field: 'applicationDate', minWidth: 130 },
  { label: '当前阶段', field: 'currentStage', minWidth: 170 },
  { label: '完成时间', field: 'completedAt', minWidth: 170 },
  { label: '操作', field: 'action', fixed: 'right', width: 106 }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const tableColumns = computed(() =>
  currentPhase.value === 'pending'
    ? allSchemas.tableColumns.filter(
        (column) => column.field !== 'currentStage' && column.field !== 'completedAt'
      )
    : allSchemas.tableColumns
)

const getCurrentPage = async (params: Recordable): Promise<PricePageResult> => {
  const result = await callApi<PricePageResult>('getInventoryPriceApplicationPage', {
    ...params,
    phase: currentPhase.value
  })
  const list = Array.isArray(result?.list)
    ? result.list.map((record) => normalizePriceRecord(record, currentPhase.value))
    : Array.isArray(result?.records)
      ? result.records.map((record) => normalizePriceRecord(record, currentPhase.value))
      : []
  return { ...result, list, records: list }
}

const { register, tableObject, tableMethods } = useTable<InventoryPriceRecord>({
  getListApi: getCurrentPage,
  defaultParams: { phase: currentPhase.value }
})
const { getList, setSearchParams } = tableMethods

const createVisible = ref(false)
const createLoading = ref(false)
const createFormRef = ref<FormInstance>()
const projectKeyword = ref('')
const coreEnterpriseKeyword = ref('')
const projectsLoading = ref(false)
const availableProjects = ref<InventoryPriceProject[]>([])
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailRecord = ref<InventoryPriceRecord>()
const priceItemsSaving = ref(false)
const excelUploading = ref(false)
const templateDownloading = ref(false)
const signOpinionVisible = ref(false)
const signOpinionContent = ref('')
const signOpinionLoading = ref(false)
const batchSubmitVisible = ref(false)
const batchSubmitOpinion = ref('')
const batchSubmitting = ref(false)
const opinionVisible = ref(false)
const opinionRecord = ref<InventoryPriceRecord>()
const historyVisible = ref(false)
const historyRecord = ref<InventoryPriceRecord>()
const trendVisible = ref(false)
const trendLoading = ref(false)
const trendRecord = ref<InventoryPriceRecord>()
const trendRows = ref<PriceTrendRow[]>([])
const imageVisible = ref(false)
const imageRecord = ref<InventoryPriceRecord>()
const imageItems = ref<ImageFile[]>([])
const actionLoading = ref<'submit' | 'withdraw' | ''>('')
const selectedRecords = ref<InventoryPriceRecord[]>([])

const initialCreateForm = (): CreateForm => ({
  projectId: '',
  projectName: '',
  projectNo: '',
  coreEnterpriseName: '',
  coreCustomerNo: ''
})
const createForm = reactive<CreateForm>(initialCreateForm())
const createRules: FormRules<CreateForm> = {
  projectId: [{ required: true, message: '请选择一个有效项目', trigger: 'change' }],
  projectName: [{ required: true, message: '请选择项目', trigger: 'change' }],
  projectNo: [{ required: true, message: '请选择项目', trigger: 'change' }],
  coreEnterpriseName: [{ required: true, message: '请选择项目', trigger: 'change' }],
  coreCustomerNo: [{ required: true, message: '请选择项目', trigger: 'change' }]
}

const currentRecord = computed(() => tableObject.currentRow || undefined)
const canEditPriceItems = computed(
  () => detailRecord.value?.phase === 'pending' && currentPhase.value === 'pending'
)
const filteredProjects = computed(() => {
  const keyword = projectKeyword.value.trim().toLowerCase()
  const coreEnterprise = coreEnterpriseKeyword.value.trim().toLowerCase()
  if (!keyword && !coreEnterprise) return availableProjects.value
  return availableProjects.value.filter((project) =>
    (!keyword ||
      [project.projectName, project.projectNo]
        .join('|')
        .toLowerCase()
        .includes(keyword)) &&
    (!coreEnterprise || project.coreEnterpriseName.toLowerCase().includes(coreEnterprise))
  )
})

const toText = (value: unknown) => (value === undefined || value === null ? '' : String(value))
const toNumber = (value: unknown) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}
const roundAmount = (value: number) => Math.round((Number(value) || 0) * 100) / 100
const formatAmount = (value: unknown) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '-'
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const normalizePriceItem = (value: unknown): PriceItem => {
  const item = (value || {}) as Record<string, unknown>
  return {
    id: (item.id ?? item.itemId ?? 0) as number | string,
    largeCategory: toText(item.largeCategory ?? item.largeCategoryName),
    middleCategory: toText(item.middleCategory ?? item.middleCategoryName),
    smallCategory: toText(item.smallCategory ?? item.smallCategoryName),
    origin: toText(item.origin),
    inboundUnitPrice: toNumber(item.inboundUnitPrice ?? item.warehouseUnitPrice ?? item.storageUnitPrice),
    latestUnitPrice: toNumber(item.latestUnitPrice ?? item.newestUnitPrice),
    monitoringUnitPrice: toNumber(
      item.monitoringUnitPrice ?? item.currentMonitoringUnitPrice ?? item.currentPrice
    ),
    monitoringSource: toText(item.monitoringSource ?? item.priceSource),
    warningRate: toNumber(item.warningRate),
    warningLine: toNumber(item.warningLine ?? item.priceWarningLine)
  }
}

const normalizePriceRecord = (
  value: unknown,
  fallbackPhase: PriceApplicationPhase = currentPhase.value
): InventoryPriceRecord => {
  const record = (value || {}) as Record<string, unknown>
  const rawItems = Array.isArray(record.priceItems)
    ? record.priceItems
    : Array.isArray(record.items)
      ? record.items
      : []
  const rawOpinions = Array.isArray(record.opinions) ? record.opinions : []
  const phase = isPriceApplicationPhase(record.phase) ? record.phase : fallbackPhase
  return {
    id: (record.id ?? record.applicationId ?? 0) as number | string,
    phase,
    status: toText(record.status || phaseLabel(phase)),
    applicationNo: toText(record.applicationNo ?? record.applicationNumber),
    projectNo: toText(record.projectNo ?? record.projectCode),
    projectName: toText(record.projectName),
    coreEnterpriseName: toText(record.coreEnterpriseName),
    coreCustomerNo: toText(record.coreCustomerNo ?? record.coreCustomerId),
    largeCategory: toText(record.largeCategory ?? record.largeCategoryName ?? rawItems[0]?.largeCategory),
    middleCategory: toText(record.middleCategory ?? record.middleCategoryName ?? rawItems[0]?.middleCategory),
    smallCategory: toText(record.smallCategory ?? record.smallCategoryName ?? rawItems[0]?.smallCategory),
    origin: toText(record.origin ?? rawItems[0]?.origin),
    inboundUnitPrice: toNumber(record.inboundUnitPrice ?? rawItems[0]?.inboundUnitPrice),
    latestUnitPrice: toNumber(record.latestUnitPrice ?? rawItems[0]?.latestUnitPrice),
    monitoringUnitPrice: toNumber(record.monitoringUnitPrice ?? rawItems[0]?.monitoringUnitPrice),
    monitoringSource: toText(record.monitoringSource ?? rawItems[0]?.monitoringSource),
    applicationDate: toText(record.applicationDate ?? record.applyDate),
    currentStage: toText(record.currentStage),
    completedAt: toText(record.completedAt ?? record.completeTime),
    opinions: rawOpinions.map((opinion: unknown, index: number) => {
      const normalized = (opinion || {}) as Record<string, unknown>
      return {
        id: (normalized.id ?? index) as number | string,
        content: toText(normalized.content ?? normalized.opinion),
        signer: toText(normalized.signer ?? normalized.userName),
        signedAt: toText(normalized.signedAt ?? normalized.createTime)
      }
    }),
    priceItems: rawItems.map(normalizePriceItem)
  }
}

const normalizeProject = (value: unknown): InventoryPriceProject => {
  const project = (value || {}) as Record<string, unknown>
  return {
    id: (project.id ?? project.projectId ?? 0) as number | string,
    projectName: toText(project.projectName),
    projectNo: toText(project.projectNo ?? project.projectCode),
    coreEnterpriseName: toText(project.coreEnterpriseName),
    coreCustomerNo: toText(project.coreCustomerNo ?? project.coreCustomerId)
  }
}

const phaseLabel = (phase: PriceApplicationPhase) => {
  if (phase === 'approved') return '审批通过'
  if (phase === 'rejected') return '被否决'
  if (phase === 'reviewing') return '审查审批中'
  return '待提交'
}

const statusTagType = (phase: PriceApplicationPhase) => {
  if (phase === 'approved') return 'success'
  if (phase === 'rejected') return 'danger'
  if (phase === 'reviewing') return 'warning'
  return 'info'
}

const warningRateOf = (item: PriceItem) => {
  const configuredRate = Number(item.warningRate)
  if (configuredRate >= 0 && configuredRate < 1) return configuredRate

  const sourcePrice = Number(item.monitoringUnitPrice) || Number(item.latestUnitPrice)
  const existingLine = Number(item.warningLine)
  if (sourcePrice > 0 && existingLine > 0 && existingLine <= sourcePrice) {
    return 1 - existingLine / sourcePrice
  }
  return 0.1
}
const warningLineOf = (item: PriceItem) => {
  const sourcePrice = Number(item.monitoringUnitPrice) || Number(item.latestUnitPrice)
  return roundAmount(sourcePrice * (1 - warningRateOf(item)))
}
const isPriceWarning = (item: PriceItem) => {
  const monitoringPrice = Number(item.monitoringUnitPrice)
  return monitoringPrice > 0 && monitoringPrice < warningLineOf(item)
}

const isFailedResult = (result: unknown): result is { success: false; message?: string } =>
  typeof result === 'object' && result !== null && 'success' in result && result.success === false

const resultRecord = (result: unknown): InventoryPriceRecord | undefined => {
  if (!result || typeof result !== 'object') return undefined
  if ('record' in result && (result as { record?: unknown }).record) {
    return normalizePriceRecord((result as { record: unknown }).record)
  }
  if ('id' in result) return normalizePriceRecord(result)
  return undefined
}

const setCurrentRecord = (record: InventoryPriceRecord) => {
  tableObject.currentRow = record
}

const handleCellClick = (record: InventoryPriceRecord) => {
  setCurrentRecord(record)
}

const handleSelectionChange = (records: InventoryPriceRecord[]) => {
  selectedRecords.value = Array.isArray(records) ? records : []
}

const requireCurrentRecord = (): InventoryPriceRecord | undefined => {
  if (!currentRecord.value) {
    ElMessage.warning('请先点击选择一条价格盯市申请')
    return undefined
  }
  return currentRecord.value
}

const refreshList = async () => {
  tableObject.currentRow = null
  selectedRecords.value = []
  await getList()
}

const handleSearch = (params: Recordable) => {
  tableObject.currentRow = null
  selectedRecords.value = []
  setSearchParams({ ...params, phase: currentPhase.value })
}

const loadAvailableProjects = async () => {
  projectsLoading.value = true
  try {
    const result = await callApi<unknown>('getAvailableInventoryPriceProjects', {
      projectName: projectKeyword.value.trim() || undefined,
      coreEnterpriseName: coreEnterpriseKeyword.value.trim() || undefined
    })
    const rawProjects = Array.isArray(result)
      ? result
      : Array.isArray((result as { list?: unknown[] })?.list)
        ? (result as { list: unknown[] }).list
        : []
    availableProjects.value = rawProjects.map(normalizeProject)
  } catch (error) {
    availableProjects.value = []
    ElMessage.error(error instanceof Error ? error.message : '获取有效项目失败')
  } finally {
    projectsLoading.value = false
  }
}

const handleProjectSearch = async () => loadAvailableProjects()

const selectProject = (project: InventoryPriceProject) => {
  Object.assign(createForm, {
    projectId: project.id,
    projectName: project.projectName,
    projectNo: project.projectNo,
    coreEnterpriseName: project.coreEnterpriseName,
    coreCustomerNo: project.coreCustomerNo
  })
  createFormRef.value?.validateField(['projectId', 'projectName', 'projectNo'])
}

const openCreate = async () => {
  Object.assign(createForm, initialCreateForm())
  projectKeyword.value = ''
  coreEnterpriseKeyword.value = ''
  createFormRef.value?.clearValidate()
  createVisible.value = true
  await loadAvailableProjects()
}

const handleCreate = async () => {
  const valid = await createFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)
  if (!valid) return

  createLoading.value = true
  try {
    const result = await callApi<unknown>('createInventoryPriceApplication', {
      projectId: Number(createForm.projectId)
    })
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '新增价格盯市申请失败')
      return
    }
    ElMessage.success('新增成功，申请已进入待提交节点')
    createVisible.value = false
    if (currentPhase.value === 'pending') await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '新增价格盯市申请失败')
  } finally {
    createLoading.value = false
  }
}

const getDetail = async (record: InventoryPriceRecord) => {
  const result = await callApi<unknown>('getInventoryPriceApplicationDetail', record.id)
  if (isFailedResult(result)) {
    ElMessage.error(result.message || '未获取到价格盯市申请详情')
    return undefined
  }
  return resultRecord(result)
}

const openDetail = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  detailLoading.value = true
  try {
    const detail = await getDetail(record)
    if (!detail) return
    detailRecord.value = detail
    detailVisible.value = true
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取价格盯市申请详情失败')
  } finally {
    detailLoading.value = false
  }
}

const handleSavePriceItems = async () => {
  if (!detailRecord.value) return
  const invalidItem = (detailRecord.value.priceItems || []).find(
    (item) => !Number(item.monitoringUnitPrice) || !item.monitoringSource
  )
  if (invalidItem) {
    ElMessage.warning('请补充每条商品的本次盯市单价和盯市来源')
    return
  }

  priceItemsSaving.value = true
  try {
    const result = await callApi<unknown>('saveInventoryPriceItems', detailRecord.value.id, {
      items: (detailRecord.value.priceItems || []).map((item) => ({
        id: item.id,
        monitoringUnitPrice: item.monitoringUnitPrice,
        monitoringSource: item.monitoringSource
      }))
    })
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '保存盯市单价失败')
      return
    }
    const savedRecord = resultRecord(result)
    if (savedRecord) detailRecord.value = savedRecord
    ElMessage.success('盯市单价维护已保存')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存盯市单价失败')
  } finally {
    priceItemsSaving.value = false
  }
}

const handleMockUpload = async () => {
  if (!detailRecord.value) return
  excelUploading.value = true
  try {
    const result = await callApi<unknown>(
      'uploadInventoryPriceExcel',
      detailRecord.value.id,
      '价格盯市单价导入.xlsx'
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '上传 Excel 失败')
      return
    }
    const savedRecord = resultRecord(result)
    if (savedRecord) detailRecord.value = savedRecord
    ElMessage.success('已模拟上传 Excel，并按导入数据更新商品盯市单价')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '上传 Excel 失败')
  } finally {
    excelUploading.value = false
  }
}

const handleDownloadTemplate = async () => {
  templateDownloading.value = true
  try {
    await callApi<unknown>('getInventoryPriceExcelTemplate')
    ElMessage.success('已生成价格盯市导入模板（Mock）')
  } catch (error) {
    ElMessage.info('已模拟导出价格盯市导入模板')
  } finally {
    templateDownloading.value = false
  }
}

const openSignOpinion = () => {
  if (!requireCurrentRecord()) return
  signOpinionContent.value = ''
  signOpinionVisible.value = true
}

const handleSignOpinion = async () => {
  const record = requireCurrentRecord()
  const content = signOpinionContent.value.trim()
  if (!record || !content) {
    if (!content) ElMessage.warning('请输入签署意见')
    return
  }

  signOpinionLoading.value = true
  try {
    const result = await callApi<unknown>('signInventoryPriceApplicationOpinion', record.id, content)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '签署意见失败')
      return
    }
    ElMessage.success('意见已签署')
    signOpinionVisible.value = false
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '签署意见失败')
  } finally {
    signOpinionLoading.value = false
  }
}

const openOpinion = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  try {
    const detail = await getDetail(record)
    if (!detail) return
    opinionRecord.value = detail
    opinionVisible.value = true
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取意见失败')
  }
}

const openHistory = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  try {
    const detail = await getDetail(record)
    if (!detail) return
    historyRecord.value = detail
    historyVisible.value = true
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取流转记录失败')
  }
}

const handleTransition = async (type: 'submit' | 'withdraw') => {
  const record = requireCurrentRecord()
  if (!record) return
  const actionLabel = type === 'submit' ? '提交' : '收回'
  try {
    await ElMessageBox.confirm(
      `确认${actionLabel}价格盯市申请“${record.applicationNo}”吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  actionLoading.value = type
  try {
    const result =
      type === 'submit'
        ? await callApi<unknown>('submitInventoryPriceApplication', record.id)
        : await callApi<unknown>('withdrawInventoryPriceApplication', record.id)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || `${actionLabel}失败`)
      return
    }
    ElMessage.success(`${actionLabel}成功`)
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : `${actionLabel}失败`)
  } finally {
    actionLoading.value = ''
  }
}

const openBatchSubmit = () => {
  if (!selectedRecords.value.length) {
    ElMessage.warning('请先勾选需要批量提交的价格盯市申请')
    return
  }
  batchSubmitOpinion.value = ''
  batchSubmitVisible.value = true
}

const handleBatchSubmit = async () => {
  if (!selectedRecords.value.length) return
  batchSubmitting.value = true
  try {
    const result = await callApi<unknown>(
      'batchSubmitInventoryPriceApplications',
      selectedRecords.value.map((record) => record.id),
      batchSubmitOpinion.value.trim()
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '批量提交失败')
      return
    }
    const submitted = Number((result as { submitted?: unknown })?.submitted)
    ElMessage.success(`批量提交成功${Number.isFinite(submitted) ? `，共 ${submitted} 条` : ''}`)
    batchSubmitVisible.value = false
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '批量提交失败')
  } finally {
    batchSubmitting.value = false
  }
}

const normalizeTrendRow = (value: unknown, fallback: InventoryPriceRecord): PriceTrendRow => {
  const row = (value || {}) as Record<string, unknown>
  return {
    date: toText(row.date ?? row.monitoringDate ?? row.applyDate),
    smallCategory: toText(row.smallCategory ?? row.smallCategoryName ?? fallback.smallCategory),
    origin: toText(row.origin ?? fallback.origin),
    inboundUnitPrice: toNumber(row.inboundUnitPrice ?? fallback.inboundUnitPrice),
    latestUnitPrice: toNumber(row.latestUnitPrice ?? fallback.latestUnitPrice),
    monitoringUnitPrice: toNumber(row.monitoringUnitPrice ?? row.currentPrice ?? fallback.monitoringUnitPrice),
    warningLine: toNumber(row.warningLine ?? row.priceWarningLine ?? fallback.latestUnitPrice * 0.9)
  }
}

const openTrend = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  trendRecord.value = record
  trendRows.value = []
  trendVisible.value = true
  trendLoading.value = true
  try {
    const result = await callApi<unknown>('getInventoryPriceTrend', record.id)
    const trendResult = (result || {}) as {
      list?: unknown[]
      points?: Array<{ date?: unknown; value?: unknown; label?: unknown }>
      warningLine?: unknown
    }
    const rawRows = Array.isArray(result)
      ? result
      : Array.isArray(trendResult.list)
        ? trendResult.list
        : Array.isArray(trendResult.points)
          ? trendResult.points.map((point) => ({
              ...point,
              monitoringUnitPrice: point.value,
              warningLine: trendResult.warningLine
            }))
          : []
    trendRows.value = rawRows.map((row) => normalizeTrendRow(row, record))
  } catch (error) {
    trendRows.value = (record.priceItems || []).map((item) => ({
      date: record.applicationDate,
      smallCategory: item.smallCategory,
      origin: item.origin,
      inboundUnitPrice: item.inboundUnitPrice,
      latestUnitPrice: item.latestUnitPrice,
      monitoringUnitPrice: item.monitoringUnitPrice,
      warningLine: warningLineOf(item)
    }))
    ElMessage.info('当前展示本申请的 Mock 单价快照')
  } finally {
    trendLoading.value = false
  }
}

const defaultImages = (record: InventoryPriceRecord): ImageFile[] => [
  {
    id: 'price-quotation',
    name: '价格报价单',
    description: `${record.smallCategory || '商品'}价格来源附件`,
    icon: 'ep:document'
  },
  {
    id: 'warehouse-document',
    name: '入库单据',
    description: `项目 ${record.projectNo || '-'} 的入库价格依据`,
    icon: 'ep:files'
  },
  {
    id: 'market-screen',
    name: '盯市截图',
    description: '最新市场价格及盯市依据',
    icon: 'ep:picture'
  }
]

const normalizeImage = (value: unknown, index: number): ImageFile => {
  const image = (value || {}) as Record<string, unknown>
  return {
    id: (image.id ?? index) as number | string,
    name: toText(image.name ?? image.fileName ?? `盯市影像${index + 1}`),
    description: toText(image.description ?? image.uploadedAt ?? image.createTime ?? '价格盯市申请影像材料'),
    icon: toText(image.icon) || 'ep:document'
  }
}

const openImage = async (record: InventoryPriceRecord) => {
  setCurrentRecord(record)
  imageRecord.value = record
  imageItems.value = defaultImages(record)
  imageVisible.value = true
  try {
    const result = await callApi<unknown>('getInventoryPriceApplicationImages', record.id)
    const rawImages = Array.isArray(result)
      ? result
      : Array.isArray((result as { list?: unknown[] })?.list)
        ? (result as { list: unknown[] }).list
        : []
    if (rawImages.length) imageItems.value = rawImages.map(normalizeImage)
  } catch {
    // 影像接口缺失时保留结构化 Mock 影像，页面仍可正常演示。
  }
}

const visibleButtons = computed<ActionButton[]>(() => {
  const detailButton: ActionButton = {
    key: 'detail',
    label: '详情',
    icon: 'ep:document',
    plain: true,
    onClick: openDetail
  }
  const opinionButton: ActionButton = {
    key: 'view-opinion',
    label: '查看意见',
    icon: 'ep:chat-line-square',
    plain: true,
    onClick: openOpinion
  }
  const historyButton: ActionButton = {
    key: 'view-history',
    label: '查看流转记录',
    icon: 'ep:connection',
    plain: true,
    onClick: openHistory
  }
  const trendButton: ActionButton = {
    key: 'view-trend',
    label: '查看单价趋势',
    icon: 'ep:trend-charts',
    plain: true,
    onClick: openTrend
  }

  if (currentPhase.value === 'pending') {
    return [
      {
        key: 'create',
        label: '新增',
        icon: 'ep:plus',
        plain: true,
        onClick: openCreate
      },
      detailButton,
      {
        key: 'sign-opinion',
        label: '签署意见',
        icon: 'ep:edit-pen',
        plain: true,
        onClick: openSignOpinion
      },
      {
        key: 'submit',
        label: '提交',
        icon: 'ep:promotion',
        plain: true,
        loading: actionLoading.value === 'submit',
        onClick: () => handleTransition('submit')
      },
      {
        key: 'batch-submit',
        label: '批量提交',
        icon: 'ep:finished',
        plain: true,
        onClick: openBatchSubmit
      },
      trendButton
    ]
  }

  if (currentPhase.value === 'reviewing') {
    return [
      detailButton,
      opinionButton,
      historyButton,
      {
        key: 'withdraw',
        label: '收回',
        icon: 'ep:back',
        plain: true,
        loading: actionLoading.value === 'withdraw',
        onClick: () => handleTransition('withdraw')
      }
    ]
  }

  return currentPhase.value === 'approved'
    ? [detailButton, opinionButton, historyButton, trendButton]
    : [detailButton, opinionButton, historyButton]
})

watch(
  currentPhase,
  (phase) => {
    tableObject.currentRow = null
    tableObject.currentPage = 1
    selectedRecords.value = []
    setSearchParams({ ...tableObject.params, phase })
  },
  { immediate: true }
)

onActivated(() => {
  getList()
})
</script>

<style scoped lang="scss">
.inventory-price-work-list {
  min-width: 0;
}

.project-query-row {
  display: flex;
  width: 100%;
  gap: 10px;
}

.project-query-row .el-input {
  flex: 1;
}

.project-picker {
  width: 100%;
}

.price-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.price-item-section {
  min-width: 0;
}

.price-item-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;

  strong {
    display: block;
    color: #27364b;
    font-size: 15px;
  }

  span {
    display: block;
    margin-top: 5px;
    color: #8492a6;
    font-size: 13px;
  }
}

.price-item-actions {
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
}

.price-number-input {
  width: 118px;
}

.price-timeline {
  padding: 8px 12px 0;
}

.image-file-list {
  display: grid;
  gap: 12px;
}

.image-file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 12px 16px;
  border: 1px solid #e3e9f2;
  border-radius: 6px;
  background: #fafcff;

  .image-file-icon {
    flex: 0 0 auto;
    color: #3d7ad6;
    font-size: 28px;
  }

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    color: #27364b;
    font-weight: 600;
  }

  p {
    margin: 5px 0 0;
    color: #8492a6;
    font-size: 13px;
  }
}

@media (max-width: 900px) {
  .price-form-grid {
    grid-template-columns: 1fr;
  }

  .price-item-heading {
    display: block;
  }

  .price-item-actions {
    flex-wrap: wrap;
    margin-top: 12px;
  }
}
</style>
