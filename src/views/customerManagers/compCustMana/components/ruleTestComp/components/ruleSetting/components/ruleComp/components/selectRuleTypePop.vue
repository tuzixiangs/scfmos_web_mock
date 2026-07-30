<template>
  <Dialog
    class="!p-0 select-rule-type-pop"
    body-class="!overflow-y-unset"
    append-to-body
    width="70%"
    v-model="visible"
    title="规则类型选择"
  >
    <selectRuleTypeComp />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import selectRuleTypeComp from './selectRuleTypeComp.vue'

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
