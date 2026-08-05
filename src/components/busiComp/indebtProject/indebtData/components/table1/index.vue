<template>
  <div class="rule-common-table-comp">
    <tableTitle title="订单合同列表">
      <div class="flex">
        <el-button size="small" @click="save"> 保存 </el-button>
        <el-button size="small" @click="add"> 新增 </el-button>
        <el-button size="small" @click="importValid"> 引入有效订单/合同 </el-button>
        <el-button size="small" @click="save"> 上传excel </el-button>
        <el-button size="small" @click="save"> 导出模版 </el-button>
        <el-button size="small" @click="save"> 删除 </el-button>
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
      <template #phaseNo="{ row }">
        <el-input @click.stop v-model="row.phaseNo" />
      </template>
      <template #phaseName="{ row }">
        <el-select @click.stop v-model="row.phaseName">
          <el-option label="甲方" value="1" />
          <el-option label="购买方" value="2" />
        </el-select>
      </template>
      <template #userId="{ row }">
        <el-select @click.stop v-model="row.userId">
          <el-option label="乙方" value="1" />
          <el-option label="销售方" value="2" />
        </el-select>
      </template>
      <template #userName="{ row }">
        <el-select @click.stop v-model="row.userName">
          <el-option label="丙方" value="1" />
          <el-option label="第三方" value="2" />
        </el-select>
      </template>
      <template #orgId="{ row }">
        <el-input @click.stop v-model="row.orgId" />
      </template>
      <template #orgName="{ row }">
        <el-input @click.stop v-model="row.orgName" />
      </template>
      <template #orgName2="{ row }">
        <el-date-picker
          @click.stop
          class="!w-150px"
          v-model="row.orgName2"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
        />
      </template>
      <template #orgName3="{ row }">
        <el-date-picker
          @click.stop
          class="!w-150px"
          v-model="row.orgName3"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
        />
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click.stop="edit(row)">上传影像</el-button>
      </template>
    </Table>

    <importValidOrder ref="importValidOrderRef" />
  </div>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from './api.js'
import importValidOrder from '../importValidOrder/index.vue'

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
  list.value.push({ currency: '人民币' })
  list.value.push({ currency: '人民币' })
  list.value.push({ currency: '人民币' })
  list.value.push({ currency: '人民币' })
  list.value.push({ currency: '人民币' })
  list.value.push({ currency: '人民币' })
}, 10)

const columns = [
  { label: '序号', type: 'index', minWidth: 120 },
  { label: '订单/合同流水号', field: 'serialNo', minWidth: 120 },
  { label: '* 订单/合同编号', field: 'phaseNo', minWidth: 220 },
  { label: '* 签约方1', field: 'phaseName', minWidth: 120 },
  { label: '* 签约方2', field: 'userId', minWidth: 120 },
  { label: '签约方3', field: 'userName', minWidth: 120 },
  { label: '* 订单/合同总金额', field: 'orgId', minWidth: 140 },
  { label: '* 本次使用金额', field: 'orgName', minWidth: 120 },
  { label: '剩余可用金额', field: 'orgName1', minWidth: 120 },
  { label: '* 币种', field: 'currency', minWidth: 120 },
  { label: '* 合同起始日', field: 'orgName2', minWidth: 180 },
  { label: '* 合同到期日', field: 'orgName3', minWidth: 180 },
  { label: '数据来源', field: 'orgName4', minWidth: 120 },
  { label: '操作', field: 'action', minWidth: 120, fixed: 'right' }
]

const edit = () => {
  settingClick()
}

const del = () => {}

const add = () => {
  list.value.unshift({
    currency: '人民币'
  })
}

const importValidOrderRef = ref()
const importValid = () => {
  importValidOrderRef.value.open()
}

const save = () => {}
</script>

<style lang="scss" scoped>
.rule-common-table-comp {
  display: flex;
  flex-direction: column;
}
</style>
