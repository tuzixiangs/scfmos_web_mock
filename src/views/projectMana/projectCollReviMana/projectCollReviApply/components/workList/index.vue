<template>
  <ContentWrap v-loading="pageLoading">
    <!-- 搜索工作栏 -->
    <div class="flex items-center mb-2 w-[110px]" @click="handleExpand">
      <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
      <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
      <el-button link> 查询条件 </el-button>
    </div>
    <el-form
      ref="queryFormRef"
      v-show="isExpand"
      :model="queryParams"
      class="search-form"
      label-width="auto"
      @keyup.enter="search"
    >
      <el-form-item label="协审编号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
          class="!w-240px"
          clearable
          placeholder="请输入协审编号"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          class="!w-240px"
          clearable
          placeholder="请输入项目名称"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="客户编号" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          class="!w-240px"
          clearable
          placeholder="请输入客户编号"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>

    <div style="display: flex; margin-bottom: 17px">
      <el-button v-if="addVIf" @click="add">
        <Icon class="mr-5px" icon="ep:circle-plus" />
        新增
      </el-button>
      <el-button @click="goDetail">
        <Icon class="mr-5px" icon="ep:edit" />
        详情
      </el-button>
      <el-button v-if="delVIf" @click="del">
        <Icon class="mr-5px" icon="ep:delete" />
        删除
      </el-button>
      <el-button v-if="delVIf"  @click="handleSignOpinion">
        签署意见
      </el-button>
      <el-button v-if="viewSubmitVif" @click="submit"> 提交 </el-button>
      <el-button v-if="viewPhaseOpinionVif" @click="viewPhaseOpinion1"> 查看意见 </el-button>
      <el-button v-if="viewToRecordVif" @click="toRecord"> 查看流转记录 </el-button>
      <el-button v-if="viewTakeBackVif" @click="takeBack"> 收回 </el-button>

    </div>
    <Table
      :columns="columns"
      :data="list"
      :loading="loading"
      :pagination="{
        total: total
      }"
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @current-change="tableCurrentChange"
      @page-change="getList"
      @row-dblclick="goDetail"
      highlight-current-row
    />

    <!-- 新增 -->
    <addPop ref="addPopRef" @confirm="addConfirm" />

    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      hideTip
      @confirm="handleSignOpinionConfirm"
      @cancel="handleSignOpinionCancel"
      @submit="submit"
    />

    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :objectType="objectType"
      @refresh="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />
    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"
    />
    <flowRecordPop ref="flowRecordRef" :params="flowParams" />
    
    <viewPhaseOpinion ref="viewPhaseOpinionRef" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import addPop from './components/addPop.vue'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'
import { useOldDictStore } from '@/store/modules/oldDict'
import * as CreditFlowApi from '@/api/creditflow'
import viewPhaseOpinion from '../../../viewPutOutPhaseOpinion/index.vue'

defineOptions({
  name: 'ConTractToRegistered'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const isExpand = ref(false)
const pageLoading = ref(false)
const handleExpand = () => {
  isExpand.value = !isExpand.value
}

// 新增权限
const addVIf = computed(() => ['010'].includes(props.params.key))

// 删除权限
const delVIf = computed(() => ['010', '040'].includes(props.params.key))

// 查看意见
const viewPhaseOpinionVif = computed(() => ['020', '030', '040', '050'].includes(props.params.key))
// 查看流转记录
const viewToRecordVif = computed(() => ['020', '030', '050'].includes(props.params.key))
// 提交
const viewSubmitVif = computed(() => ['010', '040'].includes(props.params.key))
//收回
const viewTakeBackVif = computed(() => ['020'].includes(props.params.key))

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
  fetchCback
} = useTableList(Api.getProjectCoreviewPage, { phaseType: props.params.dealtype, objectType: 'ProjectCoreviewGYL' }, false)

const { getDictFetch, getDictLabels } = useOldDictStore()

fetchCback((list) => {
  list.forEach((v) => {
    v.businessSum1 = formatValue(v.businessSum, 'currency')
    v.exposureSum1 = formatValue(v.exposureSum, 'currency')
    v.loanProductCategory1 = getDictLabels('GYLLoanProductCategory', v.loanProductCategory)
  })
})

const initFetch = () => {
  Promise.all([getDictFetch('GYLLoanProductCategory')]).then(res => {
    getList()
  })
}
initFetch()

const router = useRouter() // 路由

const columns = [
  { label: '协审编号', field: 'serialNo', minWidth: 220 },
  { label: '项目名称', field: 'projectName', minWidth: 320 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '客户编号', field: 'customerId', minWidth: 220 },
  { label: '协审方式', field: 'coreviewMethodNm' },
  { label: '协审类型', field: 'coreviewTypeNm' },
  { label: '申请人', field: 'inputUserID' },
  { label: '申请分行', field: 'branchName', minWidth: 160 },
  { label: '申请分行业务团队', field: 'teamName', minWidth: 130 },
  { label: '项目额度（万元）', field: 'businessSum1', minWidth: 150 },
  { label: '项目敞口（万元）', field: 'exposureSum1', minWidth: 150 },
  { label: '是否分行权限', field: 'branchAccess', minWidth: 120 },
  { label: '产品方案', field: 'loanProductCategory1', minWidth: 120 },
  { label: '所属行业', field: 'industryType', minWidth: 120 }
]

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/projectMana/projectCollReviMana/projectCollReviManaDetail',
    query: {
      serialNo: currentRow.value.serialNo,
      readonly: !['010', '040'].includes(props.params.key) ? '1' : '0',
      fromPage: 'projectCollReviApply',
      t: Date.now()
    }
  })
}

