<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
    <!-- <div style="width: 100%; display: flex; justify-content: center"> -->
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="机构类型" prop="orgNature">
          <el-input v-model="formData.orgNature" placeholder="请选择机构类型" />
        </el-form-item>
        <el-form-item label="是否NRA标识" prop="nraflag">
          <el-input v-model="formData.nraflag" placeholder="请选择是否NRA标识" />
        </el-form-item>
        <el-form-item label="证件类型" prop="otherCertTypeName">
          <el-input v-model="formData.otherCertTypeName" placeholder="请选择选择证件类型" />
        </el-form-item>
        <el-form-item label="证件号码" prop="corpID">
          <el-input v-model="formData.corpID" placeholder="请输入证件号码" />
        </el-form-item>
        <el-form-item label="证件号码确认" prop="corpID_copy">
          <el-input v-model="formData.corpID_copy" placeholder="请输入证件号码" />
        </el-form-item>
        <el-form-item label="客户名称" prop="enterpriseName">
          <el-input v-model="formData.enterpriseName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="企业中征码" prop="loanCardNo">
          <el-input v-model="formData.loanCardNo" placeholder="请输入企业中征码" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio
              v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
              :key="dict.label"
              :label="dict.value"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输备注" type="textarea" />
        </el-form-item>
      </el-form>
    <!-- </div> -->
    <template #footer>
      <el-button :disabled="formLoading" tpye="" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as RoleApi from '@/api/system/role'

defineOptions({ name: 'SystemRoleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
  code: '',
  sort: undefined,
  status: CommonStatusEnum.ENABLE,
  remark: ''
})
const cancel = () => {
  dialogVisible.value = false
  emit('cancel')
}
const formRules = reactive({
  orgNature: [{ required: true, message: '机构类型不能为空', trigger: 'blur' }],
  nraflag: [{ required: true, message: '是否NRA标识不能为空', trigger: 'change' }],
  otherCertTypeName: [{ required: true, message: '证件类型不能为空', trigger: 'change' }],
  corpID: [{ required: true, message: '证件号码不能为空', trigger: 'change' }],
  corpID_copy: [{ required: false, message: '证件号码确认不能为空', trigger: 'blur' }],
  enterpriseName: [{ required: false, message: '客户名称不能为空', trigger: 'blur' }],
  loanCardNo: [{ required: false, message: '企业中征码不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type, id) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await RoleApi.getRole(id)
    } finally {
      formLoading.value = false
    }
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: '',
    code: '',
    sort: undefined,
    status: CommonStatusEnum.ENABLE,
    remark: ''
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const checkCertIDValidity = () => {
  Api.checkCertIDValidity(formData).then(res => {
    
  })
}

/** 提交表单 */
const emit = defineEmits(['success', 'cancel']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
}
</script>
