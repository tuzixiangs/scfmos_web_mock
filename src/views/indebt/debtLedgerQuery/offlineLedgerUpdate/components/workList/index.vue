<template>
  <ContentWrap class="offlineLedger-work-list">
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
      highlight-current-row
      :show-overflow-tooltip="true"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @cell-click="handleCellClick"
      @register="register"
    >
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
    title="新增线下台账更新申请"
    width="820px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="110px">
      <div class="offlineLedger-form-grid">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model.trim="createForm.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目编号" prop="projectNo">
          <el-input v-model.trim="createForm.projectNo" placeholder="请输入项目编号" />
        </el-form-item>
        <el-form-item label="核心企业名称" prop="coreEnterpriseName">
          <el-input v-model.trim="createForm.coreEnterpriseName" placeholder="请输入核心企业名称" />
        </el-form-item>
        <el-form-item label="核心客户编号" prop="coreCustomerNo">
          <el-input v-model.trim="createForm.coreCustomerNo" placeholder="请输入核心客户编号" />
        </el-form-item>
        <el-form-item label="产品方案" prop="productPlan">
          <el-select v-model="createForm.productPlan" placeholder="请选择产品方案" class="w-full">
            <el-option label="单一客户综合授信" value="单一客户综合授信" />
            <el-option label="存货质押融资" value="存货质押融资" />
            <el-option label="经销商融资" value="经销商融资" />
            <el-option label="仓单质押融资" value="仓单质押融资" />
          </el-select>
        </el-form-item>
        <el-form-item label="监管方企业名称" prop="regulatorEnterpriseName">
          <el-input
            v-model.trim="createForm.regulatorEnterpriseName"
            placeholder="请输入监管方企业名称"
          />
        </el-form-item>
        <el-form-item label="台账名称" prop="offlineLedgerName">
          <el-input v-model.trim="createForm.offlineLedgerName" placeholder="请输入台账名称" />
        </el-form-item>
        <el-form-item label="台账代码" prop="offlineLedgerCode">
          <el-input v-model.trim="createForm.offlineLedgerCode" placeholder="请输入台账代码" />
        </el-form-item>
        <el-form-item label="台账类型" prop="offlineLedgerType">
          <el-select v-model="createForm.offlineLedgerType" placeholder="请选择台账类型" class="w-full">
            <el-option label="线下台账" value="线下台账" />
            <el-option label="历史台账" value="历史台账" />
            <el-option label="线下管理说明" value="线下管理说明" />
            <el-option label="台账附件" value="台账附件" />
          </el-select>
        </el-form-item>
        <el-form-item label="保险到期日" prop="insuranceExpiryDate">
          <el-date-picker
            v-model="createForm.insuranceExpiryDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择保险到期日"
            class="w-full"
          />
        </el-form-item>
      </div>
      <el-alert
        title="新增申请默认进入“待提交的线下台账更新申请”节点。"
        type="info"
        :closable="false"
      />
    </el-form>
    <template #footer>
      <el-button @click="createVisible = false">取 消</el-button>
      <el-button type="primary" :loading="createLoading" @click="handleCreate">保 存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="detailVisible" title="线下台账更新申请详情" width="900px" destroy-on-close>
    <el-descriptions v-if="detailRecord" :column="2" border>
      <el-descriptions-item label="申请编号">{{ detailRecord.applicationNo }}</el-descriptions-item>
      <el-descriptions-item label="申请状态">
        <el-tag :type="statusTagType(detailRecord.phase)" effect="light">
          {{ detailRecord.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="核心企业名称">{{ detailRecord.coreEnterpriseName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ detailRecord.coreCustomerNo }}</el-descriptions-item>
      <el-descriptions-item label="产品方案">{{ detailRecord.productPlan }}</el-descriptions-item>
      <el-descriptions-item label="项目名称">{{ detailRecord.projectName }}</el-descriptions-item>
      <el-descriptions-item label="项目编号">{{ detailRecord.projectNo }}</el-descriptions-item>
      <el-descriptions-item label="监管方企业名称">{{ detailRecord.regulatorEnterpriseName }}</el-descriptions-item>
      <el-descriptions-item label="台账名称">{{ detailRecord.offlineLedgerName }}</el-descriptions-item>
      <el-descriptions-item label="台账代码">{{ detailRecord.offlineLedgerCode }}</el-descriptions-item>
      <el-descriptions-item label="台账类型">{{ detailRecord.offlineLedgerType }}</el-descriptions-item>
      <el-descriptions-item label="保险到期日">{{ detailRecord.insuranceExpiryDate || '-' }}</el-descriptions-item>
      <el-descriptions-item label="申请日期">{{ detailRecord.applicationDate }}</el-descriptions-item>
      <el-descriptions-item label="当前阶段">{{ detailRecord.currentStage || '-' }}</el-descriptions-item>
      <el-descriptions-item label="完成时间">{{ detailRecord.completedAt || '-' }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="signOpinionVisible" title="签署意见" width="600px" destroy-on-close>
    <el-form label-width="90px">
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

  <el-dialog v-model="opinionVisible" title="查看意见" width="720px" destroy-on-close>
    <el-timeline v-if="opinionRecord?.opinions?.length" class="offlineLedger-timeline">
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
    <el-timeline class="offlineLedger-timeline">
      <el-timeline-item :timestamp="historyRecord?.applicationDate || ''" placement="top">
        已创建线下台账更新申请，进入“待提交”节点。
      </el-timeline-item>
      <el-timeline-item
        v-if="historyRecord && historyRecord.phase !== 'pending'"
        :timestamp="historyRecord?.completedAt || '流程处理中'"
        type="primary"
        placement="top"
      >
        {{ historyRecord?.currentStage || historyRecord?.status || '审查审批中' }}
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

  <el-dialog v-model="imageVisible" title="线下台账更新申请影像" width="760px" destroy-on-close>
    <el-alert
      :title="`申请编号：${imageRecord?.applicationNo || ''}`"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <div class="image-file-list">
      <div v-for="image in imageItems" :key="image.name" class="image-file-card">
        <Icon :icon="image.icon" class="image-file-icon" />
        <div>
          <strong>{{ image.name }}</strong>
          <p>{{ image.description }}</p>
        </div>
        <el-button link type="primary" @click="ElMessage.info('当前为 Mock 演示影像，可在详情页接入实际影像系统')">
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
import * as OfflineLedgerUpdateApi from '@/api/indebt/offlineLedgerUpdate'

defineOptions({ name: 'OfflineLedgerApplicationWorkList' })

type OfflineLedgerApplicationPhase = OfflineLedgerUpdateApi.OfflineLedgerApplicationPhase
type OfflineLedgerApplicationRecord = OfflineLedgerUpdateApi.OfflineLedgerApplicationRecord
type OfflineLedgerApplicationCreateForm = OfflineLedgerUpdateApi.OfflineLedgerApplicationCreateForm
type OfflineLedgerApplicationSubmitResult = OfflineLedgerUpdateApi.OfflineLedgerApplicationSubmitResult

const props = defineProps<{
  params?: {
    phase?: OfflineLedgerApplicationPhase
  }
}>()

const validPhases: OfflineLedgerApplicationPhase[] = ['pending', 'reviewing', 'rejected', 'approved']
const isOfflineLedgerApplicationPhase = (value: unknown): value is OfflineLedgerApplicationPhase =>
  validPhases.includes(value as OfflineLedgerApplicationPhase)

const currentPhase = computed<OfflineLedgerApplicationPhase>(() =>
  isOfflineLedgerApplicationPhase(props.params?.phase) ? props.params.phase : 'pending'
)

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
    isTable: false,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入客户名称' } }
  },
  {
    label: '核心企业名称',
    field: 'coreEnterpriseName',
    minWidth: 190,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入核心企业名称' } }
  },
  {
    label: '核心客户编号',
    field: 'coreCustomerNo',
    minWidth: 175,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入核心客户编号' } }
  },
  {
    label: '产品方案',
    field: 'productPlan',
    minWidth: 150,
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        placeholder: '请选择产品方案',
        options: [
          { label: '单一客户综合授信', value: '单一客户综合授信' },
          { label: '存货质押融资', value: '存货质押融资' },
          { label: '经销商融资', value: '经销商融资' },
          { label: '仓单质押融资', value: '仓单质押融资' }
        ]
      }
    }
  },
  {
    label: '项目名称',
    field: 'projectName',
    minWidth: 180,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入项目名称' } }
  },
  {
    label: '项目编号',
    field: 'projectNo',
    minWidth: 175
  },
  { label: '监管方企业名称', field: 'regulatorEnterpriseName', minWidth: 200, isTable: false },
  { label: '台账名称', field: 'offlineLedgerName', minWidth: 180, isTable: false },
  {
    label: '台账代码',
    field: 'offlineLedgerCode',
    minWidth: 145,
    isTable: false
  },
  {
    label: '台账类型',
    field: 'offlineLedgerType',
    minWidth: 120,
    isTable: false
  },
  {
    label: '保险到期日',
    field: 'insuranceExpiryDate',
    minWidth: 135,
    isTable: false
  },
  {
    label: '申请日期',
    field: 'applicationDate',
    minWidth: 130
  },
  {
    label: '当前阶段',
    field: 'currentStage',
    minWidth: 180
  },
  {
    label: '完成时间',
    field: 'completedAt',
    minWidth: 170
  },
  {
    label: '操作',
    field: 'action',
    fixed: 'right',
    width: 105
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const tableColumns = computed(() =>
  currentPhase.value === 'pending'
    ? allSchemas.tableColumns.filter(
        (column) => column.field !== 'currentStage' && column.field !== 'completedAt'
      )
    : allSchemas.tableColumns
)

const { register, tableObject, tableMethods } = useTable<OfflineLedgerApplicationRecord>({
  getListApi: OfflineLedgerUpdateApi.getOfflineLedgerApplicationPage,
  defaultParams: { phase: currentPhase.value }
})
const { getList, setSearchParams } = tableMethods

const createVisible = ref(false)
const createLoading = ref(false)
const createFormRef = ref<FormInstance>()
const detailVisible = ref(false)
const detailRecord = ref<OfflineLedgerApplicationRecord>()
const signOpinionVisible = ref(false)
const signOpinionContent = ref('')
const signOpinionLoading = ref(false)
const opinionVisible = ref(false)
const opinionRecord = ref<OfflineLedgerApplicationRecord>()
const historyVisible = ref(false)
const historyRecord = ref<OfflineLedgerApplicationRecord>()
const imageVisible = ref(false)
const imageRecord = ref<OfflineLedgerApplicationRecord>()
const actionLoading = ref<'submit' | 'withdraw' | ''>('')

const initialCreateForm = (): OfflineLedgerApplicationCreateForm => ({
  projectName: '',
  projectNo: '',
  coreEnterpriseName: '',
  coreCustomerNo: '',
  productPlan: '',
  regulatorEnterpriseName: '',
  offlineLedgerName: '',
  offlineLedgerCode: '',
  offlineLedgerType: '线下台账',
  insuranceExpiryDate: ''
})

const createForm = reactive<OfflineLedgerApplicationCreateForm>(initialCreateForm())
const createRules: FormRules<OfflineLedgerApplicationCreateForm> = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  projectNo: [{ required: true, message: '请输入项目编号', trigger: 'blur' }],
  coreEnterpriseName: [{ required: true, message: '请输入核心企业名称', trigger: 'blur' }],
  coreCustomerNo: [{ required: true, message: '请输入核心客户编号', trigger: 'blur' }],
  productPlan: [{ required: true, message: '请选择产品方案', trigger: 'change' }],
  regulatorEnterpriseName: [{ required: true, message: '请输入监管方企业名称', trigger: 'blur' }],
  offlineLedgerName: [{ required: true, message: '请输入台账名称', trigger: 'blur' }],
  offlineLedgerCode: [{ required: true, message: '请输入台账代码', trigger: 'blur' }],
  offlineLedgerType: [{ required: true, message: '请选择台账类型', trigger: 'change' }]
}

