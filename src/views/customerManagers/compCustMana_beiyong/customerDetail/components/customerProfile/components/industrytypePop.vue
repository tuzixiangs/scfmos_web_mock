<template>
  <Dialog
    v-model="visible"
    title="选择国标行业"
    width="1000px"
    top="5vh"
    class="customer-region-code-pop"
  >
    <el-cascader-panel
      ref="cascaderPanelRef"
      v-loading="loading"
      :options="areaList"
      :props="treeProps"
    />
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { onUnmounted } from 'vue'
import { getIndustryTreeList } from '../api.js'
import { ElMessage } from 'element-plus'

const visible = ref(false)

const treeProps = {
  children: 'children',
  label: 'title',
  value: 'key'
}

const emit = defineEmits(['confirm'])

const areaList = ref([])
const loading = ref(false)
const getData = async () => {
  loading.value = true
  const data = await getIndustryTreeList().finally((_) => (loading.value = false))
  areaList.value = noDisabled(data)
}

const noDisabled = (data) => {
  data.forEach((v) => {
    delete v.disabled

    if (v.children?.length) {
      return noDisabled(v.children)
    }
  })

  return data
}

const open = () => {
  visible.value = true
  if (!areaList.value?.length) {
    getData()
  }
}

const cascaderPanelRef = ref()
const confirm = () => {
  const checked = cascaderPanelRef.value.getCheckedNodes(true)
  if (!checked.length) return ElMessage.warning('页节点信息不能选择，请重新选择')

  visible.value = false
  emit('confirm', checked[0].data)
}

defineExpose({
  open
})

/**
 * 组件内部拦截了双击事件，改用原生事件监听
 */
watch(cascaderPanelRef, (newVal) => {
  if(newVal) {
    const panelDom = cascaderPanelRef.value.$el
    panelDom.addEventListener('dblclick', confirm)
  }
})

onUnmounted(() => {
  if(cascaderPanelRef.value) {
    const panelDom = cascaderPanelRef.value.$el
    panelDom.removeEventListener('dblclick', confirm)
  }
})
</script>

<style lang="scss" scoped>
.customer-region-code-pop {
  height: 55vh;

  .el-cascader-panel {
    height: 400px;

    :deep(.el-cascader-menu__wrap.el-scrollbar__wrap) {
      height: 100%;
    }
  }
}
</style>
