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
      v-show="isExpand"
      class="search-form"
      ref="queryFormRef"
      :model="queryParams"
      label-width="auto"
      @keyup.enter="search1"
    >
      <el-form-item label="客户名称" prop="customerID">
        <el-input
          v-model="queryParams.customername"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="业务品种" prop="code">
        <el-input
          v-model="queryParams.businesstypename"
          class="!w-240px"
          clearable
          placeholder="请输入业务品种"
        />
      </el-form-item>
      <el-form-item label="批复金额" prop="status">
        <el-input-number
          v-model="queryParams.businesssumstart"
          class="!w-140px mr-10px"
          clearable
          placeholder="请输入批复金额"
          :controls="false"
        />
        到
        <el-input-number
          v-model="queryParams.businesssumend"
          class="!w-140px ml-10px"
          clearable
          placeholder="请输入批复金额"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="完成时间" prop="endtime1">
        <div class="!w-240px">
          <el-date-picker
            class="!w-1/1"
            v-model="queryParams.endtime1"
            type="daterange"
            value-format="YYYY/MM/DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="search1" size="default" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch" size="default"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
    <div style="display: flex; margin-bottom: 17px">
      <!-- <div style="font-size: 18px; font-weight: 700"> 查询结果</div> -->
      <div>
        <el-button @click="goDetail" plain>
          业务详情
        </el-button>
<!--        <el-button v-if="queryCreditlineReportVIf" @click="queryCreditlineReport" :loading="loading4" plain>-->
<!--          查看调查报告-->
<!--        </el-button>-->
        <el-button v-if="viewEdpfReportVIf" @click="viewEdpfReport" :loading="loading3" plain>
          查看批复通知书
        </el-button>
        <el-button v-if="bookInContractVIf" @click="bookInContract" plain>
          登记合同
        </el-button>
        <el-button v-if="unBookInContractVIf" @click="unBookInContract" :loading="loading6" plain>
          批复变更不登记合同
        </el-button>
        <el-button v-if="cancelContractVIf" @click="cancelContract" plain>
          业务取消
        </el-button>
        <el-button v-if="againApproveBookDocVIf" @click="againApproveBookDoc" :loading="loading5" plain>
          重新生成批复通知书
        </el-button>
      </div>
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
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'

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
  tableCurrentChange,
  fetchCback
} = useTableList(Api.getCustomerInfoEntPage, {
  dealtype: props.params.dealtype,
  creditSourceFlag: '01',
  phaseType: props.params.key
}, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
  })
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
  { label: '批复编号', field: 'serialno', minWidth: 220 },
  { label: '申请流水号', field: 'relativeserialno', minWidth: 220 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '业务品种', field: 'businesstypename', minWidth: 120 },
  { label: '发生类型', field: 'occurtypename', minWidth: 120 },
  { label: '币种', field: 'currency', minWidth: 120 },
  { label: '批复金额', field: 'businesssum', minWidth: 120 },
  { label: '主要担保方式', field: 'vouchtypename', minWidth: 100 },
  { label: '登记人', field: 'inputusername', minWidth: 120 },
  { label: '登记机构', field: 'inputorgname', minWidth: 100 },
  { label: '完成时间', field: 'endtime', minWidth: 120 }
]

// 登记合同显影，只有待登记合同显示
const bookInContractVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

// 业务取消，只有待登记合同显示
const cancelContractVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

// 查看批复通知书
const viewEdpfReportVIf = computed(() => {
  return ['010','020','024','026'].includes(props.params.key)
})

const againApproveBookDocVIf = computed(() => {
  return ['010','020','024','026'].includes(props.params.key)
})

const unBookInContractVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

// 查看调查报告
const queryCreditlineReportVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/contractIssuanceMGM/approvalDetail',
    query: {
      serialno: currentRow.value.serialno,
      occurtype: currentRow.value.occurtype,
      businesstype: currentRow.value.businesstype,
      customerid: currentRow.value.customerid,
      customerType: currentRow.value.customertype,
      relativeserialno: currentRow.value.relativeserialno,
      t: Date.now(),
      _tagTitle: '项目批复详情', // 对tag页签中的title，重命名
    }
  })
}

const handleDblClick = (row) => {
  router.push({
    path: '/contractIssuanceMGM/approvalDetail',
    query: {
      serialno: row.serialno,
      occurtype: row.occurtype,
      businesstype: row.businesstype,
      customerid: row.customerid,
      customerType: row.customertype,
      relativeserialno: row.relativeserialno,
      t: Date.now(),
      _tagTitle: '项目批复详情', // 对tag页签中的title，重命名
    }
  })
}

const bookInContractFetch = (row) => {
  return Api.bookInContract({
    relativeserialno: row.relativeserialno,
    serialno: row.serialno,
    creditSourceFlag:'01'
  })
}

const { confirmFetch } = useMessage()
const pageLoading = ref(false)
const bookInContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  let id
  confirmFetch({
    title: '你确定要根据选中的电子最终审批意见登记合同吗？确定后生成合同',
    fetchFunc: () => bookInContractFetch(currentRow.value).then((res) => (id = res))
  }).then((_) => {
    ElMessage.success('登记成功')
    getList()
    pageLoading.value = true
    Api.bookInContract2({ id })
      .then((res) => {
        if (res.businesstype?.startsWith('3')) {
          router.push({
            path: '/contractIssuanceMGM/creditLineDetail',
            query: {
              businessType: currentRow.value.businesstype,
              customerID: currentRow.value.customerid,
              serialNo: id,
              t: Date.now()
            }
          })
        } else {
          router.push({
            path: '/contractIssuanceMGM/contractDetail',
            query: {
              businessType: currentRow.value.businesstype,
              customerID: currentRow.value.customerid,
              serialNo: id,
              t: Date.now()
            }
          })
        }
      })
      .finally(() => (pageLoading.value = false))
  })
}

const cancelContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '取消后该笔业务将失效不能恢复!',
    fetchFunc: () =>
      Api.cancelContract({
        objectType: 'BusinessApprove',
        serialNo: currentRow.value.serialno
      })
  }).then((_) => {
    ElMessage.success('已取消')

    getList()
  })
}

// 查看批复通知书
const loading3 = ref()
const viewEdpfReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  Api.viewEdpfReport({
    objectNo: currentRow.value.serialno
  }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      return
    }

    window.open(res.url)
  }).finally(() => loading3.value = false)
}

// 查看调查报告
const loading4 = ref()
const queryCreditlineReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading4.value = true
  Api.queryCreditlineReport({
    objectno: currentRow.value.relativeserialno,
    objecttype: "CreditApply",
  }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      return
    }

    window.open(res.url)
  }).finally(() => loading4.value = false)
}
const loading5 = ref()
const againApproveBookDoc = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading5.value = true

  confirmFetch({
    title: '你确定要重新生成吗？',
    fetchFunc: () => Api.againApproveBookDoc({
      serialNo: currentRow.value.serialno
    }).then(res => {
      console.log('pppp',res)
      if (res) {
        window.open(res)
      }
    })
  }).then((_) => {

  }).finally(() => loading5.value = false)

}

const loading6 = ref()
const unBookInContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading6.value = true
  Api.unBookInContract({
    serialNo: currentRow.value.serialno
  }).then(res => {
    console.log('pppp',res)

  }).finally(() => loading6.value = false)
}
const button1 = () => {
  ElMessage.info('功能待实现')
}

onActivated(() => {
  search()
})
</script>
