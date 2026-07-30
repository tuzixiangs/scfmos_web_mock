<template>
  <!-- 列表 -->
  <ContentWrap>
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
      <el-form-item label="客户名称" prop="customerID">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="证件号" prop="code">
        <el-input
          v-model="queryParams.certID"
          class="!w-240px"
          clearable
          placeholder="请输入证件号"
        />
      </el-form-item>
      <el-form-item label="是否我行定义小微" prop="status">
        <el-select
          v-model="queryParams.isSmallScope"
          class="!w-240px"
          clearable
          placeholder="请选择是否我行定义小微"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="核心客户号" prop="mfCustomerId">
        <el-input
          v-model="queryParams.mfCustomerId"
          class="!w-240px"
          clearable
          placeholder="请输入核心客户号"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search" size="default" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch" size="default">
          <Icon class="mr-5px" icon="ep:refresh" />重置
        </el-button>
      </el-form-item>
    </el-form>
    <div style="display: flex; margin-bottom: 17px">
      <!-- <div style="font-size: 18px; font-weight: 700"> 查询结果</div> -->
      <div>
        <el-button plain @click="add('create')">
          <Icon class="mr-5px" icon="ep:document-add" />
          新增
        </el-button>
        <el-button @click="goDetail()" plain>
          <Icon class="mr-5px" icon="ep:edit" />
          详情
        </el-button>
        <el-button @click="doRiskDetection(doRiskDetectionAction)" plain> 客户信息检查 </el-button>
        <el-button @click="reqPermissionClick" plain> 权限申请 </el-button>
        <!-- <el-button @click="button1" plain tpye=""> 集团客户关联搜索 </el-button> -->
        <!-- <el-button @click="handleGetCustomerOwnership" plain> 获取客户主办权 </el-button> -->
        <!-- <el-button @click="button1" plain tpye=""> 移交主办权 </el-button> -->
        <!-- <el-button @click="button1" plain tpye=""> 接收主办权 </el-button> -->
        <!--<el-button @click="handleSyncCreditLimit" plain> 同步额度系统 </el-button> -->
        <el-button @click="del" plain> 删除 </el-button>
        <el-button @click="addTeam" plain> 加入供应链群成员 </el-button>
      </div>
    </div>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      border
      stripe
      highlight-current-row
      show-overflow-tooltip
      @current-change="tableCurrentChange"
      @row-dblclick="goDetail()"
    >
      <el-table-column align="center" label="客户名称" fixed width="320" prop="customerName" />
      <el-table-column align="center" label="证件类型" width="250" prop="certTypeName" />
      <el-table-column align="center" label="证件号" width="200" prop="certID" />
      <el-table-column align="center" label="机构类型" width="100" prop="orgNatureName" />
      <el-table-column align="center" label="企业规模" width="100" prop="scopeName" />
      <el-table-column
        align="center"
        label="是否我行定义小微"
        :width="150"
        prop="isSmallScopeName"
      />
      <el-table-column align="center" label="主办客户经理" :width="180" prop="managerUserName" />
      <el-table-column align="center" label="主办机构" width="150" prop="managerOrgName" />
      <el-table-column align="center" label="核心客户号" width="150" prop="mfcustomerID" />
      <el-table-column align="center" label="客户主办权" prop="belongAttribute" />
      <el-table-column align="center" label="信息维护权" prop="belongAttribute2" />
      <el-table-column align="center" label="信息查看权" prop="belongAttribute1" />
      <el-table-column align="center" label="业务申办权" prop="belongAttribute3" />
      <el-table-column align="center" label="暂存标志" prop="tempSaveFlag" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />

    <addCustomer ref="addCustomerRef" @success="addCustomerOk" />
    <select-team-work-pop ref="selectTeamWorkPopRef" />

    <CustomerIdDialog
      v-model="addCustomerDialogVisible"
      ref="CustomerIdChangeDialog"
      :initial-data="{ CustomerType: '0110' }"
      :add-loading="addLoading"
      title="新增"
      show-org-type
      @confirm="handleAddConfirm"
      @cancel="handleAddCancel"
    />

    <reqPermission ref="reqPermissionRef" @success="reqPermissionConfirm" />

    <!-- 风险探测 -->
    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"
    />
    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :object-type="'Customer'"
      @refresh="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />
  </ContentWrap>
</template>

<script setup>
import addCustomer from './components/addCustomer.vue'
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import selectTeamWorkPop from './components/selectTeamWorkPop.vue'
import useTableList from '@/compositions/useTableList'
import reqPermission from './components/reqPermission.vue'
import { useMessage } from '@/hooks/web/useMessage'
import { personalApi } from '@/api/customerInfoMGM/personal'
import { useRiskDetection } from '@/views/creditApplicationMGM/approvalChangeRequest/hooks'

defineOptions({
  name: '/compCustMana'
})

const isExpand = ref(false)
const handleExpand = () => {
  isExpand.value = !isExpand.value
}

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
} = useTableList(Api.getCustomerInfoEntPage)

const router = useRouter() // 路由

const addCustomerDialogVisible = ref(false)

