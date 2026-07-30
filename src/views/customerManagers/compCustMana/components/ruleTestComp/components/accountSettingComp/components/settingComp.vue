<template>
  <div class="rule-common-table-comp">
    <tableTitle :title="title">
      <el-button size="small"> 配置 </el-button>
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
    </Table>
  </div>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from './api.js'
import tableTitle from '@/components/busiComp/tableTitle/index.vue'

const props = defineProps({
  title: {
    // 表名
    type: String,
    default: '表名'
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
  // list.value.push({})
}, 1000)

const columns = [
  { label: '客户名称', field: 'serialNo', minWidth: 120 },
  { label: '监测账号', field: 'phaseNo', minWidth: 220 }
]

const edit = () => {}

const del = () => {}
</script>

<style lang="scss" scoped>
.rule-common-table-comp {
  display: flex;
  flex-direction: column;
}
</style>
