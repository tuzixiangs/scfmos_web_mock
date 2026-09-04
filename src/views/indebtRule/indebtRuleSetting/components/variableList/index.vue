<template>
  <div class="variable-list">
    <!-- 顶部操作区 -->
    <ContentWrap class="!p-0" :body-style="{ padding: '0 15px' }">
      <tableTitle title="债项因子规则">
        <el-button @click="selectIndebtRule"> 选择债项因子 </el-button>
      </tableTitle>
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
      />
    </ContentWrap>

    <selectPopVue ref="selectPopRef" @confirm="selectPopConfirm" />
  </div>
</template>

<script setup>
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'
import tableTitle from '@/components/busiComp/tableTitle/index.vue'
import selectPopVue from './selectPop.vue'

const props = defineProps({
  ruleId: String
})

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
  setDefaultParams,
  fetchCback
} = useTableList(Api.varAndConst, { ruleId: props.ruleId }, false)

fetchCback(() => {
  list.value.forEach(v => {
    v.variablesGroupId = v.ruleId
  })
})

// 演示环境直接进入规则详情时也展示已配置的债项因子，避免空白表格。
reSearch()

const selectPopRef = ref()
const selectIndebtRule = () => {
  selectPopRef.value.open()
}

const selectPopConfirm = (data) => {
  list.value = data
}

const columns = [
  { label: '债项因子编号', field: 'variablesGroupId' },
  { label: '债项因子名称', field: 'variablesName' },
  { label: '债项因子键值', field: 'variablesKey' }
]

defineExpose({
  list
})
</script>

<style lang="scss" scoped>
.variable-list {
}
</style>
