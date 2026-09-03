<template>
 

  <ContentWrap>
   
    <!-- 查询条件 -->
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
      >
        <el-form-item label="客户名称" prop="customerName">
          <div class="flex items-center gap-5px">
            <el-input
              v-model="queryParams.customerName"
              placeholder="请输入客户名称"
              clearable
              class="!w-200px"
            />
          </div>
        </el-form-item>
        <el-form-item label="证件号" prop="idNumber">
          <div class="flex items-center gap-5px">
            <el-input
              v-model="queryParams.certId"
              placeholder="请输入证件号"
              clearable
              class="!w-200px"
            />
          </div>
        </el-form-item>
        <el-form-item label="核心客户号" prop="mfCustomerId">
          <el-input
            v-model="queryParams.mfCustomerId"
            class="!w-200px"
            clearable
            placeholder="请输入核心客户号"
          />
        </el-form-item>
        <el-form-item>
          <el-button tpye="" @click="handleQuery">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleClear">清空</el-button>
        </el-form-item>
      </el-form>
    <div class="mb-15px flex flex-wrap ">
      <el-button tpye="" @click="handleCreate">
        <Icon icon="ep:plus" class="mr-5px" />
        新增
      </el-button>
      <el-button @click="handleDetail" :disabled="!hasSingleSelectedRow">
        详情
      </el-button>
      <el-button @click="doRiskDetection(doRiskDetectionAction)" :disabled="!hasSingleSelectedRow">
        客户信息检查
      </el-button>
      <el-button @click="handleAddSupplyChainMember" :disabled="!hasSelectedRows">
        加入供应链群成员
      </el-button>
      <el-button @click="handlePermissionApplication" :disabled="!hasSelectedRows">
        权限申请
      </el-button>
      <!-- <el-button @click="handleCustomerTypeConversion" :disabled="!hasSelectedRows">
        客户类型转换
      </el-button> -->
      <el-button @click="handleGetCustomerOwnership" :disabled="!hasSelectedRows">
        获取客户主办权
      </el-button>
      <el-button @click="handleTransferOwnership">
        移交主办权
      </el-button>
      <el-button @click="handleReceiveOwnership">
        接收主办权
      </el-button>
      <el-button @click="handleDesensitizedExport" >
        脱敏导出
      </el-button>
      <el-button @click="handleSyncCreditLimit" :disabled="!hasSelectedRows">
        同步额度系统
      </el-button>
      <el-button type="" @click="handleDelete" :disabled="!hasSelectedRows">
        删除
      </el-button>
      <el-button @click="handleBusinessPreApproval" :disabled="!hasSelectedRows">
        业务预审
      </el-button>
    </div>
    <Table
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      highlight-current-row
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @current-change="handleSelectionChange"
      @row-dblclick="handleDetail"
    />
  </ContentWrap>

  <select-team-work-pop ref="selectTeamWorkPopRef" />
  <reqPermission ref="reqPermissionRef" @success="reqPermissionConfirm" />

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

  <OcrRecognitionDialog
    v-model="ocrDialogVisible"
    ref="ocrRecognitionDialog"
    title="新增"
    :add-loading="addLoading"
    :initial-data="{CustomerType:'0310'}"
    @confirm='handleOcrConfirm'
    @cancel='handleOcrCancel'
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  defaultQueryParams,
  tableColumns
} from './const/index'
import { personalApi } from '@/api/customerInfoMGM/sxrs'
import selectTeamWorkPop from '@/views/customerManagers/compCustMana/components/selectTeamWorkPop.vue'
import reqPermission from '@/views/customerManagers/compCustMana/components/reqPermission.vue'
import { useRiskDetection } from '@/views/creditApplicationMGM/approvalChangeRequest/hooks'
import download from '@/utils/download'
defineOptions({ name: 'salaryEarner' })

const isExpand = ref(false)
const handleExpand = () => {
  isExpand.value = !isExpand.value
}

const message = useMessage()
const router = useRouter()

