<template>
  <ContentWrap class="!p-0 w-100%" :body-style="{ padding: '0 15px' }">
    <Table
      :columns="columns"
      :data="list"
      :loading="loading"
      :pagination="{ total }"
      highlight-current-row
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @current-change="tableCurrentChange"
      @page-change="getList"
      @row-click="tableRowClick"
    />
  </ContentWrap>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'

const emit = defineEmits(['select'])

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
} = useTableList(Api.crVariablesGroup, {}, false)

const visible = ref(false)

const columns = [
  { label: '债项因子编号', field: 'variablesGroupCode' },
  { label: '债项因子名称', field: 'variablesGroupName' },
  { label: '债项因子来源', field: 'variablesOrigin' }
]

const open = ({ objectNo }) => {
  visible.value = true
  getList()
}

const btnLoading = ref(false)

const tableRowClick = () => {
  emit('select', currentRow.value)
}

defineExpose({
  open,
  search
})
</script>
