<template>
  <Dialog v-model="visible" title="选择加入供应链群成员" width="1000px" top="5vh">
    <ContentWrap>
      <el-form inline>
        <el-form-item label="合作项目编号">
          <el-input v-model="queryParams.projectid" placeholder="搜索合作项目编号" clearable />
        </el-form-item>
        <el-form-item label="合作项目名称">
          <el-input v-model="queryParams.projectname" placeholder="搜索合作项目名称" clearable />
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
        @row-dblclick="confirm"
      >
        <el-table-column align="center" label="合作项目编号" prop="projectid" />
        <el-table-column align="center" label="合作项目名称" prop="projectname" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from '../api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'

const {
  queryParams,
  loading,
  getList,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange
} = useTableList(Api.selectTeamWork, {}, false)

const visible = ref(false)

let rowItem = {}
const open = (row) => {
  rowItem = row
  visible.value = true
  getList()
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value?.projectid) {
    ElMessage.warning('请选择')
    return
  }

  saving.value = true
  Api.createTeamWorkCustomer({
    relativeid: rowItem.customerID,
    projectid: currentRow.value.projectid
  })
    .then((res) => {
      // btr约定：接口返回1：已加入，拦截；2：需用户确认。3：直接加入
      if (res['1']) return ElMessage.warning(res['1'].msg)

      if (res['2']) {
        confirmCreate(res['2'].msg)
        return
      }

      if (res['3']) {
        visible.value = false
        ElMessage.success('保存成功')
      }
    })
    .finally((_) => (saving.value = false))
}

const { confirmFetch } = useMessage()
const confirmCreate = (message) => {
  confirmFetch({
    title: message,
    fetchFunc: () =>
      Api.addTeamWorkCustomer({
        relativeid: rowItem.customerID,
        projectid: currentRow.value.projectid
      })
  }).then((_) => {
    visible.value = false
    ElMessage.success('保存成功')
  })
}
defineExpose({
  open
})
</script>