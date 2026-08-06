<template>
  <ContentWrap class="asset-management-work-list">
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
      <template #outboundAmount="{ row }">
        {{ formatAmount(row.outboundAmount) }}
      </template>
      <template #inboundValue="{ row }">
        {{ formatAmount(row.inboundValue) }}
      </template>
      <template #currency="{ row }">
        {{ row.currency || '-' }}
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
    title="新增债项资产入库申请"
    width="860px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form
      ref="createFormRef"
      :model="createForm"
      :rules="createRules"
      label-width="118px"
      class="create-project-form"
    >
      <div class="arrival-form-grid">
        <el-form-item label="项目名称" prop="projectId">
          <el-input
            v-model="createForm.projectName"
            readonly
            class="project-picker-input"
            placeholder="请选择项目"
            @click="openProjectPicker"
          >
            <template #suffix>
              <Icon icon="ep:search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="项目编号" prop="projectNo">
          <el-input v-model="createForm.projectNo" readonly placeholder="选择项目后自动反显" />
        </el-form-item>
        <el-form-item label="链属客户名称" prop="linkedCustomerName">
          <el-input
            v-model="createForm.linkedCustomerName"
            readonly
            placeholder="选择项目后自动反显"
          />
        </el-form-item>
        <el-form-item label="授信编号" prop="creditNo">
          <el-input v-model="createForm.creditNo" readonly placeholder="选择项目后自动反显" />
        </el-form-item>
        <el-form-item label="产品方案" prop="productPlan">
          <el-input v-model="createForm.productPlan" readonly placeholder="选择项目后自动反显" />
        </el-form-item>
        <el-form-item label="业务合同编号" prop="businessContractNo">
          <el-input
            v-model="createForm.businessContractNo"
            readonly
            placeholder="选择项目后自动反显"
          />
        </el-form-item>
        <el-form-item label="入库类型" prop="inboundType">
          <el-select v-model="createForm.inboundType" class="w-full" placeholder="请选择入库类型">
            <el-option label="部分入库" value="部分入库" />
            <el-option label="已完成入库" value="已完成入库" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="createVisible = false">取 消</el-button>
      <el-button type="primary" :loading="createLoading" @click="handleCreate">保 存</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="projectPickerVisible"
    title="选择有效项目"
    width="1080px"
    top="8vh"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-alert
      title="请选择仍有待确认资产且未存在在途入库申请的有效项目。"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <div class="project-query-row mb-16px">
      <el-input
        v-model.trim="projectKeyword"
        clearable
        placeholder="请输入项目名称或项目编号"
        @keyup.enter="loadAvailableProjects"
      />
      <el-input
        v-model.trim="linkedCustomerKeyword"
        clearable
        placeholder="请输入链属客户名称"
        @keyup.enter="loadAvailableProjects"
      />
      <el-button :loading="projectsLoading" @click="loadAvailableProjects">
        <Icon icon="ep:search" class="mr-4px" />查询项目
      </el-button>
    </div>
    <div class="project-picker" v-loading="projectsLoading">
      <el-table
        :data="availableProjects"
        size="small"
        border
        highlight-current-row
        max-height="420"
        @row-click="selectProjectCandidate"
      >
        <el-table-column width="58" align="center">
          <template #default="{ row }">
            <el-radio
              :model-value="String(selectedProject?.id ?? '')"
              :value="String(row.id)"
              @change="selectProjectCandidate(row)"
            >
              <span class="sr-only">选择项目</span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" min-width="155" />
        <el-table-column prop="projectNo" label="项目编号" min-width="155" />
        <el-table-column prop="linkedCustomerName" label="链属客户名称" min-width="170" />
        <el-table-column prop="creditNo" label="授信编号" min-width="160" />
        <el-table-column prop="productPlan" label="产品方案" min-width="145" />
        <el-table-column prop="businessContractNo" label="业务合同编号" min-width="175" />
      </el-table>
      <el-empty
        v-if="!projectsLoading && !availableProjects.length"
        :image-size="72"
        description="未找到可新增入库申请的有效项目"
      />
    </div>
    <template #footer>
      <el-button @click="projectPickerVisible = false">取 消</el-button>
      <el-button type="primary" :disabled="!selectedProject" @click="confirmProjectSelection">
        确 定
      </el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="batchSubmitVisible"
    title="批量提交债项资产入库申请"
    width="600px"
    destroy-on-close
  >
    <el-alert
      :title="`已选择 ${selectedRecords.length} 条待处理入库申请，将统一提交至审查审批流程。`"
      type="warning"
      :closable="false"
      class="mb-16px"
    />
    <template #footer>
      <el-button @click="batchSubmitVisible = false">取 消</el-button>
      <el-button type="primary" :loading="batchSubmitting" @click="handleBatchSubmit"
        >确认提交</el-button
      >
    </template>
  </el-dialog>

  <el-dialog v-model="opinionVisible" title="查看意见" width="720px" destroy-on-close>
    <el-timeline v-if="opinionRecord?.opinions?.length" class="asset-management-timeline">
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
    <el-timeline v-if="historyRecord?.flowRecords?.length" class="asset-management-timeline">
      <el-timeline-item
        v-for="flowRecord in historyRecord.flowRecords"
        :key="flowRecord.id"
        :timestamp="`${flowRecord.operator} · ${flowRecord.operatedAt}`"
        placement="top"
      >
        {{ flowRecord.node }}：{{ flowRecord.action }}
        <span v-if="flowRecord.comment">（{{ flowRecord.comment }}）</span>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无流转记录" />
  </el-dialog>

  <el-dialog v-model="imageVisible" title="债项资产入库申请影像" width="760px" destroy-on-close>
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
        <el-button
          link
          type="primary"
          @click="ElMessage.info('当前为 Mock 演示影像，可在此接入实际影像系统')"
        >
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
import * as AssetManagementApi from '@/api/indebt/assetManagement'

