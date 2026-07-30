<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <div class="flex items-center mb-2 w-[110px]" @click="isExpand = !isExpand">
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
      @keyup.enter="search1"
    >
      <el-form-item label="核心客户号" prop="mfcustomerid">
        <el-input
          v-model="queryParams.mfcustomerid"
          class="!w-240px"
          clearable
          placeholder="请输入核心客户号"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customername">
        <el-input
          v-model="queryParams.customername"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="业务品种" prop="businesstypename">
        <el-input
          v-model="queryParams.businesstypename"
          class="!w-240px"
          clearable
          placeholder="请输入业务品种"
        />
      </el-form-item>
      <el-form-item label="出账流水号" prop="serialno">
        <el-input
          v-model="queryParams.serialno"
          class="!w-240px"
          clearable
          placeholder="请输入出账流水号"
        />
      </el-form-item>
      <el-form-item label="发生类型" prop="occurtypename">
        <el-select
          v-model="queryParams.occurtypename"
          placeholder="请选择发生类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in occurrenceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="完成时间" prop="endtime1">
        <div class="w-350px">
        <el-date-picker
          v-model="queryParams.endtime1"
          type="daterange"
          value-format="YYYY/MM/DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="search1" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
      <div class="mb-15px" style="display: flex;flex-wrap: wrap;gap: 8px;">
        <el-button v-if="addLoanApplyVIf" @click="addLoanApply" plain tpye=""  :loading="loading1">
          新增放贷申请
        </el-button>
        <el-button v-if="props.params.key !== '1080'" @click="goDetail" plain type="">
          放贷详情
        </el-button>
        <el-button v-if="cancelLoanVIf" @click="cancelLoan" plain tpye="">
          取消放贷
        </el-button>

        <el-button  v-if="viewOpinionVIf" @click="viewPhaseOpinion"> 查看意见 </el-button>
        <el-button  v-if="signOpinionVIf" @click="handleSignOpinion"> 签署意见 </el-button>
        <el-button  v-if="riskVIf" @click="doRiskDetection"> 自动风险探测 </el-button>
        <el-button  v-if="submitVIf" @click="submit"> 提交 </el-button>
        <el-button v-if="syncContractInfoVIf" @click="syncContractInfo" plain tpye="">
          同步合同信息
        </el-button>

        <el-button  v-if="takeBackVIf" @click="takeBack"> 收回 </el-button>
        <el-button  v-if="cancelArchiving" @click="doRiskDetection"> 取消归档 </el-button>
        <el-button  v-if="restartProcessVIf" @click="notDoBtn"> 重新发起流程 </el-button>
        <el-button  v-if="voidedVIf" @click="notDoBtn"> 作废 </el-button>
        <el-button  v-if="fillPutOutVIf" @click="handleNoticeBook"> 填写放贷通知书 </el-button>
        <el-button  v-if="viewPutOutVIf" @click="viewFormatReport"> 查看放贷通知书 </el-button>

        <el-button  v-if="viewRecordVIf" @click="toRecord"> 查看流转记录 </el-button>
        <el-button  v-if="archivingVIf" @click="notDoBtn"> 归档 </el-button>
        <el-button  v-if="viewQuotaApprovalVIf" @click="preViewReport"> 查看额度批复通知书 </el-button>
        <el-button  v-if="viewApprovalVIf" @click="viewEdpfReport"> 查看批复通知书 </el-button>
        <el-button  v-if="syncVideoVIf" @click="syncVideo"> 同步视频系统 </el-button>
        <el-button v-if="exportExcelVIf" type="" @click="handleExport" :loading="exportLoading">
          <Icon icon="ep:download" class="mr-5px"/>
          导出EXCEL
        </el-button>


        <el-button v-if="returnOnlineBankVIf" @click="returnOnlineBank" plain tpye="">
          退回网银
        </el-button>
        <el-button v-if="concentratedWorkOptionVIf" @click="concentratedWorkOption" plain tpye="">
          集中作业任务挑选
        </el-button>

        <el-button v-if="concentratedWorkBackVIf" @click="concentratedWorkBack" plain tpye="">
          集中作业退回
        </el-button>
      </div>
    <Table
      :columns="columns"
      :data="list"
      :loading="loading"
      :pagination="{
        total: total
      }"
      highlight-current-row
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @current-change="tableCurrentChange"
      @page-change="getList"
      @row-dblclick="goDetail"
    />
    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :object-type="'PutOutApply'"
      @refresh="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />
    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"
    />

    <ApprovalOpinion 
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      @confirm="handleSignOpinionConfirm"
      @cancel="handleSignOpinionCancel"
      @submit="submit"
    />

    <addLoanApplyPop ref="addLoanApplyPopRef" @confirm="getList" />

    <!-- 查看额度批复通知书 -->
    <preViewReportPop ref="preViewReportRef" />
    <!-- 填写放贷通知书 -->
    <treeListPop
      ref="treeListPopRef1"
      :api-func="Api.preEditFormatReport"
      :qry-params="getPutOut"
      @confirm="(item) => editFormatReport(item)"
    />

    <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
  </ContentWrap>