const addPopRef = ref()
const add = () => {
  // if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  addPopRef.value.open()
}

const addConfirm = (item) => {
  const serialNo = item?.serialNo || item?.serialno
  if (!serialNo) return ElMessage.error('新增成功，但未获取到协审编号')

  router.push({
    path: '/projectMana/projectCollReviMana/projectCollReviManaDetail',
    query: {
      serialNo,
      t: Date.now()
    }
  })
}

const { confirmFetch } = useMessage()
// 删除
const del = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '确认删除',
    fetchFunc: () => Api.deleteApply({ serialNo: currentRow.value.serialNo, })
  }).then((_) => {
    ElMessage.success('已删除')

    getList()
  })
}

// 签署意见
const signOpinionVisible = ref(false)
const currentProcessInstanceForOpinion = ref([])

const handleSignOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const selectedRows = currentRow.value
  currentProcessInstanceForOpinion.value = {
    businessId: selectedRows.serialNo,
    businessType: selectedRows.businessType,
    phaseNo: selectedRows.phaseNo,
    objectType: 'ProjectCoreviewGYL'
  }
  signOpinionVisible.value = true
}

const handleSignOpinionConfirm = () => {
  signOpinionVisible.value = false
}

const handleSignOpinionCancel = () => {
  signOpinionVisible.value = false
}

const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')
const objectType = ref('')
const creditFlowApprovalVisible = ref(false)

const doRiskDetection = async (rskTp = 1) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  serialNo.value = currentRow.value.objectNo
  phaseNo.value = currentRow.value.phaseNo
  riskData.value = {
    scenarioId: '015',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      EDObjectNo: serialNo.value,
      EDObjectType: 'ProjectCoreviewGYL',
      EDPhaseNo: phaseNo.value,
      EDCustomerID: currentRow.value.customerID
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

const checkCommentExec = async(serialNo,objectType,phaseType) => {
  const resp = await Api.checkComment({serialNo,objectType,phaseType}).then(res => res)
  return resp;
}

const submit = async () => {
  // await doRiskDetection()
  // submitFlag.value = true

  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  
  if (currentRow.value['tempSaveFlag'] != 2) {
    return ElMessage.warning('请保存协审信息后提交')
  }

  console.log(props.params.dealtype)
  const data = await checkCommentExec(currentRow.value.serialNo,"ProjectCoreviewGYL",props.params.dealtype)
  console.log("data:",data)
  if (!data?.phaseOpinion) {
   ElMessage.warning(`${currentRow.value.serialNo}签署意见未保存`)
    return
  }

  serialNo.value = currentRow.value.serialNo
  phaseNo.value = currentRow.value.phaseNo
  objectType.value = 'ProjectCoreviewGYL'

  creditFlowApprovalVisible.value = true
}

const handleRiskMonitorConfirm = async (hasFailure) => {
  console.log('hasFailure', hasFailure)
  if (!submitFlag.value) {
    await handleRiskMonitorCancel()
    return
  }
  riskMonitorVisible.value = false

  creditFlowApprovalVisible.value = true
}

const handleRiskMonitorCancel = async () => {
  riskMonitorVisible.value = false
}
const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
}

// 查看意见
const viewPhaseOpinionRef = ref()
const viewPhaseOpinion1 = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  viewPhaseOpinionRef.value.open(currentRow.value)
  // console.log('router',router);
  //   if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  //   router.push({
  //   path: '/projectMana/projectCollReviMana/viewEDPhaseOpinion',
  //   query: {
  //     serialNo: currentRow.value.serialNo,
  //     t: new Date().getTime()
  //   }
  // })

}

// 查看流转记录
const flowParams = reactive({objectType: 'ProjectCoreviewGYL'
})
const flowRecordRef = ref()
const toRecord = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  flowParams.serialNo = currentRow.value.serialNo
  flowRecordRef.value.open(flowParams)
}
// const { confirmFetch } = useMessage()
// 收回
const takeBack = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.withdraw({
      serialNo: currentRow.value.serialNo,
      phaseNo: currentRow.value.phaseNo,
      objectType: 'ProjectCoreviewGYL',
      nextUserRole: '收回',
      nextUserInfo: '',
      ftSerialno:currentRow.value.ftSerialno,
      flag:1 //申请
    })
  })
  ElMessage.success('收回成功')
  getList()
}

onActivated(() => {
  search()
})
</script>
