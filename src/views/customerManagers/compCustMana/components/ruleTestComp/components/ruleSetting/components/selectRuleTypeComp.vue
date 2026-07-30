<template>
  <div class="select-rule-type-comp">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>规则类型</span>
          </div>
          <div class="header-right">
            <span v-if="selectedRule" class="selected-info">
              当前选择：{{ selectedRule.name }}
            </span>
          </div>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :model="searchForm" inline>
          <el-form-item label="规则类型">
            <el-select
              v-model="searchForm.ruleType"
              placeholder="请选择"
              clearable
              style="width: 150px"
            >
              <el-option label="采购规则" value="purchase" />
              <el-option label="风控规则" value="risk" />
              <el-option label="授信规则" value="credit" />
              <el-option label="合同规则" value="contract" />
            </el-select>
          </el-form-item>
          <el-form-item label="规则编号">
            <el-input
              v-model="searchForm.ruleCode"
              placeholder="请输入规则编号"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="规则名称">
            <el-input
              v-model="searchForm.ruleName"
              placeholder="请输入规则名称"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" :icon="Search">
              搜索
            </el-button>
            <el-button @click="handleReset" :icon="Refresh">
              <!-- <Icon icon="ep:refresh"></Icon> -->
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <table-title title="规则列表" />

      <!-- 表格 -->
      <Table
        :columns="tableColumns"
        :data="tableData"
        :loading="false"
        :pagination="{
          total: total,
          size: 'small'
        }"
        highlight-current-row
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        @page-change="handlePageChange"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Refresh, ArrowRight } from '@element-plus/icons-vue'
import Table from '@/components/Table/src/Table.vue'
import tableTitle from '@/components/busiComp/tableTitle/index.vue'

const emit = defineEmits(['next', 'update:modelValue'])

// 搜索表单
const searchForm = ref({
  ruleType: '',
  ruleCode: '',
  ruleName: ''
})

// 表格列配置
const tableColumns = [
  { label: '规则类型', field: 'ruleType', minWidth: 120 },
  { label: '规则编号', field: 'ruleCode', minWidth: 150 },
  { label: '规则名称', field: 'ruleName', minWidth: 200 },
  { label: '规则描述', field: 'ruleDescription', minWidth: 250 },
  { label: '状态', field: 'status', minWidth: 100 },
  { label: '创建时间', field: 'createTime', minWidth: 160 }
]

// 模拟表格数据
const tableData = ref([
  {
    id: 1,
    ruleType: '采购规则',
    ruleCode: 'PUR001',
    ruleName: '采购金额审批规则',
    ruleDescription: '采购金额超过10万元需上级审批',
    status: '启用',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    ruleType: '采购规则',
    ruleCode: 'PUR002',
    ruleName: '供应商准入规则',
    ruleDescription: '新供应商需完成资质审核方可准入',
    status: '启用',
    createTime: '2024-01-16 14:20:00'
  },
  {
    id: 3,
    ruleType: '风控规则',
    ruleCode: 'RISK001',
    ruleName: '信用评级规则',
    ruleDescription: '客户信用评级低于B级需人工审核',
    status: '启用',
    createTime: '2024-02-01 09:15:00'
  },
  {
    id: 4,
    ruleType: '风控规则',
    ruleCode: 'RISK002',
    ruleName: '额度控制规则',
    ruleDescription: '单笔采购超过授信额度需冻结',
    status: '停用',
    createTime: '2024-02-05 11:45:00'
  },
  {
    id: 5,
    ruleType: '授信规则',
    ruleCode: 'CREDIT001',
    ruleName: '授信期限规则',
    ruleDescription: '授信期限不超过12个月',
    status: '启用',
    createTime: '2024-02-10 16:30:00'
  },
  {
    id: 6,
    ruleType: '授信规则',
    ruleCode: 'CREDIT002',
    ruleName: '授信额度计算规则',
    ruleDescription: '根据财务报表计算授信额度',
    status: '启用',
    createTime: '2024-02-12 08:50:00'
  },
  {
    id: 7,
    ruleType: '合同规则',
    ruleCode: 'CONTRACT001',
    ruleName: '合同模板规则',
    ruleDescription: '标准采购合同需使用官方模板',
    status: '启用',
    createTime: '2024-03-01 13:20:00'
  },
  {
    id: 8,
    ruleType: '合同规则',
    ruleCode: 'CONTRACT002',
    ruleName: '合同签署规则',
    ruleDescription: '合同金额超过50万需双方法定代表人签署',
    status: '停用',
    createTime: '2024-03-05 10:10:00'
  }
])

const total = ref(tableData.value.length)
const pageSize = ref(10)
const currentPage = ref(1)
const selectedRule = ref(null)

// 搜索
const handleSearch = () => {
  const { ruleType, ruleCode, ruleName } = searchForm.value
  tableData.value = tableData.value.filter((item) => {
    const matchType = !ruleType || item.ruleType === ruleType
    const matchCode = !ruleCode || item.ruleCode.includes(ruleCode)
    const matchName = !ruleName || item.ruleName.includes(ruleName)
    return matchType && matchCode && matchName
  })
  total.value = tableData.value.length
  currentPage.value = 1
}

// 重置
const handleReset = () => {
  searchForm.value = {
    ruleType: '',
    ruleCode: '',
    ruleName: ''
  }
  handleSearch()
}

// 表格行点击
const handleRowClick = (row) => {
  selectedRule.value = row
  selectedRule.value.name = `${row.ruleType} - ${row.ruleName}`
}

// 选中变化
const handleSelectionChange = () => {}

// 分页变化
const handlePageChange = () => {}

// 下一步
const goNext = () => {
  emit('next', selectedRule.value)
}
</script>

<style lang="scss" scoped>
.select-rule-type-comp {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .selected-info {
      color: #409eff;
      font-weight: 500;
    }
  }

  .search-area {
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
