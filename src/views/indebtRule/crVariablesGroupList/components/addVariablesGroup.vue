<template>
  <Dialog
    class="!p-0"
    body-class="!overflow-y-unset"
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px">
      <el-form-item label="债项因子组别名称" prop="variablesGroupName">
        <el-input
          v-model="formData.variablesGroupName"
          placeholder="请输入债项因子组别名称"
          clearable
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="债项因子组别编码" prop="variablesGroupCode">
        <el-input
          v-model="formData.variablesGroupCode"
          placeholder="请输入债项因子组别编码"
          clearable
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="债项因子来源" prop="variablesOrigin">
        <el-select v-model="formData.variablesOrigin" clearable placeholder="请选择债项因子来源">
          <el-option
            v-for="dict in getStrDictOptions('variables_origin')"
            :key="dict.value"
            :label="dict.label"
            :value="`${dict.value}`"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="pr-10px pb-10px">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { addVariablesGroup, editVariablesGroup } from '../api'
import { getStrDictOptions } from '@/utils/dict'

defineOptions({
  name: 'addVariablesGroup'
})

const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const dialogTitle = ref('新增债项因子组别')
const loading = ref(false)
const formRef = ref()
const isEdit = ref(false)
const editId = ref('')

const formData = reactive({
  variablesGroupName: '',
  variablesGroupCode: '',
  variablesOrigin: ''
})

const formRules = {
  variablesGroupName: [{ required: true, message: '请输入债项因子组别名称', trigger: 'change' }],
  variablesGroupCode: [{ required: true, message: '请输入债项因子组别编码', trigger: 'change' }],
  variablesOrigin: [{ required: true, message: '请选择债项因子来源', trigger: 'change' }]
}

const open = (editData?: any) => {
  dialogVisible.value = true
  if (editData && editData.id) {
    // 编辑模式
    isEdit.value = true
    editId.value = editData.id
    dialogTitle.value = '编辑债项因子组别'
    Object.assign(formData, {
      variablesGroupName: editData.variablesGroupName || '',
      variablesGroupCode: editData.variablesGroupCode || '',
      variablesOrigin: editData.variablesOrigin || ''
    })
  } else {
    // 新增模式
    isEdit.value = false
    editId.value = ''
    dialogTitle.value = '新增债项因子组别'
    resetForm()
  }
  formRef.value?.clearValidate()
}

const resetForm = () => {
  Object.assign(formData, {
    variablesGroupName: '',
    variablesGroupCode: '',
    variablesOrigin: ''
  })
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      if (isEdit.value) {
        // 编辑模式，携带id参数
        await editVariablesGroup({ ...formData, id: editId.value })
        ElMessage.success('编辑成功')
      } else {
        // 新增模式
        await addVariablesGroup(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      emit('success')
    } finally {
      loading.value = false
    }
  })
}

defineExpose({
  open
})
</script>
