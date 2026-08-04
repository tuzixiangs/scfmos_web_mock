<template>
  <div class="select-area">
    <el-form-item label="常量集">
      <el-button @click="handleSelectContant">选择常量</el-button>
    </el-form-item>
    <div v-if="props.ruleAdd">
      <!-- 选常量弹窗 -->
      <el-dialog
        title="选择常量"
        v-model="visible"
        :width="700"
        @confirm="handleOk"
        @cancel="handleCancel"
      >
        <el-table
          @expand="expand"
          :row-key="(row) => row.id"
          :columns="outColumns"
          :data="outData"
          :pagination="ipagination1"
          @page-change="handleTableChange"
          v-model:expanded-row-keys="expandedRowKeys"
        >
          <template #expanded="{ row }">
            <el-table
              :row-key="(row) => row.constantId"
              :columns="inColumns"
              :data="inData"
              :pagination="false"
            >
              <template #default="{ row: inRow }">
                <el-checkbox
                  :model-value="judgeArrId(inRow)"
                  @change="(val) => selectContant(inRow, val)"
                >
                  {{ inRow.constantName }}
                </el-checkbox>
              </template>
            </el-table>
          </template>
        </el-table>
      </el-dialog>
      <!-- 所选常量表格 -->
      <el-table
        style="padding: 0 20px;"
        border
        :row-key="(row) => row.constantId"
        :data="state.rule.selectedContant"
        :pagination="ipagination2"
      >
        <template #default="{ row }">
          <el-table-column prop="constantId" label="常量编号" />
          <el-table-column prop="constantName" label="常量名" />
          <el-table-column prop="constantKey" label="常量键值" />
          <el-table-column label="操作">
            <template #default>
              <el-link @click="handleEdit(row)">编辑</el-link>
              <el-divider direction="vertical" />
              <el-popconfirm @confirm="() => handleDelete(row.constantId)" title="确定删除吗?">
                <template #reference>
                  <el-link type="danger">删除</el-link>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div v-else-if="props.ruleEdit">
      <!-- 选常量弹窗 -->
      <el-dialog
        title="选择常量"
        v-model="visible"
        :width="700"
        @confirm="handleOk"
        @cancel="handleCancel"
      >
        <el-table
          @expand="expand"
          :row-key="(row) => row.id"
          :columns="outColumns"
          :data="outData"
          :pagination="ipagination1"
          @page-change="handleTableChange"
          v-model:expanded-row-keys="expandedRowKeys"
        >
          <template #expanded="{ row }">
            <el-table
              :row-key="(row) => row.constantId"
              :columns="inColumns"
              :data="inData"
              :pagination="false"
            >
              <template #default="{ row: inRow }">
                <el-checkbox
                  :model-value="judgeArrId(inRow)"
                  @change="(val) => selectContant(inRow, val)"
                >
                  {{ inRow.constantName }}
                </el-checkbox>
              </template>
            </el-table>
          </template>
        </el-table>
      </el-dialog>
      <!-- 所选常量表格 -->
      <el-table
        style="padding: 0 20px;"
        border
        :row-key="(row) => row.constantId"
        :data="state.rule.selectedContant"
        :pagination="ipagination2"
      >
        <template #default="{ row }">
          <el-table-column prop="constantId" label="常量编号" />
          <el-table-column prop="constantName" label="常量名" />
          <el-table-column prop="constantKey" label="常量键值" />
          <el-table-column label="操作">
            <template #default>
              <el-link @click="handleEdit(row)">编辑</el-link>
              <el-divider direction="vertical" />
              <el-popconfirm @confirm="() => handleDelete(row.constantId)" title="确定删除吗?">
                <template #reference>
                  <el-link type="danger">删除</el-link>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, defineProps, defineEmits } from 'vue'
import { contantGroupList, contantList } from './api.js'

// Props
const props = defineProps({
  scUpdateData: {
    type: Array,
    default: () => []
  },
  ruleAdd: {
    type: Boolean,
    default: false
  },
  ruleEdit: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['scTransData', 'editData'])

// 状态
const visible = ref(false)
const confirmLoading = ref(false)
const outData = ref<any[]>([])
const inData = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])
const expandedRowKeys = ref<string[]>([])
const backUpData = ref<any[]>([])

