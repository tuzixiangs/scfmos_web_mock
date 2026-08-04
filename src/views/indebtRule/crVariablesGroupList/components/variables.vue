<template>
  <Dialog
    class="!p-0"
    body-class="!overflow-y-unset"
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="债项因子名称" prop="variablesName">
        <el-input
          v-model="formData.variablesName"
          placeholder="请输入债项因子名称"
          clearable
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="债项因子键值" prop="variablesKey">
        <el-input
          v-model="formData.variablesKey"
          placeholder="请输入债项因子键值"
          clearable
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="债项因子类别编号" prop="variablesGroupId">
        <el-input
          v-model="formData.variablesGroupId"
          placeholder="请输入债项因子类别编号"
          disabled
        />
      </el-form-item>
      <el-form-item label="债项因子类型" prop="variablesType">
        <el-select v-model="formData.variablesType" clearable placeholder="请选择债项因子类型">
          <el-option
            v-for="dict in getStrDictOptions('variables_type')"
            :key="dict.value"
            :label="dict.label"
            :value="`${dict.value}`"
          />
        </el-select>
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
      <el-form-item label="因子值" prop="valLimit">
        <el-select v-model="formData.valLimit" clearable placeholder="请选择因子值">
          <el-option
            v-for="dict in getStrDictOptions('val_limit')"
            :key="dict.value"
            :label="dict.label"
            :value="`${dict.value}`"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="pr-10px pb-10px">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { addVariables, editVariables } from '../api'
import { getStrDictOptions } from '@/utils/dict'

defineOptions({
  name: 'variablesModal'
})

const emit = defineEmits(['ok', 'close'])

const props = defineProps({
  modalData: {
    type: Object,
    default: () => ({})
  }
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增债项因子')
const loading = ref(false)
const formRef = ref()

const formData = reactive({
  id: '',
  variablesName: '',
  variablesKey: '',
  variablesGroupId: '',
  variablesType: '',
  variablesOrigin: '',
  valLimit: ''
})

const formRules = {
  variablesName: [{ required: true, message: '请输入债项因子名称', trigger: 'blur' }],
  variablesKey: [{ required: true, message: '请输入债项因子key!', trigger: 'blur' }],
  variablesType: [{ required: true, message: '请选择债项因子类型', trigger: 'change' }],
  variablesOrigin: [{ required: true, message: '请选择债项因子来源', trigger: 'change' }]
}

const open = (mode: 'add' | 'edit' = 'add', data?: any) => {
  dialogVisible.value = true
  dialogTitle.value = mode === 'edit' ? '编辑债项因子' : '新增债项因子'
  
  if (mode === 'edit' && data) {
    Object.assign(formData, data)
  } else {
    resetForm()
  }
  
  // 设置债项因子类别编号
  if (props.modalData && props.modalData.variablesGroupId) {
    formData.variablesGroupId = props.modalData.variablesGroupId
  } else if (data && data.variablesGroupId) {
    formData.variablesGroupId = data.variablesGroupId
  }
  
  formRef.value?.clearValidate()
}

const resetForm = () => {
  Object.assign(formData, {
    id: '',
    variablesName: '',
    variablesKey: '',
    variablesGroupId: '',
    variablesType: '',
    variablesOrigin: '',
    valLimit: ''
  })
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      if (!formData.id) {
        // 新增
        await addVariables(formData)
        ElMessage.success('新增成功')
      } else {
        // 编辑
        await editVariables(formData)
        ElMessage.success('编辑成功')
      }
      dialogVisible.value = false
      emit('ok')
    } finally {
      loading.value = false
    }
  })
}

const handleClose = () => {
  emit('close')
  dialogVisible.value = false
  formRef.value?.clearValidate()
}

defineExpose({
  open
})
</script>

<style scoped lang="scss">
</style>
