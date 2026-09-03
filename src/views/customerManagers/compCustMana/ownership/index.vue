<template>
  <ContentWrap :body-style="{ padding: '12px 15px 0' }">
    <div class="mb-15px text-16px font-bold">主办权</div>

    <div class="mb-15px flex flex-wrap gap-10px">
      <el-button plain :loading="submitting" @click="handlePrimaryAction">
        {{ primaryActionText }}
      </el-button>
      <el-button plain @click="handleReturn">退回客户</el-button>
      <el-button plain @click="handleSelectAll">全选</el-button>
      <el-button plain @click="handleReverseSelection">反选</el-button>
    </div>

    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      border
      stripe
      show-overflow-tooltip
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="customerName" label="客户名称" min-width="220" align="center" />
      <el-table-column prop="customerId" label="客户编号" width="190" align="center" />
      <el-table-column prop="certTypeName" label="证件类型" width="170" align="center" />
      <el-table-column prop="certId" label="证件号码" width="190" align="center" />
      <el-table-column prop="customerTypeName" label="客户类型" width="120" align="center" />
      <el-table-column prop="mfCustomerId" label="核心客户号" width="180" align="center" />
      <el-table-column
        prop="managerUserName"
        label="当前主办客户经理"
        width="170"
        align="center"
      />
      <el-table-column
        v-if="!isReceiveMode"
        prop="targetUserName"
        label="拟移交客户经理"
        width="160"
        align="center"
      />
      <el-table-column prop="changeStatusName" label="移交状态" width="120" align="center" />
    </el-table>

    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import * as CustomerApi from '../api.js'

defineOptions({ name: 'CustomerOwnershipPage' })

interface OwnershipRow {
  customerName: string
  customerId: string
  certType: string
  certTypeName: string
  certId: string
  customerTypeName: string
  managerUserName: string
  mfCustomerId: string
  changeStatus: string
  changeStatusName: string
  targetUserId?: string
  targetUserName?: string
}

const route = useRoute()
const isReceiveMode = computed(() => route.name === 'CustomerOwnershipReceive')
const primaryActionText = computed(() => (isReceiveMode.value ? '接收客户' : '移交客户'))

const loading = ref(false)
const submitting = ref(false)
const list = ref<OwnershipRow[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  customerType: String(route.query.customerType || '0110')
})
const tableRef = ref()
const selectedRows = ref<OwnershipRow[]>([])

const getList = async () => {
  loading.value = true
  try {
    const request = isReceiveMode.value
      ? CustomerApi.getReceiveCustomerList
      : CustomerApi.getSendCustomerList
    const data = await request(queryParams)
    list.value = data.list || []
    total.value = data.total || list.value.length
    selectedRows.value = []
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (rows: OwnershipRow[]) => {
  selectedRows.value = rows
}

const ensureSelection = () => {
  if (selectedRows.value.length > 0) return true
  ElMessage.warning('请选择要操作的客户')
  return false
}

const handlePrimaryAction = async () => {
  if (!ensureSelection()) return

  submitting.value = true
  try {
    const request = isReceiveMode.value ? CustomerApi.receiveRight : CustomerApi.hostingRight
    await request({ customerIds: selectedRows.value.map((row) => row.customerId) })
    const statusName = isReceiveMode.value ? '已接收' : '移交申请已提交'
    selectedRows.value.forEach((row) => {
      row.changeStatusName = statusName
    })
    tableRef.value?.clearSelection()
    ElMessage.success(`${primaryActionText.value}成功`)
  } finally {
    submitting.value = false
  }
}

const handleReturn = () => {
  if (!ensureSelection()) return
  selectedRows.value.forEach((row) => {
    row.changeStatusName = '已退回'
  })
  tableRef.value?.clearSelection()
  ElMessage.success('退回成功')
}

const handleSelectAll = () => {
  tableRef.value?.toggleAllSelection()
}

const handleReverseSelection = () => {
  const selectedIds = new Set(selectedRows.value.map((row) => row.customerId))
  list.value.forEach((row) => {
    tableRef.value?.toggleRowSelection(row, !selectedIds.has(row.customerId))
  })
}

watch(
  () => [route.name, route.query.customerType],
  () => {
    queryParams.customerType = String(route.query.customerType || '0110')
    queryParams.pageNo = 1
    getList()
  },
  { immediate: true }
)
</script>
