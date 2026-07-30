<template>
  <Dialog v-model="visible" title="权限申请" width="500px">
    <!-- <div style="width: 100%; display: flex; justify-content: center"> -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="170px"
    >
      <el-form-item label="证件号码" prop="certID">
        <el-input v-model="formData.certID" disabled placeholder="请选择证件号码" />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="formData.customerName" disabled placeholder="请选择客户名称" />
      </el-form-item>
      <el-form-item label="是否申请信息查看权" prop="applyAttribute1">
        <el-select v-model="formData.applyAttribute1" clearable placeholder="请选择">
          <el-option label="有" :value="1" />
          <el-option label="无" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否申请信息维护权" prop="applyAttribute2">
        <el-select v-model="formData.applyAttribute2" clearable placeholder="请选择">
          <el-option label="有" :value="1" />
          <el-option label="无" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否申请业务申办权" prop="applyAttribute3">
        <el-select v-model="formData.applyAttribute3" clearable placeholder="请选择">
          <el-option label="有" :value="1" />
          <el-option label="无" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请理由(限100汉字)" prop="applyReason">
        <el-input
          v-model="formData.applyReason"
          :rows="3"
          placeholder="请输申请理由"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <!-- </div> -->
    <template #footer>
      <el-button :loading="formLoading" tpye="" @click="submitForm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as RoleApi from '@/api/system/role'
import * as Api from '../api.js'

defineOptions({ name: 'SystemRoleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const visible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = reactive({})
const formRules = reactive({
  applyAttribute1: [{ required: true, message: '信息查看权不能为空', trigger: 'change' }],
  applyAttribute2: [{ required: true, message: '信息维护权不能为空', trigger: 'change' }],
  applyAttribute3: [{ required: true, message: '证业务申办权不能为空', trigger: 'change' }],
  applyReason: [{ required: true, message: '申请理由不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

let compParams

/** 打开弹窗 */
const open = async (row, params) => {
  visible.value = true

  compParams = params

  nextTick(() => {
    formRef.value.resetFields()
    formData.customerID = row.customerID?row.customerID :row.customerId 
    formData.customerName = row.customerName
    formData.certID = row.certID?row.certID :row.certId 
    formData.applyAttribute1 = row.belongAttribute1 == '有' ? 1 : 2
    formData.applyAttribute2 = row.belongAttribute2 == '有' ? 1 : 2
    formData.applyAttribute3 = row.belongAttribute3 == '有' ? 1 : 2
    formData.applyReason = ''
  })
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 发送操作成功的事件

  formLoading.value = true
  Api.applyRole(formData)
    .then((res) => {
      visible.value = false

      ElMessage.success(res)
      emit('success', compParams)
    })
    .finally((_) => (formLoading.value = false))
}

/**
 * 弹窗打开前校验
 * 返回 true可以打开，false不可以
 */
const openCheck = (row) => {
  if (row.applyStatus === '1') {
    ElMessage.warning('已提交申请,不能再次提交！')
    return false
  }

  const cols = ['belongAttribute1', 'belongAttribute2', 'belongAttribute3']
  if (cols.every((v) => row[v] === '有')) {
    ElMessage.warning('你已拥有该用户所有权限')
    return false
  }

  return true
}
defineExpose({ open, openCheck })
</script>
