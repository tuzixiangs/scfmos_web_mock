<template>
  <div class="rule-common-table-comp">
    <tableTitle :title="title">
      <el-button size="small" @click="settingClick"> 配置 </el-button>
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
      <template #action="{ row }">
        <el-button link type="primary" @click="edit(row)">编辑</el-button>
        <el-button link type="danger" @click="del(row)">删除</el-button>
      </template>
    </Table>
  </div>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from './api.js'

const props = defineProps({
  title: { // 表名
    type: String,
    default: '表名'
  },
})

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
  { label: '商品类别', field: 'serialNo', minWidth: 120 },
  { label: '境内/外采购', field: 'objectNo', minWidth: 220 },
  { label: '规则编号', field: 'phaseNo', minWidth: 220 },
  { label: '规则类型', field: 'phaseName', minWidth: 120 },
  { label: '规则名称', field: 'userId', minWidth: 220 },
  { label: '规则描述', field: 'userName', minWidth: 120 },
  { label: '规则表达式', field: 'orgId', minWidth: 120 },
  { label: '债项因子', field: 'orgName', minWidth: 120 },
  { label: '操作', field: 'action', minWidth: 120 },
]

const edit = () => {
  settingClick()
}

const del = () => {

}

const settingClick = () => {
  emit('settingClick')
}
</script>

<style lang="scss" scoped>
.rule-common-table-comp {
  display: flex;
  flex-direction: column;
}
  
</style>