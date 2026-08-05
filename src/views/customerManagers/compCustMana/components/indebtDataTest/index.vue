<template>
  <Dialog
    body-class="!overflow-y-unset"
    width="90%"
    top="2vh"
    v-model="dialogVisible"
    title="债项数据测试页面"
  >
    <indebtData />
  </Dialog>
</template>

<script setup>
import indebtData from '@/components/busiComp/indebtProject/indebtData/index.vue'

const dialogVisible = ref(false) // 弹窗的是否展示
/** 打开弹窗 */
const open = async (type, id) => {
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
