<template>
  <div class="rule-common-table-comp">
    <tableTitle title="预选商品大类/中类">
      <el-button size="small" @click="add"> 新增 </el-button>
      <el-button size="small" type="danger" :disabled="!currentRow?.length" @click="del"> 删除 </el-button>
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
      highlight-current-row
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @selection-change="tableCurrentChange"
      @page-change="getList"
    >
    </Table>

    <selComClassPop ref="selComClassPopRef" />
  </div>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from '../api.js'
import selComClassPop from '../../../commonComp/selComClassPop/index.vue'
const emit = defineEmits(['settingClick'])

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
  { label: '商品大类', field: 'serialNo', minWidth: 120 },
  { label: '商品中类', field: 'serialNo', minWidth: 120 },
  { label: '商品代码', field: 'serialNo', minWidth: 120 },
]

const edit = () => {
  settingClick()
}

const del = () => {

}

const selComClassPopRef = ref()
const add = () => {
  selComClassPopRef.value.open()
}
</script>

<style lang="scss" scoped>
.rule-common-table-comp {
  display: flex;
  flex-direction: column;
}
  
</style>