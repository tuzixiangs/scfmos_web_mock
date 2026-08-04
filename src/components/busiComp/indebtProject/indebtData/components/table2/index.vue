<template>
  <div class="rule-common-table-comp">
    <tableTitle title="债项资产清单">
      <span>-资产总金额：2,354,000,000</span>
      <div class="flex">
        <el-button size="small" @click="save"> 保存为入库 </el-button>
        <el-button size="small" @click="add"> 保存为虚拟库 </el-button>
        <el-button size="small" @click="add"> 新增 </el-button>
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
          <el-option label="商品大类1" value="1" />
          <el-option label="商品大类2" value="2" />
        </el-select>
      </template>
      <template #userId="{ row }">
        <el-select @click.stop v-model="row.userId">
          <el-option label="商品中类1" value="1" />
          <el-option label="商品中类2" value="2" />
        </el-select>
      </template>
      <template #orgId="{ row }">
        <el-input @click.stop v-model="row.orgId" />
      </template>
      <template #orgName="{ row }">
        <el-input @click.stop v-model="row.orgName" />
      </template>
      <template #orgName1="{ row }">
        <el-select @click.stop v-model="row.orgName1">
          <el-option label="国家1" value="1" />
          <el-option label="国家2" value="2" />
        </el-select>
      </template>
      <template #currency1="{ row }">
        <el-select @click.stop v-model="row.currency1">
          <el-option label="仓库1" value="1" />
          <el-option label="仓库2" value="2" />
        </el-select>
      </template>
      <template #orgName2="{ row }">
        <el-input @click.stop v-model="row.orgName2" />
      </template>
      <template #orgName3="{ row }">
        <el-input @click.stop v-model="row.orgName3" />
      </template>
      <template #orgName4="{ row }">
        <el-input @click.stop v-model="row.orgName4" />
      </template>
      <template #orgName7="{ row }">
        <el-date-picker
          @click.stop
          class="!w-150px"
          v-model="row.orgName7"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
        />
      </template>
      <template #orgName8="{ row }">
        <el-date-picker
          @click.stop
          class="!w-150px"
          v-model="row.orgName8"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
        />
      </template>
      <template #orgName9="{ row }">
        <el-select @click.stop v-model="row.orgName9">
          <el-option label="核心企业" value="1" />
          <el-option label="借款人自己" value="2" />
        </el-select>
      </template>
      <template #orgName11="{ row }">
        <el-input @click.stop v-model="row.orgName11" />
      </template>
      <template #orgName12="{ row }">
        <el-input @click.stop v-model="row.orgName12" />
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
  { label: '商品编号', field: 'serialNo', minWidth: 120 },
  { label: '* 商品名称', field: 'phaseNo', minWidth: 220 },
  { label: '* 商品大类', field: 'phaseName', minWidth: 120 },
  { label: '* 商品中类', field: 'userId', minWidth: 120 },
  { label: '* 商品小类', field: 'userName', minWidth: 120 },
  { label: '批次号', field: 'orgId', minWidth: 120 },
  { label: '柜号', field: 'orgName', minWidth: 120 },
  { label: '* 产地', field: 'orgName1', minWidth: 120 },
  { label: '* 仓储地', field: 'currency1', minWidth: 120 },
  { label: '规格', field: 'orgName2', minWidth: 180 },
  { label: '* 数量/重量', field: 'orgName3', minWidth: 150 },
  { label: '* 初始认定单价', field: 'orgName4', minWidth: 120 },
  { label: '初始认定价值', field: 'orgName5', minWidth: 120 },
  { label: '* 币种', field: 'currency', minWidth: 120 },
  { label: '货物起始日', field: 'orgName7', minWidth: 120 },
  { label: '货物到期日', field: 'orgName8', minWidth: 120 },
  { label: '* 货物所有权', field: 'orgName9', minWidth: 120 },
  { label: '备注1', field: 'orgName10', minWidth: 120 },
  { label: '备注2', field: 'orgName11', minWidth: 120 },
  { label: '入库类型', field: 'orgName12', minWidth: 120 },
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
