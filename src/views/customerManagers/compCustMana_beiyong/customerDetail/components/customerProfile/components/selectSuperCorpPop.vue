<template>
  <Dialog v-model="visible" title="选择上级公司名称" width="1300px" top="5vh">
    <ContentWrap>
      <el-form inline @keyup.enter="search">
        <el-form-item label="客户编号">
          <el-input class="!w-200px" v-model="queryParams.customerID" placeholder="搜索客户编号" clearable />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input class="!w-200px" v-model="queryParams.customerName" placeholder="搜索客户名称" clearable />
        </el-form-item>
        <el-form-item label="证件编号">
          <el-input class="!w-200px" v-model="queryParams.certID" placeholder="搜索证件编号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="search" tpye=""
            ><Icon class="mr-5px" icon="ep:search" /> 查询
          </el-button>
          <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="list"
        :header-cell-style="{ background: '#F7F8FA' }"
        highlight-current-row
        @current-change="tableCurrentChange"
        @dblclick="confirm"
      >
        
        <el-table-column align="center" label="客户编号" prop="customerID" />
        <el-table-column align="center" label="客户名称" prop="customerName" />
        <el-table-column align="center" label="证件编号" prop="certID" />
        <el-table-column align="center" label="证件类型" prop="certType" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import * as Api from '../api.js'
import useTableList from '@/compositions/useTableList'

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
} = useTableList(Api.getSuperEntPage, {}, false)

const visible = ref(false)
const route = useRoute() // 路由对象
const open = (row) => {
  setDefaultParams({ curCustomerID: route.query.customerID })
  visible.value = true
  getList()
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value?.customerName) {
    ElMessage.warning('请选择')
    return
  }

  emit('confirm', currentRow.value)
  visible.value = false
}

defineExpose({
  open
})
</script>