</template>

<script setup lang="tsx">
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import addLoanApplyPop from './components/addLoanApplyPop.vue'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'
import { useMessage } from '@/hooks/web/useMessage'
import * as CreditFlowApi from "@/api/creditflow";
import download from '@/utils/download'
import preViewReportPop from '@/components/busiComp/preViewReportPop/index.vue'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import {addDialog} from "@/components/Dialog";
import viewPhaseOpinionPop from '@/views/contractIssuanceMGM/viewPutOutPhaseOpinion/index.vue'
import {checkRoleIds} from "@/utils/permission";
import { occurrenceTypeOptions } from './const'



defineOptions({
  name: 'ConTractToRegistered'
})

const isExpand = ref(false)

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

console.log('子组件开始取数', props.params)
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
  fetchCback,
  setCurrentRow
} = useTableList(Api.pendPutOutApplyList, {
  dealtype: props.params.dealtype,
  contractserialno: props.params.contractserialno,
  creditSourceFlag: '01',
  phaseType: props.params.key
}, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
  })
})
// 新增放贷申请
const addLoanApplyVIf = computed(() => {
  return ['1010'].includes(props.params.key)
})
// 取消放贷
const cancelLoanVIf = computed(() => {
  return ['1010','1025','1030','1060'].includes(props.params.key)
})
// 同步合同
const syncContractInfoVIf = computed(() => {
  return ['1010','1025','1030'].includes(props.params.key)
})

// 退回网银显隐
const returnOnlineBankVIf = computed(() => {
  return ['1010','1025','1030'].includes(props.params.key)
})
// 查看额度批复
const viewQuotaApprovalVIf = computed(() => {
  return ['1010','1020','1025','1030','1035','1040','1050','1060','1065','1070'].includes(props.params.key)
})
// 查看批复
const viewApprovalVIf = computed(() => {
  return ['1020','1025','1030','1035','1040','1050','1060','1065','1070'].includes(props.params.key)
})
// 同步视频
const syncVideoVIf = computed(() => {
  return ['1010','1020','1025','1030','1035','1040','1050','1060','1065','1070'].includes(props.params.key)
})
// 查看流转记录
const viewRecordVIf = computed(() => {
  return ['1020'].includes(props.params.key)
})
// 查看意见
const viewOpinionVIf = computed(() => {
  return ['1020','1025','1030','1035','1040','1050','1070'].includes(props.params.key)
})
// 签署意见
const signOpinionVIf = computed(() => {
  return ['1010','1025','1030','1060'].includes(props.params.key)
})
// 填写放贷通知书
const fillPutOutVIf = computed(() => {
  return ['1010','1025','1030'].includes(props.params.key)
})
// 查看放贷通知书
const viewPutOutVIf = computed(() => {
  return ['1010','1020','1025','1030', '1040', '1050'].includes(props.params.key)
})
// 风险探测
const riskVIf = computed(() => {
  return ['1010','1025','1030'].includes(props.params.key)
})
// 提交
const submitVIf = computed(() => {
  return ['1010','1025','1030'].includes(props.params.key)
})
// 收回
const takeBackVIf = computed(() => {
  return ['1020'].includes(props.params.key)
})
// 归档
const archivingVIf = computed(() => {
  return ['1040','1050','1065'].includes(props.params.key)
})
// 导出Excel
const exportExcelVIf = computed(() => {
  return ['1010', '1020', '1050'].includes(props.params.key)
})

