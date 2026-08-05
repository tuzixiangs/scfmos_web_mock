<template>
  <Dialog
    class="!p-0 select-rule-type-pop"
    body-class="!overflow-y-unset !p-0"
    append-to-body
    width="1250px"
    v-model="visible"
    title="选择债项因子"
  >
    <div class="flex gap-20px" :style="{ minHeight: '400px'}">
      <table-1 ref="table1Ref" @select="table1Select" />
      <table-2 ref="table2Ref" />
    </div>
    <template #footer>
      <div class="p-20px pt-0">
        <el-button @click="visible = false">关 闭</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import table1 from './table1.vue'
import table2 from './table2.vue'

const emit = defineEmits(['confirm'])

const visible = ref(false) // 弹窗的是否展示

const table1Ref = ref()
const table2Ref = ref()
/** 打开弹窗 */
const open = async (type, id) => {
  visible.value = true

  nextTick(() => {
    table1Ref.value?.search()

  })
}

const table1Select = (row) => {
  table2Ref.value?.search({ variablesGroupId: row.id })
}

const confirm = () => {
  if (!table2Ref.value.selections?.length) {
    ElMessage.warning('请选择')
    return
  }

  emit('confirm', table2Ref.value.selections)
  visible.value = false
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
