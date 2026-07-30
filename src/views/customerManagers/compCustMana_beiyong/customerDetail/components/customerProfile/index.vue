<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '10px 15px 0px' }">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving" v-if="ecifShow" >
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      >
      <el-button v-if="tempSaveShow && ecifShow" :loading="tempSaving" @click="tempSave">暂存</el-button>
      <el-button tpye="" @click="onCustomerChange" v-if="ecifShow" 
        ><Icon class="mr-5px" icon="ep:edit" />客户信息变更</el-button
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
          >
            <template #industrytypename="{ formInfo, tempEl }">
              <div class="flex item-center">
                <component
                  style="width: calc(50% - 163px); margin-right: 10px;padding-right: 0"
                  :is="tempEl"
                  :formInfo="formInfo"
                />
                <el-button @click="downDir">行业说明下载</el-button>
              </div>
            </template>
          </dynamicForm>
        </el-scrollbar>
      </el-skeleton>
    </ContentWrap>

    <!-- 客户信息变更 -->
    <customerChange ref="customerChangeRef" />

    <!-- 控股类型 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `orgtypename`)"
      @confirm="(item) => popConfirm('orgtypename', item)"
    />

    <!-- 国标行业分类 -->
    <industrytypePop
      :ref="(el) => setMapRef(el, `industrytypename`)"
      @confirm="(item) => popConfirm('industrytypename', item)"
    />
    <!-- 绿色贷款 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `industrytypexlname`)"
      @confirm="(item) => popConfirm('industrytypexlname', item)"
    />
    <!-- 是否两高一剩行业 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `surplusindustryname`)"
      @confirm="(item) => popConfirm('surplusindustryname', item)"
    />

    <!-- 上级公司名称 -->
    <selectSuperCorpPop
      :ref="(el) => setMapRef(el, `supercorpname`)"
      @confirm="(item) => popConfirm('supercorpname', item)"
    />

    <!-- 所在国家 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `countrycodename`)"
      default-key="142"
      @confirm="(item) => popConfirm('countrycodename', item)"
    />

    <!-- 注册省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `regioncodename`)"
      @confirm="(item) => popConfirm('regioncodename', item)"
    />

    <!-- 办公省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `officeaddcodename`)"
      @confirm="(item) => popConfirm('officeaddcodename', item)"
    />
  </div>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import customerChange from './components/customerChange/index.vue'
import orgTypeNamePop from './components/orgTypeNamePop.vue'
import industrytypePop from './components/industrytypePop.vue'
import selectSurplusIndustryPop from './components/selectSurplusIndustryPop.vue'
import selectSuperCorpPop from './components/selectSuperCorpPop.vue'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import selectRegionCodePop from '@/components/dynamicForm/components/selectRegionCodePop.vue'
import download from "@/utils/download";
import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象

// 该组件仅接受customerId入参，其他参数会自行获取
const customerId = route.query.customerID || route.query.customerId || route.query.customerid
console.log('[ customerId ] >', customerId)

// 获取表单字段配置
const getTemplateVO = (templateNo, customerType) => {
  Api.getTemplateVO({ templateNo, customerType, customerId: customerId })
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
  return Api.getCustomerTemplateNo({ codeNo: 'CustomerOrgType', itemNo: formData.orgnature })
}

// 获取详情数据
const emit = defineEmits(['sendInfo'])
const formData = reactive({})
const getDetail = () => {
  return Api.getChangeCustomerInfo({ customerId: customerId }).then((res) => {
    dynamicFormRef.value?.resetFields()
    Object.assign(formData, res)
    // 向父级页面送详情数据，供其他component组件使用
    emit('sendInfo', formData)

    entTempSaveFlag()
    entImportFlag()
  })
}

const loading = ref(false)
const initGetData = () => {
  if (!customerId) return ElMessage.error('公司客户详情缺少customerId字段')

  loading.value = true
  Promise.all([getDetail()]).then((res) => {
    getCustomerTemplateNo().then(res => {
      getTemplateVO(res, formData.customertype)
    })
  })
}

initGetData()

/**
 * 保存
 */
const dynamicFormRef = ref()
const saving = ref(false)
const save = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return 

  saving.value = true
  Api.saveCustomer({ ...formData, objectType: 'Save' })
    .then((res) => {
      ElMessage.success('保存成功')
    })
    .finally((_) => (saving.value = false))
}

const tempSaving = ref(false)
const tempSave = () => {
  tempSaving.value = true
  Api.saveCustomer({ ...formData, objectType: 'TempSave' })
    .then((res) => {
      ElMessage.success('保存成功')
    })
    .finally((_) => (tempSaving.value = false))
}

// 暂存按钮显隐控制
const tempSaveShow = ref(false)
const entTempSaveFlag = () => {
  Api.entTempSaveFlag({
    customerType: formData.customertype,
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
    customerType: formData.customertype,
    customerId: formData.customerid
  }).then((res) => {
    if (res) {
      ecifShow.value = true
    }
  })
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

// 客户变更
const customerChangeRef = ref()
const onCustomerChange = () => {
  customerChangeRef.value.open(customerId)
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible,customRequired,customReadonly } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)


const activeComp = () => {
  initGetData()
}

// 行业说明下载
const downDir = async ()  => {
     const data = await Api.templatesDownload('2017')
     download.excel(data, '2017年国民经济行业分类注释（试行）.xls')
}

defineExpose({
  activeComp
})
</script>
