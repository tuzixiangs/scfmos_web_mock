<template>
  <ContentWrap class="!p-0 w-100%" :body-style="{ padding: '0 15px' }">
    <Table
      ref="tableRef"
      :columns="columns"
      :data="list"
      :loading="loading"
      :pagination="{ total }"
      highlight-current-row
      selection
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @current-change="tableCurrentChange"
      @page-change="getList"
      @selection-change="selectionChange"
    />
  </ContentWrap>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'

const {
  queryParams,
  loading,
  getList,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange,
  setDefaultParams
} = useTableList(Api.crVariables, {}, false)

const tableRef = ref()

const visible = ref(false)

const columns = [
  { label: '债项因子编号', field: 'variablesGroupId' },
  { label: '债项因子名称', field: 'variablesName' },
  { label: '债项因子键值', field: 'variablesKey' }
]

const open = ({ objectNo }) => {
  visible.value = true
  getList()
}

const selections = ref([])
const selectionChange = (row) => {
  selections.value = row
}

defineExpose({
  open,
  search,
  selections
})
</script>