/** 添加/修改操作 */
const addCustomerRef = ref()
const add = (type, id) => {
  // addCustomerRef.value.open(type, id)
  console.log('qweqweqw', addCustomerDialogVisible.value)
  addCustomerDialogVisible.value = true
}

const { confirmFetch } = useMessage()
const del = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择')

  confirmFetch({
    title: '是否确认删除该客户',
    fetchFunc: () =>
      Api.deleteBelongAttribute1({
        customerId: currentRow.value.customerID
      })
  }).then((_) => {
    ElMessage.success('已删除')
  })
}

const tableRef = ref()
const goDetail = (item) => {
  if (!currentRow.value?.customerID && !item) return ElMessage.warning('请选择')

  if (
    ['belongAttribute', 'belongAttribute1', 'belongAttribute2'].every(
      (v) => currentRow.value[v] !== '有'
    )
  ) {
    return ElMessage.warning('对不起，你没有查看该客户的权限！')
  }

  router.push({
    path: '/customerManagers/compCustManalDetail',
    query: {
      customerID: currentRow.value?.customerID || item?.customerId,
      t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
    }
  })
}
const goInDetail = (item) => {
  // if (['belongAttribute', 'belongAttribute1', 'belongAttribute2'].every(v => currentRow.value[v] !== '有')) {
  //   return ElMessage.warning('对不起，你没有查看该客户的权限！')
  // }

  router.push({
    path: '/customerManagers/compCustManalDetail',
    query: {
      customerID: item?.customerId,
      t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
    }
  })
}

const addCustomerOk = () => {
  router.push({
    path: 'compCustManalDetail',
    query: {
      customerID: 'SC2025011600000001',
      t: Date.now()
    }
  })
}

const selectTeamWorkPopRef = ref()
const addTeam = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择')

  selectTeamWorkPopRef.value.open(currentRow.value)
}

const customerIdDialog = ref()

const CustomerIdChangeDialog = ref()
const addLoading = ref(false)

const handleAddConfirm = (params) => {
  console.log('params', params)
  addLoading.value = true
  Api.addCustomer({ CustomerType: '0110', ...params })
    .then((res) => {
      console.log('成功但是目前暂时esb不通', res)
      if (res.data) {
        const info = res.data
        addLoading.value = false
        CustomerIdChangeDialog.value.hideLoading()
        // addCustomerDialogVisible.value = false
        // getList()
        // 是否需要打开客户主办权限申请弹窗
        if (info.status) {
          ElMessageBox.confirm(info.status, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then((_) => {
            reqPermissionRef.value.open(info.rightHost, {
              backToDetail: true,
              customerId: info.customerId
            })
          })
        } else {
          goInDetail({ customerId: info.customerId })
          ElMessage.success(info?.returnMsg || '新增成功')
        }
      }
    })
    .catch((error) => {
      addLoading.value = false
      CustomerIdChangeDialog.value.hideLoading()
      addCustomerDialogVisible.value = false
    })
    .finally(() => {
      addLoading.value = false
      CustomerIdChangeDialog.value.hideLoading()
      addCustomerDialogVisible.value = false
    })
}

const handleAddCancel = () => {}

// 权限申请
const reqPermissionRef = ref()
const reqPermissionClick = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择')

  const checkResult = reqPermissionRef.value.openCheck(currentRow.value)
  if (!checkResult) return

  reqPermissionRef.value.open(currentRow.value)
}

const reqPermissionConfirm = (params) => {
  getList()
  if (params.backToDetail) {
    goDetail({ customerId: info.customerId })
  }
}

/** 获取客户主办权 */
const handleGetCustomerOwnership = async () => {
  if (!currentRow.value?.customerID) {
    ElMessage.warning('请选择要操作的记录')
    return
  }
  try {
    loading.value = true
    var params = {}
    params.customerId = currentRow.value?.customerID
    const res = await personalApi.getCustomerRight(params)
    ElMessage.success('获取成功')
    getList()
  } finally {
    loading.value = false
  }
}

/** 同步额度系统 */
const handleSyncCreditLimit = async () => {
  if (!currentRow.value?.customerID) {
    ElMessage.warning('请选择要操作的记录')
    return
  }
  try {
    loading.value = true
    var params = {}
    params.customerId = currentRow.value?.customerID
    const res = await personalApi.synchronizeCustomer(params)
    ElMessage.success('同步成功')
    getList()
  } finally {
    loading.value = false
  }
}

// 自动风险探测
const {
  riskData,
  phaseNo,
  serialNo,
  doRiskDetection,
  riskMonitorVisible,
  creditFlowApprovalVisible,
  submit,
  handleRiskMonitorConfirm,
  handleCreditFlowApprovalCancel,
  handleRiskMonitorCancel
} = useRiskDetection(currentRow)

const doRiskDetectionAction = () => {
  riskData.value = {
    scenarioId: '005',
    rskTp: 1,
    params: {
      ObjectType: 'Customer',
      ObjectNo: currentRow.value.customerID
    }
  }
}
const button1 = () => {
  ElMessage.info('功能待实现')
}
</script>