// 重新发起流程
const restartProcessVIf = computed(() => {
  return ['1060'].includes(props.params.key)
})
// 作废
const voidedVIf = computed(() => {
  return ['1060'].includes(props.params.key)
})
// 取消归档
const cancelArchiving = computed(() => {
  return ['1070'].includes(props.params.key)
})
// 集中作业任务挑选
const concentratedWorkOptionVIf = computed(() => {
  return ['1080'].includes(props.params.key)
})

// 集中作业任务退回
const concentratedWorkBackVIf = computed(() => {
  return ['1010'].includes(props.params.key)
})
const search1 = () => {
  if (queryParams.endtime1?.length) {
    queryParams.endtimestart = queryParams.endtime1[0]
    queryParams.endtimeend = queryParams.endtime1[1]
  } else {
    queryParams.endtimestart = ''
    queryParams.endtimeend = ''
  }
  search()
}



const router = useRouter() // 路由

const columns = [
  { label: '核心客户号', field: 'mfcustomerid', minWidth: 120 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '业务品种', field: 'businesstypename', minWidth: 160 },
  { label: '币种', field: 'currencyname' },
  { label: '申请金额（元）', field: 'businesssum1', minWidth: 160 },
  { label: '网银确认标志', field: 'affirmflag', minWidth: 120 },
  { label: '出账流水号', field: 'serialno', minWidth: 180 },
  { label: '放款渠道', field: 'putoutchannel',minWidth: 180 },
  { label: '合同流水号', field: 'contractserialno', minWidth: 180 },
  { label: '发生类型', field: 'occurtypename' },
  { label: '出账状态', field: 'putoutstatusname' },
  { label: '当前流程', field: 'flowname', minWidth: 120 },
  { label: '当前阶段', field: 'phasename', minWidth: 120 },
  { label: '供应链标识', field: 'gylflag', minWidth: 120 },
  { label: '供应链客户类型', field: 'gylcustomertype', minWidth: 140 },
  { label: '所属项目名称', field: 'projectname', minWidth: 320 },
  { label: '完成时间', field: 'endtime', minWidth: 120 }
]

const loading1 = ref()
const addLoanApplyPopRef = ref()
const addLoanApply = () => {
  //合同项下业务登记
  var contractserialno  = props.params.contractserialno
  console.log(contractserialno)
  if(props.params.contractserialno){
    loading1.value = true
       Api.getTempSaveFlag({ contractserialno: contractserialno}).then(res => {
          if(res!="3"&&res!="2"){
              ElMessage.success('请先保存业务的基本信息')
              return
           }else{
              Api.newApply({ contractserialno: contractserialno}).then(res => {
                   ElMessage.success('新增成功')
                   getList()
              })
           }
       })
     
  }else{
    //放贷详情进来
    addLoanApplyPopRef.value.open()
  }
}

const goDetail = () => {
  if(props.params.key === '1080') return;
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const has289 = checkRoleIds(['289'])
  const isEdit = (['0010','3000'].includes(currentRow.value.phaseno)) || (props.params.key ==='1020' && has289)
  router.push({
    path: '/contractIssuanceMGM/loanDetail',
    query: {
      serialno: currentRow.value.serialno,
      businesstype: currentRow.value.businesstype,
      customerID: currentRow.value.customerid,
      customertype: currentRow.value.customertype,
      isEdit,
      t: Date.now(),
      _tagTitle: '项目放贷详情', // 对tag页签中的title，重命名
    }
  })
}

const { confirmFetch } = useMessage()
const bookInContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '你确定要根据选中的电子最终审批意见登记合同吗？确定后生成合同',
    fetchFunc: () => Api.bookInContract({ relativeserialno: currentRow.value.relativeserialno,creditSourceFlag:'01' })
  }).then((_) => {
    ElMessage.success('登记成功')

    getList()
  })
}

