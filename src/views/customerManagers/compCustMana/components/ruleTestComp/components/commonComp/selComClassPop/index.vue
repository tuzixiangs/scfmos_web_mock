<template>
  <Dialog
    class="!p-0"
    body-class="!overflow-y-unset"
    width="70%"
    top="10vh"
    append-to-body
    v-model="visible"
    title="预选商品类"
  >
    <div class="flex gap-20px">
      <table1 ref="table1Ref" class="w-40%" />
      <table2 ref="table2Ref" class="w-60%" />
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

const visible = ref(false) // 弹窗的是否展示
/** 打开弹窗 */
const open = async (type, id) => {
  visible.value = true
}

const table1Ref = ref()
const table2Ref = ref()
const confirm = () => {
  const table1Selections = table1Ref.value.currentRow?.value ?? []
  const table2Selections = table2Ref.value.currentRow?.value ?? []

  if (!table1Selections.length) {
    ElMessage.warning('请选择')
    return
  }

  emit('confirm', { ...table1Selections, ...table2Selections })
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
