<template>
  <div class="rule-common-table-comp">
    <tableTitle :title="title">
      <el-button size="small" @click="add"> 新增 </el-button>
    </tableTitle>

    <Table
      :columns="columns"
      :data="list"
      :loading="loading"
      :pagination="{
        total: total,
        size: 'small'
      }"
      highlight-current-row
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @current-change="tableCurrentChange"
      @page-change="getList"
    >
      <template #action="{  }">
        <el-button type="primary" link @click="add">编辑</el-button>
        <el-button type="danger" link>删除</el-button>
      </template>
    </Table>

    <addComp ref="addCompRef" :type="type" />
  </div>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from './api.js'
import tableTitle from '@/components/busiComp/tableTitle/index.vue'
import addComp from './addComp/index.vue'

const props = defineProps({
  title: {
    // 表名
    type: String,
    default: '表名'
  },
  type: {
    type: String,
    default: '1'
  }
})

const {
  queryParams,
  getList,
  loading,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange,
  fetchCback,
  setDefaultParams
} = useTableList(Api.getFlowRecordPage, {}, false)

setTimeout(() => {
  list.value.push({})
}, 1000)

const columns1 = [
  { label: '商品大类', field: 'serialNo', minWidth: 120 },
  { label: '商品中类', field: 'phaseNo', minWidth: 220 },
  { label: '商品小类', field: 'phaseNo', minWidth: 220 },
  { label: '剩余有效期（月）', field: 'phaseNo', minWidth: 220 },
  { label: '价衰系数（%）', field: 'phaseNo', minWidth: 220 },
  { label: '操作', field: 'action', minWidth: 220 },
]
const columns2 = [
  { label: '商品大类', field: 'serialNo', minWidth: 120 },
  { label: '商品中类', field: 'phaseNo', minWidth: 220 },
  { label: '商品小类', field: 'phaseNo', minWidth: 220 },
  { label: '在库时长（天）', field: 'phaseNo', minWidth: 220 },
  { label: '价衰系数（%）', field: 'phaseNo', minWidth: 220 },
  { label: '操作', field: 'action', minWidth: 220 },
]

const columns = ref([])

const initColumns = () => {
  columns.value = props.type == 1 ? columns1 : columns2
}

initColumns()

const addCompRef = ref()
const add = () => {
  addCompRef.value.open()
}

const edit = () => {}

const del = () => {}
</script>

<style lang="scss" scoped>
.rule-common-table-comp {
  display: flex;
  flex-direction: column;
}
</style>
