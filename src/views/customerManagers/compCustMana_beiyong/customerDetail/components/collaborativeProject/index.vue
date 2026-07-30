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
    <!-- <el-button plain type="" @click="handleDelete">
      <Icon class="mr-5px" icon="ep:delete" />
      删除
    </el-button> -->
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
      
      <el-table-column align="center" label="合作项目编号" prop="projectID" />
      <el-table-column align="center" label="合作项目名称" prop="projectName" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />

    <detail ref="detailRef" @success="getList"/>
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import detail from './components/detail.vue'
import { sleep } from '@/utils/index'
import { useUserStoreWithOut } from '@/store/modules/user'
import dayjs from 'dayjs'

defineOptions({
  name: 'creditLineDetail'
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

const { user, dept } = useUserStoreWithOut()

/** 添加/修改操作 */
const addCustomerRef = ref()
const add = (type, id) => {
  detailRef.value.open({
    inputUserName: dept?.name ?? '',
    inputOrgName: user.nickname ?? '',
    inputDate: dayjs().format('YYYY-MM-DD')
  },true)
}

const handleDelete = async () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择项目')
  await ElMessageBox.confirm('确定要删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
  })
  const delLoading = ElLoading.service({
    text: '处理中...',
  })
  await sleep(300)
  await Api.saveCustRelaTeamworkProject({
    projectID: currentRow.value.projectID,
    objectType: 'Delete'
  }).finally(()=> {
    delLoading.close()
  })
  ElMessage.success('删除成功')
  getList()
}

const detailRef = ref()
const goDetail = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择项目')

  detailRef.value.open(currentRow.value)
}

const router = useRouter()
const goCreditLineDetail = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择项目')
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