const ipagination1 = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const ipagination2 = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const state = reactive({
  rule: {
    selectedContant: [] as any[]
  }
})

// 表格列配置
const outColumns = [
  {
    prop: 'id',
    label: '常量编号'
  },
  {
    prop: 'constantGroupName',
    label: '常量名称'
  }
]

const inColumns = [
  {
    prop: 'constantId',
    label: '常量编号'
  },
  {
    prop: 'constantName',
    label: '常量名称'
  },
  {
    prop: 'constantValue',
    label: '常量值'
  },
  {
    prop: 'constantOrigin',
    label: '常量来源',
    formatter: (row: any) => {
      const map: Record<string, string> = {
        '01': '录入',
        '02': '渠道',
        '03': '下游系'
      }
      return map[row.constantOrigin] || ''
    }
  }
]

const selectedColumns = [
  {
    prop: 'constantId',
    label: '常量编号'
  },
  {
    prop: 'constantName',
    label: '常量名'
  },
  {
    prop: 'constantKey',
    label: '常量键值'
  },
  {
    prop: 'action',
    label: '操作'
  }
]

// 方法
const loadData = async (pageNo = 1, pageSize = 10) => {
  try {
    const data = { pageNo, pageSize }
    const res: any = await contantGroupList(data)
    outData.value = res.result?.records || res.result
    ipagination1.value.total = res.result?.total || 0
    ipagination1.value.currentPage = res.result?.current || 1
  } catch (error) {
    console.error('查询常量类别列表失败:', error)
  }
}

const handleSelectContant = () => {
  visible.value = true
  loadData()
}

const handleOk = () => {
  visible.value = false
  const arr = [...state.rule.selectedContant]
  backUpData.value = [...state.rule.selectedContant]
  emit('scTransData', arr)
  if (props.ruleEdit) {
    emit('editData', arr)
  }
}

const handleCancel = () => {
  state.rule.selectedContant = [...backUpData.value]
  confirmLoading.value = true
  visible.value = false
  confirmLoading.value = false
}

const expand = async (expanded: boolean, row: any) => {
  if (expanded) {
    expandedRowKeys.value = [row.id]

    const data = { constantGroupId: row.id }
    try {
      const res: any = await contantList(data)
      if (props.ruleEdit) {
        (res.result?.records || []).forEach((item: any) => {
          state.rule.selectedContant.forEach((elem: any) => {
            if (item.id === elem.constantId) {
              item.checked = true
            }
          })
          item.constantId = item.id
          item.argType = 'C'
          delete item.id
        })
      }
      inData.value = res.result?.records || []
    } catch (error) {
      console.error('查询常量列表失败:', error)
    }
  }
}

const handleTableChange = (pagination: any) => {
  loadData(pagination.currentPage, pagination.pageSize)
}

const judgeArrId = (row: any) => {
  const idArr = state.rule.selectedContant.map((item: any) => item.constantId)
  const judgeArr = [...new Set(idArr)]
  return judgeArr.indexOf(row.constantId) > -1
}

const selectContant = (record: any, selected: boolean) => {
  if (selected) {
    if (!judgeArrId(record)) state.rule.selectedContant.push(record)
  } else {
    state.rule.selectedContant = state.rule.selectedContant.filter((item: any) => {
      return item.constantId !== record.constantId
    })
  }
}

const handleEdit = (record: any) => {}

const handleDelete = (id: string) => {}

// 监听 scUpdateData 变化
watch(() => props.scUpdateData, (n) => {
  if (n) {
    backUpData.value = [...n]
    state.rule.selectedContant = [...n]
  }
}, { immediate: true })

// 监听 visible 变化
watch(visible, (n) => {
  if (n) {
    if (props.ruleAdd) {
      state.rule.selectedContant = []
    } else if (props.ruleEdit) {
      state.rule.selectedContant = [...backUpData.value]
    }
  }
})
</script>

<style lang="scss" scoped>
.select-area {
  margin-top: 20px;
  .input-block {
    display: flex;
    margin-left: 150px;
  }
}
</style>
