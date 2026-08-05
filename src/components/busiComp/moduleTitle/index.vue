<template>
  <div class="module-title-comp">
    <div class="title">{{ title }}</div>
    <component :is="$slots.default" />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  default: '模块名'
})
</script>

<style lang="scss" scoped>
.module-title-comp {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;

  .title {
    font-weight: bold;
    color: #1a3a6b;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 3px;
      background: #1a3a6b;
      border-radius: 2px;
      height: 14px;
    }
  }
}
</style>