defineOptions({ name: 'AssetManagementApplicationWorkList' })

type AssetManagementApplicationPhase = 'pending' | 'reviewing' | 'rejected' | 'approved'

interface AssetManagementOpinion {
  id: number | string
  content: string
  signer: string
  signedAt: string
}

interface AssetManagementFlowRecord {
  id: number | string
  node: string
  action: string
  operator: string
  operatedAt: string
  comment?: string
}

interface AssetManagementRecord {
  id: number | string
  phase: AssetManagementApplicationPhase
  status: string
  applicationNo: string
  customerName: string
  coreCustomerNo: string
  linkedCustomerName: string
  projectName: string
  projectNo: string
  creditNo: string
  productPlan: string
  businessContractNo: string
  businessContractAmount: number
  outboundAmount: number
  billingDate: string
  arrivalDeadline: string
  inboundValue: number
  currency: string
  applicationDate: string
  inboundType: string
  contractStartDate: string
  contractEndDate: string
  currentStage?: string
  completedAt?: string
  opinions?: AssetManagementOpinion[]
  flowRecords?: AssetManagementFlowRecord[]
}

interface AvailableProject {
  id: number | string
  projectName: string
  projectNo: string
  linkedCustomerName: string
  creditNo: string
  productPlan: string
  businessContractNo: string
}

interface AssetManagementPageResult {
  total: number
  list: AssetManagementRecord[]
  records?: AssetManagementRecord[]
  pageNo?: number
  pageSize?: number
}

interface CreateForm {
  projectId: number | string | ''
  projectName: string
  projectNo: string
  linkedCustomerName: string
  creditNo: string
  productPlan: string
  businessContractNo: string
  inboundType: '部分入库' | '已完成入库' | ''
}

interface ImageFile {
  id: number | string
  name: string
  description: string
  icon: string
}

const props = defineProps<{
  params?: {
    phase?: AssetManagementApplicationPhase
  }
}>()

const route = useRoute()
const router = useRouter()

const validPhases: AssetManagementApplicationPhase[] = [
  'pending',
  'reviewing',
  'rejected',
  'approved'
]
const isAssetManagementApplicationPhase = (
  value: unknown
): value is AssetManagementApplicationPhase =>
  validPhases.includes(value as AssetManagementApplicationPhase)
