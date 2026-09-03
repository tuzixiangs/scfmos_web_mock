<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '10px 15px 0px' }">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving" v-if="ecifShow" >
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      >
      <el-button v-if="tempSaveShow && ecifShow" :loading="tempSaving" @click="tempSave">暂存</el-button>
      <el-button
tpye="" @click="onCustomerChange"
        v-if="ecifShow" ><Icon class="mr-5px" icon="ep:edit" />客户信息变更</el-button
      >
      <el-button v-if="ecifShow" :loading="ecifImporting" @click="ecifImport"
        ><Icon class="mr-5px" icon="ep:download" />导入ECIF数据</el-button
      >
    </ContentWrap>

    <ContentWrap :body-style="{ padding: '0px 15px' }">
      <el-skeleton :loading="loading" animated>
        <el-scrollbar height="calc(100vh - 188px)">
          <dynamicForm
            ref="dynamicFormRef"
            style="width: calc(100% - 10px)"
            :formData="formData"
            :dockList="dockList"
            :formTempList="formTempList"
            :customVisible="customVisible"
            :customRequired="customRequired"
            :customReadonly="customReadonly"
            @pop-confirm="popConfirm"
            @select-input-click="formSelectInputClick"
            @select-change="formSelectChange"
            @render-finished="formRendering = false"
          />
        </el-scrollbar>
      </el-skeleton>
    </ContentWrap>

    <!-- 客户信息变更 -->
    <customerChange ref="customerChangeRef" />

    <!-- 控股类型 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `entorgtypename`)"
      @confirm="(item) => popConfirm('entorgtypename', item)"
    />
    
     <!-- 行业 -->
     <industrytypePop
      :ref="(el) => setMapRef(el, `unitkindname`)"
           @confirm="(item) => popConfirm('unitkindname', item)"
     />

    <!-- 所在国家 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `countryname`)"
      :beforeConfirm="countryname_beforeConfirm"
      @confirm="(item) => popConfirm('countryname', item)"
    />

    <!-- 注册省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `nativeplace`)"
      @confirm="(item) => popConfirm('nativeplace', item)"
    />

    <!-- 注册省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `familyadd`)"
      @confirm="(item) => popConfirm('familyadd', item)"
    />
    
    <!-- 注册省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `ctcdstccdname`)"
      @confirm="(item) => popConfirm('ctcdstccdname', item)"
    />
     
    <!-- 信用等级评估模板名称 -->
    <creditBelongPop
      :ref="(el) => setMapRef(el, `creditbelongname`)"
      :customerType="customerType"
      @confirm="(item) => popConfirm('creditbelongname', item)"
    />
    <!-- 单位地址 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `workadd`)"
      @confirm="(item) => popConfirm('workadd', item)"
    />

    <!-- 主经营企业 -->
    <selectEntorgPop
      :ref="(el) => setMapRef(el, `entorgcustomername`)"
      @confirm="(item) => popConfirm('entorgcustomername', item)"
    />
  </div>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import customerChange from './components/customerChange/index.vue'
import orgTypeNamePop from './components/orgTypeNamePop.vue'
import industrytypePop from './components/industrytypePop.vue'
import creditBelongPop from '../../../../personal/customerDetail/components/personalProfile/components/creditBelongPop.vue'
import selectEntorgPop from '../../../../personal/customerDetail/components/personalProfile/components/selectEntorgPop.vue'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import selectRegionCodePop from '@/components/dynamicForm/components/selectRegionCodePop.vue'

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])
const customerType = '0310'
// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象
const customerId = computed(() => route.query.customerId || route.query.customerID || route.query.customerid)

// 获取表单字段配置
const getTemplateVO = (templateNo, customerType) => {
  Api.getTemplateVO({ templateNo, customerType, customerId: customerId.value })
    .then((res) => {
      formTempList.value = res?.templates || []
      dockList.push(...(res?.docks || []))
    })
    .finally((_) => {
      loading.value = false
    })
}

// 获取表单模板号
const getCustomerTemplateNo = () => {
  Api.getCustomerTemplateNo({ codeNo: 'CustomerType', itemNo: customerType }).then(
    (res) => {
      getTemplateVO(res, customerType)
    }
  )
}

// 获取详情数据
const emit = defineEmits(['sendInfo'])
const formData = reactive({})
const getDetail = () => {
  Api.getCustomerInfo({ customerid: customerId.value }).then((res) => {
    dynamicFormRef.value?.resetFields()
    Object.assign(formData, res)
        entTempSaveFlag()
        entImportFlag()
    
    emit('sendInfo', formData)
  })
}

const loading = ref(false)
const initGetData = () => {
  if (!customerType) {
    return ElMessage.error('无客户类型')
  }

  loading.value = true
  Promise.all([getCustomerTemplateNo(), getDetail()]).then((res) => {})
}

initGetData()

const arrTostr = (arr,sep=',') => {
  if(!Array.isArray(arr) || arr.length ===0) {
    return ""
  }
  return arr.join(sep)
}

/**
 * 保存
 */
const dynamicFormRef = ref()
const saving = ref(false)
const save = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return
  
  saving.value = true
  Api.saveCustomer({ ...formData, objecttype: 'Save' })
    .then((res) => {
      ElMessage.success('保存成功')
    })
    .finally((_) => (saving.value = false))
}


const tempSaving = ref(false)
const tempSave = () => {
  tempSaving.value = true
  const params  =  {...formData ,objecttype: 'TempSave',gylloanproductcategory: arrTostr(formData.gylloanproductcategory),loanproductcategory:arrTostr(formData.loanproductcategory),vouchflag:arrTostr(formData.vouchflag)}
  Api.saveCustomer(params)
    .then((res) => {
      ElMessage.success('暂存成功')
    })
    .finally((_) => (tempSaving.value = false))
}

// 暂存按钮显隐控制
const tempSaveShow = ref(false)
const entTempSaveFlag = () => {
  Api.entTempSaveFlag({
    customerType: customerType,
    customerId: formData.customerid
  }).then((res) => {
    if (res !== '2') {
      tempSaveShow.value = true
    }
  })
}

// 导入ecif按钮权限
const ecifShow = ref(false)
const entImportFlag = () => {
  Api.entImportFlag({
    customerType: customerType,
    customerId: formData.customerid
  }).then((res) => {
    if (res) {
      ecifShow.value = true
    }
  })
}

// 客户变更
const customerChangeRef = ref()
const onCustomerChange = () => {
  customerChangeRef.value.open(customerId.value)
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// ecif导入
const ecifImporting = ref(false)
const ecifImport = () => {
  ecifImporting.value = true
  Api.getEcifIndInfo({ customerId: formData.customerid })
    .then((res) => {
      ElMessage.success('导入成功')
      getDetail()
    })
    .finally((_) => (ecifImporting.value = false))
}

// 国籍选择校验
const countryname_beforeConfirm = (item) => {
  if (customerType.substring(0, 2) == "03"
    && ['Ind09', 'Ind03', 'Ind17'].includes(formData['certtype'])
    && ['CHN', 'HKG', 'MAC', 'TWN'].includes(item.key)) {
      ElMessage.warning('证件类型为护照、外国人居留证或外国人永久居留身份证时，国籍不得选择中国')
      return false
  }

  return true
}

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible, customRequired,customReadonly } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)
</script>