// 查询参数
const queryParams = reactive({ ...defaultQueryParams })

const queryFormRef = ref()
const selectedRows = ref<any[]>([])
const currentRow = computed(() => selectedRows.value[0])

// 计算属性：用于按钮禁用状态
const hasSelectedRows = computed(() => selectedRows.value && selectedRows.value.length > 0)
const hasSingleSelectedRow = computed(() => selectedRows.value && selectedRows.value.length === 1)


const ocrDialogData = ref({})

const ocrRecognitionDialog = ref()

// 使用 useTable hook
const { tableObject, tableMethods } = useTable({
  getListApi: async (params: any) => {
    try {
      // TODO: 调用实际接口获取列表数据
      
       const res = await personalApi.getList(params)
       console.log('ressdsad',res);
        ocrRecognitionDialog.value.hideLoading()
       if (res ) {
        return {
          list: res.list || res.data.records || [],
          total: res.total || 0
        }
      }
      // return {
      //   list: res.data.list || res.data.records || [],
      //   total: res.data.total || 0
      // }
      
      // 使用 mock 数据
      // return await getMockListData(params)
    } catch (error) {
      console.error('获取列表失败：', error)
      ocrRecognitionDialog.value.hideLoading()
      message.error('获取列表失败')
      return {
        list: [],
        total: 0
      }
    }
  },
  defaultParams: { ...queryParams }
})

const { getList, setSearchParams } = tableMethods

// 表格选择变化
const handleSelectionChange = (val) => {
  selectedRows.value = val ? [val] : []
}

/** 搜索按钮操作 */
const handleQuery = () => {
  setSearchParams(queryParams)
  getList()
}

/** 取消按钮操作 */
const handleCancel = () => {
  handleQuery()
}

/** 清空按钮操作 */
const handleClear = () => {
  Object.assign(queryParams, { ...defaultQueryParams })
  handleQuery()
}


const ocrDialogVisible = ref(false)

const loading = ref(false)


/** 新增 */
const handleCreate = () => {
  // message.info('新增功能待实现')

  ocrDialogVisible.value =true
}

const addLoading = ref(false)

 const handleOcrConfirm = async(params) => {
  addLoading.value = true
   console.log(params);
   const data = {
    CustomerType:'0310',
    CertType:params.CertType,
    CertID:params.CertID,
    CertID1:params.CertID1,
    CountryCode:params.CountryCode,
    CustomerName:params.CustomerName,
    MaturityDate:params.MaturityDate
   }

   loading.value = true
  
   try {
     
   const res =  await personalApi.addCustomer(data)

   if(res) {
      const info = res.data
    
      // 是否需要打开客户主办权限申请弹窗
      if (info.status) {
        addLoading.value = false
        loading.value = false
        ocrDialogVisible.value =false
        ElMessageBox.confirm(info.status, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          reqPermissionRef.value.open(info.rightHost,{backToDetail:true,customerId:info.customerId})
        })
      } else {
       
       const cusRes = await personalApi.getCustomerInfo({customerId:info.customerId})
       if(!res) {
        ElMessage.error('获取客户详情失败')
        return
       }
       addLoading.value = false
        loading.value = false
        ocrDialogVisible.value =false
       handleRowDetail({
          customerName: cusRes.customerName,
          customerId:cusRes.customerID,
          customerType: cusRes.customerType,
       })
        message.success(info?.returnMsg || '新增成功')
        getList()
      }
    }

   } catch (error: any) {
    addLoading.value = false
     loading.value = false
     ocrDialogVisible.value =false
   }

    
 }


 const reqPermissionConfirm =async (params: any = {}) => {
   getList()
  if (params.backToDetail) {
  
    const cusRes = await personalApi.getCustomerInfo({customerId:params.customerId})
    handleRowDetail({
          customerName: cusRes.customerName,
          customerId:cusRes.customerID,
          customerType: cusRes.customerType,
       })
        message.success('新增成功')
        getList()


    // goDetail({ customerId: info.customerId })
  }
}

