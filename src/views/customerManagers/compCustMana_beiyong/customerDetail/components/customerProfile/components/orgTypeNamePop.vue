<template>
  <Dialog v-model="visible" title="控股类型选择" width="500px">
    <el-tree
      ref="treeRef"
      :data="data"
      :props="treeProps"
      default-expand-all
      highlight-current
      node-key="id"
      @node-click="nodeClick"
    />
    <template #footer>
      <el-button tpye="" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { getCityTreeList } from '../api.js'

const visible = ref(false)

const treeProps = {
  children: 'children',
  label: 'title'
}

const emit = defineEmits(['confirm'])

const data = shallowRef([])
const getData = () => {
  getCityTreeList().then(res => {
    data.value = res
  })
}

const open = () => {
  currentRow = null
  visible.value = true

  if (!data.value?.length) {
    getData()
  }
}

let currentRow
const nodeClick = (e) => {
  currentRow = e
}

const confirm = () => {
  if (!currentRow) return ElMessage.warning('请选择')

  if (!currentRow.isLeaf) return ElMessage.warning('页节点信息不能选择，请重新选择！')

  visible.value = false
  emit('confirm', currentRow)
}

defineExpose({
  open
})
</script>