const currentPhase = computed<AssetManagementApplicationPhase>(() =>
  isAssetManagementApplicationPhase(props.params?.phase) ? props.params.phase : 'pending'
)

type ApiFunction = (...args: unknown[]) => Promise<unknown>
const api = AssetManagementApi as unknown as Record<string, ApiFunction>

const callApi = async <T,>(names: string | string[], ...args: unknown[]): Promise<T> => {
  const candidates = Array.isArray(names) ? names : [names]
  const name = candidates.find((candidate) => typeof api[candidate] === 'function')
  if (!name) {
    throw new Error(`债项资产管理 Mock 未提供 ${candidates[0]} 接口`)
  }
  return api[name](...args) as Promise<T>
}

const toObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
const unwrapData = (value: unknown): unknown => {
  const result = toObject(value)
  return result.data === undefined ? value : result.data
}
const toText = (value: unknown) => (value === undefined || value === null ? '' : String(value))
const toNumber = (value: unknown) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}
const getArray = (value: unknown) => (Array.isArray(value) ? value : [])
const formatAmount = (value: unknown) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '-'
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const phaseLabel = (phase: AssetManagementApplicationPhase) => {
  if (phase === 'approved') return '审批通过'
  if (phase === 'rejected') return '被否决'
  if (phase === 'reviewing') return '审查审批中'
  return '待提交'
}

const normalizeOpinion = (value: unknown, index: number): AssetManagementOpinion => {
  const opinion = toObject(value)
  return {
    id: (opinion.id ?? opinion.opinionId ?? index) as number | string,
    content: toText(opinion.content ?? opinion.opinion),
    signer: toText(opinion.signer ?? opinion.userName ?? opinion.operatorName),
    signedAt: toText(opinion.signedAt ?? opinion.createTime ?? opinion.opinionTime)
  }
}

const normalizeFlowRecord = (value: unknown, index: number): AssetManagementFlowRecord => {
  const flowRecord = toObject(value)
  return {
    id: (flowRecord.id ?? flowRecord.flowId ?? index) as number | string,
    node: toText(flowRecord.node ?? flowRecord.stage ?? flowRecord.currentStage),
    action: toText(flowRecord.action ?? flowRecord.operation ?? flowRecord.status),
    operator: toText(flowRecord.operator ?? flowRecord.operatorName ?? flowRecord.userName),
    operatedAt: toText(flowRecord.operatedAt ?? flowRecord.createTime ?? flowRecord.operationTime),
    comment: toText(flowRecord.comment ?? flowRecord.opinion ?? flowRecord.remark)
  }
}

const normalizeRecord = (
  value: unknown,
  fallbackPhase: AssetManagementApplicationPhase = currentPhase.value
): AssetManagementRecord => {
  const record = toObject(unwrapData(value))
  const rawOpinions = getArray(record.opinions ?? record.opinionList)
  const rawFlowRecords = getArray(record.flowRecords ?? record.flowList ?? record.historyRecords)
  const phase = isAssetManagementApplicationPhase(record.phase) ? record.phase : fallbackPhase
  return {
    id: (record.id ?? record.applicationId ?? record.applyId ?? 0) as number | string,
    phase,
    status: toText(record.status ?? record.applicationStatus) || phaseLabel(phase),
    applicationNo: toText(record.applicationNo ?? record.applyNo ?? record.applicationNumber),
    customerName: toText(
      record.customerName ?? record.chainCustomerName ?? record.linkedCustomerName
    ),
    coreCustomerNo: toText(record.coreCustomerNo ?? record.coreCustomerId ?? record.customerNo),
    linkedCustomerName: toText(
      record.linkedCustomerName ?? record.chainCustomerName ?? record.customerName
    ),
    projectName: toText(record.projectName),
    projectNo: toText(record.projectNo ?? record.projectCode),
    creditNo: toText(record.creditNo ?? record.creditNumber ?? record.creditApplyNo),
    productPlan: toText(record.productPlan ?? record.productPlanName ?? record.productScheme),
    businessContractNo: toText(
      record.businessContractNo ??
        record.relatedBusinessContractNo ??
        record.contractNo ??
        record.businessAgreementNo
    ),
    businessContractAmount: toNumber(record.businessContractAmount ?? record.contractAmount),
    outboundAmount: toNumber(
      record.outboundAmount ??
        record.billingAmount ??
        record.drawdownAmount ??
        record.disbursementAmount
    ),
    billingDate: toText(
      record.billingDate ?? record.outboundDate ?? record.drawdownDate ?? record.disbursementDate
    ),
    arrivalDeadline: toText(
      record.arrivalDeadline ?? record.arrivalDeadlineDate ?? record.arrivalLimitDate
    ),
    inboundValue: toNumber(
      record.inboundValue ??
        record.inboundTotalValue ??
        record.storageValue ??
        record.inboundGoodsValue
    ),
    currency: toText(record.currency ?? record.currencyName),
    applicationDate: toText(record.applicationDate ?? record.applyDate),
    inboundType: toText(record.inboundType ?? record.storageType),
    contractStartDate: toText(record.contractStartDate ?? record.businessContractStartDate),
    contractEndDate: toText(record.contractEndDate ?? record.businessContractEndDate),
    currentStage: toText(record.currentStage ?? record.currentNode),
    completedAt: toText(record.completedAt ?? record.completeTime ?? record.completedTime),
    opinions: rawOpinions.map(normalizeOpinion),
    flowRecords: rawFlowRecords.map(normalizeFlowRecord)
  }
}