const handleOcrCancel = () => {

}

/** 详情 */
const handleDetail = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条记录')
    return
  }

  if (['belongAttribute', 'belongAttribute1', 'belongAttribute2'].every(v => selectedRows.value[0][v] !== '有')) {
    return ElMessage.warning('对不起，你没有查看该客户的权限！')
  }
  
  handleRowDetail(selectedRows.value[0])
}

/** 行详情 */
const handleRowDetail = (row: any) => {
  // 跳转到详情页面
  router.push({
    path:`sxrsDetail/${row.mfCustomerID}`,
    query: {
      customerName: row.customerName,
      customerId:row.customerId,
      customerType: "0310",
    }
  })
}

/** 加入供应链群成员 */
const selectTeamWorkPopRef = ref()
const handleAddSupplyChainMember = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  selectTeamWorkPopRef.value.open({ ...selectedRows.value[0], customerID: selectedRows.value[0].customerId })
}

/** 权限申请 */
const reqPermissionRef = ref()
const handlePermissionApplication = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }

  const checkResult = reqPermissionRef.value.openCheck(selectedRows.value[0])
  if (!checkResult) return

  reqPermissionRef.value.open(selectedRows.value[0])
}

/** 客户类型转换 */
const handleCustomerTypeConversion = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  message.info('客户类型转换功能待实现')
}

/** 获取客户主办权 */
const handleGetCustomerOwnership = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  try {
    loading.value = true
    const res = await personalApi.getCustomerRight({
      customerId: currentRow.value.customerId
    })
    if (res?.GetHost === 'Y') {
      reqPermissionRef.value.open({
        ...currentRow.value,
        isHostRights: true
      })
    } else {
      message.success('获取成功')
      getList()
    }
  } finally {
    loading.value = false
  }
}


/** 移交主办权 */
const handleTransferOwnership = () => {
  router.push({
    name: 'CustomerOwnershipTransfer',
    query: { customerType: '0310' }
  })
}

/** 接收主办权 */
const handleReceiveOwnership = () => {
  router.push({
    name: 'CustomerOwnershipReceive',
    query: { customerType: '0310' }
  })
}

/** 脱敏导出 */
const handleDesensitizedExport = async() => {
 loading.value = true
   console.log(queryParams)
   try {
     const res =  await personalApi.exportSelfExcel(queryParams)
     download.excel(res, '受薪客户脱敏列表.xls')
   } catch {
   } finally {
       loading.value = false
   }
}

/** 同步额度系统 */
const handleSyncCreditLimit = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  try {
    loading.value = true
    await personalApi.synchronizeCustomer({ customerId: currentRow.value.customerId })
    message.success('同步成功')
    getList()
  } finally {
    loading.value = false
  }
}

const {
  riskData,
  phaseNo,
  serialNo,
  doRiskDetection,
  riskMonitorVisible,
  creditFlowApprovalVisible,
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
      ObjectNo: currentRow.value.customerId
    }
  }
}

/** 删除 */
const handleDelete = async () => {
  if (selectedRows.value.length != 1) {
    message.warning('请选择一条要删除的记录')
    return
  }
  
  try {
    const count = selectedRows.value.length
    const confirmText = count === 1 
      ? `确定要删除客户"${selectedRows.value[0].customerName}"吗？`
      : `确定要删除选中的 ${count} 条记录吗？`
    
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // TODO: 调用删除接口
    await personalApi.deleteBelongAttribute1({ customerId: selectedRows.value[0].customerId})
    
    message.success(`成功删除 ${count} 条记录`)
    
    // 清空选中状态
    selectedRows.value = []
    
    // 刷新列表
    await getList()
  } catch (error: any) {
   
  }
}

/** 业务预审 */
const handleBusinessPreApproval = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的记录')
    return
  }
  message.info('业务预审功能待实现')
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
// 查询条件中的下拉和输入框布局
.flex.items-center.gap-5px {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>

