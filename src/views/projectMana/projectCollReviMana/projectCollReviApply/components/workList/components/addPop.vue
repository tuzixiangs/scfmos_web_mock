<template>
  <Dialog v-model="visible" title="新增" width="850px" top="5vh">
    <!-- <ContentWrap> -->
    <el-form
      ref="formRef"
      inline
      :model="formData"
      :rules="formRules"
      label-width="auto"
      :validate-on-rule-change="false"
    >
      <el-form-item label="协审方式" prop="coreviewMethod">
        <el-radio-group class="!w-260px" v-model="formData.coreviewMethod" @change="radioChange1">
          <el-radio-button
            v-for="item in coreviewMethodoption"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="协审类型" prop="coreviewType">
        <el-radio-group v-model="formData.coreviewType" @change="coreviewTypeChange">
          <el-radio-button
            v-for="item in coreviewTypeOption"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
<!--      <el-form-item label="供应链标识" prop="gylFlag">-->
<!--        <el-radio-group class="!w-260px" v-model="formData.gylFlag">-->
<!--          <el-radio-button v-for="item in gylFlagOption" :key="item.value" :label="item.value">{{-->
<!--            item.label-->
<!--          }}</el-radio-button>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
      <el-form-item label="客户编号" prop="customerId">
        <!-- <el-input
          disabled
          class="!w-260px"
          v-model="formData.customerId"
          placeholder="输入客户编号"
          clearable
        /> -->
        <el-input
          class="!w-260px"
          v-model="formData.customerId"
          placeholder="请选择客户编号"
          readonly
          @click="selectUser"
        >
          <template #append>
            <el-button @click="selectUser">
              <Icon icon="ep:more" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          readonly
          class="!w-260px"
          v-model="formData.customerName"
          placeholder="请选择客户名称"
          @click="selectUser"
        >
          <template #append>
            <el-button @click="selectUser">
              <Icon icon="ep:more" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-show="formData.coreviewMethod != '01'" label="协审编号" prop="relativeSerialNo">
        <el-input
          class="!w-260px"
          v-model="formData.relativeSerialNo"
          placeholder="协审编号"
          clearable
          readonly
          @click="handleOpenDialog"
        >
          <template #append>
            <!-- <el-button @click="getSerailNo" :loading="btnLoading"> 点击获取 </el-button> -->
            <el-button @click="handleOpenDialog">
              <Icon icon="ep:more" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="发生日期" prop="createTm">
        <el-date-picker
          disabled
          class="!w-260px"
          v-model="formData.createTm"
          type="date"
          placeholder="请选择发生日期"
          value-format="YYYY/MM/DD"
          format="YYYY/MM/DD"
        />
      </el-form-item>
    </el-form>
    <!-- </ContentWrap> -->
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>

    <MiniPageSelectDialog
      ref="dialogRef"
      v-model="visible1"
      width="1200px"
      :columns="columns1"
      :searchFields="searchFields1"
      @confirm="selectUserConfirm"
      :api-method="Api.qryCoreviewApplyCustomerPage"
    />
    
    <!-- 协审编号 -->
    <MiniPageSelectDialog
      v-model="visible2"
      width="1200px"
      :columns="columns2"
      :searchFields="searchFields2"
      @confirm="selectUserConfirm2"
      :api-method="Api.getLatestSerialNo"
      :extra-params="extraParams2"
    />
  </Dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from './api.js'
import dayjs from 'dayjs'
import { getDictOptions } from '@/utils/dict'
import useFormHelper from '@/hooks/web/useFormHelper'
import { useDictStoreWithOut } from '@/store/modules/dict'

const visible = ref(false)

const dictStore = useDictStoreWithOut()
const coreviewMethodoption = computed(() => getDictOptions('coreview_method'))
const coreviewTypeOption = computed(() => getDictOptions('coreview_type'))
const gylFlagOption = computed(() => getDictOptions('supply_chain_flag'))

