<template>
  <ContentWrap>
    <div class="flex items-center mb-2 w-[110px]" @click="expanded = !expanded">
      <Icon :icon="expanded ? 'ep:minus' : 'ep:plus'" class="mr-4px" />
      <el-button link>查询条件</el-button>
    </div>
    <el-form v-show="expanded" inline>
      <el-form-item label="合同编号">
        <el-input v-model="keyword" class="!w-240px" clearable placeholder="请输入合同编号或客户名称" />
      </el-form-item>
      <el-form-item>
        <el-button @click="keyword = ''"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <div class="mb-15px flex gap-8px">
      <el-button plain @click="showDetail"><Icon icon="ep:edit" class="mr-5px" />合同详情</el-button>
      <el-button plain @click="showDetail">查看意见</el-button>
      <el-button plain @click="showDetail">查看流转记录</el-button>
      <el-button plain @click="showDetail"><Icon icon="ep:download" class="mr-5px" />导出</el-button>
    </div>
    <Table
      :columns="columns"
      :data="filteredRecords"
      :pagination="{ total: filteredRecords.length }"
      highlight-current-row
      @current-change="currentRow = $event"
      @row-dblclick="showDetail"
    />
  </ContentWrap>
</template>

<script setup>
defineOptions({ name: 'ContractSupplementApproval' })

const expanded = ref(false)
const keyword = ref('')
const currentRow = ref()

const records = [
  { objectNo: 'BQ202607290001', contractNo: 'HT202607290021', customerName: '华东供应链有限公司', businessTypeName: '供应链流动资金贷款', businessSum: '5,000,000.00', currencyName: '人民币', phaseName: '待审批', applicant: '张晨', applyDate: '2026-07-29' },
  { objectNo: 'BQ202607260002', contractNo: 'HT202607260018', customerName: '新城贸易有限公司', businessTypeName: '国内保理融资', businessSum: '2,800,000.00', currencyName: '人民币', phaseName: '审批中', applicant: '李敏', applyDate: '2026-07-26' },
  { objectNo: 'BQ202607200003', contractNo: 'HT202607200015', customerName: '双胞胎农牧有限公司', businessTypeName: '存货质押融资', businessSum: '4,200,000.00', currencyName: '人民币', phaseName: '审批通过', applicant: '陈敏', applyDate: '2026-07-20' }
]

const columns = [
  { label: '补签申请编号', field: 'objectNo', minWidth: 180 },
  { label: '合同编号', field: 'contractNo', minWidth: 180 },
  { label: '客户名称', field: 'customerName', minWidth: 220 },
  { label: '业务品种', field: 'businessTypeName', minWidth: 180 },
  { label: '合同金额', field: 'businessSum', minWidth: 140 },
  { label: '币种', field: 'currencyName' },
  { label: '当前阶段', field: 'phaseName', minWidth: 130 },
  { label: '申请人', field: 'applicant' },
  { label: '申请日期', field: 'applyDate', minWidth: 140 }
]

const filteredRecords = computed(() => {
  const value = keyword.value.trim()
  return !value ? records : records.filter((item) =>
    item.contractNo.includes(value) || item.customerName.includes(value) || item.objectNo.includes(value)
  )
})

const showDetail = (row) => {
  const record = row?.objectNo ? row : currentRow.value
  if (!record) return ElMessage.warning('请选择一条补签申请')
  ElMessage.success(`已打开 ${record.contractNo} 的补签申请信息`)
}
</script>
