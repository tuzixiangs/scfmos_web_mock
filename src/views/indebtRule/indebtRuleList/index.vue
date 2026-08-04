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
      <el-form-item label="规则编号" prop="id">
        <el-input
          v-model="queryParams.id"
          class="!w-240px"
          clearable
          placeholder="请输入规则编号"
        />
      </el-form-item>
      <el-form-item label="规则类型" prop="ruleType">
        <el-select
          v-model="queryParams.ruleType"
          class="!w-240px"
          clearable
          placeholder="请选择规则类型"
        >
          <el-option label="放款前规则" value="A" />
          <el-option label="授信支持资产规则" value="B" />
          <el-option label="预警规则" value="C" />
        </el-select>
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
    <tableTitle title="规则列表">
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
  </ContentWrap>

  <!-- 表单区域 -->
  <!-- <CrRuleModal ref="modalForm" @ok="modalFormOk" /> -->
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { ContentWrap } from '@/components/ContentWrap'
import { Icon } from '@/components/Icon'
import request from '@/config/axios'
import CrRuleModal from '../indebtRuleSetting/index.vue'
import tableTitle from '@/components/busiComp/tableTitle/index.vue'

defineOptions({
  name: 'indebtRuleList'
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
  return request.get({ url: '/system/crRule/list', params })
}

const crRuleDelete = (data: any) => {
  return request.delete({ url: `/system/crRule/delete?id=${data}` })
}

const crRuleDeleteBatch = (data: any) => {
  return request.delete({ url: '/system/crRule/deleteBatch', data })
}

// useTableList
const { queryParams, getList, loading, total, list, search, reSearch, pageLoading } =
  useTableList(crRuleList, {}, false)

// 表格列定义
const columns = [
  { label: '#', field: 'index', type: 'index' as const, width: 60, align: 'center' },
  {
    label: '规则类型',
    field: 'ruleType',
    minWidth: 140,
    formatter: (row: any) => {
      if (row.ruleType === 'A') return '放款前规则'
      if (row.ruleType === 'B') return '授信支持资产规则'
      if (row.ruleType === 'C') return '预警规则'
      return row.ruleType
    }
  },
  { label: '规则编号', field: 'id', minWidth: 80 },
  {
    label: '规则分类',
    field: 'ruleGroup',
    minWidth: 100,
    formatter: (row: any) => {
      if (row.ruleGroup === '0') return '债项'
      if (row.ruleGroup === '1') return '借据'
      if (row.ruleGroup === '2') return '客户'
      return row.ruleGroup
    }
  },
  { label: '规则名称', field: 'ruleName', minWidth: 300 },
  { label: '规则表达式', field: 'ruleExpression', minWidth: 400 },
  {
    label: '规则状态',
    field: 'ruleStatus',
    minWidth: 80,
    formatter: (row: any) => {
      if (row.ruleStatus === '0' || row.ruleStatus === 0) return '关闭'
      if (row.ruleStatus == '1') return '启用'
      if (row.ruleStatus == '2') return '大数据开启'
      return row.ruleStatus
    }
  },
  { label: '规则执行次数', field: 'execCount', minWidth: 100 },
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
const modalForm = ref()

// 弹窗成功回调
const modalFormOk = () => {
  getList()
}

// 行点击事件
const handleRowClick = (row: any) => {
  // edit(row)
}

// 新增
const handleAdd = () => {
  router.push({
    path: '/indebtRule/indebtRuleSetting',
    query: {
      ruleAdd: String(true),
      ruleEdit: String(false)
    }
  })
}

// 编辑
const edit = (row: any) => {
  row.ruleAdd = false
  row.ruleEdit = true
  router.push({
    path: '/indebtRule/indebtRuleSetting',
    query: row
  })
}

// 删除
const handleDelete = (id: string) => {
  // ElMessageBox.confirm('确定删除吗?', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // })
  //   .then(async () => {
  return crRuleDelete(id).then((res) => {
    ElMessage.success('删除成功')
    getList()
  })
  // })
  // .catch(() => {})
}

// 批量删除
const batchDel = async () => {
  if (selectedRowKeys.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }

  ElMessageBox.confirm('确定删除选中的数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await crRuleDeleteBatch({ ids: selectedRowKeys.value.join(',') })
        ElMessage.success('删除成功')
        selectedRowKeys.value = []
        getList()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 初始化

onActivated(() => {
  getList()
})
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
