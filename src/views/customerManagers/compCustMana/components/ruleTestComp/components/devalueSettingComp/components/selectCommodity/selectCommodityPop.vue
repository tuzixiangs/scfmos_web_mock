<template>
  <Dialog
    class="!p-0 select-rule-type-pop"
    body-class="!overflow-y-unset !p-0"
    append-to-body
    width="1250px"
    v-model="visible"
    title="选择商品"
  >
    <ContentWrap :body-style="{ padding: '0px' }">
      <selectCommodityComp />
    </ContentWrap>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import selectCommodityComp from './selectCommodityComp.vue'

const visible = ref(false) // 弹窗的是否展示
/** 打开弹窗 */
const open = async (type, id) => {
  visible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.select-rule-type-pop {
  .dialog-footer {
    padding: 20px;
    padding-top: 0;
  }
}
</style>
