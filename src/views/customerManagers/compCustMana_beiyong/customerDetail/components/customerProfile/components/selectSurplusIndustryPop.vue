<template>
  <Dialog v-model="visible" title="选择加入供应链群成员" width="1000px" top="5vh">
    <ContentWrap>
      <el-scrollbar height="55vh">
        <el-tree
          ref="treeRef"
          :data="data"
          :props="treeProps"
          default-expand-all
          highlight-current
          node-key="id"
          @node-click="nodeClick"
        />
      </el-scrollbar>
    </ContentWrap>
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import * as Api from '../api.js'

const visible = ref(false)

const treeProps = {
  children: 'children',
  label: 'title'
}

const emit = defineEmits(['confirm'])

const data = shallowRef([])

const getSurplusIndustryTreeList = () => {
  Api.getSurplusIndustryTreeList().then((res) => {
    data.value = res
  })
}

const open = () => {
  currentRow = null
  visible.value = true
  getSurplusIndustryTreeList()
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