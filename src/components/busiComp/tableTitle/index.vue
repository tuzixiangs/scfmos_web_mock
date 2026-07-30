<template>
  <div class="table-title-comp">
    <Icon icon="ep:list" />
    {{ title }}
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    // 表名
    type: String,
    default: '表名'
  }
})
</script>

<style lang="scss" scoped>
.table-title-comp {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
  padding-left: 15px;
  color: #1a3a6b;
  font-weight: bold;
  background-color: #f5f7fa;
  border: 1px solid #d9d9d9;
  border-bottom: unset;
}
</style>