const currentRecord = computed(() => tableObject.currentRow || undefined)

const imageItems = computed(() => [
  {
    name: '台账现场照片',
    description: `${imageRecord.value?.offlineLedgerName || '台账'}现场影像资料`,
    icon: 'ep:picture'
  },
  {
    name: '仓储保险凭证',
    description: `保险到期日：${imageRecord.value?.insuranceExpiryDate || '待补充'}`,
    icon: 'ep:document'
  },
  {
    name: '监管方合作材料',
    description: imageRecord.value?.regulatorEnterpriseName || '监管方企业材料',
    icon: 'ep:files'
  }
])

const setCurrentRecord = (record: OfflineLedgerApplicationRecord) => {
  tableObject.currentRow = record
}

const handleCellClick = (record: OfflineLedgerApplicationRecord) => {
  setCurrentRecord(record)
}

const requireCurrentRecord = (): OfflineLedgerApplicationRecord | undefined => {
  if (!currentRecord.value) {
    ElMessage.warning('请先点击选择一条线下台账更新申请')
    return undefined
  }
  return currentRecord.value
}

const refreshList = async () => {
  tableObject.currentRow = null
  await getList()
}

const handleSearch = (params: Recordable) => {
  tableObject.currentRow = null
  setSearchParams({ ...params, phase: currentPhase.value })
}

