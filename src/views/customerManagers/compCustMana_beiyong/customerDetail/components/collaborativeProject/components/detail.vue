<template>
  <Dialog v-model="visible" title="详情" width="800px" @close="close">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="150px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="合作项目编号" prop="projectID">
            <el-input v-model="formData.projectID" disabled placeholder="请输入合作项目编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合作项目名称" prop="projectName">
            <el-input v-model="formData.projectName" placeholder="请输入合作项目名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注(限100汉字) " prop="remark">
            <el-input
              type="textarea"
              :maxlength="100"
              :rows="2"
              show-word-limit
              v-model="formData.remark"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人" prop="inputUserName">
            <el-input v-model="formData.inputUserName" disabled placeholder="登记人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记机构" prop="inputOrgName">
            <el-input v-model="formData.inputOrgName" disabled placeholder="登记机构" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记日期" prop="inputDate">
            <el-input v-model="formData.inputDate" disabled placeholder="登记日期" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- </div> -->
    <template #footer>
      <el-button :loading="formLoading" v-if="isShowSubmitBtn" tpye="" @click="submitForm">确 定</el-button>
      <el-button @click="close">关 闭</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as Api from '../api.js'
import { useUserStoreWithOut } from '@/store/modules/user'

defineOptions({ name: 'SystemRoleForm' })

const message = useMessage() // 消息弹窗
const route = useRoute() // 路由
const { user } = useUserStoreWithOut()
const isSelf = computed(()=>user.nickname === formData.inputUserName)
const isShowSubmitBtn = computed(()=>{
  if(isAdd.value) {
    return true
  }
  return isSelf.value
})

const visible = ref(false) // 弹窗的是否展示
const isAdd = ref(false)
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = reactive({
  projectID: '',
  projectName: '',
  remark: '',
  inputUserName: '',
  inputOrgName: '',
  inputDate: ''
})
const formRules = reactive({
  projectName: [{ required: true, message: '合作项目名称不能为空', trigger: 'change' }],
  remark: [{ required: true, message: '备注不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

const restForm = ()=> {
  // formRef.value?.setValues({})
  for (const key in formData) {
    formData[key] = ''
  }
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}

/** 打开弹窗 */
const open = async (row,add=false) => {
  isAdd.value = add
  visible.value = true
  restForm()
   Object.assign(formData, row)
  if(!isAdd.value) {
    formLoading.value = true
    const data = await Api.custRelaTeamworkProjectItem({ projectID: row.projectID }).finally(
      (_) => (formLoading.value = false)
    )

    Object.assign(formData, data)
  }
  

  nextTick(() => {
    setTimeout(() => {
      formRef.value?.clearValidate()
    }, 10)
  })
}

const close = ()=>{
  restForm()
  visible.value = false
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if(valid) {
      const params = toRaw(formData)
      if(isAdd.value) {
        delete params.projectID
        params.objectType = 'Add'
        params.customerID = route.query.customerID 
      }else {
        params.objectType = 'Edit'
      }
      formLoading.value = true
      const res = await Api.saveCustRelaTeamworkProject(params).finally(()=> formLoading.value = false)
      ElMessage.success('操作成功')
      emit('success')
      close()
    } else {
      return false
    }
  })
}
</script>
