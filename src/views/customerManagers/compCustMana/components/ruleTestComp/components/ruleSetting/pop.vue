<template>
  <Dialog
    class="!p-0"
    body-class="!overflow-y-unset"
    width="500px"
    top="2vh"
    v-model="visible"
    title="规则配置测试页面1111"
  >
    <ruleSetting style="padding: 0 20px" @close="visible = false" />
  </Dialog>
</template>

<script setup>
import ruleSetting from './index.vue'

const visible = ref(false) // 弹窗的是否展示
/** 打开弹窗 */
const open = async (type, id) => {
  visible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