const openCreate = () => {
  Object.assign(createForm, initialCreateForm())
  createFormRef.value?.clearValidate()
  createVisible.value = true
}

const isFailedResult = (result: unknown): result is { success: false; message?: string } =>
  typeof result === 'object' && result !== null && 'success' in result && result.success === false

const handleCreate = async () => {
  const valid = await createFormRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return

  createLoading.value = true
  try {
    const result = await OfflineLedgerUpdateApi.createOfflineLedgerApplication({ ...createForm })
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '新增线下台账更新申请失败')
      return
    }
    ElMessage.success('新增成功，申请已进入待提交节点')
    createVisible.value = false
    if (currentPhase.value === 'pending') await refreshList()
  } finally {
    createLoading.value = false
  }
}

const getDetail = async (record: OfflineLedgerApplicationRecord) => {
  const result = await OfflineLedgerUpdateApi.getOfflineLedgerApplicationDetail(record.id)
  if (isFailedResult(result)) {
    ElMessage.error(result.message || '未获取到线下台账更新申请详情')
    return undefined
  }
  return result as OfflineLedgerApplicationRecord
}

const openDetail = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  const detail = await getDetail(record)
  if (!detail) return
  detailRecord.value = detail
  detailVisible.value = true
}

const openImage = (record: OfflineLedgerApplicationRecord) => {
  setCurrentRecord(record)
  imageRecord.value = record
  imageVisible.value = true
}

