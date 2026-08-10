<template>
  <ContentWrap class="inspection-work-list">
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
      <template #inspectionDate="{ row }">
        <el-tag type="success" effect="light" class="font-bold">
          {{ row.inspectionDate }}
        </el-tag>
      </template>
      <template #currentStage="{ row }">
        <el-tag v-if="row.currentStage" type="warning" effect="light">
          {{ row.currentStage }}
        </el-tag>
        <span v-else>-</span>
      </template>
      <template #receivedAt="{ row }">
        {{ row.receivedAt || '-' }}
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

  <!-- 新增巡库申请弹框 -->
  <el-dialog
    v-model="createVisible"
    title="新增巡库申请"
    width="760px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-alert
      title="先选择有效项目，系统自动反显项目编号及核心企业信息，然后再指定本次巡库日期。"
      type="info"
      show-icon
      :closable="false"
      class="mb-16px"
    />
    <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="110px">
      <div class="inspection-form-grid">
        <el-form-item label="项目名称" prop="projectName">
          <el-select
            v-model="createForm.projectName"
            placeholder="请选择有效的供应链项目"
            class="w-full"
            filterable
            @change="handleProjectChange"
          >
            <el-option
              v-for="item in availableProjects"
              :key="item.projectNo"
              :label="`${item.projectName} (${item.projectNo})`"
              :value="item.projectName"
            >
              <div class="flex justify-between items-center">
                <span>{{ item.projectName }}</span>
                <span class="text-gray-400 text-xs ml-2">{{ item.productPlan }} | {{ item.coreEnterpriseName }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目编号" prop="projectNo">
          <el-input v-model="createForm.projectNo" readonly placeholder="选择项目后自动返回" />
        </el-form-item>
        <el-form-item label="核心企业名称" prop="coreEnterpriseName">
          <el-input v-model="createForm.coreEnterpriseName" readonly placeholder="选择项目后自动返回" />
        </el-form-item>
        <el-form-item label="核心客户编号" prop="coreCustomerNo">
          <el-input v-model="createForm.coreCustomerNo" readonly placeholder="选择项目后自动返回" />
        </el-form-item>
        <el-form-item label="巡库日期" prop="inspectionDate" class="grid-col-span-2">
          <el-date-picker
            v-model="createForm.inspectionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择巡库日期 (YYYY-MM-DD)"
            class="w-full"
          />
        </el-form-item>
      </div>
      <div class="tip-banner mt-10px text-gray-500 text-xs">
        * 说明：新增完成后在“待提交的巡库申请”列表展示。
      </div>
    </el-form>
    <template #footer>
      <el-button @click="createVisible = false">取 消</el-button>
      <el-button type="primary" :loading="createLoading" @click="handleCreate">保 存</el-button>
    </template>
  </el-dialog>

  <!-- 项目仓库一览表弹框 -->
  <el-dialog
    v-model="warehousesOverviewVisible"
    title="项目仓库一览表"
    width="920px"
    destroy-on-close
  >
    <div v-if="overviewProject" class="overview-header mb-16px p-12px bg-gray-50 rounded border">
      <el-row :gutter="16">
        <el-col :span="12">
          <span class="text-gray-500">项目名称：</span>
          <span class="font-bold text-primary">{{ overviewProject.projectName }}</span>
        </el-col>
        <el-col :span="12">
          <span class="text-gray-500">项目编号：</span>
          <span class="font-bold">{{ overviewProject.projectNo }}</span>
        </el-col>
        <el-col :span="12" class="mt-8px">
          <span class="text-gray-500">核心企业：</span>
          <span>{{ overviewProject.coreEnterpriseName }}</span>
        </el-col>
        <el-col :span="12" class="mt-8px">
          <span class="text-gray-500">核心客户编号：</span>
          <span>{{ overviewProject.coreCustomerNo }}</span>
        </el-col>
      </el-row>
    </div>

    <el-table :data="projectWarehouses" border stripe style="width: 100%">
      <el-table-column prop="warehouseName" label="仓库名称" min-width="150" />
      <el-table-column prop="warehouseCode" label="仓库代码" min-width="120" />
      <el-table-column prop="warehouseType" label="仓库类型" width="100" />
      <el-table-column prop="regulatorEnterpriseName" label="监管方企业名称" min-width="170" />
      <el-table-column prop="insuranceExpiryDate" label="保险到期日" width="125" />
      <el-table-column prop="inspectionDate" label="最新巡库日期" width="135">
        <template #default="{ row }">
          <el-tag type="success" effect="light" class="font-bold">{{ row.inspectionDate || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag type="info" size="small">{{ row.status || '正常' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button type="primary" @click="warehousesOverviewVisible = false">关 闭</el-button>
    </template>
  </el-dialog>

  <!-- 签署意见弹框 -->
  <el-dialog v-model="signOpinionVisible" title="签署意见" width="600px" destroy-on-close>
    <el-form label-width="90px">
      <el-form-item label="申请编号">
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

  <!-- 查看意见弹框 -->
  <el-dialog v-model="opinionVisible" title="查看意见" width="720px" destroy-on-close>
    <el-timeline v-if="opinionRecord?.opinions?.length" class="inspection-timeline">
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

  <!-- 查看流转记录弹框 -->
  <el-dialog v-model="historyVisible" title="查看流转记录" width="680px" destroy-on-close>
    <el-timeline class="inspection-timeline">
      <el-timeline-item :timestamp="historyRecord?.applicationDate || ''" placement="top">
        已创建巡库申请，拟定巡库日期为 [ {{ historyRecord?.inspectionDate }} ]，进入“待提交”节点。
      </el-timeline-item>
      <el-timeline-item
        v-if="historyRecord && historyRecord.phase !== 'pending'"
        :timestamp="historyRecord?.receivedAt || historyRecord?.completedAt || '流程处理中'"
        type="primary"
        placement="top"
      >
        {{ historyRecord?.currentStage || historyRecord?.status || '分行债项管理岗审批' }}
      </el-timeline-item>
      <el-timeline-item
        v-if="historyRecord?.completedAt"
        :timestamp="historyRecord.completedAt"
        :type="historyRecord.phase === 'approved' ? 'success' : 'danger'"
        placement="top"
      >
        {{ historyRecord.phase === 'approved' ? '审批通过，已同步更新该项目下所有仓库的巡库日期。' : '审批结束。' }}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>

  <!-- 查看影像弹框 -->
  <el-dialog v-model="imageVisible" title="巡库申请影像" width="760px" destroy-on-close>
    <el-alert
      :title="`申请编号：${imageRecord?.applicationNo || ''} | 项目：${imageRecord?.projectName || ''}`"
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
import * as WarehouseManagementApi from '@/api/indebt/warehouseManagement'

defineOptions({ name: 'WarehouseInspectionWorkList' })

type WarehouseApplicationPhase = WarehouseManagementApi.WarehouseApplicationPhase
type WarehouseInspectionRecord = WarehouseManagementApi.WarehouseInspectionRecord
type WarehouseInspectionCreateForm = WarehouseManagementApi.WarehouseInspectionCreateForm
type ProjectWarehouseInfo = WarehouseManagementApi.ProjectWarehouseInfo
type EffectiveSupplyChainProject = WarehouseManagementApi.EffectiveSupplyChainProject

const props = defineProps<{
  params?: {
    phase?: WarehouseApplicationPhase
    isApproval?: boolean
  }
}>()

const currentPhase = computed<WarehouseApplicationPhase>(() => props.params?.phase || 'pending')
const isApprovalView = computed<boolean>(() => Boolean(props.params?.isApproval))

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
    label: '核心企业名称',
    field: 'coreEnterpriseName',
    minWidth: 190,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入客户名称' } }
  },
  {
    label: '核心客户编号',
    field: 'coreCustomerNo',
    minWidth: 175
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
  {
    label: '巡库日期',
    field: 'inspectionDate',
    minWidth: 135
  },
  {
    label: '申请日期',
    field: 'applicationDate',
    minWidth: 130
  },
  {
    label: '接收时间',
    field: 'receivedAt',
    minWidth: 165
  },
  {
    label: '当前阶段',
    field: 'currentStage',
    minWidth: 165
  },
  {
    label: '完成时间',
    field: 'completedAt',
    minWidth: 165
  },
  {
    label: '操作',
    field: 'action',
    fixed: 'right',
    width: 105
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const tableColumns = computed(() => {
  return allSchemas.tableColumns.filter((column) => {
    if (column.field === 'receivedAt') {
      return isApprovalView.value
    }
    if (column.field === 'currentStage') {
      return currentPhase.value !== 'pending' && !isApprovalView.value
    }
    if (column.field === 'completedAt') {
      return currentPhase.value === 'approved' || (isApprovalView.value && currentPhase.value === 'approved')
    }
    return true
  })
})

const { register, tableObject, tableMethods } = useTable<WarehouseInspectionRecord>({
  getListApi: WarehouseManagementApi.getWarehouseInspectionPage,
  defaultParams: { phase: currentPhase.value, isApproval: isApprovalView.value }
})
const { getList, setSearchParams } = tableMethods

const createVisible = ref(false)
const createLoading = ref(false)
const createFormRef = ref<FormInstance>()
const availableProjects = ref<EffectiveSupplyChainProject[]>([])

const warehousesOverviewVisible = ref(false)
const overviewProject = ref<WarehouseInspectionRecord | null>(null)
const projectWarehouses = ref<ProjectWarehouseInfo[]>([])

const signOpinionVisible = ref(false)
const signOpinionContent = ref('')
const signOpinionLoading = ref(false)
const opinionVisible = ref(false)
const opinionRecord = ref<WarehouseInspectionRecord>()
const historyVisible = ref(false)
const historyRecord = ref<WarehouseInspectionRecord>()
const imageVisible = ref(false)
const imageRecord = ref<WarehouseInspectionRecord>()
const actionLoading = ref<'submit' | 'withdraw' | 'approve' | ''>('')

const initialCreateForm = (): WarehouseInspectionCreateForm => ({
  projectName: '',
  projectNo: '',
  coreEnterpriseName: '',
  coreCustomerNo: '',
  inspectionDate: ''
})

const createForm = reactive<WarehouseInspectionCreateForm>(initialCreateForm())
const createRules: FormRules<WarehouseInspectionCreateForm> = {
  projectName: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
  inspectionDate: [{ required: true, message: '请选择巡库日期', trigger: 'change' }]
}

const currentRecord = computed(() => tableObject.currentRow || undefined)

const imageItems = computed(() => [
  {
    name: '现场巡库照片',
    description: `${imageRecord.value?.projectName || '项目'}现场照片`,
    icon: 'ep:picture'
  },
  {
    name: '巡库记录表',
    description: `巡库日期：${imageRecord.value?.inspectionDate || '待补充'}`,
    icon: 'ep:document'
  },
  {
    name: '仓库盘点明细',
    description: imageRecord.value?.coreEnterpriseName || '盘点明细表',
    icon: 'ep:files'
  }
])

const setCurrentRecord = (record: WarehouseInspectionRecord) => {
  tableObject.currentRow = record
}

const handleCellClick = (record: WarehouseInspectionRecord) => {
  setCurrentRecord(record)
}

const requireCurrentRecord = (): WarehouseInspectionRecord | undefined => {
  if (!currentRecord.value) {
    ElMessage.warning('请先点击选择一条巡库申请')
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
  setSearchParams({ ...params, phase: currentPhase.value, isApproval: isApprovalView.value })
}

const loadAvailableProjects = async () => {
  try {
    const list = await WarehouseManagementApi.getEffectiveSupplyChainProjects()
    availableProjects.value = list || []
  } catch (error) {
    console.error('加载有效项目失败', error)
  }
}

const handleProjectChange = (val: string) => {
  const selected = availableProjects.value.find((p) => p.projectName === val)
  if (selected) {
    createForm.projectNo = selected.projectNo
    createForm.coreEnterpriseName = selected.coreEnterpriseName
    createForm.coreCustomerNo = selected.coreCustomerNo
  }
}

const openCreate = async () => {
  Object.assign(createForm, initialCreateForm())
  createFormRef.value?.clearValidate()
  await loadAvailableProjects()
  createVisible.value = true
}

const handleCreate = async () => {
  const valid = await createFormRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return

  createLoading.value = true
  try {
    const result = await WarehouseManagementApi.createWarehouseInspection({ ...createForm })
    if (result && (result as any).success === false) {
      ElMessage.error((result as any).message || '新增巡库申请失败')
      return
    }
    ElMessage.success('新增成功，申请已存入待提交的巡库申请列表')
    createVisible.value = false
    await refreshList()
  } catch (error) {
    console.error('新增巡库申请异常', error)
    ElMessage.error('新增巡库申请失败')
  } finally {
    createLoading.value = false
  }
}

const openProjectWarehousesOverview = async (record?: WarehouseInspectionRecord) => {
  const target = record || requireCurrentRecord()
  if (!target) return

  overviewProject.value = target
  try {
    const res = await WarehouseManagementApi.getProjectWarehouses(target.projectNo)
    projectWarehouses.value = res || []
    warehousesOverviewVisible.value = true
  } catch (error) {
    console.error('加载项目仓库信息失败', error)
    ElMessage.error('加载项目仓库信息失败')
  }
}

const openSignOpinion = (record?: WarehouseInspectionRecord) => {
  const target = record || requireCurrentRecord()
  if (!target) return
  setCurrentRecord(target)
  signOpinionContent.value = ''
  signOpinionVisible.value = true
}

const handleSignOpinion = async () => {
  if (!currentRecord.value) return
  if (!signOpinionContent.value.trim()) {
    ElMessage.warning('请输入签署意见内容')
    return
  }

  signOpinionLoading.value = true
  try {
    const result = await WarehouseManagementApi.signWarehouseInspectionOpinion(
      currentRecord.value.id,
      signOpinionContent.value.trim()
    )
    if (result && result.success === false) {
      ElMessage.error(result.message || '签署意见失败')
      return
    }
    ElMessage.success('签署意见成功')
    signOpinionVisible.value = false
    await refreshList()
  } catch (error) {
    console.error('签署意见异常', error)
    ElMessage.error('签署意见失败')
  } finally {
    signOpinionLoading.value = false
  }
}

const handleSubmit = async () => {
  const record = requireCurrentRecord()
  if (!record) return

  try {
    await ElMessageBox.confirm(
      `确定提交申请编号为“${record.applicationNo}”的巡库申请吗？`,
      '提交确认',
      { confirmButtonText: '确定提交', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }

  actionLoading.value = 'submit'
  try {
    if (isApprovalView.value) {
      // 审批通过逻辑
      const result = await WarehouseManagementApi.approveWarehouseInspection(record.id)
      if (result && result.success === false) {
        ElMessage.error(result.message || '审批处理失败')
        return
      }
      ElMessage.success('审批通过！已将此流程的巡库日期更新至该项目关联的所有仓库。')
    } else {
      // 申请提交逻辑
      const result = await WarehouseManagementApi.submitWarehouseInspection(record.id)
      if (result && result.success === false) {
        ElMessage.error(result.message || '提交失败')
        return
      }
      ElMessage.success('提交成功，申请已进入“审查审批中”节点')
    }
    await refreshList()
  } catch (error) {
    console.error('提交巡库申请异常', error)
    ElMessage.error('操作失败')
  } finally {
    actionLoading.value = ''
  }
}

const handleWithdraw = async () => {
  const record = requireCurrentRecord()
  if (!record) return

  const confirmTitle = isApprovalView.value ? '退回确认' : '收回确认'
  const confirmMsg = isApprovalView.value
    ? `确定退回申请编号为“${record.applicationNo}”的巡库申请至上一步吗？`
    : `确定收回申请编号为“${record.applicationNo}”的巡库申请吗？`

  try {
    await ElMessageBox.confirm(confirmMsg, confirmTitle, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  actionLoading.value = 'withdraw'
  try {
    const result = await WarehouseManagementApi.withdrawWarehouseInspection(record.id)
    if (result && result.success === false) {
      ElMessage.error(result.message || '操作失败')
      return
    }
    ElMessage.success(isApprovalView.value ? '退回成功，已退回上一步' : '收回成功，申请已回到待提交节点')
    await refreshList()
  } catch (error) {
    console.error('收回/退回巡库申请异常', error)
    ElMessage.error('操作失败')
  } finally {
    actionLoading.value = ''
  }
}

const openOpinion = (record?: WarehouseInspectionRecord) => {
  const target = record || requireCurrentRecord()
  if (!target) return
  opinionRecord.value = target
  opinionVisible.value = true
}

const openHistory = (record?: WarehouseInspectionRecord) => {
  const target = record || requireCurrentRecord()
  if (!target) return
  historyRecord.value = target
  historyVisible.value = true
}

const openImage = (record?: WarehouseInspectionRecord) => {
  const target = record || requireCurrentRecord()
  if (!target) return
  imageRecord.value = target
  imageVisible.value = true
}

const visibleButtons = computed<ActionButton[]>(() => {
  if (isApprovalView.value) {
    if (currentPhase.value === 'reviewing') {
      return [
        {
          label: '项目仓库一览表',
          icon: 'ep:list',
          plain: true,
          onClick: () => openProjectWarehousesOverview()
        },
        {
          label: '提交',
          icon: 'ep:check',
          plain: true,
          loading: actionLoading.value === 'submit',
          onClick: () => handleSubmit()
        },
        {
          label: '签署意见',
          icon: 'ep:edit-pen',
          plain: true,
          onClick: () => openSignOpinion()
        },
        {
          label: '查看意见',
          icon: 'ep:chat-line-square',
          plain: true,
          onClick: () => openOpinion()
        },
        {
          label: '查看流转记录',
          icon: 'ep:connection',
          plain: true,
          onClick: () => openHistory()
        },
        {
          label: '退回上一步',
          icon: 'ep:back',
          plain: true,
          loading: actionLoading.value === 'withdraw',
          onClick: () => handleWithdraw()
        },
        {
          label: '查看影像',
          icon: 'ep:picture',
          plain: true,
          onClick: () => openImage()
        }
      ]
    } else {
      // 已完成工作
      return [
        {
          label: '项目仓库一览表',
          icon: 'ep:list',
          plain: true,
          onClick: () => openProjectWarehousesOverview()
        },
        {
          label: '查看意见',
          icon: 'ep:chat-line-square',
          plain: true,
          onClick: () => openOpinion()
        },
        {
          label: '查看流转记录',
          icon: 'ep:connection',
          plain: true,
          onClick: () => openHistory()
        },
        {
          label: '查看影像',
          icon: 'ep:picture',
          plain: true,
          onClick: () => openImage()
        }
      ]
    }
  }

  // 申请视角
  if (currentPhase.value === 'pending') {
    return [
      {
        label: '新增',
        icon: 'ep:plus',
        plain: true,
        onClick: () => openCreate()
      },
      {
        label: '项目仓库一览表',
        icon: 'ep:list',
        plain: true,
        onClick: () => openProjectWarehousesOverview()
      },
      {
        label: '签署意见',
        icon: 'ep:edit-pen',
        plain: true,
        onClick: () => openSignOpinion()
      },
      {
        label: '提交',
        icon: 'ep:check',
        plain: true,
        loading: actionLoading.value === 'submit',
        onClick: () => handleSubmit()
      },
      {
        label: '查看影像',
        icon: 'ep:picture',
        plain: true,
        onClick: () => openImage()
      }
    ]
  }

  if (currentPhase.value === 'reviewing') {
    return [
      {
        label: '项目仓库一览表',
        icon: 'ep:list',
        plain: true,
        onClick: () => openProjectWarehousesOverview()
      },
      {
        label: '查看意见',
        icon: 'ep:chat-line-square',
        plain: true,
        onClick: () => openOpinion()
      },
      {
        label: '查看流转记录',
        icon: 'ep:connection',
        plain: true,
        onClick: () => openHistory()
      },
      {
        label: '收回',
        icon: 'ep:back',
        plain: true,
        loading: actionLoading.value === 'withdraw',
        onClick: () => handleWithdraw()
      },
      {
        label: '查看影像',
        icon: 'ep:picture',
        plain: true,
        onClick: () => openImage()
      }
    ]
  }

  // 审批通过
  return [
    {
      label: '项目仓库一览表',
      icon: 'ep:list',
      plain: true,
      onClick: () => openProjectWarehousesOverview()
    },
    {
      label: '查看意见',
      icon: 'ep:chat-line-square',
      plain: true,
      onClick: () => openOpinion()
    },
    {
      label: '查看流转记录',
      icon: 'ep:connection',
      plain: true,
      onClick: () => openHistory()
    },
    {
      label: '查看影像',
      icon: 'ep:picture',
      plain: true,
      onClick: () => openImage()
    }
  ]
})

watch(
  () => [props.params?.phase, props.params?.isApproval],
  async () => {
    tableObject.currentRow = null
    await refreshList()
  }
)

onActivated(() => {
  refreshList()
})
</script>

<style lang="scss" scoped>
.inspection-work-list {
  :deep(.el-table__row) {
    cursor: pointer;
  }
}

.inspection-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
}

.grid-col-span-2 {
  grid-column: span 2;
}

.inspection-timeline {
  padding-left: 10px;
}

.image-file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-file-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background-color: var(--el-fill-color-blank);

  .image-file-icon {
    font-size: 28px;
    color: var(--el-color-primary);
  }

  > div {
    flex: 1;

    strong {
      display: block;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
