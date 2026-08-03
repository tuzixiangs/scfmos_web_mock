<template>
  <Dialog
    v-model="visible"
    title="修改状态"
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="选择渠道标识" prop="channelid" v-if="type == 2">
        <el-select
          v-model="formData.channelid"
          placeholder="请选择渠道标识"
          style="width: 100%"
          clearable
        >
          <el-option label="SXCT001" value="SXCT001" />
          <el-option label="SXCT003" value="SXCT003" />
        </el-select>
      </el-form-item>
      <el-form-item label="母票号" prop="serialno">
        <el-input v-model="formData.serialno" />
      </el-form-item>
    </el-form>

    <!-- 底部对话框操作按钮 -->
    <template #footer>
      <el-button tpye="" @click="confirm" :loading="btnLoading">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import * as Api from '../api.js'
import { ElMessage } from 'element-plus'
import { useOldDictStore } from '@/store/modules/oldDict'

const visible = ref()

const formData = reactive({})

const formRules = {
  channelid: [{ required: true, message: '渠道标识 必录', trigger: 'change' }],
  serialno: [{ required: true, message: '母票号 必录', trigger: 'change' }]
}

const { getDictFetch } = useOldDictStore()

const initFetch = () => {
  getDictFetch('BuyStatus').then((res) => {
    buyStatusOptions.value = res['BuyStatus']
  })
}
initFetch()

const buyStatusOptions = ref([])

const type = ref()
/**
 * type 1e链，2线上链路
 */
const open = (flag = 1) => {
  formData.serialno = ''
  formData.status = ''

  type.value = flag
  if (flag == 1) formData.channelid = 'TSEL001'

  visible.value = true
}

const emit = defineEmits(['confirm'])

const btnLoading = ref()
const formRef = ref()
const confirm = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  btnLoading.value = true
  Api.noticToCT({
    serialno: formData.serialno,
    channelid: formData.channelid
  })
    .then((res) => {
      ElMessage.success('操作成功')

      emit('confirm')
      visible.value = false
    })
    .finally(() => (btnLoading.value = false))
}

defineExpose({
  open
})
</script>
