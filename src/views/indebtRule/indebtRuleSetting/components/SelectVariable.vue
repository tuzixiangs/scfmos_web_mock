<template>
<div>
  <el-button @click="visible = true"></el-button>
  <Dialog
    class="!p-0 select-variable"
    body-class="!overflow-y-unset"
    append-to-body
    width="90%"
    v-model="visible"
    title="债项因子选择"
  >
    <div class="select-variable-container">
      <!-- 左侧表格 -->
      <div class="left-table-wrapper">
        <div class="table-header">
          <span class="table-title">可选债项因子</span>
        </div>
        <Table
          ref="leftTableRef"
          :columns="leftColumns"
          :data="leftTableData"
          :pagination="leftPagination"
          v-model:current-page="leftPagination.currentPage"
          v-model:page-size="leftPagination.pageSize"
          :loading="leftLoading"
          border
          stripe
          size="small"
          @page-change="handleLeftPageChange"
          @selection-change="handleLeftSelectionChange"
        />
      </div>

      <!-- 中间操作按钮 -->
      <div class="center-actions">
        <el-button
          type="primary"
          :icon="ArrowRight"
          circle
          @click="handleAddToRight"
          :disabled="!selectedLeftRows.length"
        />
      </div>

      <!-- 右侧表格 -->
      <div class="right-table-wrapper">
        <div class="table-header">
          <span class="table-title">已选债项因子</span>
          <el-tag v-if="selectedRightRows.length" type="primary" class="selection-count">
            已选 {{ selectedRightRows.length }} 项
          </el-tag>
        </div>
        <Table
          ref="rightTableRef"
          :columns="rightColumns"
          :data="rightTableData"
          :pagination="rightPagination"
          v-model:current-page="rightPagination.currentPage"
          v-model:page-size="rightPagination.pageSize"
          :loading="rightLoading"
          selection
          border
          stripe
          size="small"
          @page-change="handleRightPageChange"
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </Dialog>
</div>

</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { Table } from '@/components/Table'
import { getVariablesGroupList } from '@/views/indebtRule/crVariablesGroupList/api'
import request from '@/config/axios'

defineOptions({
  name: 'SelectVariable'
})

const emit = defineEmits(['confirm'])

const visible = ref(false)
const leftTableRef = ref()
const rightTableRef = ref()

// 左侧表格数据
const leftLoading = ref(false)
const leftTableData = ref<any[]>([])
const selectedLeftRows = ref<any[]>([])
const leftPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 右侧表格数据
const rightLoading = ref(false)
const rightTableData = ref<any[]>([])
const selectedRightRows = ref<any[]>([])
const rightPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 当前选中的债项因子组ID
const selectedGroupId = ref<string>('')

// 左侧表头
const leftColumns = [
  { field: 'variablesGroupCode', label: '债项因子编号', width: 150 },
  { field: 'variablesGroupName', label: '债项因子名称', minWidth: 200 },
  { field: 'variablesGroupSource', label: '债项因子来源', minWidth: 150 }
]

// 右侧表头
const rightColumns = [
  { field: 'variablesCode', label: '债项因子编号', width: 150 },
  { field: 'variablesName', label: '债项因子名称', minWidth: 200 },
  { field: 'variablesKey', label: '债项因子键值', minWidth: 200 }
]

/** 打开弹窗 */
const open = async (type?: string, id?: string) => {
  visible.value = true
  selectedGroupId.value = id || ''
  
  // 重置分页
  leftPagination.currentPage = 1
  rightPagination.currentPage = 1
  
  // 加载左侧数据
  await loadLeftTableData()
  
  // 如果有选中的组ID，加载右侧数据
  if (selectedGroupId.value) {
    await loadRightTableData()
  }
}

defineExpose({ open })

/** 加载左侧表格数据 */
const loadLeftTableData = async () => {
  leftLoading.value = true
  try {
    const res = await getVariablesGroupList({
      currentPage: leftPagination.currentPage,
      pageSize: leftPagination.pageSize
    })
    leftTableData.value = res.records || []
    leftPagination.total = res.total || 0
  } catch (error) {
    console.error('加载左侧数据失败:', error)
  } finally {
    leftLoading.value = false
  }
}

/** 加载右侧表格数据 */
const loadRightTableData = async () => {
  if (!selectedGroupId.value) {
    rightTableData.value = []
    rightPagination.total = 0
    return
  }
  
  rightLoading.value = true
  try {
    const res = await request.get({
      url: '/system/crVariables/list',
      params: {
        variablesGroupId: selectedGroupId.value,
        currentPage: rightPagination.currentPage,
        pageSize: rightPagination.pageSize
      }
    })
    rightTableData.value = res.records || []
    rightPagination.total = res.total || 0
  } catch (error) {
    console.error('加载右侧数据失败:', error)
  } finally {
    rightLoading.value = false
  }
}

/** 左侧分页变化 */
const handleLeftPageChange = async ({ pageNo, pageSize }: { pageNo: number; pageSize: number }) => {
  leftPagination.currentPage = pageNo
  leftPagination.pageSize = pageSize
  selectedLeftRows.value = []
  await loadLeftTableData()
}

/** 右侧分页变化 */
const handleRightPageChange = async ({ pageNo, pageSize }: { pageNo: number; pageSize: number }) => {
  rightPagination.currentPage = pageNo
  rightPagination.pageSize = pageSize
  await loadRightTableData()
}

/** 左侧选择变化 */
const handleLeftSelectionChange = (selection: any[]) => {
  selectedLeftRows.value = selection
}

/** 添加到右侧 */
const handleAddToRight = () => {
  // 将左侧选中的数据添加到右侧
  const newItems = selectedLeftRows.value.filter(
    (leftRow) =>
      !rightTableData.value.some((rightRow) => rightRow.id === leftRow.id)
  )
  
  rightTableData.value = [...rightTableData.value, ...newItems]
  rightPagination.total = rightTableData.value.length
  
  // 清空左侧选择
  selectedLeftRows.value = []
  nextTick(() => {
    leftTableRef.value?.elTableRef?.clearSelection()
  })
}

/** 确认选择 */
const confirm = () => {
  emit('confirm', selectedRightRows.value)
  visible.value = false
}

// 监听组ID变化，重新加载右侧数据
watch(
  () => selectedGroupId.value,
  () => {
    if (selectedGroupId.value) {
      rightPagination.currentPage = 1
      loadRightTableData()
    }
  }
)
</script>

<style lang="scss" scoped>
.select-variable {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .select-variable-container {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    min-height: 500px;

    .left-table-wrapper,
    .right-table-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;

      .table-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;

        .table-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .selection-count {
          margin-left: auto;
        }
      }
    }

    .center-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 10px;

      .el-button {
        margin: 10px 0;
      }
    }
  }

  .dialog-footer {
    padding: 20px;
    padding-top: 0;
    text-align: right;
  }
}
</style>
