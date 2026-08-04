<template>
  <div class="rule-common-table-comp">
    <tableTitle title="商品中类">
    </tableTitle>

    <Table
      :columns="columns"
      :data="list"
      :loading="loading"
      :pagination="{
        total: total,
        size: 'small'
      }"
      selection
      reserve-selection
      highlight-current-row
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @selection-change="tableCurrentChange"
      @page-change="getList"
    >
    </Table>
  </div>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from './api.js'

const emit = defineEmits(['currentRowChange'])

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
}, 10);

const columns = [
  { label: '中类编码', field: 'code', minWidth: 150 },
  { label: '中类名称', field: 'label', minWidth: 200 },
  { label: '所属大类', field: 'bigLabel', minWidth: 180 }
]

const edit = () => {
  settingClick()
}

const del = () => {

}

const settingClick = () => {
  emit('settingClick')
}

defineExpose({
  currentRow
})
</script>

<style lang="scss" scoped>
.rule-common-table-comp {
  display: flex;
  flex-direction: column;
}
  
</style>