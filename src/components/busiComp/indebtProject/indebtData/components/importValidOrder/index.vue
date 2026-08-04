<template>
  <Dialog
    class="!p-0"
    body-class="!overflow-y-unset"
    width="90%"
    top="20vh"
    append-to-body
    v-model="visible"
    title="引入有效订单/合同"
  >
    <content-wrap>
      <tableTitle title="可引入订单/合同列表">
        <div class="flex">
          <el-button size="small" @click="save"> 保存 </el-button>
        </div>
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
        v-model:pageSize="queryParams.pageSize"
        v-model:currentPage="queryParams.pageNo"
        @selection-change="tableCurrentChange"
        @page-change="getList"
      >
      </Table>
    </content-wrap>

    <template #footer>
      <div class="p-20px pt-0">
        <el-button @click="visible = false">关 闭</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import indebtData from '@/components/busiComp/indebtProject/indebtData/index.vue'
import useTableList from '@/compositions/useTableList'
import * as Api from './api.js'

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
  list.value.push({})
  list.value.push({})
  list.value.push({})
  list.value.push({})
  list.value.push({})
}, 10)

const columns = [
  { label: '序号', type: 'index', minWidth: 120 },
  { label: '订单/合同流水号', field: 'serialNo', minWidth: 120 },
  { label: '订单/合同编号', field: 'phaseNo', minWidth: 180 },
  { label: '签约方1', field: 'phaseName', minWidth: 120 },
  { label: '签约方2', field: 'userId', minWidth: 120 },
  { label: '签约方3', field: 'userName', minWidth: 120 },
  { label: '订单/合同总金额', field: 'orgId', minWidth: 120 },
  { label: '本次使用金额', field: 'orgName', minWidth: 120 },
  { label: '剩余可用金额', field: 'orgName1', minWidth: 120 },
  { label: '币种', field: 'currency', minWidth: 120 },
  { label: '合同起始日', field: 'orgName2', minWidth: 180 },
  { label: '合同到期日', field: 'orgName3', minWidth: 180 },
  { label: '数据来源', field: 'orgName4', minWidth: 120 }
]

const visible = ref(false) // 弹窗的是否展示
/** 打开弹窗 */
const open = async (type, id) => {
  visible.value = true
}

const confirm = () => {
  
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