// 取消放贷
const cancelLoan = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '您确定取消该信息吗？',
    fetchFunc: () =>
      Api.cancelContract({ objectType: 'BusinessPutout', serialNo: currentRow.value.serialno })
  }).then((_) => {
    ElMessage.success('已取消')

    getList()
  })
}

// 退回网银
const returnOnlineBank = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定退回网银？',
    fetchFunc: () =>
      Api.returnOnlineBank({ serialNo: currentRow.value.serialno, objectType: 'PutOutApply' })
  }).then((_) => {
    ElMessage.success('已退回')

    getList()
  })
}

// 同步合同信息
const syncContractInfo = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定同步合同信息',
    fetchFunc: () => Api.syncContractInfo({ serialNo: currentRow.value.serialno })
  }).then((_) => {
    ElMessage.success('同步成功')

    getList()
  })
}

const button1 = () => {
  ElMessage.info('功能待实现')
}
// const { confirmFetch } = useMessage()
const takeBack = async () => {
  if (getSelect()) return;
  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.withdraw({
      serialNo: selectRow.value.serialno,
      phaseNo: selectRow.value.phaseno,
      objectType: 'PutOutApply',
      nextUserRole: "收回",
      nextUserInfo: '',
      flag:1
    })
  })
  ElMessage.success('收回成功')
  getList()
}

const getSelect = () => {
  if(!currentRow.value) {
    ElMessage.warning("请选择一条记录")
    return true
  }
  selectRow.value = currentRow.value
  return false
}

const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')
const selectRow = ref()
const creditFlowApprovalVisible = ref(false)
const exportLoading = ref(false) // 导出的加载中
const message = useMessage() // 消息弹窗

const doRiskDetection = async (rskTp = 1,otherParams = {}) => {
  if (getSelect()) return;
  serialNo.value = currentRow.value.serialno
  phaseNo.value = currentRow.value.phaseno
  riskData.value = {
    scenarioId: '003',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      BPObjectType: 'PutOutApply',
      BPSerialNo: currentRow.value.serialno,
      BPBusinessType: currentRow.value.businesstype,
      BPContractSerialNo: currentRow.value.contractserialno,
      BPPhaseNo: currentRow.value.phaseno,
      CustomerID: currentRow.value.customerid
    },otherParams
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

const checkCommentExec = async(serialNo,objectType,phaseno) => {
  const resp = await Api.checkComment({serialNo,objectType,phaseno}).then(res => res)
  return resp;

}

const submit = async (checkFlag) => {
  if (getSelect()) return;
  console.log("checkFlag:",checkFlag)
  if(checkFlag != 1){
        const data = await checkCommentExec(currentRow.value.serialno,"PutOutApply",currentRow.value.phaseno)
        console.log("data:",data)
        if (!data?.phaseOpinion) {
        ElMessage.warning(`${currentRow.value.serialno}签署意见未保存`)
          return
        }
  }
  const checkBusType =  await Api.checkBusTypeAndLoanProductCategory({"serialNo":currentRow.value.serialno,"projectType":"01"})
    if(checkBusType){
        ElMessage.warning(`${currentRow.value.serialNo} 此业务不允许在供应链作业系统发起`)
      return
    }
  
   const submitRisk =  await Api.checkSubmitIsRisk({"objectNo":currentRow.value.serialno,"objectType":"PutOutApply","phaseNo":currentRow.value.phaseno})
    //需要强控
    console.log("ispass:",submitRisk)
    await doRiskDetection(2, { isPass: !submitRisk })
  submitFlag.value = true
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

const notDoBtn = () => {
  ElMessage.warning('功能待实现')
}


const signOpinionVisible = ref(false)
const currentProcessInstanceForOpinion = ref([])

const handleSignOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
   

  const selectedRows = currentRow.value
  currentProcessInstanceForOpinion.value = {
     businessId:selectedRows.serialno,
    //businessId:'BC2025112400000006',
    businessType:selectedRows.businesstype,
    phaseNo:selectedRows.phaseno,
    objectType:'PutOutApply'
  }


  signOpinionVisible.value= true

}

// 查看批复通知书
const loading3 = ref()
const viewEdpfReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  Api.viewEdpfReport({
    objectNo: currentRow.value.contractserialno
  }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      return
    }

    window.open(res.url)
  }).finally(() => loading3.value = false)
}


