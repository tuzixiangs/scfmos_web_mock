<template>
  <Dialog v-model="dialogVisible">
    <iframe :src="iframeUrl" style="width: 100%; height: 100%" />
  </Dialog>
</template>

<script setup>
const iframeUrl = ref('http://192.168.143.150:7003/Credit/ThirdLogon.jsp?TPUSERID=3087&TPPASSWORD=CC357616CC513B4896F8FED824B3E191&TPOPENTYPE=Loan&TPSERIALNO=2025091000001501&RightType=ReadOnly')

const dialogVisible = ref(false) // 弹窗的是否展示
/** 打开弹窗 */
const open = async (type, id) => {
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>