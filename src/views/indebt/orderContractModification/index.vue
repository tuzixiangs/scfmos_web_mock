<template>
  <OrderContractModificationWorkList :params="{ mode: activeMenu }" />
</template>

<script setup lang="ts">
import OrderContractModificationWorkList from './components/workList/index.vue'

defineOptions({ name: 'OrderContractModification' })

const route = useRoute()
// 顶层菜单拆分后，“查询”入口默认定位到历史修改记录；原页面内切换仍然可用。
const activeMenu = computed(() =>
  String(route.name) === 'OrderContractModificationRecordQuery'
    ? 'record'
    : String(route.query?.key || 'application')
)
</script>