/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await Api.handleExport(queryParams)
    download.excel(data, `${props.params.title}.xls`)
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 同步合同信息
const syncVideo = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
     console.log('1111')
  var param = {}
  param.objectno = currentRow.value.serialno
  param.objectType = 'PutOutApply'
  confirmFetch({
    title: '是否确定同步视频系统',
    fetchFunc: () => Api.syncVideo(param)
  }).then((_) => {
    ElMessage.success('同步成功')

    getList()
  })
}


const toRecord = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  // router.push({
  //   path: '/revApprMan/creditreviewapprovalrecord',
  //   query: {
  //     serialNo: currentRow.value.serialno,
  //     objectType: "PutOutApply",
  //     t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
  //   }
  // })
  addDialog({
    title: '流转记录',
    width:"1200px",
    hideFooter: true,
    contentRenderer: ()=> (
      <FlowRecord serialNo={currentRow.value.serialno} objectType={'PutOutApply'} />
    )
  })
}

// 查看额度批复通知书
const preViewReportRef = ref()
const preViewReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  preViewReportRef.value.open({ objectNo: currentRow.value.contractserialno })
}

const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
    if (!currentRow.value) return ElMessage.warning('请选择 1 条')

    viewPhaseOpinionRef.value.open({serialNo:currentRow.value.serialno})
  //   router.push({
  //   path: '/contractIssuanceMGM/viewPutOutPhaseOpinion',
  //   query: {
  //     serialNo: currentRow.value.serialno,
  //   }
  // })

}

//填写放贷通知书
const treeListPopRef1 = ref()
const handleNoticeBook = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const data = await Api.judgeFormatReport(getPutOut)
  if(data.length == 0){
    treeListPopRef1.value.open()
  }else{
      if(data.includes('放贷详情未保存')){
          ElMessage.warning(data)
      }else {
        ElMessageBox.confirm(data, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type:"warning"
        })
        .then(() => {
            treeListPopRef1.value.open()
        }).catch(() =>{
             editFormatReport();
        })
      }
  }
}
//查看放贷通知书
const viewFormatReport = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const data = await Api.viewFormatReport(getPutOut)
    if(data.url?.length>0){
      window.open(data.url)
    } else {
      ElMessage.warning(data.msg || '暂时无法查看')
    }
}


// 弹窗选择
const popConfirm = (item) => {
    console.log(item)
    
}
//生成放贷申请书
const editFormatReport = async (item) => {
  // 出账信息
  const editFormatReportReq =  reactive({
     customerID: computed(() => currentRow.value.customerid),
     objectNo: computed(() => currentRow.value.serialno),
     objectType: computed(() =>'PutOutApply'),
     docID: computed(() => item ==null?"":item.itemNo) //如果是新生成的放贷通知书不传item ，如果已生成放贷，则编辑传item
  })
  const data = await Api.editFormatReport(editFormatReportReq)
  if(data.url.length>0){
    window.open(data.url)
  }
}


// 集中作业挑选
const concentratedWorkOption = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定集中作业挑选？',
    fetchFunc: () =>
      Api.concentratedWorkOption({ serialNo: currentRow.value.serialno, objectType: 'PutOutApply',CreditSourceFlag:props.params?.creditSourceFlag ?? '01' })
  }).then((_) => {
    ElMessage.success('挑选成功')
    setCurrentRow(null)
    getList()
  })
}

// 集中作业退回
const concentratedWorkBack = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定集中作业退回？',
    fetchFunc: () =>
      Api.concentratedWorkBack({ serialNo: currentRow.value.serialno, objectType: 'PutOutApply',CreditSourceFlag:props.params?.creditSourceFlag ?? '01' })
  }).then((_) => {
    ElMessage.success('退回成功')
    setCurrentRow(null)
    getList()
  })
}


// 出账信息
const getPutOut =  reactive({
     objectNo: computed(() => currentRow.value.serialno),
     objectType: computed(() =>'PutOutApply')
  })

onActivated(() => {
  getList()
})
</script>
