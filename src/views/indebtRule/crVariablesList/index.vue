<template>
  <ContentWrap :body-style="{ padding: '10px 15px 0px' }" v-loading="pageLoading">
    <!-- 搜索工作栏 -->
    <div class="flex items-center mb-2 w-[110px]" @click="handleExpand">
      <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
      <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
      <el-button link> 查询条件 </el-button>
    </div>
    <el-form
      ref="queryFormRef"
      class="search-form"
      :model="queryParams"
      v-show="isExpand"
      label-position="left"
      label-width="auto"
      @keyup.enter="search"
    >
      <el-form-item label="债项因子名称" prop="variablesName">
        <el-input
          v-model="queryParams.variablesName"
          class="!w-240px"
          clearable
          placeholder="请输入债项因子名称"
        />
      </el-form-item>
      <el-form-item label="债项因子键值" prop="variablesKey">
        <el-input
          v-model="queryParams.variablesKey"
          class="!w-240px"
          clearable
          placeholder="请输入债项因子键值"
        />
      </el-form-item>
      <!-- <el-form-item label="规则分类" prop="ruleGroup">
        <el-input
          v-model="queryParams.ruleGroup"
          class="!w-240px"
          clearable
          placeholder="请输入规则分类"
        />
      </el-form-item> -->

      <el-form-item>
        <el-button @click="search" size="default" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch" size="default">
          <Icon class="mr-5px" icon="ep:refresh" /> 重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap :body-style="{ paddingTop: '0px' }">
    <tableTitle title="债项因子列表">
      <div>
        <el-button @click="handleAdd">
          <Icon class="mr-5px" icon="ep:document-add" />
          新增
        </el-button>
      </div>
      <!-- 已选择提示 -->
      <!-- <div
        v-if="selectedRowKeys.length > 0"
        class="ant-alert ant-alert-info"
        style="margin-bottom: 16px"
      >
        <i class="anticon anticon-info-circle ant-alert-icon"></i>
        已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->
    </tableTitle>
    <Table
      :columns="columns"
      :data="list"
      :loading="loading"
      :pagination="{
        total: total
      }"
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      selection
      @selection-change="handleSelectionChange"
      @page-change="getList"
      @row-click="handleRowClick"
    >
      <template #action="{ row }">
        <div @click.stop>
          <el-button link type="primary" @click="edit(row)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-popconfirm title="确定删除吗?" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button link type="danger"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </Table>

    <addVariables ref="addVariablesGroupRef" @success="getList" />
  </ContentWrap>

</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { ContentWrap } from '@/components/ContentWrap'
import { Icon } from '@/components/Icon'
import request from '@/config/axios'
import { getDictLabel } from '@/utils/dict'
import tableTitle from '@/components/busiComp/tableTitle/index.vue'
import addVariables from './components/addVariables.vue'

defineOptions({
  name: 'crVariablesList'
})

const router = useRouter()

// 是否展开搜索条件
const isExpand = ref(false)

const handleExpand = () => {
  isExpand.value = !isExpand.value
}

// 已选择的行
const selectedRowKeys = ref<string[]>([])

const handleSelectionChange = (selection: any[]) => {
  selectedRowKeys.value = selection.map((item) => item.id)
}

const onClearSelected = () => {
  selectedRowKeys.value = []
}

// API 函数
const crRuleList = (params: any) => {
  return request.get({ url: '/system/crVariables/list', params })
}

const crRuleDelete = (data: any) => {
  return request.delete({ url: `/system/crVariables/delete?id=${data}` })
}

const crRuleDeleteBatch = (data: any) => {
  return request.delete({ url: '/indebt/crVariables/deleteBatch', data })
}

const route = useRoute()

// useTableList
const { queryParams, getList, loading, total, list, search, reSearch, pageLoading } =
  useTableList(crRuleList, { variablesGroupId: route.query.variablesGroupId })

// 表格列定义
const columns = [
  { label: '#', field: 'index', type: 'index' as const, width: 60, align: 'center' },
  {
    label: '债项因子名称',
    field: 'variablesName',
    minWidth: 140,
  },
  { label: '债项因子键值', field: 'variablesKey', minWidth: 80 },
  {
    label: '债项因子类别编号',
    field: 'variablesGroupId',
    minWidth: 100,
  },
  {
    label: '债项因子类型',
    field: 'variablesType',
    minWidth: 100,
    formatter: (row: any) => {
      return getDictLabel('variables_type', row.variablesType)
    }
  },
  {
    label: '债项因子来源',
    field: 'variablesOrigin',
    minWidth: 100,
    formatter: (row: any) => {
      return getDictLabel('variables_origin', row.variablesOrigin)
    }
  },
  {
    label: '操作',
    field: 'action',
    align: 'center' as const,
    fixed: 'right' as const,
    minWidth: 150,
    slots: true
  }
]

// 弹窗引用
const addVariablesGroupRef = ref()

// 弹窗成功回调
const modalFormOk = () => {
  getList()
}

// 行点击事件
const handleRowClick = (row: any) => {
  // edit(row)
}

// 编辑
const edit = (row: any) => {
  addVariablesGroupRef.value?.open('edit', row)
}

// 新增
const handleAdd = () => {
  addVariablesGroupRef.value?.open('add', { variablesGroupId: route.query.variablesGroupId })
}

// 删除
const handleDelete = (id: string) => {
  return crRuleDelete(id).then((res) => {
    ElMessage.success('删除成功')
    getList()
  })
}

// 初始化
// getList()
</script>

<style scoped lang="scss">
.ant-alert {
  &.ant-alert-info {
    background-color: #f0f2f5;
    padding: 8px 16px;
    border-radius: 4px;
  }
}

:deep(.anticon) {
  margin-right: 4px;
}
</style>
