<template>
  <!-- 列表 -->
  <ContentWrap>
    <!-- <el-button plain tpye="" @click="add('create')">
      <Icon class="mr-5px" icon="ep:document-add" />
      新增
    </el-button> -->
    <el-button @click="goDetail" plain type="">
      <Icon class="mr-5px" icon="ep:edit" />
      详情
    </el-button>
    <el-button @click="goCreditLineDetail" plain type="">
      授信额度详情
    </el-button>
  </ContentWrap>
  <ContentWrap>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :header-cell-style="{ background: '#F7F8FA' }"
      highlight-current-row
      show-overflow-tooltip
      @current-change="tableCurrentChange"
      @row-dblclick="goDetail"
    >
      
      <el-table-column align="center" label="合作项目编号" prop="customerID" />
      <el-table-column align="center" label="合作项目名称" prop="customerName" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage } from 'element-plus'
import useTableList from '@/compositions/useTableList'

defineOptions({
  name: 'PartnerInfo'
})

const route = useRoute() // 路由
const {
  queryParams,
  getList,
  loading,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange
} = useTableList(Api.custRelaTeamworkProjectList, { customerID: route.query.customerID || route.query.customerId })

/** 添加/修改操作 */
const addCustomerRef = ref()
const add = (type, id) => {
  detailRef.value.open({},true)
}

const detailRef = ref()
const goDetail = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择')
  router.push({
    path: '/customerManagers/compCustManalDetail',
    query: {
      orgNature: currentRow.value.orgNature,
      customerID: currentRow.value.customerID,
      mfcustomerID: currentRow.value.mfCustomerID,
      _multiTab: true,
      t: Date.now()
    }
  })
}

const router = useRouter()
const goCreditLineDetail = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择一条数据')
  if (!currentRow.value?.serialNo) return ElMessage.warning('当前项目没有有效的授信额度，请确定！')
  router.push({
    path: '/contractIssuanceMGM/creditLineDetail',
    query: {
      businessType: currentRow.value.businessType,
      customerID: currentRow.value.customerID,
      serialNo: currentRow.value.serialNo,
      t: Date.now()
    }
  })
}


const selectTeamWorkPopRef = ref()
const addTeam = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择')

  selectTeamWorkPopRef.value.open(currentRow.value)
}
</script>