const normalizeProject = (value: unknown): AvailableProject => {
  const project = toObject(unwrapData(value))
  return {
    id: (project.id ?? project.projectId ?? 0) as number | string,
    projectName: toText(project.projectName),
    projectNo: toText(project.projectNo ?? project.projectCode),
    linkedCustomerName: toText(
      project.linkedCustomerName ?? project.chainCustomerName ?? project.customerName
    ),
    creditNo: toText(project.creditNo ?? project.creditNumber ?? project.creditApplyNo),
    productPlan: toText(project.productPlan ?? project.productPlanName ?? project.productScheme),
    businessContractNo: toText(
      project.businessContractNo ?? project.contractNo ?? project.businessAgreementNo
    )
  }
}

const isFailedResult = (value: unknown): value is { success: false; message?: string } => {
  const result = toObject(value)
  return result.success === false || result.code === -1 || result.code === 'FAIL'
}

const recordFromResult = (value: unknown): AssetManagementRecord | undefined => {
  const raw = unwrapData(value)
  const result = toObject(raw)
  const record = result.record ?? result.application ?? result.detail
  if (record) return normalizeRecord(record)
  if (result.id ?? result.applicationNo ?? result.applyNo) return normalizeRecord(result)
  return undefined
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
    label: '客户名称',
    field: 'customerName',
    minWidth: 175,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入客户名称' } }
  },
  {
    label: '核心客户编号',
    field: 'coreCustomerNo',
    minWidth: 165,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入核心客户编号' } }
  },
  { label: '产品方案', field: 'productPlan', minWidth: 145 },
  { label: '关联业务合同编号', field: 'businessContractNo', minWidth: 180 },
  { label: '出账金额', field: 'outboundAmount', minWidth: 140 },
  { label: '出账日期', field: 'billingDate', minWidth: 130 },
  { label: '入库截止日期', field: 'arrivalDeadline', minWidth: 145 },
  { label: '入库货值', field: 'inboundValue', minWidth: 135 },
  { label: '币种', field: 'currency', minWidth: 105 },
  { label: '申请日期', field: 'applicationDate', minWidth: 130 },
  { label: '入库类型', field: 'inboundType', minWidth: 125 },
  { label: '当前阶段', field: 'currentStage', minWidth: 175 },
  { label: '完成时间', field: 'completedAt', minWidth: 170 },
  { label: '操作', field: 'action', fixed: 'right', width: 110 }
])