const columns1 = [
  { label: '客户编号', prop: 'customerId', minWidth: 220},
  { label: '客户名称', prop: 'customerName',minWidth: 320 },
  { label: '证件类型', prop: 'certTypeName', minWidth: 150 },
  { label: '证件编号', prop: 'certId', minWidth: 220 },
  { label: '客户类型', prop: 'customerTypeName', minWidth: 150 }
]

const searchFields1 = [
  { label: '客户编号', prop: 'customerId' },
  { label: '客户名称', prop: 'customerName' },
  // { label: '证件类型', prop: 'certTypeName' },
  { label: '证件编号', prop: 'certId' },
  // { label: '客户类型', prop: 'customerTypeName' }
]

const columns2 = [
  { label: '协审编号', prop: 'serialNo', minWidth: 220 },
  { label: '项目名称', prop: 'projectName', minWidth: 320 },
  { label: '客户编号', prop: 'customerId', minWidth: 220 },
  { label: '客户名称', prop: 'customerName', minWidth: 320 },
  { label: '协审方式', prop: 'coreviewMethodNm', minWidth: 150 },
  { label: '协审类型', prop: 'coreviewTypeNm', minWidth: 150 },
  { label: '申请人', prop: 'userName', minWidth: 150 },
  { label: '申请分行', prop: 'branchName', minWidth: 150 },
  { label: '产品方案', prop: 'loanProductCategory', minWidth: 150 },
]

const searchFields2 = [
  { label: '协审编号', prop: 'serialNo' },
  { label: '项目名称', prop: 'projectName' },
  { label: '客户名称', prop: 'customerName' },
]

const visible2 = ref()
const extraParams2 = reactive({})
const handleOpenDialog = async () => {
  if (!(await validateField(['coreviewMethod', 'coreviewType', 'customerId', 'customerName'])))
    return

  extraParams2.coreviewType = formData.coreviewType
  extraParams2.customerId = formData.customerId
  visible2.value = true
}

const selectUserConfirm2 = (item) => {
  formData.relativeSerialNo = item.serialNo
}

const formData = reactive({})
const formRules = reactive({
  coreviewMethod: [{ required: true, message: '协审方式 必录', trigger: 'change' }],
  coreviewType: [{ required: true, message: '协审类型 必录', trigger: 'change' }],
  customerId: [{ required: true, message: '客户编号 必录', trigger: 'change' }],
  customerName: [{ required: true, message: '客户名称 必录', trigger: 'change' }],
  gylFlag: [{ required: true, message: '供应链标识 必录', trigger: 'change' }]
})

const open = async (row) => {
  Object.keys(formData).forEach((key) => (formData[key] = ''))
  visible.value = true

  if (!coreviewMethodoption.value.length || !coreviewTypeOption.value.length) {
    await dictStore.resetDict()
  }

  formData.createTm = dayjs().format('YYYY/MM/DD')
}

const radioChange1 = (item) => {
  if (item == '02') {
    formRules.relativeSerialNo = [{ required: true, message: '协审编号 必录', trigger: 'change' }]
  } else {
    delete formRules.relativeSerialNo
    formRef.value.clearValidate('relativeSerialNo')
    formData.relativeSerialNo = ''
  }
}

const visible1 = ref()
const selectUser = () => {
  visible1.value = true
}

const selectUserConfirm = (item) => {
  formData.customerName = item.customerName
  formData.customerId = item.customerId
}

const formRef = ref()
const btnLoading = ref()
const { validateField } = useFormHelper(formRef)
const getSerailNo = async () => {
  if (!(await validateField(['coreviewMethod', 'coreviewType', 'customerId', 'customerName'])))
    return

  btnLoading.value = true
  Api.getLatestSerialNo({ coreviewType: formData.coreviewType, customerId: formData.customerId }).then(res => {
    formData.relativeSerialNo = res
  }).finally(_ => btnLoading.value = false)
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  Api.addSave(formData)
    .then((res) => {
      ElMessage.success('保存成功')
      visible.value = false
      emit('confirm', res)
    })
    .finally((_) => (saving.value = false))
}

const coreviewTypeChange = () => {
  formData.customerName = ''
  formData.customerId = ''
  formData.relativeSerialNo = ''
}

defineExpose({
  open
})
</script>