const openSignOpinion = () => {
  const record = requireCurrentRecord()
  if (!record) return

  const signApi = (OfflineLedgerUpdateApi as unknown as Record<string, unknown>)
    .signOfflineLedgerApplicationOpinion
  if (typeof signApi !== 'function') {
    ElMessage.info('当前 Mock 未配置“签署意见”接口，意见暂不能保存')
    return
  }

  signOpinionContent.value = ''
  signOpinionVisible.value = true
}

type SignOpinionApi = (id: number, opinion: string) => Promise<OfflineLedgerApplicationSubmitResult>

const handleSignOpinion = async () => {
  const record = requireCurrentRecord()
  const content = signOpinionContent.value.trim()
  if (!record || !content) {
    if (!content) ElMessage.warning('请输入签署意见')
    return
  }

  const signApi = (OfflineLedgerUpdateApi as unknown as Record<string, unknown>)
    .signOfflineLedgerApplicationOpinion as SignOpinionApi | undefined
  if (!signApi) {
    ElMessage.info('当前 Mock 未配置“签署意见”接口，意见暂不能保存')
    return
  }

  signOpinionLoading.value = true
  try {
    const result = await signApi(record.id, content)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || '签署意见失败')
      return
    }
    ElMessage.success('意见已签署')
    signOpinionVisible.value = false
    await refreshList()
  } finally {
    signOpinionLoading.value = false
  }
}

const openOpinion = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  const detail = await getDetail(record)
  if (!detail) return
  opinionRecord.value = detail
  opinionVisible.value = true
}

const openHistory = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  const detail = await getDetail(record)
  if (!detail) return
  historyRecord.value = detail
  historyVisible.value = true
}

const handleTransition = async (type: 'submit' | 'withdraw') => {
  const record = requireCurrentRecord()
  if (!record) return
  const isSubmit = type === 'submit'
  const actionLabel = isSubmit ? '提交' : '收回'

  try {
    await ElMessageBox.confirm(
      `确认${actionLabel}线下台账更新申请“${record.applicationNo}”吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  actionLoading.value = type
  try {
    const result = isSubmit
      ? await OfflineLedgerUpdateApi.submitOfflineLedgerApplication(record.id)
      : await OfflineLedgerUpdateApi.withdrawOfflineLedgerApplication(record.id)
    if (isFailedResult(result)) {
      ElMessage.error(result.message || `${actionLabel}失败`)
      return
    }
    ElMessage.success(`${actionLabel}成功`)
    await refreshList()
  } finally {
    actionLoading.value = ''
  }
}

const statusTagType = (phase: OfflineLedgerApplicationPhase) => {
  if (phase === 'approved') return 'success'
  if (phase === 'rejected') return 'danger'
  if (phase === 'reviewing') return 'warning'
  return 'info'
}

const visibleButtons = computed<ActionButton[]>(() => {
  const commonButtons: ActionButton[] = [
    {
      key: 'detail',
      label: '详情',
      icon: 'ep:document',
      plain: true,
      onClick: openDetail
    },
    {
      key: 'view-opinion',
      label: '查看意见',
      icon: 'ep:chat-line-square',
      plain: true,
      onClick: openOpinion
    },
    {
      key: 'view-history',
      label: '查看流转记录',
      icon: 'ep:connection',
      plain: true,
      onClick: openHistory
    }
  ]

  if (currentPhase.value === 'pending') {
    return [
      {
        key: 'create',
        label: '新增申请',
        icon: 'ep:plus',
        plain: true,
        onClick: openCreate
      },
      commonButtons[0],
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
      }
    ]
  }

  if (currentPhase.value === 'reviewing') {
    return [
      commonButtons[0],
      commonButtons[1],
      commonButtons[2],
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

  return commonButtons
})

watch(
  currentPhase,
  (phase) => {
    tableObject.currentRow = null
    tableObject.currentPage = 1
    setSearchParams({ ...tableObject.params, phase })
  },
  { immediate: true }
)

onActivated(() => {
  getList()
})
</script>

<style scoped lang="scss">
.offlineLedger-work-list {
  min-width: 0;
}

.offlineLedger-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.offlineLedger-timeline {
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
  .offlineLedger-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