const pendingFields = new Set([
  'applicationNo',
  'customerName',
  'coreCustomerNo',
  'productPlan',
  'businessContractNo',
  'outboundAmount',
  'billingDate',
  'arrivalDeadline',
  'action'
])
const reviewingAndApprovedFields = new Set([
  'applicationNo',
  'customerName',
  'coreCustomerNo',
  'productPlan',
  'businessContractNo',
  'inboundValue',
  'currency',
  'applicationDate',
  'inboundType',
  'currentStage',
  'completedAt',
  'action'
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const tableColumns = computed(() =>
  allSchemas.tableColumns.filter((column) =>
    (currentPhase.value === 'pending' ? pendingFields : reviewingAndApprovedFields).has(
      column.field
    )
  )
)

const getCurrentPage = async (params: Recordable): Promise<AssetManagementPageResult> => {
  const result = await callApi<unknown>(
    ['getAssetManagementApplicationPage', 'getAssetManagementPage'],
    { ...params, phase: currentPhase.value }
  )
  const page = toObject(unwrapData(result))
  const rows = getArray(page.list ?? page.records ?? page.rows).map((item) =>
    normalizeRecord(item, currentPhase.value)
  )
  return {
    total: toNumber(page.total ?? page.totalCount ?? rows.length),
    list: rows,
    records: rows,
    pageNo: toNumber(page.pageNo ?? page.currentPage),
    pageSize: toNumber(page.pageSize)
  }
}

const { register, tableObject, tableMethods } = useTable<AssetManagementRecord>({
  getListApi: getCurrentPage,
  defaultParams: { phase: currentPhase.value }
})
const { getList, setSearchParams } = tableMethods

const createVisible = ref(false)
const createLoading = ref(false)
const createFormRef = ref<FormInstance>()
const projectPickerVisible = ref(false)
const projectKeyword = ref('')
const linkedCustomerKeyword = ref('')
const projectsLoading = ref(false)
const availableProjects = ref<AvailableProject[]>([])
const selectedProject = ref<AvailableProject>()
const batchSubmitVisible = ref(false)
const batchSubmitting = ref(false)
const selectedRecords = ref<AssetManagementRecord[]>([])
const opinionVisible = ref(false)
const opinionRecord = ref<AssetManagementRecord>()
const historyVisible = ref(false)
const historyRecord = ref<AssetManagementRecord>()
const imageVisible = ref(false)
const imageRecord = ref<AssetManagementRecord>()
const imageItems = ref<ImageFile[]>([])
const actionLoading = ref<'submit' | 'withdraw' | 'approve' | 'sign' | ''>('')

const initialCreateForm = (): CreateForm => ({
  projectId: '',
  projectName: '',
  projectNo: '',
  linkedCustomerName: '',
  creditNo: '',
  productPlan: '',
  businessContractNo: '',
  inboundType: '部分入库'
})
const createForm = reactive<CreateForm>(initialCreateForm())
const createRules: FormRules<CreateForm> = {
  projectId: [{ required: true, message: '请选择一个有效项目', trigger: 'change' }],
  inboundType: [{ required: true, message: '请选择入库类型', trigger: 'change' }]
}

const currentRecord = computed(() => tableObject.currentRow || undefined)

const setCurrentRecord = (record: AssetManagementRecord) => {
  tableObject.currentRow = record
}

const handleCellClick = (record: AssetManagementRecord) => {
  setCurrentRecord(record)
}

const handleSelectionChange = (records: AssetManagementRecord[]) => {
  selectedRecords.value = Array.isArray(records) ? records : []
}

const requireCurrentRecord = (): AssetManagementRecord | undefined => {
  if (!currentRecord.value) {
    ElMessage.warning('请先点击选择一条债项资产入库申请')
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
    const result = await callApi<unknown>(
      ['getAvailableAssetManagementProjects', 'getEffectiveAssetManagementProjects'],
      {
        projectName: projectKeyword.value.trim() || undefined,
        linkedCustomerName: linkedCustomerKeyword.value.trim() || undefined,
        customerName: linkedCustomerKeyword.value.trim() || undefined
      }
    )
    const source = unwrapData(result)
    const page = toObject(source)
    const rows = Array.isArray(source) ? source : getArray(page.list ?? page.records ?? page.rows)
    availableProjects.value = rows.map(normalizeProject)
  } catch (error) {
    availableProjects.value = []
    ElMessage.error(error instanceof Error ? error.message : '获取有效项目失败')
  } finally {
    projectsLoading.value = false
  }
}

const selectProjectCandidate = (project: AvailableProject) => {
  selectedProject.value = project
}

const confirmProjectSelection = () => {
  const project = selectedProject.value
  if (!project) {
    ElMessage.warning('请先选择一个有效项目')
    return
  }
  Object.assign(createForm, {
    projectId: project.id,
    projectName: project.projectName,
    projectNo: project.projectNo,
    linkedCustomerName: project.linkedCustomerName,
    creditNo: project.creditNo,
    productPlan: project.productPlan,
    businessContractNo: project.businessContractNo
  })
  projectPickerVisible.value = false
  createFormRef.value?.validateField('projectId')
}

const openProjectPicker = async () => {
  selectedProject.value = createForm.projectId
    ? {
        id: createForm.projectId,
        projectName: createForm.projectName,
        projectNo: createForm.projectNo,
        linkedCustomerName: createForm.linkedCustomerName,
        creditNo: createForm.creditNo,
        productPlan: createForm.productPlan,
        businessContractNo: createForm.businessContractNo
      }
    : undefined
  projectKeyword.value = ''
  linkedCustomerKeyword.value = ''
  projectPickerVisible.value = true
  await loadAvailableProjects()
}

const openCreate = () => {
  Object.assign(createForm, initialCreateForm())
  selectedProject.value = undefined
  availableProjects.value = []
  projectKeyword.value = ''
  linkedCustomerKeyword.value = ''
  createFormRef.value?.clearValidate()
  createVisible.value = true
}

const handleCreate = async () => {
  const valid = await createFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)
  if (!valid) return

  createLoading.value = true
  try {
    const result = await callApi<unknown>('createAssetManagementApplication', {
      projectId: Number(createForm.projectId),
      inboundType: createForm.inboundType
    })
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '新增债项资产入库申请失败')
      return
    }
    ElMessage.success('新增成功，申请已进入待提交节点')
    createVisible.value = false
    if (currentPhase.value === 'pending') await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '新增债项资产入库申请失败')
  } finally {
    createLoading.value = false
  }
}

const getDetail = async (record: AssetManagementRecord) => {
  const result = await callApi<unknown>('getAssetManagementApplicationDetail', record.id)
  if (isFailedResult(result)) {
    ElMessage.error(result.message || '未获取到债项资产入库申请详情')
    return undefined
  }
  return recordFromResult(result)
}

const openDetail = () => {
  const record = requireCurrentRecord()
  if (!record) return
  router.push({
    path: route.path,
    query: {
      ...route.query,
      view: 'detail',
      id: String(record.id),
      phase: record.phase
    }
  })
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
      `确认${actionLabel}债项资产入库申请“${record.applicationNo}”吗？`,
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
        ? await callApi<unknown>('submitAssetManagementApplication', record.id)
        : await callApi<unknown>('withdrawAssetManagementApplication', record.id)
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

const handleSignOpinion = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  let content = ''
  try {
    const result = await ElMessageBox.prompt('请输入签署意见', '签署意见', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      inputValue: '经核验，入库资产信息与业务合同匹配。',
      inputValidator: (value) => Boolean(value?.trim()) || '请填写意见内容'
    })
    content = result.value
  } catch {
    return
  }

  actionLoading.value = 'sign'
  try {
    const result = await callApi<unknown>(
      'signAssetManagementApplicationOpinion',
      record.id,
      content
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '签署意见失败')
      return
    }
    ElMessage.success('签署意见已保存')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '签署意见失败')
  } finally {
    actionLoading.value = ''
  }
}

const handleApprove = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  try {
    await ElMessageBox.confirm(
      `确认提交并完成债项资产入库审批“${record.applicationNo}”吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  actionLoading.value = 'approve'
  try {
    const result = await callApi<unknown>('approveAssetManagementApplication', record.id)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '提交审批失败')
      return
    }
    ElMessage.success('提交成功，申请已进入已完成工作')
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '提交审批失败')
  } finally {
    actionLoading.value = ''
  }
}

const openBatchSubmit = () => {
  if (!selectedRecords.value.length) {
    ElMessage.warning('请先勾选需要批量提交的入库申请')
    return
  }
  batchSubmitVisible.value = true
}

const handleBatchSubmit = async () => {
  if (!selectedRecords.value.length) return
  batchSubmitting.value = true
  try {
    const result = await callApi<unknown>(
      ['batchSubmitAssetManagementApplications', 'batchSubmitAssetManagement'],
      selectedRecords.value.map((record) => record.id)
    )
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '批量提交失败')
      return
    }
    const resultData = toObject(unwrapData(result))
    const count = toNumber(resultData.submitted ?? resultData.count)
    ElMessage.success(`批量提交成功${count ? `，共 ${count} 条` : ''}`)
    batchSubmitVisible.value = false
    await refreshList()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '批量提交失败')
  } finally {
    batchSubmitting.value = false
  }
}

const defaultImages = (record: AssetManagementRecord): ImageFile[] => [
  {
    id: 'arrival-notice',
    name: '入库通知单',
    description: `入库截止日期：${record.arrivalDeadline || '待补充'}`,
    icon: 'ep:document'
  },
  {
    id: 'inbound-document',
    name: '入库确认材料',
    description: `入库类型：${record.inboundType || '待补充'}`,
    icon: 'ep:files'
  },
  {
    id: 'arrival-image',
    name: '货物入库影像',
    description: record.businessContractNo || '关联业务合同影像材料',
    icon: 'ep:picture'
  }
]

const normalizeImage = (value: unknown, index: number): ImageFile => {
  const image = toObject(value)
  return {
    id: (image.id ?? image.fileId ?? index) as number | string,
    name: toText(image.name ?? image.fileName ?? `入库影像${index + 1}`),
    description: toText(
      image.description ?? image.uploadedAt ?? image.createTime ?? '债项资产入库申请影像材料'
    ),
    icon: toText(image.icon) || 'ep:document'
  }
}

const openImage = async (record: AssetManagementRecord) => {
  setCurrentRecord(record)
  imageRecord.value = record
  imageItems.value = defaultImages(record)
  imageVisible.value = true
  try {
    const result = await callApi<unknown>('getAssetManagementApplicationImages', record.id)
    const source = unwrapData(result)
    const resultObject = toObject(source)
    const rows = Array.isArray(source)
      ? source
      : getArray(resultObject.list ?? resultObject.records)
    if (rows.length) imageItems.value = rows.map(normalizeImage)
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
      }
    ]
  }

  if (currentPhase.value === 'reviewing') {
    return [
      detailButton,
      {
        key: 'approve',
        label: '提交',
        icon: 'ep:promotion',
        plain: true,
        loading: actionLoading.value === 'approve',
        onClick: handleApprove
      },
      {
        key: 'sign-opinion',
        label: '签署意见',
        icon: 'ep:edit-pen',
        plain: true,
        loading: actionLoading.value === 'sign',
        onClick: handleSignOpinion
      },
      opinionButton,
      historyButton,
      {
        key: 'withdraw',
        label: '退回上一步',
        icon: 'ep:back',
        plain: true,
        loading: actionLoading.value === 'withdraw',
        onClick: () => handleTransition('withdraw')
      }
    ]
  }

  return [detailButton, opinionButton, historyButton]
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
.asset-management-work-list {
  min-width: 0;
}

.create-project-form {
  padding: 12px 18px 4px 4px;
}

.project-picker-input {
  cursor: pointer;

  :deep(.el-input__wrapper),
  :deep(.el-input__inner),
  :deep(.el-input__suffix) {
    cursor: pointer;
  }

  :deep(.el-input__suffix) {
    color: var(--el-color-primary);
  }
}

.project-query-row {
  display: flex;
  width: 100%;
  gap: 10px;

  .el-input {
    flex: 1;
  }
}

.project-picker {
  width: 100%;
  min-height: 120px;
}

.arrival-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.asset-management-timeline {
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
  .project-query-row {
    display: block;
  }

  .project-query-row > * + * {
    margin-top: 10px;
  }

  .arrival-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
